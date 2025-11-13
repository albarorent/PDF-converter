import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, asunto, mensaje } = await request.json();

    // Validación
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Configurar transportador SMTP de Hostinger
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER, // Tu email completo
        pass: process.env.EMAIL_PASSWORD, // Tu contraseña del email
      },
    });
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
    
    // Verificar conexión
    await transporter.verify();

    // Enviar email
    await transporter.sendMail({
      from: `"Contacto PDF Tools" <${process.env.EMAIL_USER}>`,
      to: "soportepdf@pdfconvertools.com",
      replyTo: email, // Para responder directamente al usuario
      subject: `[Contacto Web] ${asunto}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { margin-top: 5px; }
              .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📧 Nuevo mensaje de contacto</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">👤 Nombre:</div>
                  <div class="value">${nombre}</div>
                </div>
                <div class="field">
                  <div class="label">✉️ Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">📌 Asunto:</div>
                  <div class="value">${asunto}</div>
                </div>
                <hr>
                <div class="field">
                  <div class="label">💬 Mensaje:</div>
                  <div class="value">${mensaje.replace(/\n/g, "<br>")}</div>
                </div>
              </div>
              <div class="footer">
                <p>Este mensaje fue enviado desde el formulario de contacto de pdfconvertools.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Nuevo mensaje de contacto

Nombre: ${nombre}
Email: ${email}
Asunto: ${asunto}

Mensaje:
${mensaje}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

/*
Archivo .env.local (crear en la raíz del proyecto):

EMAIL_USER=soportepdf@pdfconvertools.com
EMAIL_PASSWORD=tu_contraseña_aqui
*/