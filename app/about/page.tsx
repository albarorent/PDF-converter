
import Link from "next/link";
import { 
  FileText, 
  Shield, 
  Zap, 
  Heart, 
  Users, 
  Target,
  Lightbulb,
  Award,
  Globe,
  Lock
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Acerca de PDF Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Herramientas profesionales y gratuitas para trabajar con PDFs. 
            Nuestra misión es hacer que la gestión de documentos sea simple, 
            rápida y accesible para todos.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Historia */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Nuestra Historia</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                PDF Tools nació de una necesidad simple: encontrar herramientas confiables 
                y gratuitas para trabajar con archivos PDF sin complicaciones.
              </p>
              <p>
                Cansados de herramientas que requerían registro, tenían límites restrictivos 
                o preocupaciones de privacidad, decidimos crear algo diferente. Una plataforma 
                donde la privacidad del usuario fuera lo primero, donde el procesamiento local 
                garantizara que tus documentos nunca salieran de tu dispositivo.
              </p>
              <p>
                Hoy, miles de usuarios confían en PDF Tools para sus necesidades diarias de 
                gestión de documentos, desde estudiantes hasta profesionales.
              </p>
            </div>
          </div>
        </section>

        {/* Misión, Visión y Valores */}
        <section className="mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Misión */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed">
                Democratizar el acceso a herramientas profesionales de PDF, 
                ofreciendo soluciones gratuitas, seguras y fáciles de usar para todos.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <Globe className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
              <p className="text-gray-700 leading-relaxed">
                Ser la plataforma de referencia mundial para la gestión de documentos PDF, 
                reconocida por su compromiso con la privacidad y la calidad.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <Heart className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nuestros Valores</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  Privacidad primero
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  Simplicidad
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  Accesibilidad
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  Calidad
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por Qué Elegirnos?</h2>
            <p className="text-gray-600 text-lg">
              Lo que nos hace diferentes de otras herramientas PDF
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">100% Privacidad Garantizada</h3>
                  <p className="text-gray-700">
                    El procesamiento se realiza localmente en tu navegador. 
                    Tus archivos nunca se suben a nuestros servidores, 
                    garantizando total privacidad y seguridad.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Rápido y Eficiente</h3>
                  <p className="text-gray-700">
                    Sin esperas ni colas. El procesamiento local significa 
                    conversiones instantáneas sin depender de la velocidad 
                    de internet o servidores sobrecargados.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sin Registro ni Límites</h3>
                  <p className="text-gray-700">
                    No necesitas crear una cuenta. No hay límites diarios 
                    ni restricciones artificiales. Usa nuestras herramientas 
                    libremente cuantas veces necesites.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Award className="w-8 h-8 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Calidad Profesional</h3>
                  <p className="text-gray-700">
                    Utilizamos las mejores bibliotecas y tecnologías disponibles 
                    para garantizar resultados de calidad profesional en todas 
                    nuestras conversiones.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Múltiples Formatos</h3>
                  <p className="text-gray-700">
                    Soportamos una amplia variedad de formatos de entrada y 
                    salida, permitiéndote trabajar con PDFs de cualquier forma 
                    que necesites.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Siempre Gratuito</h3>
                  <p className="text-gray-700">
                    Creemos que las herramientas esenciales deben ser accesibles 
                    para todos. Por eso, todas nuestras funciones son y serán 
                    siempre completamente gratuitas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        {/* <section className="mb-20">
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestro Impacto</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">1M+</div>
                <div className="text-blue-100">Archivos Procesados</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Usuarios Mensuales</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">6</div>
                <div className="text-blue-100">Herramientas Gratuitas</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Procesamiento Local</div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Tecnología */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Nuestra Tecnología</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Utilizamos tecnologías web modernas para ofrecer el mejor rendimiento 
                y experiencia de usuario:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span><strong>PDF.js de Mozilla:</strong> Para renderizado y manipulación de PDFs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span><strong>Canvas API:</strong> Para conversiones de alta calidad a imágenes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span><strong>WebAssembly:</strong> Para procesamiento rápido y eficiente</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span><strong>React/Next.js:</strong> Para una interfaz moderna y responsive</span>
                </li>
              </ul>
              <p>
                Todas estas tecnologías se ejecutan directamente en tu navegador, 
                sin necesidad de enviar datos a servidores externos.
              </p>
            </div>
          </div>
        </section>

        {/* Compromiso con la privacidad */}
        <section className="mb-20">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl font-bold text-green-800">
                Nuestro Compromiso con tu Privacidad
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                En PDF Tools, la privacidad no es solo una característica, es nuestra 
                filosofía fundamental:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Procesamiento 100% local en tu navegador</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Cero almacenamiento de tus archivos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Sin tracking innecesario</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Código abierto y transparente</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Cumplimiento con GDPR y regulaciones de privacidad</span>
                </li>
              </ul>
              <p className="mt-4">
                Lee más sobre nuestras prácticas en nuestra{" "}
                <Link href="/privacidad" className="text-blue-600 hover:underline font-semibold">
                  Política de Privacidad
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Únete a miles de usuarios que confían en PDF Tools para sus documentos
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/tools"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                Ver todas las herramientas
              </Link>
              <Link
                href="/blog"
                className="bg-blue-800 text-white hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 focus:outline-none px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Leer el blog
              </Link>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <footer className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-4">
            ¿Tienes preguntas o sugerencias?
          </p>
          <Link
            href="/contacto"
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg underline"
          >
            Contáctanos →
          </Link>
        </footer>
      </div>
    </main>
  );
}