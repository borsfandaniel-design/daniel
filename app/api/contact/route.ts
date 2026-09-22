import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Lipsesc câmpuri obligatorii.' }, { status: 400 });
    }

    // Call to Resend API
    // Ensure process.env.RESEND_API_KEY is defined in your .env.local file
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>', // Adjust with your verified domain
        to: ['borsfandaniel@gmail.com'], // Put your target email here
        subject: `[Contact Nou] - ${name} (${service})`,
        html: `
          <h2>Mesaj nou de pe portofoliu</h2>
          <p><strong>Nume:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Serviciu:</strong> ${service}</p>
          <p><strong>Mesaj:</strong></p>
          <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #FF5722;">
            ${message}
          </blockquote>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      return NextResponse.json({ error: errorData }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email trimis cu succes!' });
  } catch (err) {
    return NextResponse.json({ error: 'Eroare internă de server.' }, { status: 500 });
  }
}