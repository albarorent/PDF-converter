"use client";
import { useState, useEffect } from "react";
import {
  Download,
  FileUp,
  Loader2,
  FileText,
  Image as ImageIcon,
  File,
  Table,
} from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

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

type ConversionMode =
  | "pdf-to-image"
  | "image-to-pdf"
  | "word-to-pdf"
  | "pdf-to-word"
  | "excel-to-pdf"
  | "pdf-to-excel";

interface ConversionOption {
  id: ConversionMode;
  title: string;
  description: string;
  icon: any;
  accept: string;
  color: string;
}

const conversions: ConversionOption[] = [
  {
    id: "pdf-to-image",
    title: "PDF a Imagen",
    description: "Convierte páginas PDF a PNG, JPG o WEBP",
    icon: ImageIcon,
    accept: "application/pdf",
    color: "blue",
  },
  {
    id: "image-to-pdf",
    title: "Imagen a PDF",
    description: "Crea un PDF desde imágenes",
    icon: FileText,
    accept: "image/*",
    color: "purple",
  },
  {
    id: "word-to-pdf",
    title: "Word a PDF",
    description: "Convierte DOCX a PDF",
    icon: File,
    accept: ".doc,.docx",
    color: "indigo",
  },
  {
    id: "pdf-to-word",
    title: "PDF a Word",
    description: "Extrae texto de PDF a DOCX",
    icon: File,
    accept: "application/pdf",
    color: "cyan",
  },
  {
    id: "excel-to-pdf",
    title: "Excel a PDF",
    description: "Convierte XLSX a PDF",
    icon: Table,
    accept: ".xls,.xlsx",
    color: "green",
  },
  {
    id: "pdf-to-excel",
    title: "PDF a Excel",
    description: "Extrae tablas de PDF a XLSX",
    icon: Table,
    accept: "application/pdf",
    color: "emerald",
  },
];

type ImageFormat = "png" | "jpg" | "webp";

export default function Page() {
  const [mode, setMode] = useState<ConversionMode | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(92);

  useEffect(() => {
    loadPdfJs().then(() => setPdfJsReady(true));
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setError("");
      setResult(null);
    }
  };

  const convertPdfToImages = async (file: File) => {
    const pdfjsLib = (window as any).pdfjsLib;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images: string[] = [];
    const mimeType =
      imageFormat === "png"
        ? "image/png"
        : imageFormat === "jpg"
        ? "image/jpeg"
        : "image/webp";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const scale = 2;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const imageData = canvas.toDataURL(mimeType, quality / 100);
      images.push(imageData);
    }

    return images;
  };

  const convertImagesToPdf = async (imageFiles: File[]) => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    let firstPage = true;

    for (const file of imageFiles) {
      const img = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (!firstPage) {
        pdf.addPage();
      }
      firstPage = false;

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgAspect = img.width / img.height;
      const pageAspect = pageWidth / pageHeight;

      let imgWidth, imgHeight;
      if (imgAspect > pageAspect) {
        imgWidth = pageWidth;
        imgHeight = pageWidth / imgAspect;
      } else {
        imgHeight = pageHeight;
        imgWidth = pageHeight * imgAspect;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
    }

    return pdf.output("blob");
  };

  const convertWordToPdf = async (file: File) => {
    // Esta funcionalidad requiere backend para una conversión real
    // Por ahora, retornamos un mensaje informativo
    throw new Error(
      "La conversión de Word a PDF requiere procesamiento en servidor. Esta función estará disponible próximamente."
    );
  };

  const convertPdfToWord = async (file: File) => {
    const pdfjsLib = (window as any).pdfjsLib;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textContent = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const text = await page.getTextContent();
      const pageText = text.items.map((item: any) => item.str).join(" ");
      textContent += `\n\n=== Página ${pageNum} ===\n\n${pageText}`;
    }

    // Crear un blob de texto que el usuario puede guardar como .txt
    // Para DOCX real se necesitaría una librería como docx
    return new Blob([textContent], { type: "text/plain" });
  };

  const convertExcelToPdf = async (file: File) => {
    throw new Error(
      "La conversión de Excel a PDF requiere procesamiento en servidor. Esta función estará disponible próximamente."
    );
  };

  const convertPdfToExcel = async (file: File) => {
    throw new Error(
      "La conversión de PDF a Excel requiere procesamiento en servidor. Esta función estará disponible próximamente."
    );
  };

  const handleConvert = async () => {
    if (!mode || files.length === 0) {
      setError("Por favor selecciona archivos");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      switch (mode) {
        case "pdf-to-image":
          const images = await convertPdfToImages(files[0]);
          setResult({ type: "images", data: images });
          break;

        case "image-to-pdf":
          const pdfBlob = await convertImagesToPdf(files);
          setResult({ type: "pdf", data: pdfBlob });
          break;

        case "word-to-pdf":
          await convertWordToPdf(files[0]);
          break;

        case "pdf-to-word":
          const wordBlob = await convertPdfToWord(files[0]);
          setResult({ type: "word", data: wordBlob });
          break;

        case "excel-to-pdf":
          await convertExcelToPdf(files[0]);
          break;

        case "pdf-to-excel":
          await convertPdfToExcel(files[0]);
          break;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al procesar el archivo");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imgData: string, index: number) => {
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `pagina-${index + 1}.${imageFormat}`;
    link.click();
  };

  const downloadPdf = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "documento.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadWord = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "documento.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentMode = conversions.find((c) => c.id === mode);

  if (!mode) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-5xl">
          <Link href="/">← Volver al inicio</Link>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Conversor Universal de Documentos
            </h1>
            <p className="text-gray-600">
              Convierte entre PDF, imágenes, Word y Excel
            </p>
            <p className="text-xs text-green-600 mt-2">
              ✓ Procesamiento 100% local - Sin subir archivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversions.map((conv) => {
              const Icon = conv.icon;
              return (
                <button
                  key={conv.id}
                  onClick={() => setMode(conv.id)}
                  className={`p-6 rounded-xl border-2 border-gray-200 hover:border-${conv.color}-500 hover:bg-${conv.color}-50 transition-all text-left group`}
                >
                  <Icon
                    className={`w-10 h-10 mb-3 text-${conv.color}-600 group-hover:scale-110 transition-transform`}
                  />
                  <h3 className="font-semibold text-lg mb-1">{conv.title}</h3>
                  <p className="text-sm text-gray-600">{conv.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>
            🔒 Tus archivos se procesan localmente - Nunca salen de tu navegador
          </p>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-3xl">
        <button
          onClick={() => {
            setMode(null);
            setFiles([]);
            setResult(null);
            setError("");
          }}
          className="text-gray-600 hover:text-gray-800 mb-6 flex items-center gap-2"
        >
          ← Volver al menú
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{currentMode?.title}</h1>
          <p className="text-gray-600">{currentMode?.description}</p>
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
              <p className="text-xs text-gray-400">
                {mode === "image-to-pdf"
                  ? "Múltiples imágenes permitidas"
                  : "Un archivo a la vez"}
              </p>
            </div>
            <input
              type="file"
              accept={currentMode?.accept}
              multiple={mode === "image-to-pdf"}
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 rounded-lg flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options for PDF to Image */}
        {mode === "pdf-to-image" && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de salida
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["png", "jpg", "webp"] as ImageFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => setImageFormat(format)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      imageFormat === format
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold uppercase">{format}</div>
                  </button>
                ))}
              </div>
            </div>

            {(imageFormat === "jpg" || imageFormat === "webp") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calidad: {quality}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={files.length === 0 || loading}
          className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl w-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            "Convertir"
          )}
        </button>

        {/* Results */}
        {result && result.type === "images" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">
                {result.data.length} imagen{result.data.length > 1 ? "es" : ""}{" "}
                generada{result.data.length > 1 ? "s" : ""}
              </h2>
              <button
                onClick={() =>
                  result.data.forEach((img: string, i: number) =>
                    setTimeout(() => downloadImage(img, i), i * 100)
                  )
                }
                className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Descargar todas
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {result.data.map((img: string, i: number) => (
                <div key={i} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Página {i + 1}</span>
                    <button
                      onClick={() => downloadImage(img, i)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </div>
                  <img
                    src={img}
                    alt={`Página ${i + 1}`}
                    className="w-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {result && result.type === "pdf" && (
          <div className="mt-8 text-center">
            <div className="p-8 bg-green-50 rounded-xl">
              <FileText className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">
                PDF generado exitosamente
              </h3>
              <button
                onClick={() => downloadPdf(result.data)}
                className="mt-4 flex items-center gap-2 mx-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                <Download className="w-5 h-5" />
                Descargar PDF
              </button>
            </div>
          </div>
        )}

        {result && result.type === "word" && (
          <div className="mt-8 text-center">
            <div className="p-8 bg-blue-50 rounded-xl">
              <File className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">
                Texto extraído exitosamente
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Se ha extraído el texto del PDF
              </p>
              <button
                onClick={() => downloadWord(result.data)}
                className="mt-4 flex items-center gap-2 mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-5 h-5" />
                Descargar como TXT
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>
          🔒 Tus archivos se procesan localmente - Nunca salen de tu navegador
        </p>
      </footer>
    </main>
  );
}
