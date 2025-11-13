"use client";
import Link from "next/link";
import {
  FileImage,
  FileSymlink,
  Scissors,
  Compass as Compress,
  FileText,
  ListOrdered,
  Menu,
  X,
  BookOpen,
  Home,
  Wrench,
  Users,
} from "lucide-react";
import { useState } from "react";

const tools = [
  {
    name: "Convierte PDFs",
    description:
      "Convierte tus PDFs en diferentes formatos (imágenes, Word, etc.)",
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
    description:
      "Editar PDFs en línea: Añade texto, imágenes y anotaciones fácilmente",
    path: "/tools/edit-pdf",
    icon: FileText,
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PDF Tools
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              <Link
                href="/tools"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Wrench className="w-4 h-4" />
                Herramientas
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Blog
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                Acerca de
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Inicio
                </Link>
                <Link
                  href="/tools"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Wrench className="w-4 h-4" />
                  Herramientas
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  Blog
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  Acerca de
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-6 py-16">
        <div className="max-w-6xl w-full text-center">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Herramientas PDF Online
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Edita, convierte y gestiona tus PDFs de forma gratuita y segura
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(({ name, path, icon: Icon, description }) => (
              <Link
                key={path}
                href={path}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <Icon className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="font-semibold text-gray-700 text-lg mb-2">
                  {name}
                </h2>
                <p className="text-gray-500 text-sm">{description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              ¿Por qué elegir nuestras herramientas?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-2">100% Seguro</h3>
                <p className="text-sm text-gray-600">
                  Procesamiento local en tu navegador. Tus archivos nunca se
                  suben a nuestros servidores.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Rápido y Fácil</h3>
                <p className="text-sm text-gray-600">
                  Sin registros ni límites. Convierte tus archivos en segundos.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">💯</div>
                <h3 className="font-semibold mb-2">Totalmente Gratis</h3>
                <p className="text-sm text-gray-600">
                  Todas las herramientas son gratuitas sin restricciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg">PDF Tools</span>
              </div>
              <p className="text-sm text-gray-600">
                Herramientas profesionales para trabajar con PDFs de forma
                gratuita y segura.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Herramientas</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/tools/pdf-to-convert"
                    className="hover:text-blue-600"
                  >
                    Convertir PDF
                  </Link>
                </li>
                <li>
                  <Link href="/tools/merge-pdf" className="hover:text-blue-600">
                    Unir PDFs
                  </Link>
                </li>
                <li>
                  <Link href="/tools/split-pdf" className="hover:text-blue-600">
                    Dividir PDF
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/compress-pdf"
                    className="hover:text-blue-600"
                  >
                    Comprimir PDF
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/reorder-pdf"
                    className="hover:text-blue-600"
                  >
                    Ordenar Páginas
                  </Link>
                </li>
                <li>
                  <Link href="/tools/edit-pdf" className="hover:text-blue-600">
                    Editar PDF
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/blog" className="hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-blue-600">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-blue-600">
                    Todas las herramientas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/contacto" className="hover:text-blue-600">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="hover:text-blue-600">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-blue-600">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} PDF Tools. Todos los derechos
              reservados.
            </p>
            <p className="mt-2">🔒 100% procesamiento seguro en el navegador</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
