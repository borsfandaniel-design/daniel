import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { checkRateLimitAsync, getClientIp } from "../../lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const clientIp = getClientIp(reqHeaders);

    // 1. RZN-07: Verificare Content-Length înainte de procesare (Limită 32 KB)
    const contentLength = reqHeaders.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 32 * 1024) {
      return NextResponse.json(
        { error: "Dimensiunea cererii depășește limita permisă (maxim 32 KB)." },
        { status: 413 }
      );
    }

    // 2. RZN-04: Rate Limiting distribuit anti-spam: Max 5 mesaje per 10 minute per IP
    const rateLimit = await checkRateLimitAsync(`contact_${clientIp}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Ai trimis prea multe solicitări recent. Te rugăm să aștepți înainte de a reîncerca.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    // 3. RZN-07: Parsare sigură a corpului cererii
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Formatul cererii este invalid. Se acceptă doar JSON valid." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Corpul cererii este invalid." },
        { status: 400 }
      );
    }

    // 4. Protecție Honeypot anti-bot
    if (body.website_hp && String(body.website_hp).trim().length > 0) {
      return NextResponse.json({ success: true, note: "Ignored by honeypot" });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Toate câmpurile (nume, email, mesaj) sunt obligatorii." },
        { status: 400 }
      );
    }

    // 5. Validare lungimi și prevenire Buffer / Memory Exhaustion
    if (name.length > 80) {
      return NextResponse.json({ error: "Numele este prea lung (maxim 80 de caractere)." }, { status: 400 });
    }
    if (email.length > 120) {
      return NextResponse.json({ error: "Adresa de email este prea lungă." }, { status: 400 });
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: "Mesajul depășește limita permisă (maxim 4000 de caractere)." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Adresă de email invalidă." }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    // 6. RZN-01: Expediere email cu prefix distinct [SWING CONTACT], complet separat de 2FA
    let resendDataId: string | undefined;
    if (process.env.RESEND_API_KEY) {
      const { data: resendData, error: resendError } = await resend.emails.send({
        from: "SWING Contact <onboarding@resend.dev>",
        to: [targetEmail],
        replyTo: email,
        subject: `[SWING CONTACT] Mesaj nou de la ${safeName}`,
        text: `Ai primit un mesaj nou prin formularul de contact de pe site:\n\nNume: ${name}\nEmail: ${email}\n\nMesaj:\n${message}\n\n---\nIP Expeditor: ${clientIp}\nPoți da Reply direct la acest e-mail pentru a-i răspunde clientului (${email}).`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF7ED; border: 2px solid #FF5400; border-radius: 20px; overflow: hidden; padding: 28px; color: #09090b;">
            <div style="border-bottom: 2px solid #FF5400; padding-bottom: 14px; margin-bottom: 20px;">
              <span style="font-size: 11px; font-weight: 800; font-family: monospace; color: #EA580C; letter-spacing: 1.5px; text-transform: uppercase;">SWING // NOU MESAJ PRIMIT</span>
              <h2 style="color: #09090b; margin: 6px 0 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">Mesaj de la ${safeName}</h2>
            </div>

            <div style="background-color: #ffffff; border-radius: 14px; padding: 18px; margin-bottom: 18px; border: 1px solid rgba(255, 84, 0, 0.2);">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 90px; color: #52525b;">Nume:</td>
                  <td style="padding: 6px 0; color: #09090b; font-weight: 700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #52525b;">Email:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #EA580C; text-decoration: none; font-weight: 700;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #52525b;">IP:</td>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #71717a;">${clientIp}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ffffff; border-radius: 14px; padding: 18px; margin-bottom: 20px; border: 1px solid rgba(255, 84, 0, 0.2);">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #EA580C; margin-bottom: 8px; font-family: monospace;">Conținut Mesaj:</div>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #09090b;">${safeMessage}</p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${safeEmail}?subject=Re: Mesaj SWING" style="display: inline-block; background-color: #EA580C; color: #ffffff; padding: 12px 26px; border-radius: 12px; font-weight: 800; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">Răspunde direct lui ${safeName}</a>
            </div>
          </div>
        `,
      });

      if (resendError) {
        console.error("Eroare la transmiterea emailului de contact:", resendError.message);
        // RZN-07: Nu transmitem eroarea brută a furnizorului către client
        return NextResponse.json(
          { error: "Nu s-a putut trimite mesajul în acest moment. Te rugăm să reîncerci puțin mai târziu." },
          { status: 500 }
        );
      }

      resendDataId = resendData?.id;
    }

    // 7. RZN-01: Persistență sigură: Supabase cu fallback local izolat (în .gitignore)
    const newMessage = {
      id: resendDataId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      name,
      email,
      message,
      created_at: new Date().toISOString(),
      status: "pending",
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from("contact_messages")
          .insert([{ name, email, message, status: "pending" }]);
      } catch (dbErr) {
        console.warn("Eroare la salvarea în Supabase:", (dbErr as any)?.message);
      }
    }

    // Salvare locală exclusiv în fișier ignorat de Git
    try {
      const fs = await import("fs");
      const path = await import("path");
      const localDataFile = path.join(process.cwd(), "data", "messages.local.json");
      const dir = path.dirname(localDataFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let currentList: any[] = [];
      if (fs.existsSync(localDataFile)) {
        try {
          currentList = JSON.parse(fs.readFileSync(localDataFile, "utf8")) || [];
        } catch {
          currentList = [];
        }
      }
      currentList.unshift(newMessage);
      fs.writeFileSync(localDataFile, JSON.stringify(currentList, null, 2), "utf8");
    } catch (saveErr) {
      console.warn("Avertisment salvare locală:", (saveErr as any)?.message);
    }

    return NextResponse.json({ success: true, id: resendDataId });
  } catch (error: any) {
    console.error("Eroare server în ruta de contact:", error?.message);
    // RZN-07: Răspuns de eroare neutru fără detalii interne
    return NextResponse.json(
      { error: "A apărut o problemă la procesarea solicitării tale. Te rugăm să reîncerci." },
      { status: 500 }
    );
  }
}