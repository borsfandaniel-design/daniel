import { NextResponse } from "next/server";
import { Resend } from "resend";
import { cookies, headers } from "next/headers";
import { verifyAdminSessionToken } from "../../lib/auth";
import { checkRateLimit, getClientIp } from "../../lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Verificare sesiune admin
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Neautorizat: Trimiterea de mesaje necesită autentificare admin." },
        { status: 401 }
      );
    }

    const session = await verifyAdminSessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        { error: "Sesiune invalidă sau expirată. Te rugăm să te reautentifici." },
        { status: 401 }
      );
    }

    // 2. Rate limiting anti-flood pe trimiteri: Max 20 reply-uri per 10 minute
    const reqHeaders = await headers();
    const clientIp = getClientIp(reqHeaders);
    const rateLimit = checkRateLimit(`reply_${clientIp}`, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Limita de trimitere atinsă. Așteaptă ${rateLimit.retryAfterSeconds} secunde.` },
        { status: 429 }
      );
    }

    const { to, subject, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "Destinatarul și mesajul sunt obligatorii." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "SWING <onboarding@resend.dev>",
      to: [to],
      subject: subject || "Re: Mesaj SWING",
      text: message,
    });

    if (error) {
      console.error("Eroare Resend reply:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Eroare API send-reply:", err);
    return NextResponse.json(
      { error: err?.message || "Eroare la trimiterea răspunsului." },
      { status: 500 }
    );
  }
}
