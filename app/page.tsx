"use client";
import Link from "next/link";
import {
  FileImage,
  FileSymlink,
  Scissors,
  Compass as Compress,
  FileText,
  ListOrdered,
} from "lucide-react";

const tools = [
  {
    name: "Convierte PDFs",
    description: "Convierte tus PDFs en diferentes formatos (imágenes, Word, etc.)",
    path: "/tools/pdf-to-convert",
    icon: FileImage,
  },
  {
    name: "Unir PDFs",
    description: "Combina y reordena tus archivos PDF antes de unirlos",
    path: "/tools/merge-pdf",
    icon: FileSymlink,
  },
  {
    name: "Dividir PDF",
    description: "Extrae una o varias páginas de un PDF en archivos separados",
    path: "/tools/split-pdf",
    icon: Scissors,
  },
  {
    name: "Comprimir PDF",
    description: "Reduce el tamaño de tus archivos PDF",
    path: "/tools/compress-pdf",
    icon: Compress,
  },
  {
    name: "Ordenar Páginas",
    description:
      "Reordena las páginas de tus PDFs fácilmente. Elimina o añade páginas según necesites",
    path: "/tools/reorder-pdf",
    icon: ListOrdered,
  },
  {
    name: "Editar PDF",
    description: "Edita el contenido de tus archivos PDF de forma sencilla",
    path: "/tools/edit-pdf",
    icon: FileText,
  }
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Herramientas PDF Online
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(({ name, path, icon: Icon, description }) => (
            <Link
              key={path}
              href={path}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Icon className="w-10 h-10 text-indigo-600 mb-3" />
              <h2 className="font-semibold text-gray-700">{name}</h2>
              <p className="text-gray-500 mt-1 text-[14px]">{description}</p>
            </Link>
          ))}
        </div>

        <footer className="mt-12 text-sm text-gray-500">
          🔒 100% procesamiento local o seguro en el navegador
        </footer>
      </div>
    </main>
  );
}
