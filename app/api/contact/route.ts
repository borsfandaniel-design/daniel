import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// Inițializare Supabase & Resend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Toate câmpurile sunt obligatorii." },
        { status: 400 }
      );
    }

    // 1. Salvează automat mesajul în baza de date Supabase pentru Dashboard
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message, status: "pending" }]);

    if (dbError) {
      console.error("Eroare Supabase:", dbError);
    }

    // 2. Trimite e-mail de notificare prin Resend
    const resendResponse = await resend.emails.send({
      from: "SWING <onboarding@resend.dev>",
      to: [email], // Sau e-mailul tău dacă vrei să primești tu notificarea
      subject: `Mesaj nou de la ${name}`,
      text: message,
    });

    return NextResponse.json({ success: true, resendResponse });
  } catch (error) {
    console.error("Eroare API contact:", error);
    return NextResponse.json(
      { error: "A apărut o eroare la trimitere." },
      { status: 500 }
    );
  }
}