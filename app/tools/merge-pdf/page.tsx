"use client";
import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Loader2, Trash2, FileUp, Download, RotateCcw } from "lucide-react";
import { SortableItem } from "@/app/components/SortableItem";
import Link from "next/link";
import Image from "next/image";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const generateThumbnail = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
    // @ts-ignore
    const pdfjsWorkerSrc = await import("pdfjs-dist/legacy/build/pdf.worker");

    pdfjsLib.GlobalWorkerOptions.workerSrc = window.URL.createObjectURL(
      new Blob([pdfjsWorkerSrc], { type: "text/javascript" })
    );

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const thumbnail = canvas.toDataURL("image/png");
    setThumbnails((prev) => ({ ...prev, [file.name]: thumbnail }));
    setPageCounts((prev) => ({ ...prev, [file.name]: pdf.numPages }));
  };

  useEffect(() => {
    files.forEach((file) => {
      if (!thumbnails[file.name]) generateThumbnail(file);
    });
  }, [files]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleRemove = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setThumbnails((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleClear = () => {
    setFiles([]);
    setThumbnails({});
    setMergedUrl(null);
    setPageCounts({});
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((f) => f.name === active.id);
      const newIndex = files.findIndex((f) => f.name === over?.id);
      setFiles((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const merge = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setMergedUrl(null);

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBytes: any = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    setMergedUrl(URL.createObjectURL(blob));
    setLoading(false);
  };

  const totalPages = Object.values(pageCounts).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <Link href="/">← Volver al inicio</Link>

        <h1 className="text-3xl font-bold mb-2 text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Unir PDFs
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sube varios archivos PDF, cambia el orden y únelos fácilmente.
        </p>

        {/* Zona de carga */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileUp className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click para subir</span> o arrastra
              PDFs
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        {/* Lista de PDFs */}
        {files.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-6 mb-3">
              <p className="text-gray-600 text-sm">
                {files.length} archivo{files.length > 1 ? "s" : ""} •{" "}
                {totalPages} página
                {totalPages !== 1 ? "s" : ""}
              </p>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <RotateCcw className="w-4 h-4" /> Vaciar lista
              </button>
            </div>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files.map((f) => f.name)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {files.map((file) => (
                    <SortableItem key={file.name} id={file.name}>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          {thumbnails[file.name] ? (
                            <Image
                              src={thumbnails[file.name]}
                              alt={file.name}
                              className="w-12 h-16 object-cover border rounded"
                              width={48}
                              height={64}
                            />
                          ) : (
                            <div className="w-12 h-16 bg-gray-200 animate-pulse rounded"></div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {pageCounts[file.name]
                                ? `${pageCounts[file.name]} pág.`
                                : "Cargando..."}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(file.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Botón unir */}
            <button
              onClick={merge}
              disabled={loading}
              className="mt-6 w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Uniendo...
                </>
              ) : (
                "Unir PDFs"
              )}
            </button>
          </>
        )}

        {/* Resultado */}
        {mergedUrl && (
          <a
            href={mergedUrl}
            download="merged.pdf"
            className="mt-6 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar PDF unido
          </a>
        )}
      </div>
    </main>
  );
}
