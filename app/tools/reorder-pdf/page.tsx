"use client";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileDown,
  Upload,
  Trash2,
  Plus,
  GripVertical,
  Eye,
  X,
  FileUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface PagePreview {
  id: string;
  pageNumber: number;
  dataUrl: string;
}

export default function PdfPageOrganizer() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewPage, setPreviewPage] = useState<PagePreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPdfDoc(pdf);

      const previews: PagePreview[] = [];
      const pageCount = pdf.getPageCount();

      for (let i = 0; i < pageCount; i++) {
        const tempPdf = await PDFDocument.create();
        const [copiedPage] = await tempPdf.copyPages(pdf, [i]);
        tempPdf.addPage(copiedPage);

        const pdfBytes: any = await tempPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        previews.push({
          id: `page-${i}-${Date.now()}`,
          pageNumber: i + 1,
          dataUrl: url,
        });
      }

      setPages(previews);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando PDF:", err);
      setError(
        "Error al cargar el PDF. Asegúrate de que sea un archivo válido."
      );
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Por favor selecciona un archivo PDF válido");
      return;
    }

    setFile(selectedFile);
    loadPdf(selectedFile);
  };

  const handleAddPages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !pdfDoc) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Por favor selecciona un archivo PDF válido");
      return;
    }

    setLoading(true);

    try {
      const bytes = await selectedFile.arrayBuffer();
      const newPdf = await PDFDocument.load(bytes);

      const newPageCount = newPdf.getPageCount();
      const copiedPages = await pdfDoc.copyPages(
        newPdf,
        Array.from({ length: newPageCount }, (_, i) => i)
      );

      copiedPages.forEach((page) => pdfDoc.addPage(page));

      const newPreviews: PagePreview[] = [];
      const startIndex = pages.length;

      for (let i = 0; i < newPageCount; i++) {
        const tempPdf = await PDFDocument.create();
        const [copiedPage] = await tempPdf.copyPages(pdfDoc, [startIndex + i]);
        tempPdf.addPage(copiedPage);

        const pdfBytes: any = await tempPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        newPreviews.push({
          id: `page-${startIndex + i}-${Date.now()}`,
          pageNumber: startIndex + i + 1,
          dataUrl: url,
        });
      }

      setPages([...pages, ...newPreviews]);
      setLoading(false);
    } catch (err) {
      console.error("Error añadiendo páginas:", err);
      setError("Error al añadir páginas del PDF.");
      setLoading(false);
    }
  };

  const deletePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];

    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);

    setPages(newPages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const downloadPdf = async () => {
    if (!pdfDoc || pages.length === 0) return;

    setLoading(true);

    try {
      const newPdf = await PDFDocument.create();
      const originalIndices = pages.map((page) => page.pageNumber - 1);
      const copiedPages = await newPdf.copyPages(pdfDoc, originalIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes: any = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${
        file?.name.replace(".pdf", "") || "documento"
      }_organizado.pdf`;
      a.click();

      setLoading(false);
    } catch (err) {
      console.error("Error generando PDF:", err);
      setError("Error al generar el PDF final.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-2xl">
                    <Link href="/">← Volver al inicio</Link>
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Organizador de Páginas PDF
          </h1>
          <p className="text-gray-600">
            Reordena, elimina o añade páginas a tus archivos PDF
          </p>
          <p className="text-xs text-green-600 mt-2">
            ✓ Procesamiento 100% local - Sin subir archivos
          </p>
        </div>

        {!file ? (
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
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {file && (
              <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-700 font-medium block truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {pages.length} página{pages.length !== 1 ? "s" : ""} •{" "}
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addFileInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir páginas
                  </button>
                  <input
                    ref={addFileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleAddPages}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
                <p className="mt-4 text-gray-600">Procesando PDF...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {pages.map((page, index) => (
                    <div
                      key={page.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white border-2 rounded-lg overflow-hidden cursor-move transition-all hover:shadow-lg ${
                        draggedIndex === index
                          ? "opacity-50 scale-95 border-blue-500"
                          : "opacity-100 border-gray-200"
                      }`}
                    >
                      <div className="relative aspect-3/4 bg-white group">
                        <iframe
                          src={page.dataUrl}
                          className="w-full h-full pointer-events-none border-0"
                          title={`Página ${page.pageNumber}`}
                        />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                          {index + 1}
                        </div>
                        <div className="absolute top-2 right-2 bg-white shadow-md p-1 rounded">
                          <GripVertical className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewPage(page)}
                            className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                            title="Ver página completa"
                          >
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => deletePage(index)}
                            className="bg-red-500 p-2 rounded-lg hover:bg-red-600 transition-all shadow-lg"
                            title="Eliminar página"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={downloadPdf}
                  disabled={loading || pages.length === 0}
                  className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl w-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-5 h-5" />
                      Descargar PDF Organizado
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>
          🔒 Tus archivos se procesan localmente - Nunca salen de tu navegador
        </p>
      </footer>

      {previewPage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-800">
                Página {previewPage.pageNumber}
              </h3>
              <button
                onClick={() => setPreviewPage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe
                src={previewPage.dataUrl}
                className="w-full h-full min-h-[600px]"
                title={`Vista previa página ${previewPage.pageNumber}`}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
