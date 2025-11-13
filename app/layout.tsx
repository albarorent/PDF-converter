
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Mejora rendimiento
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ Metadata mejorada
export const metadata: Metadata = {
  metadataBase: new URL("https://www.pdfconvertools.com/"),
  title: {
    default: "PDF Tools - Herramientas PDF Online Gratis | Convierte, Une y Comprime",
    template: "%s | PDF Tools", // Para páginas hijas: "Título página | PDF Tools"
  },
  description:
    "Convierte, une, divide, comprime y edita archivos PDF gratis sin registro. 100% seguro con procesamiento local en tu navegador. Sin límites ni marcas de agua.",
  keywords: [
    "convertir PDF",
    "PDF a imagen",
    "PDF a Word",
    "unir PDF online",
    "dividir PDF",
    "comprimir PDF",
    "editar PDF online",
    "herramientas PDF gratis",
    "PDF tools",
    "PDF converter",
    "merge PDF",
    "split PDF",
    "reduce PDF size",
  ],
  authors: [{ name: "PDF Tools" }],
  creator: "PDF Tools",
  publisher: "PDF Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.pdfconvertools.com",
    siteName: "PDF Tools",
    title: "PDF Tools - Herramientas PDF Online Gratis",
    description:
      "Convierte, une y edita PDFs gratis. Procesamiento 100% local y seguro sin subir archivos.",
    images: [
      {
        url: "/og-image.png", // Crea esta imagen 1200x630px
        width: 1200,
        height: 630,
        alt: "PDF Tools - Herramientas PDF Online",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools - Convierte y Gestiona tus PDFs Online",
    description: "Herramientas PDF gratuitas. Seguro, rápido y sin límites.",
    images: ["/og-image.png"],
    creator: "@tutwitter", // Opcional: tu cuenta de Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.pdfconvertools.com",
    languages: {
      "es-ES": "https://www.pdfconvertools.com",
      // Agrega más idiomas si los soportas
    },
  },
  verification: {
    google: "tu-codigo-google-search-console", // Añadir después de verificar
    // yandex: "codigo-yandex",
    // bing: "codigo-bing",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ID de Google Analytics (reemplaza con el tuyo)
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
  
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* ✅ Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* ✅ Schema.org - Organización */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PDF Tools",
              url: "https://www.pdfconvertools.com/",
              logo: "https://www.pdfconvertools.com/logo.png",
              description:
                "Herramientas online para convertir, unir, comprimir y editar PDFs gratis.",
              sameAs: [
                // Añade tus redes sociales
                // "https://twitter.com/tuperfil",
                // "https://facebook.com/tuperfil",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "contacto@pdfconvertools.com",
                url: "https://www.pdfconvertools.com/contacto",
              },
            }),
          }}
        />

        {/* ✅ Schema.org - WebSite con SearchAction */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PDF Tools",
              url: "https://www.pdfconvertools.com",
              description:
                "Herramientas profesionales gratuitas para gestionar archivos PDF online.",
              inLanguage: "es",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.pdfconvertools.com/blog?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* ✅ Schema.org - WebApplication (opcional, para destacar herramientas) */}
        <Script
          id="schema-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "PDF Tools",
              url: "https://www.pdfconvertools.com",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Herramientas gratuitas para convertir, unir, dividir y editar PDFs online.",
              featureList: [
                "Convertir PDF a imagen",
                "Unir múltiples PDFs",
                "Dividir PDFs",
                "Comprimir PDFs",
                "Editar PDFs online",
                "Reordenar páginas PDF",
              ],
              browserRequirements: "Requires JavaScript",
            }),
          }}
        />

        {/* ✅ Google AdSense (descomentar después de aprobación) */}
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        /> */}

        {/* ✅ Preconnect para mejorar rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}
      >
        {/* ✅ Skip to main content (accesibilidad y SEO) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50"
        >
          Saltar al contenido principal
        </a>

        {children}

        {/* ✅ Noscript para usuarios sin JavaScript */}
        <noscript>
          <div style={{
            padding: '20px',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            margin: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p>
              <strong>JavaScript está deshabilitado.</strong> Para utilizar nuestras herramientas PDF,
              por favor habilita JavaScript en tu navegador.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}