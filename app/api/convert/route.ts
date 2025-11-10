// app/api/convert/route.ts
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validaciones
    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "El archivo debe ser un PDF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande (máx 10MB)" },
        { status: 400 }
      );
    }

    // Convertir a base64 para enviar al frontend
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Pdf = buffer.toString('base64');

    // El frontend hará la conversión con pdf.js
    return NextResponse.json({
      pdfData: base64Pdf,
      fileName: file.name,
      fileSize: file.size,
    });

  } catch (error: any) {
    console.error("Error al procesar PDF:", error);
    return NextResponse.json(
      { error: "Error al procesar el PDF: " + error.message },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};