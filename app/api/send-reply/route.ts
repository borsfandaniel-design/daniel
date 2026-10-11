import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
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

