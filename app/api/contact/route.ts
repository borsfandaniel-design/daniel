import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { checkRateLimitAsync, getClientIp } from "../../lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com";
const MAX_BODY_BYTES = 32 * 1024; // 32 KB

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * SWI-12: Citire controlată a fluxului cu limită strictă de 32 KB.
 * Nu se bazează exclusiv pe antetul Content-Length (care poate fi falsificat sau lipsi în chunked requests).
 */
async function readBodyWithByteLimit(
  req: Request,
  maxBytes: number
): Promise<{ text?: string; errorStatus?: number; errorMsg?: string }> {
  // 1. Verificare timpurie Content-Length (dacă este furnizat)
  const contentLength = req.headers.get("content-length");
  if (contentLength) {
    const parsedLength = parseInt(contentLength, 10);
    if (!isNaN(parsedLength) && parsedLength > maxBytes) {
      return {
        errorStatus: 413,
        errorMsg: "Dimensiunea cererii depășește limita permisă (maxim 32 KB).",
      };
    }
  }

  if (!req.body) {
    return { text: "" };
  }

  // 2. Citire pe bucăți (chunk-by-chunk) din stream
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          // Oprim imediat citirea fără a încărca restul în memorie
          try {
            await reader.cancel("Payload exceeded limit");
          } catch {}
          return {
            errorStatus: 413,
            errorMsg: "Dimensiunea cererii depășește limita permisă (maxim 32 KB).",
          };
        }
        chunks.push(value);
      }
    }
  } catch {
    return {
      errorStatus: 400,
      errorMsg: "Fluxul cererii a fost întrerupt sau corpul este invalid.",
    };
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { text: new TextDecoder("utf-8").decode(merged) };
}

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const clientIp = getClientIp(reqHeaders);

    // 1. SWI-10: Rate Limiting distribuit anti-spam: Max 5 mesaje per 10 minute per IP
    const rateLimit = await checkRateLimitAsync(`contact_${clientIp}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            rateLimit.error ||
            "Ai trimis prea multe solicitări recent. Te rugăm să aștepți înainte de a reîncerca.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    // 2. SWI-12: Citire controlată a fluxului cu limitare efectivă la 32 KB
    const streamResult = await readBodyWithByteLimit(req, MAX_BODY_BYTES);
    if (streamResult.errorStatus) {
      return NextResponse.json(
        { error: streamResult.errorMsg },
        { status: streamResult.errorStatus }
      );
    }

    const rawText = streamResult.text || "";
    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Corpul cererii este gol." },
        { status: 400 }
      );
    }

    let body: any;
    try {
      body = JSON.parse(rawText);
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

    // 3. Protecție Honeypot anti-bot
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

    // 4. Validare lungimi și prevenire Buffer / Memory Exhaustion
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

    // 5. Trimitere email prin Resend
    let resendDataId = "";
    if (process.env.RESEND_API_KEY) {
      const { data: resendData, error: resendError } = await resend.emails.send({
        from: "SWING Contact <onboarding@resend.dev>",
        to: [targetEmail],
        replyTo: email,
        subject: `[SWING CONTACT] Mesaj nou de la ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; padding: 24px; color: #09090b;">
            <div style="border-bottom: 2px solid #FF5400; padding-bottom: 12px; margin-bottom: 20px;">
              <span style="font-size: 10px; font-weight: 800; font-family: monospace; color: #FF5400; letter-spacing: 1.5px; text-transform: uppercase;">SWING // CONTACT LEAD</span>
              <h2 style="margin: 4px 0 0; font-size: 20px; font-weight: 800; color: #09090b;">Formular Contact: ${safeName}</h2>
            </div>
            
            <div style="background-color: #f4f4f5; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 80px; color: #52525b;">Nume:</td>
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
        return NextResponse.json(
          { error: "Nu s-a putut trimite mesajul în acest moment. Te rugăm să reîncerci puțin mai târziu." },
          { status: 500 }
        );
      }

      resendDataId = resendData?.id || "";
    }

    // 6. OBS-02: Persistență sigură în Supabase (preferă cheia privilegiată server-side dacă este configurată)
    const newMessage = {
      id: resendDataId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      name,
      email,
      message,
      created_at: new Date().toISOString(),
      status: "pending",
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from("contact_messages")
          .insert([{ name, email, message, status: "pending" }]);
      } catch (dbErr) {
        console.warn("Avertisment salvare în Supabase:", (dbErr as any)?.message);
      }
    }

    // Salvare locală exclusiv în mediul de dezvoltare în fișier ignorat de Git
    if (process.env.NODE_ENV !== "production") {
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
        console.warn("Avertisment salvare locală dev:", (saveErr as any)?.message);
      }
    }

    return NextResponse.json({ success: true, id: resendDataId });
  } catch (error: any) {
    console.error("Eroare server în ruta de contact:", error?.message);
    return NextResponse.json(
      { error: "A apărut o problemă la procesarea solicitării tale. Te rugăm să reîncerci." },
      { status: 500 }
    );
  }
}