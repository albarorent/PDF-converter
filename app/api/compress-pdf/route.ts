// app/api/compress-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Niveles de compresión disponibles
const COMPRESSION_SETTINGS = {
  high: '/screen',      // Máxima compresión (72 DPI) - archivos muy pequeños
  medium: '/ebook',     // Compresión media (150 DPI) - balance calidad/tamaño
  low: '/printer',      // Compresión baja (300 DPI) - alta calidad
  default: '/default',  // Compresión por defecto de Ghostscript
};

export async function POST(request: NextRequest) {
  let inputPath = '';
  let outputPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const compressionLevel = (formData.get('level') as string) || 'medium';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'El archivo debe ser un PDF' },
        { status: 400 }
      );
    }

    // Verificar que Ghostscript está instalado
    try {
      await execAsync('gs --version');
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Ghostscript no está instalado en el servidor',
          details: 'Instala Ghostscript: apt-get install ghostscript (Linux) o brew install ghostscript (Mac)'
        },
        { status: 500 }
      );
    }

    // Crear archivos temporales
    const tempDir = tmpdir();
    const uniqueId = randomUUID();
    inputPath = join(tempDir, `input-${uniqueId}.pdf`);
    outputPath = join(tempDir, `output-${uniqueId}.pdf`);

    // Guardar el archivo subido
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(inputPath, buffer);

    const originalSize = buffer.byteLength;

    // Comando de Ghostscript para comprimir
    const setting = COMPRESSION_SETTINGS[compressionLevel as keyof typeof COMPRESSION_SETTINGS] || COMPRESSION_SETTINGS.medium;
    
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${setting} -dNOPAUSE -dQUIET -dBATCH -dDetectDuplicateImages=true -dCompressFonts=true -r150 -sOutputFile="${outputPath}" "${inputPath}"`;

    // Ejecutar Ghostscript
    await execAsync(gsCommand, { maxBuffer: 50 * 1024 * 1024 }); // 50MB buffer

    // Leer el archivo comprimido
    const compressedBuffer = await readFile(outputPath);
    const compressedSize = compressedBuffer.byteLength;
    const compressionRate = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    // Limpiar archivos temporales
    await unlink(inputPath);
    await unlink(outputPath);

    // Retornar el PDF comprimido
    return new NextResponse(compressedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '')}_comprimido.pdf"`,
        'X-Original-Size': originalSize.toString(),
        'X-Compressed-Size': compressedSize.toString(),
        'X-Compression-Rate': compressionRate.toString(),
        'X-Compression-Level': compressionLevel,
      },
    });

  } catch (error) {
    console.error('Error comprimiendo PDF:', error);
    
    // Limpiar archivos temporales en caso de error
    try {
      if (inputPath) await unlink(inputPath);
      if (outputPath) await unlink(outputPath);
    } catch (cleanupError) {
      console.error('Error limpiando archivos temporales:', cleanupError);
    }

    return NextResponse.json(
      { 
        error: 'Error al procesar el PDF',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Configuración para archivos grandes
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};