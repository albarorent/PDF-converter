"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setCompressedUrl(null);
    setProgress(0);
  };

  const compress = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes, {
      updateMetadata: false,
      ignoreEncryption: true,
    });

    const compressedBytes:any = await pdf.save({
      useObjectStreams: true, // compacta internamente
      addDefaultPage: false,
    });

    const blob = new Blob([compressedBytes], { type: "application/pdf" });
    setCompressedUrl(URL.createObjectURL(blob));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Comprimir PDF
        </h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="mb-4 w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        <button
          onClick={compress}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 transition hover:bg-blue-700"
        >
          {loading ? "Comprimiendo..." : "Comprimir"}
        </button>

        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {progress}%
            </p>
          </div>
        )}

        {compressedUrl && (
          <a
            href={compressedUrl}
            download="compressed.pdf"
            className="block mt-6 text-blue-600 text-center font-medium hover:underline"
          >
            Descargar PDF comprimido
          </a>
        )}
      </div>
    </main>
  );
}
