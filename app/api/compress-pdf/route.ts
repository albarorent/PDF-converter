import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const level = formData.get("level") as string || "recommended";

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    const originalSize = file.size;

    // 1. Iniciar tarea en iLovePDF
    const startResponse = await fetch("https://api.ilovepdf.com/v1/start/compress", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ILOVEPDF_PUBLIC_KEY}`,
      },
    });

    if (!startResponse.ok) {
      throw new Error("Error al iniciar compresión");
    }

    const { server, task } = await startResponse.json();

    // 2. Subir archivo
    const uploadFormData = new FormData();
    uploadFormData.append("task", task);
    uploadFormData.append("file", file);

    const uploadResponse = await fetch(`https://${server}/v1/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ILOVEPDF_PUBLIC_KEY}`,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Error al subir archivo");
    }

    const uploadData = await uploadResponse.json();
    const serverFilename = uploadData.server_filename;

    // 3. Procesar compresión
    const processResponse = await fetch(`https://${server}/v1/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ILOVEPDF_PUBLIC_KEY}`,
      },
      body: JSON.stringify({
        task,
        tool: "compress",
        files: [{ server_filename: serverFilename, filename: file.name }],
        compression_level: level, // extreme, recommended, low
      }),
    });

    if (!processResponse.ok) {
      throw new Error("Error al procesar compresión");
    }

    const processData = await processResponse.json();

    // 4. Descargar archivo comprimido
    const downloadUrl = `https://${server}/v1/download/${task}`;
    const downloadResponse = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${process.env.ILOVEPDF_PUBLIC_KEY}`,
      },
    });

    if (!downloadResponse.ok) {
      throw new Error("Error al descargar archivo");
    }

    const compressedBuffer = await downloadResponse.arrayBuffer();
    const compressedSize = compressedBuffer.byteLength;
    const compressionRate = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    // Retornar PDF comprimido
    return new NextResponse(compressedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace('.pdf', '')}_comprimido.pdf"`,
        "X-Original-Size": originalSize.toString(),
        "X-Compressed-Size": compressedSize.toString(),
        "X-Compression-Rate": compressionRate.toString(),
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { 
        error: "Error al comprimir PDF",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: "50mb",
  },
};

/*
Archivo .env.local:
ILOVEPDF_PUBLIC_KEY=tu_key_aqui

Para obtener tu API key:
1. Regístrate en https://developer.ilovepdf.com/
2. Crea un proyecto
3. Copia tu "Public key"
4. Plan gratuito: 250 archivos/mes
*/