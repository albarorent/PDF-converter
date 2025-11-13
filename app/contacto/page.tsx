"use client";
import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de envío
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-4">Contacto</h1>
          <p className="text-gray-600">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2 text-green-600">¡Mensaje enviado!</h2>
              <p className="text-gray-600">Te responderemos lo antes posible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  required
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Cuéntanos más detalles..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar mensaje
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>También puedes escribirnos a: <a href="mailto:contacto@pdftools.com" className="text-blue-600 hover:underline">contacto@pdftools.com</a></p>
        </div>
      </div>
    </main>
  );
}