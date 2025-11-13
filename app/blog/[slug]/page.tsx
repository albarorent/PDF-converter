
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { getArticleBySlug, articles } from "../data/articles";

// Esta función le dice a Next.js qué páginas crear
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// AGREGAR ESTO: Generar metadata dinámico
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Artículo no encontrado'
    };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords.join(', '),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params; // CAMBIO IMPORTANTE
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} de lectura</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600">
            {article.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed text-gray-700">
              {article.content.intro}
            </p>
          </div>

          {/* CTA to Tool */}
          <div className="my-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-2">¿Listo para comenzar?</h3>
            <p className="text-gray-600 mb-4">Usa nuestra herramienta gratuita ahora mismo</p>
            <Link
              href={article.tool}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Probar herramienta gratis
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Steps */}
          {article.content.steps && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Paso a paso</h2>
              <div className="space-y-4">
                {article.content.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {article.content.tips && (
            <div className="mb-12 bg-green-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-800">💡 Consejos útiles</h2>
              <ul className="space-y-2">
                {article.content.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {article.content.faqs && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
              <div className="space-y-6">
                {article.content.faqs.map((faq, idx) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final CTA */}
          <div className="mt-12 p-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">¿Te fue útil esta guía?</h3>
            <p className="mb-6 text-blue-100">Prueba nuestra herramienta ahora y hazlo tú mismo en minutos</p>
            <Link
              href={article.tool}
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-bold text-lg"
            >
              Usar herramienta gratis →
            </Link>
          </div>

          {/* Keywords */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 mb-3">Palabras clave:</p>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Artículos relacionados</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {articles
              .filter(a => a.slug !== article.slug)
              .slice(0, 2)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/blog/${relatedArticle.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 group"
                >
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedArticle.description}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}