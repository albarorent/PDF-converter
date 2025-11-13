
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
    category: "Conversión",
  },
  {
    name: "Unir PDFs",
    description: "Combina y reordena tus archivos PDF antes de unirlos",
    path: "/tools/merge-pdf",
    icon: FileSymlink,
    category: "Organización",
  },
  {
    name: "Dividir PDF",
    description: "Extrae una o varias páginas de un PDF en archivos separados",
    path: "/tools/split-pdf",
    icon: Scissors,
    category: "Organización",
  },
  {
    name: "Comprimir PDF",
    description: "Reduce el tamaño de tus archivos PDF",
    path: "/tools/compress-pdf",
    icon: Compress,
    category: "Optimización",
  },
  {
    name: "Ordenar Páginas",
    description: "Reordena las páginas de tus PDFs fácilmente. Elimina o añade páginas según necesites",
    path: "/tools/reorder-pdf",
    icon: ListOrdered,
    category: "Organización",
  },
  {
    name: "Editar PDF",
    description: "Editar PDFs en línea: Añade texto, imágenes y anotaciones fácilmente",
    path: "/tools/edit-pdf",
    icon: FileText,
    category: "Edición",
  },
];

export default function ToolsPage() {
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Todas las Herramientas
          </h1>
          <p className="text-xl text-gray-600">
            Herramientas profesionales para gestionar tus PDFs
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map(({ name, path, icon: Icon, description }) => (
                  <Link
                    key={path}
                    href={path}
                    className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <Icon className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-700 text-lg mb-2">{name}</h3>
                    <p className="text-gray-500 text-sm text-center">{description}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
