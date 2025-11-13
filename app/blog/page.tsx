
"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { articles } from "./data/articles";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Blog de Herramientas PDF
          </h1>
          <p className="text-gray-600 text-lg">
            Tutoriales, guías y consejos para trabajar con PDFs
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.date).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>

                <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>

                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Leer más</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex flex-wrap gap-2">
                  {article.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron artículos</p>
          </div>
        )}
      </div>
    </main>
  );
}