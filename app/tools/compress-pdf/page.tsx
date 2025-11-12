"use client";
import { useState } from "react";
import {
  FileDown,
  Upload,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";

type CompressionLevel = "high" | "medium" | "low";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] =
    useState<CompressionLevel>("low");

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Por favor selecciona un archivo PDF válido");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedUrl(null);
    setProgress(0);
    setLoading(false);
    setError(null);
    setCompressedSize(0);
  };

  const compress = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", compressionLevel);

      setProgress(30);

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al comprimir el PDF");
      }

      const compressedSizeHeader = response.headers.get("X-Compressed-Size");
      const blob = await response.blob();

      setProgress(90);

      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);

      if (compressedSizeHeader) {
        setCompressedSize(parseInt(compressedSizeHeader));
      } else {
        setCompressedSize(blob.size);
      }

      setProgress(100);

      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al comprimir el PDF"
      );
      setLoading(false);
      setProgress(0);
    }
  };

  const compressionRate =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-100">
        <Link href="/">← Volver al inicio</Link>

        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Compresor de PDF
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Reduce el tamaño de tus archivos PDF con Ghostscript
        </p>

        <div className="mb-6">
          <label className="block w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                className="hidden"
              />
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {file ? file.name : "Haz clic para seleccionar un PDF"}
              </p>
              {originalSize > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Tamaño: {formatBytes(originalSize)}
                </p>
              )}
            </div>
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de compresión
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setCompressionLevel("high")}
              disabled={loading}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                compressionLevel === "high"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              Alta
            </button>
            <button
              onClick={() => setCompressionLevel("medium")}
              disabled={loading}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                compressionLevel === "medium"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              Media
            </button>
            <button
              onClick={() => setCompressionLevel("low")}
              disabled={loading}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                compressionLevel === "low"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              Baja
            </button>
          </div>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              {compressionLevel === "high" &&
                "Máxima compresión (72 DPI) - Tamaño muy pequeño, menor calidad"}
              {compressionLevel === "medium" &&
                "Balance óptimo (150 DPI) - Buena calidad y tamaño reducido"}
              {compressionLevel === "low" &&
                "Mínima compresión (300 DPI) - Alta calidad, mayor tamaño"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          onClick={compress}
          disabled={!file || loading}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Comprimiendo..." : "Comprimir PDF"}
        </button>

        {loading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 font-medium">
              {progress}%
            </p>
          </div>
        )}

        {compressedUrl && !loading && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    ¡Compresión exitosa!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Reducción: {compressionRate}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded p-2">
                  <p className="text-gray-600">Tamaño original</p>
                  <p className="font-semibold text-gray-800">
                    {formatBytes(originalSize)}
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-gray-600">Tamaño final</p>
                  <p className="font-semibold text-green-600">
                    {formatBytes(compressedSize)}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={compressedUrl}
              download={`${
                file?.name.replace(".pdf", "") || "archivo"
              }_comprimido.pdf`}
              className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <FileDown className="w-5 h-5" />
              Descargar PDF Comprimido
            </a>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6 max-w-md">
        Powered by Ghostscript - Compresión profesional de PDFs
      </p>
    </main>
  );
}
