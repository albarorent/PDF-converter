"use client";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileDown,
  Upload,
  FileUp,
  Loader2,
  Scissors,
  CheckSquare,
  Square,
  Download,
} from "lucide-react";
import Link from "next/link";

interface PagePreview {
  id: string;
  pageNumber: number;
  dataUrl: string;
  selected: boolean;
}

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [splitMode, setSplitMode] = useState<"individual" | "selection">(
    "selection"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          selected: false,
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
    setPages([]);
    setPdfDoc(null);
    loadPdf(selectedFile);
  };

  const togglePageSelection = (index: number) => {
    const newPages = [...pages];
    newPages[index].selected = !newPages[index].selected;
    setPages(newPages);
  };

  const selectAllPages = () => {
    const newPages = pages.map((page) => ({ ...page, selected: true }));
    setPages(newPages);
  };

  const deselectAllPages = () => {
    const newPages = pages.map((page) => ({ ...page, selected: false }));
    setPages(newPages);
  };

  const downloadSelectedPages = async () => {
    if (!pdfDoc) return;

    const selectedPages = pages.filter((p) => p.selected);
    if (selectedPages.length === 0) {
      setError("Selecciona al menos una página para extraer");
      return;
    }

    setLoading(true);

    try {
      if (splitMode === "individual") {
        // Descargar cada página como archivo separado
        for (const page of selectedPages) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [
            page.pageNumber - 1,
          ]);
          newPdf.addPage(copiedPage);

          const pdfBytes: any = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `${file?.name.replace(".pdf", "") || "pagina"}_pagina_${
            page.pageNumber
          }.pdf`;
          a.click();

          // Pequeña pausa entre descargas
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } else {
        // Descargar todas las páginas seleccionadas en un solo PDF
        const newPdf = await PDFDocument.create();
        const indices = selectedPages.map((p) => p.pageNumber - 1);
        const copiedPages = await newPdf.copyPages(pdfDoc, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes: any = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${
          file?.name.replace(".pdf", "") || "documento"
        }_extraido.pdf`;
        a.click();
      }

      setLoading(false);
    } catch (err) {
      console.error("Error extrayendo páginas:", err);
      setError("Error al extraer las páginas del PDF.");
      setLoading(false);
    }
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-2xl">
        <Link href="/">← Volver al inicio</Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Scissors className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dividir PDF
          </h1>
          <p className="text-gray-600">
            Extrae páginas específicas de tu PDF en archivos separados
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
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {pages.length > 0 && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modo de división
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSplitMode("selection")}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          splitMode === "selection"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        Un solo archivo
                      </button>
                      <button
                        onClick={() => setSplitMode("individual")}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          splitMode === "individual"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        Archivos separados
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {splitMode === "selection"
                        ? "Las páginas seleccionadas se combinarán en un solo PDF"
                        : "Cada página seleccionada se descargará como un archivo PDF individual"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">
                        {selectedCount}
                      </span>{" "}
                      página{selectedCount !== 1 ? "s" : ""} seleccionada
                      {selectedCount !== 1 ? "s" : ""}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllPages}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                      >
                        Seleccionar todas
                      </button>
                      <button
                        onClick={deselectAllPages}
                        className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Deseleccionar todas
                      </button>
                    </div>
                  </div>
                </div>

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
                          onClick={() => togglePageSelection(index)}
                          className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                            page.selected
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="relative aspect-3/4 bg-white group">
                            <iframe
                              src={page.dataUrl}
                              className="w-full h-full pointer-events-none border-0"
                              title={`Página ${page.pageNumber}`}
                            />
                            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                              {page.pageNumber}
                            </div>
                            <div className="absolute top-2 right-2">
                              {page.selected ? (
                                <div className="bg-blue-600 text-white p-1 rounded shadow-md">
                                  <CheckSquare className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className="bg-white p-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Square className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            {page.selected && (
                              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={downloadSelectedPages}
                      disabled={selectedCount === 0}
                      className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl w-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {splitMode === "individual"
                        ? `Descargar ${selectedCount} página${
                            selectedCount !== 1 ? "s" : ""
                          } separada${selectedCount !== 1 ? "s" : ""}`
                        : `Extraer ${selectedCount} página${
                            selectedCount !== 1 ? "s" : ""
                          }`}
                    </button>
                  </>
                )}
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
    </main>
  );
}
