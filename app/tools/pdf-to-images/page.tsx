"use client";
import { useState, useEffect } from "react";
import { Download, FileUp, Loader2 } from "lucide-react";
import Link from "next/link";

// Extiende el tipo Window para incluir pdfjsLib
declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

// Cargar pdf.js
const loadPdfJs = async () => {
  if (typeof window !== "undefined" && !window.pdfjsLib) {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    document.head.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });

    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
};

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [pdfJsReady, setPdfJsReady] = useState(false);

  useEffect(() => {
    loadPdfJs().then(() => setPdfJsReady(true));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("El archivo es demasiado grande (máx 10MB)");
        return;
      }
      setFile(selectedFile);
      setError("");
      setImages([]);
    }
  };

  const convertPdfToImages = async (arrayBuffer: ArrayBuffer) => {
    const pdfjsLib = (window as any).pdfjsLib;
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const convertedImages: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const scale = 2; // Mayor calidad
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imageData = canvas.toDataURL("image/png");
      const base64 = imageData.replace(/^data:image\/png;base64,/, "");
      convertedImages.push(base64);
    }

    return convertedImages;
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Por favor selecciona un PDF");
      return;
    }

    if (!pdfJsReady) {
      setError("Cargando biblioteca PDF...");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Leer el archivo directamente en el frontend
      const arrayBuffer = await file.arrayBuffer();
      const convertedImages = await convertPdfToImages(arrayBuffer);
      setImages(convertedImages);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al procesar el archivo");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (base64: string, index: number) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64}`;
    link.download = `pagina-${index + 1}.png`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => downloadImage(img, i), i * 100);
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-2xl">
        <Link href="/">← Volver al inicio</Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PDF a Imágenes
          </h1>
          <p className="text-gray-600">
            Convierte cada página de tu PDF en una imagen PNG
          </p>
          <p className="text-xs text-green-600 mt-2">
            ✓ Procesamiento 100% local - Sin subir archivos
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-12 h-12 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click para subir</span> o
                arrastra y suelta
              </p>
              <p className="text-xs text-gray-400">PDF (máx. 10MB)</p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-700 truncate">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!file || loading || !pdfJsReady}
          className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl w-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Convirtiendo...
            </>
          ) : !pdfJsReady ? (
            "Cargando biblioteca..."
          ) : (
            "Convertir a Imágenes"
          )}
        </button>

        {/* Results */}
        {images.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">
                {images.length} página{images.length > 1 ? "s" : ""} generada
                {images.length > 1 ? "s" : ""}
              </h2>
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar todas
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Página {i + 1}
                    </span>
                    <button
                      onClick={() => downloadImage(img, i)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </div>
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Página ${i + 1}`}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>
          🔒 Tus archivos se procesan localmente - Nunca salen de tu navegador
        </p>
      </footer>
    </main>
  );
}
