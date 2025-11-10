"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileUp,
  Loader2,
  FileText,
  Download,
  X,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

function SortableFile({ file, index, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between py-2 px-3 bg-white rounded-lg mb-2 border border-gray-200 shadow-sm cursor-grab"
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners}>
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div>
        <FileText className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-gray-700 truncate max-w-[200px]">
          {index + 1}. {file.name}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </span>
        <button
          onClick={() => onRemove(file.name)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    if (selected.some((f) => f.type !== "application/pdf")) {
      setError("Solo se permiten archivos PDF");
      return;
    }
    setError("");
    setFiles((prev) => [...prev, ...selected]);
    setMergedUrl(null);
  };

  const handleRemove = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.name === active.id);
      const newIndex = files.findIndex((f) => f.name === over.id);
      setFiles((files) => arrayMove(files, oldIndex, newIndex));
    }
  };

  const merge = async () => {
    if (files.length < 2) {
      setError("Selecciona al menos dos archivos PDF");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }

      const mergedBytes:any = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      setMergedUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError("Error al unir los PDFs. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-2xl">
        {/* Header */}
        <Link href="/">← Volver al inicio</Link>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Unir PDFs
          </h1>
          <p className="text-gray-600">
            Combina varios archivos PDF en uno solo y elige el orden fácilmente.
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
                <span className="font-semibold">Click para subir</span> o arrastra tus PDFs
              </p>
              <p className="text-xs text-gray-400">Puedes seleccionar varios archivos</p>
            </div>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-4 bg-blue-50 rounded-lg p-3 max-h-64 overflow-y-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={files.map((f) => f.name)}
                  strategy={verticalListSortingStrategy}
                >
                  {files.map((file, index) => (
                    <SortableFile
                      key={file.name}
                      file={file}
                      index={index}
                      onRemove={handleRemove}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Merge Button */}
        <button
          onClick={merge}
          disabled={files.length < 2 || loading}
          className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl w-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uniendo PDFs...
            </>
          ) : (
            "Unir PDFs"
          )}
        </button>

        {/* Download */}
        {mergedUrl && (
          <div className="mt-6 text-center">
            <a
              href={mergedUrl}
              download="merged.pdf"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Descargar PDF unido
            </a>
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>🔒 Tus archivos se procesan localmente - Nunca salen de tu navegador</p>
      </footer>
    </main>
  );
}
