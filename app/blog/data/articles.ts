// blog/data/articles.ts
export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  tool: string; // Link a la herramienta
  date: string;
  readTime: string;
  keywords: string[];
  content: {
    intro: string;
    steps?: string[];
    tips?: string[];
    faqs?: { q: string; a: string }[];
  };
}

export const articles: Article[] = [
  {
    slug: "como-convertir-pdf-a-imagen",
    title: "Cómo Convertir PDF a Imagen (PNG, JPG, WEBP) - Guía 2025",
    description: "Aprende a convertir tus PDFs a imágenes de alta calidad. Guía paso a paso con las mejores prácticas.",
    category: "Tutoriales",
    tool: "/tools/pdf-to-convert",
    date: "2025-11-13",
    readTime: "5 min",
    keywords: ["convertir pdf a imagen", "pdf a png", "pdf a jpg", "convertir pdf online"],
    content: {
      intro: "¿Necesitas convertir un PDF a imagen? Ya sea para compartir en redes sociales, incluir en presentaciones o simplemente visualizar mejor tu documento, convertir PDFs a formato de imagen es una necesidad común. En esta guía te mostramos cómo hacerlo de manera rápida y gratuita.",
      steps: [
        "Abre nuestra herramienta de conversión de PDF a imagen",
        "Sube tu archivo PDF (máximo 10MB)",
        "Selecciona el formato deseado: PNG para mejor calidad, JPG para menor tamaño, o WEBP para balance óptimo",
        "Ajusta la calidad si elegiste JPG o WEBP (recomendado: 85-95%)",
        "Haz clic en 'Convertir' y espera unos segundos",
        "Descarga las imágenes generadas individualmente o todas a la vez"
      ],
      tips: [
        "PNG es ideal para documentos con texto nítido y gráficos",
        "JPG reduce el tamaño hasta 70% pero pierde algo de calidad",
        "WEBP ofrece la mejor compresión sin pérdida visible de calidad",
        "Para redes sociales, usa JPG al 85% de calidad",
        "Para impresión, usa PNG a máxima resolución"
      ],
      faqs: [
        {
          q: "¿Pierdo calidad al convertir PDF a imagen?",
          a: "Con PNG mantienes el 100% de calidad. Con JPG y WEBP hay una ligera compresión, pero configurando la calidad al 90% o más, la diferencia es imperceptible."
        },
        {
          q: "¿Puedo convertir PDFs de múltiples páginas?",
          a: "Sí, nuestra herramienta convierte cada página del PDF en una imagen individual que puedes descargar."
        },
        {
          q: "¿Es seguro subir mis PDFs?",
          a: "Totalmente. El procesamiento se hace 100% en tu navegador, tus archivos nunca se suben a ningún servidor."
        }
      ]
    }
  },
  {
    slug: "unir-pdfs-online-gratis",
    title: "Cómo Unir PDFs Online Gratis sin Límites | Guía Completa",
    description: "Combina varios archivos PDF en uno solo de forma rápida y segura. Sin registro, sin límites.",
    category: "Tutoriales",
    tool: "/tools/merge-pdf",
    date: "2025-11-13",
    readTime: "4 min",
    keywords: ["unir pdf", "combinar pdf", "fusionar pdf", "juntar pdf online"],
    content: {
      intro: "¿Tienes varios PDFs que necesitas combinar en un solo archivo? Ya sea para organizar documentos, crear un portafolio o simplemente mantener todo en un lugar, unir PDFs es muy fácil con las herramientas correctas.",
      steps: [
        "Accede a nuestra herramienta de Unir PDFs",
        "Arrastra y suelta todos los PDFs que quieras combinar",
        "Reordena los archivos según el orden que desees",
        "Haz clic en 'Unir PDFs'",
        "Descarga tu PDF combinado en segundos"
      ],
      tips: [
        "Puedes unir tantos PDFs como necesites, sin límites",
        "El orden importa: organiza bien antes de unir",
        "Los PDFs mantienen su formato original",
        "Ideal para crear reportes, portfolios o documentación",
        "Funciona con PDFs de diferentes tamaños y orientaciones"
      ],
      faqs: [
        {
          q: "¿Hay límite en el número de PDFs que puedo unir?",
          a: "No hay límite en cantidad, solo en el tamaño total (recomendado menos de 50MB para mejor rendimiento)."
        },
        {
          q: "¿Se mantiene la calidad al unir PDFs?",
          a: "Sí, la calidad permanece exactamente igual. No hay compresión ni pérdida de información."
        },
        {
          q: "¿Puedo cambiar el orden después de subir los archivos?",
          a: "Sí, puedes reorganizar los PDFs arrastrándolos antes de hacer la unión."
        }
      ]
    }
  },
  {
    slug: "dividir-pdf-paginas-separadas",
    title: "Dividir PDF en Páginas Separadas | Extraer Páginas Fácilmente",
    description: "Extrae una o varias páginas de un PDF. Crea archivos separados de forma rápida y gratuita.",
    category: "Tutoriales",
    tool: "/tools/split-pdf",
    date: "2025-11-13",
    readTime: "4 min",
    keywords: ["dividir pdf", "separar pdf", "extraer paginas pdf", "cortar pdf"],
    content: {
      intro: "¿Necesitas extraer solo algunas páginas de un PDF grande? Dividir PDFs es útil cuando quieres compartir solo secciones específicas de un documento o cuando necesitas separar capítulos.",
      steps: [
        "Abre la herramienta Dividir PDF",
        "Sube tu archivo PDF",
        "Selecciona las páginas que deseas extraer (rangos o páginas específicas)",
        "Elige si quieres dividir en archivos individuales o en grupos",
        "Descarga tus PDFs separados"
      ],
      tips: [
        "Puedes extraer páginas individuales o rangos (ej: 1-5, 10-15)",
        "Útil para separar facturas, capítulos de libros, o secciones de reportes",
        "Mantiene el formato y calidad originales",
        "Más rápido que imprimir páginas específicas a PDF",
        "Perfecto para compartir solo la información relevante"
      ],
      faqs: [
        {
          q: "¿Puedo dividir un PDF de 100 páginas?",
          a: "Sí, puedes dividir PDFs de cualquier tamaño. Solo asegúrate de que el archivo no supere 10MB."
        },
        {
          q: "¿Cómo selecciono páginas específicas?",
          a: "Puedes indicar números específicos (1,3,5) o rangos (1-10) según necesites."
        },
        {
          q: "¿Se pierde formato al dividir?",
          a: "No, cada página mantiene exactamente el mismo formato, fuentes, imágenes y layout del PDF original."
        }
      ]
    }
  },
  {
    slug: "comprimir-pdf-reducir-tamano",
    title: "Cómo Comprimir PDF y Reducir su Tamaño sin Perder Calidad",
    description: "Reduce el tamaño de tus PDFs hasta un 70%. Perfecto para enviar por email o subir a la web.",
    category: "Tutoriales",
    tool: "/tools/compress-pdf",
    date: "2025-11-13",
    readTime: "5 min",
    keywords: ["comprimir pdf", "reducir pdf", "pdf mas pequeño", "optimizar pdf"],
    content: {
      intro: "Los PDFs grandes son difíciles de enviar por email y ocupan mucho espacio. Aprende a comprimirlos manteniendo la mejor calidad posible.",
      steps: [
        "Accede a la herramienta Comprimir PDF",
        "Sube el PDF que quieres reducir",
        "Selecciona el nivel de compresión (baja, media o alta)",
        "Procesa el archivo",
        "Compara el tamaño original vs el comprimido",
        "Descarga tu PDF optimizado"
      ],
      tips: [
        "Compresión baja: ideal para documentos importantes (reduce 20-30%)",
        "Compresión media: balance perfecto (reduce 40-50%)",
        "Compresión alta: máxima reducción (reduce 60-70%)",
        "PDFs con muchas imágenes se comprimen más",
        "Para email, apunta a menos de 10MB"
      ],
      faqs: [
        {
          q: "¿Por qué mi PDF pesa tanto?",
          a: "Generalmente por imágenes de alta resolución, escaneos sin optimizar, o fuentes incrustadas innecesarias."
        },
        {
          q: "¿Pierdo calidad al comprimir?",
          a: "Hay una ligera pérdida, pero con compresión media/baja es casi imperceptible. Siempre puedes comparar antes de descargar."
        },
        {
          q: "¿Cuánto puedo reducir un PDF?",
          a: "Depende del contenido, pero típicamente entre 30% y 70%. PDFs con muchas imágenes se comprimen más."
        }
      ]
    }
  },
  {
    slug: "ordenar-paginas-pdf",
    title: "Cómo Reordenar Páginas de un PDF | Organiza tus Documentos",
    description: "Reorganiza, elimina o añade páginas a tus PDFs fácilmente. Organiza tus documentos en segundos.",
    category: "Tutoriales",
    tool: "/tools/reorder-pdf",
    date: "2025-11-13",
    readTime: "3 min",
    keywords: ["ordenar pdf", "reordenar paginas pdf", "reorganizar pdf", "mover paginas pdf"],
    content: {
      intro: "¿Las páginas de tu PDF están desordenadas? Reorganiza tu documento de forma visual y sencilla, sin necesidad de software complicado.",
      steps: [
        "Abre la herramienta Ordenar Páginas",
        "Carga tu archivo PDF",
        "Visualiza todas las páginas en miniatura",
        "Arrastra y suelta las páginas en el orden deseado",
        "Elimina páginas que no necesites (opcional)",
        "Genera tu PDF reorganizado"
      ],
      tips: [
        "Vista en miniatura facilita identificar páginas",
        "Puedes eliminar páginas innecesarias al mismo tiempo",
        "Útil para corregir escaneos desordenados",
        "Perfecto para organizar documentos antes de enviarlos",
        "Guarda tiempo vs reimprimir el documento"
      ],
      faqs: [
        {
          q: "¿Puedo eliminar páginas mientras reordeno?",
          a: "Sí, puedes eliminar las páginas que no necesites durante el proceso de reorganización."
        },
        {
          q: "¿Hay límite de páginas?",
          a: "No hay límite específico, pero archivos muy grandes (500+ páginas) pueden tardar más en procesar."
        },
        {
          q: "¿Se mantiene la calidad?",
          a: "Sí, solo cambias el orden. El contenido permanece exactamente igual."
        }
      ]
    }
  },
  {
    slug: "editar-pdf-online-gratis",
    title: "Cómo Editar PDF Online Gratis | Añade Texto e Imágenes",
    description: "Edita tus PDFs directamente en el navegador. Añade texto, imágenes, firmas y anotaciones fácilmente.",
    category: "Tutoriales",
    tool: "/tools/edit-pdf",
    date: "2025-11-13",
    readTime: "6 min",
    keywords: ["editar pdf", "modificar pdf", "añadir texto pdf", "editar pdf online"],
    content: {
      intro: "¿Necesitas hacer cambios rápidos en un PDF? Ya sea añadir texto, insertar imágenes o hacer anotaciones, editar PDFs online es más fácil de lo que crees.",
      steps: [
        "Accede a nuestra herramienta de Editar PDF",
        "Sube el PDF que quieres modificar",
        "Selecciona la herramienta: texto, imagen, dibujo o firma",
        "Haz clic donde quieras añadir contenido",
        "Personaliza (tamaño, color, posición)",
        "Guarda tu PDF editado"
      ],
      tips: [
        "Usa la herramienta de texto para rellenar formularios",
        "Añade tu firma para documentos oficiales",
        "Las anotaciones son ideales para marcar cambios",
        "Puedes deshacer y rehacer cambios",
        "Exporta en alta calidad para impresión"
      ],
      faqs: [
        {
          q: "¿Puedo editar cualquier PDF?",
          a: "Sí, pero PDFs protegidos con contraseña requieren que la ingreses primero."
        },
        {
          q: "¿Las ediciones se ven profesionales?",
          a: "Sí, puedes ajustar fuentes, tamaños y colores para que luzcan como parte del documento original."
        },
        {
          q: "¿Puedo añadir mi firma?",
          a: "Sí, puedes dibujar tu firma con el mouse/táctil o subir una imagen de tu firma."
        }
      ]
    }
  }
];

// Función helper para obtener artículo por slug
export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

// Función helper para obtener artículos por categoría
export const getArticlesByCategory = (category: string): Article[] => {
  return articles.filter(article => article.category === category);
};