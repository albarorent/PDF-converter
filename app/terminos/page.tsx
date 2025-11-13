import { FileText, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-4">Términos y Condiciones</h1>
          <p className="text-gray-600">Última actualización: Noviembre 2024</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              1. Aceptación de Términos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar este sitio web y sus herramientas, aceptas estar sujeto a estos términos y condiciones de uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Descripción del Servicio</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              PDF Tools proporciona herramientas gratuitas en línea para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Convertir archivos PDF a diferentes formatos</li>
              <li>Unir, dividir y organizar documentos PDF</li>
              <li>Comprimir y optimizar archivos PDF</li>
              <li>Editar y añadir contenido a PDFs</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              El procesamiento de archivos se realiza principalmente en tu navegador (procesamiento local), garantizando la privacidad de tus documentos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Uso Aceptable</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Al utilizar nuestras herramientas, te comprometes a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Usar el servicio solo para fines legales y legítimos</li>
              <li>No cargar contenido ilegal, ofensivo o que viole derechos de terceros</li>
              <li>No intentar sobrecargar o dañar la infraestructura del servicio</li>
              <li>No utilizar el servicio para distribuir malware o contenido malicioso</li>
              <li>Respetar los derechos de autor y propiedad intelectual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Privacidad y Seguridad</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos tomamos muy en serio tu privacidad. El procesamiento de archivos se realiza localmente en tu navegador cuando es posible, lo que significa que tus documentos no se envían a nuestros servidores. Para más información, consulta nuestra{" "}
              <Link href="/privacidad" className="text-blue-600 hover:underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Limitación de Responsabilidad</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    El servicio se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables de:
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Pérdida de datos o corrupción de archivos</li>
              <li>Interrupciones del servicio o errores técnicos</li>
              <li>Daños directos o indirectos derivados del uso del servicio</li>
              <li>Precisión o calidad de los archivos procesados</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Recomendamos siempre mantener copias de respaldo de tus archivos originales.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Propiedad Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todo el contenido de este sitio web, incluyendo pero no limitado a texto, gráficos, logos, iconos e imágenes, es propiedad de PDF Tools o sus proveedores de contenido y está protegido por leyes de derechos de autor. Los archivos que proceses permanecen siendo de tu propiedad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Límites de Uso</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Aplicamos los siguientes límites razonables para garantizar un servicio justo para todos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Tamaño máximo de archivo: 10MB por archivo</li>
              <li>Número de archivos: Sin límite establecido para uso normal</li>
              <li>Uso comercial: Permitido con atribución apropiada</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Nos reservamos el derecho de modificar estos límites según sea necesario para mantener la calidad del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Modificaciones del Servicio</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte del servicio en cualquier momento sin previo aviso. No seremos responsables ante ti o terceros por cualquier modificación, suspensión o discontinuación del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Enlaces a Terceros</h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido, políticas de privacidad o prácticas de sitios web de terceros. Te recomendamos leer los términos y condiciones de cualquier sitio de terceros que visites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Ley Aplicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Cambios en los Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de actualizar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página. El uso continuado del servicio después de cualquier cambio constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas sobre estos términos y condiciones, por favor contáctanos en:{" "}
              <Link href="/contacto" className="text-blue-600 hover:underline">
                página de contacto
              </Link>
              {" "}o enviando un email a{" "}
              <a href="mailto:legal@pdftools.com" className="text-blue-600 hover:underline">
                legal@pdftools.com
              </a>
            </p>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              Al utilizar nuestro servicio, confirmas que has leído, entendido y aceptado estos términos y condiciones.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}