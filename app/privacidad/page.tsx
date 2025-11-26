import { Lock, Eye, Server, Cookie } from "lucide-react";
import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Lock className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-gray-600">Última actualización: Noviembre 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex gap-2">
              <Lock className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-800 mb-2">
                  Tu privacidad es nuestra prioridad
                </h3>
                <p className="text-gray-700 text-sm">
                  El procesamiento de tus archivos se realiza principalmente en
                  tu navegador (procesamiento local). Esto significa que tus
                  documentos NO se suben a nuestros servidores en la mayoría de
                  los casos.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              1. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              1.1 Archivos que Procesas
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              La mayoría de nuestras herramientas procesan tus archivos
              completamente en tu navegador (procesamiento del lado del
              cliente). Esto significa que:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Tus archivos NUNCA se envían a nuestros servidores</li>
              <li>El procesamiento ocurre directamente en tu dispositivo</li>
              <li>Nadie más tiene acceso a tus documentos</li>
              <li>
                Los archivos no se almacenan ni se guardan en ningún lugar
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              1.2 Información de Uso
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Recopilamos información anónima sobre cómo utilizas nuestro sitio:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Páginas visitadas y herramientas utilizadas</li>
              <li>Tipo de navegador y sistema operativo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-600" />
              2. Cómo Usamos tu Información
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Mejorar la funcionalidad y experiencia del usuario</li>
              <li>Analizar tendencias y patrones de uso del sitio</li>
              <li>Detectar y prevenir problemas técnicos</li>
              <li>Optimizar el rendimiento de nuestras herramientas</li>
              <li>Generar estadísticas anónimas de uso</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>
                NO vendemos, alquilamos ni compartimos tu información personal
                con terceros para fines de marketing.
              </strong>
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cookie className="w-6 h-6 text-blue-600" />
              3. Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos cookies y tecnologías similares para:
            </p>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies Esenciales</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies de Análisis</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos Google Analytics para entender cómo los usuarios interactúan con nuestro sitio. Esta información es anónima y agregada.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">Cookies de Publicidad</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Si utilizamos Google AdSense u otros servicios publicitarios, se pueden establecer cookies para mostrar anuncios relevantes. Puedes gestionar tus preferencias de anuncios en la configuración de tu navegador.
            </p>

            <p className="text-gray-700 leading-relaxed mt-4">
              Puedes controlar y/o eliminar las cookies según desees. Para obtener más información, visita{" "}
              <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                aboutcookies.org
              </a>
            </p>
          </section> */}

          {/* <section>
            <h2 className="text-2xl font-bold mb-4">4. Google AdSense</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos Google AdSense para mostrar anuncios en nuestro sitio. Google utiliza cookies para servir anuncios basados en las visitas previas de un usuario a este u otros sitios web.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Los usuarios pueden inhabilitar el uso de cookies de publicidad personalizada visitando{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Configuración de anuncios de Google
              </a>
            </p>
          </section> */}

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Seguridad de los Datos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                Procesamiento local en el navegador para máxima privacidad
              </li>
              <li>Conexiones HTTPS encriptadas</li>
              <li>No almacenamiento de archivos procesados</li>
              <li>Acceso restringido a datos de analytics</li>
              <li>Revisiones de seguridad periódicas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Tus Derechos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Acceso:</strong> Solicitar información sobre qué datos
                personales tenemos sobre ti
              </li>
              <li>
                <strong>Rectificación:</strong> Corregir cualquier información
                inexacta
              </li>
              <li>
                <strong>Eliminación:</strong> Solicitar la eliminación de tus
                datos personales
              </li>
              <li>
                <strong>Oposición:</strong> Oponerte al procesamiento de tus
                datos personales
              </li>
              <li>
                <strong>Portabilidad:</strong> Recibir tus datos en un formato
                estructurado
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Para ejercer cualquiera de estos derechos, contáctanos en{" "}
              <a
                href="mailto:soportepdf@pdfconvertools.com"
                className="text-blue-600 hover:underline"
              >
                soportepdf@pdfconvertools.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Retención de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Como la mayoría del procesamiento ocurre localmente en tu
              navegador, no retenemos tus archivos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Cambios en esta Política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos actualizar esta política de privacidad ocasionalmente. Te
              notificaremos sobre cualquier cambio publicando la nueva política
              en esta página y actualizando la fecha de "última actualización".
              Te recomendamos revisar esta página periódicamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas sobre esta política de privacidad,
              contáctanos:
            </p>
            <ul className="space-y-2 text-gray-700 mt-3">
              <li>
                Email:{" "}
                <a
                  href="mailto:soportepdf@pdfconvertools.com"
                  className="text-blue-600 hover:underline"
                >
                  soportepdf@pdfconvertools.com
                </a>
              </li>
              <li>
                Página de contacto:{" "}
                <Link
                  href="/contacto"
                  className="text-blue-600 hover:underline"
                >
                  Formulario de contacto
                </Link>
              </li>
            </ul>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              Esta política de privacidad fue actualizada por última vez el 13
              de noviembre de 2025.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
