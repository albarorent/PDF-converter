import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Herramientas PDF Online Gratis | Convierte, Une y Comprime PDFs",
  description:
    "Convierte, une, divide, comprime y edita archivos PDF gratis y sin registro. 100% seguro y rápido. Procesamiento local directamente en tu navegador.",
  keywords: [
    "convertir PDF a Word",
    "unir PDF",
    "dividir PDF",
    "comprimir PDF",
    "editar PDF online",
    "herramientas PDF gratis",
    "PDF Tools",
    "PDF converter online",
  ],
  openGraph: {
    title: "Herramientas PDF Online Gratis",
    description:
      "Convierte, une, divide, comprime y edita archivos PDF sin subirlos al servidor. Todo directamente en tu navegador.",
    url: "https://tusitio.com",
    siteName: "PDF Tools",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://tusitio.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDF Tools - Herramientas PDF Online Gratis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools - Convierte y Gestiona tus PDFs Online",
    description:
      "Convierte y gestiona tus archivos PDF online gratis. Seguro y sin límites.",
    images: ["https://tusitio.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://tusitio.com"),
  alternates: {
    canonical: "https://tusitio.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ✅ Schema.org para SEO estructurado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PDF Tools",
              url: "https://tusitio.com",
              description:
                "Herramientas online para convertir, unir, comprimir y editar PDFs gratis.",
              inLanguage: "es",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://tusitio.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* ✅ Google AdSense (puedes activarlo después de aprobación) */}
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=TU_ID_CLIENTE"
          crossOrigin="anonymous"
        ></script> */}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
