import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const targetEmail = process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Toate câmpurile (nume, email, mesaj) sunt obligatorii." },
        { status: 400 }
      );
    }

    // 1. Trimite e-mail de notificare către borsfandaniel@gmail.com prin Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "SWING Contact <onboarding@resend.dev>",
      to: [targetEmail],
      replyTo: email,
      subject: `[SWING] Mesaj nou de la ${name}`,
      text: `Ai primit un mesaj nou prin formularul de contact de pe site:\n\nNume: ${name}\nEmail: ${email}\n\nMesaj:\n${message}\n\n---\nPoți da Reply direct la acest e-mail pentru a-i răspunde clientului (${email}).`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF3E0; border: 1px solid #D62828; border-radius: 16px; overflow: hidden; padding: 24px; color: #2B0808;">
          <div style="border-bottom: 2px solid #D62828; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #D62828; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">SWING // Mesaj Nou Primit</h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #2B0808; opacity: 0.8;">Un client a trimis o solicitare prin formularul de pe site.</p>
          </div>

          <div style="background-color: #ffffff; border-radius: 12px; padding: 18px; margin-bottom: 18px; border: 1px solid rgba(214, 40, 40, 0.15);">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 90px; color: #2B0808;">Nume:</td>
                <td style="padding: 6px 0; color: #2B0808;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #2B0808;">Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #D62828; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
            </table>
          </div>

          <div style="background-color: #ffffff; border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid rgba(214, 40, 40, 0.15);">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #D62828; margin-bottom: 8px;">Conținut Mesaj:</div>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #2B0808;">${message}</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${email}?subject=Re: Mesaj SWING" style="display: inline-block; background-color: #D62828; color: #FFF3E0; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">Răspunde direct lui ${name}</a>
          </div>

          <p style="text-align: center; font-size: 11px; opacity: 0.6; margin-top: 20px;">
            Poți da "Reply" direct la acest e-mail în Gmail și răspunsul tău va ajunge automat la ${email}.
          </p>
        </div>
      `,
    });

    if (resendError) {
      console.error("Eroare Resend:", resendError);
      return NextResponse.json(
        { error: "Nu s-a putut trimite e-mailul: " + resendError.message },
        { status: 500 }
      );
    }

    // 2. Salvare imediată în messages.json pentru Dashboard Realtime
    try {
      const fs = await import("fs");
      const path = await import("path");
      const dataFilePath = path.join(process.cwd(), "data", "messages.json");
      const newMessage = {
        id: resendData?.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
        name,
        email,
        message,
        created_at: new Date().toISOString(),
        status: "pending",
      };

      let currentList: any[] = [];
      if (fs.existsSync(dataFilePath)) {
        try {
          currentList = JSON.parse(fs.readFileSync(dataFilePath, "utf8")) || [];
        } catch {
          currentList = [];
        }
      }
      currentList.unshift(newMessage);
      fs.writeFileSync(dataFilePath, JSON.stringify(currentList, null, 2), "utf8");
    } catch (saveErr) {
      console.warn("Eroare salvare messages.json:", saveErr);
    }

    // 3. Salvare opțională în Supabase dacă este disponibil
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from("contact_messages")
          .insert([{ name, email, message, status: "pending" }]);
      } catch (dbErr) {
        console.warn("Eroare non-critică la salvarea în Supabase:", dbErr);
      }
    }

    return NextResponse.json({ success: true, id: resendData?.id });
  } catch (error: any) {
    console.error("Eroare API contact:", error);
    return NextResponse.json(
      { error: error?.message || "A apărut o eroare la procesarea mesajului." },
      { status: 500 }
    );
  }
}