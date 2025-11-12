"use client";
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Type,
  ImagePlus,
  Pencil,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Highlighter,
  Square,
  Circle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  PenTool,
  Eraser,
} from "lucide-react";

type Tool =
  | "select"
  | "text"
  | "image"
  | "draw"
  | "highlight"
  | "rectangle"
  | "circle"
  | "edit"
  | "signature";

type TextElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily: string;
};

type Annotation = {
  id: string;
  type:
    | "text"
    | "image"
    | "draw"
    | "highlight"
    | "rectangle"
    | "circle"
    | "signature"
    | "editedText";
  page: number;
  x: number;
  y: number;
  content?: string;
  imageUrl?: string;
  color?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  originalTextId?: string;
};

export default function EditPdf() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentTool, setCurrentTool] = useState<Tool>("select");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<
    { x: number; y: number }[]
  >([]);
  const [zoom, setZoom] = useState(1.2);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingPosition, setEditingPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar PDF.js desde CDN
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    };
    document.body.appendChild(script);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido");
      return;
    }

    setIsLoading(true);
    setPdfFile(file);

    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });

    loadingTask.promise
      .then((pdf: any) => {
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        setAnnotations([]);
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.error("Error al cargar PDF:", error);
        alert("Error al cargar el PDF");
        setIsLoading(false);
      });
  };

  const extractTextElements = async (page: any, viewport: any) => {
    try {
      const textContent = await page.getTextContent();
      const elements: TextElement[] = [];

      textContent.items.forEach((item: any, index: number) => {
        if (item.str && item.str.trim()) {
          const tx = item.transform;
          // Corrección de la posición Y para que coincida con el renderizado del PDF
          const y = viewport.height - tx[5] - (tx[3] || item.height);

          elements.push({
            id: `text-${currentPage}-${index}`,
            x: tx[4],
            y: y,
            width: item.width,
            height: Math.abs(tx[3]) || item.height,
            text: item.str,
            fontSize:
              Math.abs(tx[3]) || Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]),
            fontFamily: item.fontName || "Arial",
          });
        }
      });

      setTextElements(elements);
    } catch (error) {
      console.error("Error extrayendo texto:", error);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: zoom, rotation: 0 });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Limpiar el canvas antes de renderizar
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Extraer elementos de texto si estamos en modo edición o si hay textos editados
    const hasEditedText = annotations.some(
      (a) => a.page === pageNum && a.type === "editedText"
    );

    if (currentTool === "edit" || hasEditedText) {
      await extractTextElements(page, viewport);
    } else {
      // No está en modo edición ni hay texto editado
      setTextElements([]);
    }

    renderAnnotations();
  };

  const renderAnnotations = () => {
    if (!annotationCanvasRef.current || !canvasRef.current) return;

    const annotCanvas = annotationCanvasRef.current;
    const ctx = annotCanvas.getContext("2d");
    if (!ctx) return;

    annotCanvas.width = canvasRef.current.width;
    annotCanvas.height = canvasRef.current.height;

    ctx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);

    // Dibujar cuadros de texto editables si estamos en modo edición
    if (currentTool === "edit") {
      const pageAnnotations = annotations.filter((a) => a.page === currentPage);
      const hiddenTextIds = pageAnnotations
        .filter((a) => a.type === "editedText" && a.originalTextId)
        .map((a) => a.originalTextId);

      textElements.forEach((element) => {
        // No mostrar cuadros para textos que ya han sido editados
        if (hiddenTextIds.includes(element.id)) {
          return;
        }

        const isSelected = selectedTextElement === element.id;
        ctx.strokeStyle = isSelected ? "#3B82F6" : "#94A3B8";
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        ctx.setLineDash([]);

        // Mostrar indicador de editable
        if (isSelected) {
          ctx.fillStyle = "#3B82F6";
          ctx.fillRect(element.x - 3, element.y - 3, 6, 6);
          ctx.fillRect(element.x + element.width - 3, element.y - 3, 6, 6);
        }
      });
    }

    const pageAnnotations = annotations.filter((a) => a.page === currentPage);

    // Primero, cubrir los textos originales que han sido editados
    const editedTextIds = annotations
      .filter(
        (a) =>
          a.page === currentPage && a.type === "editedText" && a.originalTextId
      )
      .map((a) => a.originalTextId);

    editedTextIds.forEach((textId) => {
      const originalElement = textElements.find((el) => el.id === textId);
      if (originalElement) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(
          originalElement.x - 2,
          originalElement.y - 2,
          originalElement.width + 4,
          originalElement.height + 4
        );
      }
    });

    pageAnnotations.forEach((annotation) => {
      if (annotation.type === "text" || annotation.type === "editedText") {
        ctx.fillStyle = annotation.color || "#000";
        ctx.font = `${(annotation.fontSize || 16) * zoom}px Arial`;
        ctx.fillText(
          annotation.content || "",
          annotation.x * zoom,
          annotation.y * zoom
        );
      } else if (annotation.type === "rectangle") {
        ctx.strokeStyle = annotation.color || "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          annotation.x * zoom,
          annotation.y * zoom,
          (annotation.width || 100) * zoom,
          (annotation.height || 60) * zoom
        );
      } else if (annotation.type === "circle") {
        ctx.strokeStyle = annotation.color || "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          annotation.x * zoom,
          annotation.y * zoom,
          (annotation.width || 50) * zoom,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      } else if (annotation.type === "draw" && annotation.points) {
        ctx.strokeStyle = annotation.color || "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          annotation.points[0].x * zoom,
          annotation.points[0].y * zoom
        );
        annotation.points.forEach((point) => {
          ctx.lineTo(point.x * zoom, point.y * zoom);
        });
        ctx.stroke();
      } else if (annotation.type === "highlight" && annotation.points) {
        ctx.strokeStyle = annotation.color || "#FFFF00";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(
          annotation.points[0].x * zoom,
          annotation.points[0].y * zoom
        );
        annotation.points.forEach((point) => {
          ctx.lineTo(point.x * zoom, point.y * zoom);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (
        (annotation.type === "image" || annotation.type === "signature") &&
        annotation.imageUrl
      ) {
        const img = new Image();
        img.src = annotation.imageUrl;
        img.onload = () => {
          ctx.drawImage(
            img,
            annotation.x * zoom,
            annotation.y * zoom,
            (annotation.width || 150) * zoom,
            (annotation.height || 150) * zoom
          );
        };
      }
    });

    if (currentDrawing.length > 0) {
      ctx.strokeStyle = currentTool === "highlight" ? "#FFFF00" : color;
      ctx.lineWidth = currentTool === "highlight" ? 20 : 2;
      ctx.lineCap = "round";
      if (currentTool === "highlight") ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(currentDrawing[0].x * zoom, currentDrawing[0].y * zoom);
      currentDrawing.forEach((point) => {
        ctx.lineTo(point.x * zoom, point.y * zoom);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [
    pdfDoc,
    currentPage,
    zoom,
    annotations,
    currentDrawing,
    currentTool,
    selectedTextElement,
  ]);

  // Efecto separado para mantener textElements cuando cambiamos de herramienta
  useEffect(() => {
    if (pdfDoc && currentTool !== "edit" && textElements.length === 0) {
      // Cargar textElements incluso si no estamos en modo edit
      // para que los textos editados se puedan cubrir correctamente
      const loadTextForCovering = async () => {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: zoom, rotation: 0 });
        await extractTextElements(page, viewport);
      };

      // Solo cargar si hay anotaciones de texto editado en esta página
      const hasEditedText = annotations.some(
        (a) => a.page === currentPage && a.type === "editedText"
      );
      if (hasEditedText) {
        loadTextForCovering();
      }
    }
  }, [currentTool, currentPage, annotations]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!annotationCanvasRef.current) return;

    const rect = annotationCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Si está en modo firma, guardar la posición y abrir el pad
    if (currentTool === "signature") {
      setSignaturePosition({ x, y });
      setShowSignaturePad(true);
      return;
    }

    // Modo edición: detectar clic en texto
    if (currentTool === "edit") {
      const pageAnnotations = annotations.filter((a) => a.page === currentPage);

      // Verificar qué textos ya están editados (ocultos)
      const hiddenTextIds = pageAnnotations
        .filter((a) => a.type === "editedText" && a.originalTextId)
        .map((a) => a.originalTextId);

      // Primero verificar si hizo clic en un texto ya editado
      const clickedEditedAnnotation = pageAnnotations.find(
        (a) =>
          a.type === "editedText" &&
          x >= a.x - 10 &&
          x <= a.x + (a.width || 100) + 10 &&
          y >= a.y - (a.height || 20) - 5 &&
          y <= a.y + 5
      );

      if (clickedEditedAnnotation && clickedEditedAnnotation.originalTextId) {
        // Editar el texto ya editado
        const originalElement = textElements.find(
          (el) => el.id === clickedEditedAnnotation.originalTextId
        );
        if (originalElement) {
          setSelectedTextElement(clickedEditedAnnotation.originalTextId);
          setEditingTextId(clickedEditedAnnotation.originalTextId);
          setEditingText(clickedEditedAnnotation.content || "");
          setEditingPosition({
            x: originalElement.x,
            y: originalElement.y,
            width: originalElement.width,
            height: originalElement.height,
          });
        }
        return;
      }

      // Si no, buscar en los elementos de texto originales (pero NO los ocultos)
      const clickedElement = textElements.find((el) => {
        // Ignorar textos que ya han sido editados (ocultos)
        if (hiddenTextIds.includes(el.id)) {
          return false;
        }
        return (
          x >= el.x &&
          x <= el.x + el.width &&
          y >= el.y &&
          y <= el.y + el.height
        );
      });

      if (clickedElement) {
        setSelectedTextElement(clickedElement.id);
        setEditingTextId(clickedElement.id);
        setEditingText(clickedElement.text);
        setEditingPosition({
          x: clickedElement.x,
          y: clickedElement.y,
          width: clickedElement.width,
          height: clickedElement.height,
        });
      } else {
        setSelectedTextElement(null);
        setEditingTextId(null);
        setEditingPosition(null);
      }
      return;
    }

    if (currentTool === "text") {
      const text = prompt("Ingresa el texto:");
      if (text) {
        const newAnnotation: Annotation = {
          id: Date.now().toString(),
          type: "text",
          page: currentPage,
          x,
          y,
          content: text,
          fontSize,
          color,
        };
        setAnnotations([...annotations, newAnnotation]);
      }
    } else if (currentTool === "rectangle") {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: "rectangle",
        page: currentPage,
        x,
        y,
        width: 100,
        height: 60,
        color,
      };
      setAnnotations([...annotations, newAnnotation]);
    } else if (currentTool === "circle") {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: "circle",
        page: currentPage,
        x,
        y,
        width: 50,
        color,
      };
      setAnnotations([...annotations, newAnnotation]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === "draw" || currentTool === "highlight") {
      setIsDrawing(true);
      const rect = annotationCanvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        setCurrentDrawing([{ x, y }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && (currentTool === "draw" || currentTool === "highlight")) {
      const rect = annotationCanvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        setCurrentDrawing([...currentDrawing, { x, y }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing.length > 0) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: currentTool === "highlight" ? "highlight" : "draw",
        page: currentPage,
        x: 0,
        y: 0,
        points: currentDrawing,
        color: currentTool === "highlight" ? "#FFFF00" : color,
      };
      setAnnotations([...annotations, newAnnotation]);
      setCurrentDrawing([]);
    }
    setIsDrawing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: "image",
        page: currentPage,
        x: 100,
        y: 100,
        imageUrl: event.target?.result as string,
        width: 150,
        height: 150,
      };
      setAnnotations([...annotations, newAnnotation]);
    };
    reader.readAsDataURL(file);
  };

  const saveSignature = () => {
    if (!signatureCanvasRef.current || !signaturePosition) return;

    const signatureUrl = signatureCanvasRef.current.toDataURL();
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: "signature",
      page: currentPage,
      x: signaturePosition.x,
      y: signaturePosition.y,
      imageUrl: signatureUrl,
      width: 200,
      height: 100,
    };
    setAnnotations([...annotations, newAnnotation]);
    setShowSignaturePad(false);
    setSignaturePosition(null);
    clearSignature();
    setCurrentTool("select");
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  const clearAll = () => {
    if (confirm("¿Estás seguro de eliminar todas las anotaciones?")) {
      setAnnotations([]);
    }
  };

  const downloadPdf = async () => {
    if (!canvasRef.current || !annotationCanvasRef.current) return;

    const combinedCanvas = document.createElement("canvas");
    const ctx = combinedCanvas.getContext("2d");
    if (!ctx) return;

    combinedCanvas.width = canvasRef.current.width;
    combinedCanvas.height = canvasRef.current.height;

    ctx.drawImage(canvasRef.current, 0, 0);
    ctx.drawImage(annotationCanvasRef.current, 0, 0);

    const link = document.createElement("a");
    link.download = `${
      pdfFile?.name.replace(".pdf", "") || "pdf"
    }_editado_pagina_${currentPage}.png`;
    link.href = combinedCanvas.toDataURL();
    link.click();
  };

  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: "select", icon: MousePointer, label: "Seleccionar" },
    { id: "edit", icon: Edit3, label: "Editar Texto" },
    { id: "text", icon: Type, label: "Añadir Texto" },
    { id: "signature", icon: PenTool, label: "Firma" },
    { id: "draw", icon: Pencil, label: "Dibujar" },
    { id: "highlight", icon: Highlighter, label: "Resaltar" },
    { id: "rectangle", icon: Square, label: "Rectángulo" },
    { id: "circle", icon: Circle, label: "Círculo" },
    { id: "image", icon: ImagePlus, label: "Imagen" },
  ];

  const currentPageAnnotations = annotations.filter(
    (a) => a.page === currentPage
  );

  // Signature pad drawing
  const [isSignatureDrawing, setIsSignatureDrawing] = useState(false);

  const startSignatureDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsSignatureDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSignatureDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopSignatureDrawing = () => {
    setIsSignatureDrawing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Editor de PDF Profesional
            </h1>
            <p className="text-purple-100">
              Edita texto del PDF, añade firmas, anotaciones e imágenes
            </p>
          </div>

          {/* Upload Section */}
          {!pdfFile && (
            <div className="p-8">
              <label className="block">
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Haz clic para subir tu PDF
                  </p>
                  <p className="text-sm text-gray-500">
                    Podrás editar el texto existente y añadir anotaciones
                  </p>
                </div>
              </label>
            </div>
          )}

          {isLoading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando PDF...</p>
            </div>
          )}

          {/* Editor Section */}
          {pdfFile && !isLoading && (
            <div className="grid grid-cols-12 gap-0">
              {/* Toolbar */}
              <div className="col-span-3 lg:col-span-2 bg-gray-50 border-r border-gray-200 p-4 max-h-screen overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Herramientas
                </h3>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setCurrentTool(tool.id);
                        if (tool.id === "image") {
                          document.getElementById("image-upload")?.click();
                        } else if (tool.id === "signature") {
                          setShowSignaturePad(true);
                        } else if (tool.id === "edit") {
                          setSelectedTextElement(null);
                        }
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all ${
                        currentTool === tool.id
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <tool.icon className="w-4 h-4 shrink-0" />
                      <span className="hidden lg:inline truncate">
                        {tool.label}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {currentTool === "edit" && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      💡 Haz clic en cualquier texto del PDF para editarlo
                    </p>
                  </div>
                )}

                {currentTool === "signature" && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-xs text-purple-800">
                      ✍️ Haz clic donde quieres colocar tu firma
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-2">
                      Tamaño de texto
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-600">{fontSize}px</span>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={clearAll}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden lg:inline">Limpiar todo</span>
                  </button>
                </div>

                {currentPageAnnotations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      Anotaciones ({currentPageAnnotations.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentPageAnnotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="flex items-center justify-between px-2 py-1 bg-white rounded text-xs"
                        >
                          <span className="text-gray-700 truncate">
                            {annotation.type}
                          </span>
                          <button
                            onClick={() => deleteAnnotation(annotation.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas Area */}
              <div className="col-span-9 lg:col-span-10 p-4">
                {/* Controls */}
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-24 text-center">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-16 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={downloadPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Descargar</span>
                  </button>
                </div>

                {/* PDF Canvas */}
                <div className="border border-gray-300 rounded-lg overflow-auto bg-gray-100 p-4 relative max-h-[70vh]">
                  <div className="relative inline-block">
                    <canvas ref={canvasRef} className="bg-white shadow-lg" />
                    <canvas
                      ref={annotationCanvasRef}
                      onClick={handleCanvasClick}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{
                        cursor:
                          currentTool === "select"
                            ? "default"
                            : currentTool === "edit"
                            ? "text"
                            : "crosshair",
                      }}
                      className="absolute top-0 left-0"
                    />

                    {/* Input de edición de texto */}
                    {editingTextId && editingPosition && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${editingPosition.x * zoom}px`,
                          top: `${editingPosition.y * zoom}px`,
                          width: `${Math.max(
                            editingPosition.width * zoom,
                            100
                          )}px`,
                          height: `${editingPosition.height * zoom}px`,
                        }}
                        className="z-10"
                      >
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onBlur={() => {
                            const clickedElement = textElements.find(
                              (el) => el.id === editingTextId
                            );
                            if (!clickedElement) return;

                            // Verificar si ya existe una anotación para este texto
                            const existingAnnotation = annotations.find(
                              (a) =>
                                a.originalTextId === editingTextId &&
                                a.page === currentPage
                            );

                            if (existingAnnotation) {
                              // Actualizar la anotación existente
                              setAnnotations(
                                annotations.map((a) =>
                                  a.id === existingAnnotation.id
                                    ? { ...a, content: editingText }
                                    : a
                                )
                              );
                            } else if (editingText !== clickedElement.text) {
                              // Crear nueva anotación solo si el texto cambió
                              const newAnnotation: Annotation = {
                                id: Date.now().toString(),
                                type: "editedText",
                                page: currentPage,
                                x: clickedElement.x,
                                y: clickedElement.y + clickedElement.height - 2,
                                content: editingText,
                                fontSize: clickedElement.fontSize / zoom,
                                color: "#000000",
                                originalTextId: clickedElement.id,
                              };
                              setAnnotations([...annotations, newAnnotation]);
                            }

                            setEditingTextId(null);
                            setEditingPosition(null);
                            setSelectedTextElement(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.currentTarget.blur();
                            }
                            if (e.key === "Escape") {
                              setEditingTextId(null);
                              setEditingPosition(null);
                              setSelectedTextElement(null);
                            }
                          }}
                          autoFocus
                          className="w-full h-full px-1 border-2 border-blue-500 bg-white text-black font-sans"
                          style={{
                            fontSize: `${
                              (textElements.find(
                                (el) => el.id === editingTextId
                              )?.fontSize || 16) * zoom
                            }px`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Crear Firma
            </h3>
            <div className="border-2 border-gray-300 rounded-lg mb-4 bg-white">
              <canvas
                ref={signatureCanvasRef}
                width={500}
                height={200}
                onMouseDown={startSignatureDrawing}
                onMouseMove={drawSignature}
                onMouseUp={stopSignatureDrawing}
                onMouseLeave={stopSignatureDrawing}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                  });
                  startSignatureDrawing(mouseEvent as any);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                  });
                  drawSignature(mouseEvent as any);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopSignatureDrawing();
                }}
                className="w-full cursor-crosshair"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearSignature}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                <Eraser className="w-4 h-4" />
                Limpiar
              </button>
              <button
                onClick={() => {
                  setShowSignaturePad(false);
                  setSignaturePosition(null);
                  setCurrentTool("select");
                }}
                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={saveSignature}
                className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium"
              >
                Guardar Firma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
