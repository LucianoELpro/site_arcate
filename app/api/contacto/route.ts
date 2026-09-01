import { Resend } from "resend";

// Route Handler del formulario de contacto de /sobre-nosotros.
// Recibe { name, email, msg }, valida y envía el correo con Resend.
// No persiste nada: solo dispara el envío (ver spec 03).

const CONTACT_TO = "lugel.vargas14@gmail.com";
const CONTACT_FROM = "onboarding@resend.dev"; // remitente sandbox (ver README / spec 03)

// Validación de correo suficiente para el formulario (no RFC completa).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; msg?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "VALIDACION" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const msg = typeof body.msg === "string" ? body.msg.trim() : "";

  if (!name || !email || !msg || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "VALIDACION" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "ENVIO" }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Arcade Vault <${CONTACT_FROM}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Nuevo mensaje de ${name} — Arcade Vault`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\n${msg}`,
    });

    if (error) {
      return Response.json({ ok: false, error: "ENVIO" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "ENVIO" }, { status: 500 });
  }
}
