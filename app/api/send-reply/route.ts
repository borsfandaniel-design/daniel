import { NextResponse } from "next/server";
import { Resend } from "resend";
import { cookies, headers } from "next/headers";
import { verifyAdminSessionToken } from "../../lib/auth";
import { checkRateLimitAsync, getClientIp } from "../../lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const clientIp = getClientIp(reqHeaders);

    // 1. RZN-07: Verificare Content-Length (max 64 KB)
    const contentLength = reqHeaders.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 64 * 1024) {
      return NextResponse.json(
        { error: "Dimensiunea mesajului depășește limita permisă (64 KB)." },
        { status: 413 }
      );
    }

    // 2. RZN-06: Verificare sesiune admin autentificată și nerevocată
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Neautorizat: Trimiterea de mesaje necesită autentificare de administrator." },
        { status: 401 }
      );
    }

    const session = await verifyAdminSessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        { error: "Sesiunea a expirat sau a fost revocată. Te rugăm să te reautentifici." },
        { status: 401 }
      );
    }

    // 3. RZN-04: Rate limiting distribuit anti-flood: Max 20 reply-uri per 10 minute
    const rateLimit = await checkRateLimitAsync(`reply_${clientIp}`, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Limita de expediere a fost atinsă. Te rugăm să aștepți înainte de a trimite noi mesaje." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    // 4. RZN-07: Parsare sigură a corpului cererii
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Formatul cererii este invalid. Se acceptă doar JSON valid." },
        { status: 400 }
      );
    }

    const to = typeof body?.to === "string" ? body.to.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "Re: Mesaj SWING";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!to || !message) {
      return NextResponse.json(
        { error: "Destinatarul și mesajul sunt obligatorii." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to) || to.length > 120) {
      return NextResponse.json({ error: "Adresă de destinatar invalidă." }, { status: 400 });
    }

    if (message.length > 8000) {
      return NextResponse.json({ error: "Mesajul depășește limita permisă de caractere." }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "SWING <onboarding@resend.dev>",
      to: [to],
      subject: subject.slice(0, 150),
      text: message,
    });

    if (error) {
      console.error("Eroare furnizor la expedierea răspunsului:", error.message);
      // RZN-07: Nu transmitem detaliul intern al furnizorului către client
      return NextResponse.json(
        { error: "Nu s-a putut trimite răspunsul către destinatar. Verifică setările de email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error("Eroare la procesarea cererii API send-reply:", err?.message);
    return NextResponse.json(
      { error: "A apărut o problemă la expedierea mesajului." },
      { status: 500 }
    );
  }
}
