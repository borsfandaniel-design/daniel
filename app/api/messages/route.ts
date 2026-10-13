import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);
const dataFilePath = path.join(process.cwd(), "data", "messages.json");

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: "pending" | "replied";
  reply_text?: string;
  replied_at?: string;
}

function getStoredMessages(): Message[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.error("Eroare la citirea messages.json:", error);
    return [];
  }
}

function saveStoredMessages(messages: Message[]): void {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), "utf8");
  } catch (error) {
    console.error("Eroare la salvarea messages.json:", error);
  }
}

// Sincronizează automat direct din Resend API pentru a garanta că toate email-urile apar în dashboard
async function syncFromResend(localMessages: Message[]): Promise<Message[]> {
  try {
    const listRes = await resend.emails.list();
    const emails = listRes.data?.data || [];

    // Căutăm email-urile de contact trimise către Daniel
    const contactEmails = emails.filter(
      (e) => e.subject && (e.subject.includes("[SWING]") || e.subject.includes("[Contact Nou]"))
    );

    let hasNew = false;
    for (const item of contactEmails) {
      const exists = localMessages.some((m) => m.id === item.id);
      if (!exists) {
        let name = "Client Nou";
        if (item.subject) {
          const matchSwing = item.subject.match(/\[SWING\] Mesaj nou de la (.+)/i);
          const matchContact = item.subject.match(/\[Contact Nou\] - ([^(]+)/i);
          if (matchSwing && matchSwing[1]) {
            name = matchSwing[1].trim();
          } else if (matchContact && matchContact[1]) {
            name = matchContact[1].trim();
          }
        }

        const email = (item.reply_to && item.reply_to[0]) || "";

        let messageText = "Mesaj recepționat prin formularul de contact.";
        try {
          const detail = await resend.emails.get(item.id);
          if (detail.data?.text) {
            const textParts = detail.data.text.split("Mesaj:\n");
            if (textParts.length > 1) {
              messageText = textParts[1].split("\n\n---")[0].trim();
            } else {
              messageText = detail.data.text.trim();
            }
          }
        } catch {
          // păstrează textul fallback
        }

        localMessages.unshift({
          id: item.id,
          name,
          email,
          message: messageText,
          created_at: item.created_at,
          status: "pending",
        });
        hasNew = true;
      }
    }

    if (hasNew) {
      saveStoredMessages(localMessages);
    }
  } catch (syncErr) {
    console.error("Eroare la sincronizarea automată din Resend:", syncErr);
  }

  return localMessages;
}

import { cookies } from "next/headers";
import { verifyAdminSessionToken } from "../../lib/auth";

async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return false;
  const session = await verifyAdminSessionToken(token);
  return session.valid;
}

// GET: Sincronizează din Resend și returnează toate mesajele în timp real (cele mai noi primele)
export async function GET() {
  try {
    const isAuthed = await requireAdminAuth();
    if (!isAuthed) {
      return NextResponse.json(
        { error: "Neautorizat: Accesul la mesaje necesită sesiune de administrator validă." },
        { status: 401 }
      );
    }

    let messages = getStoredMessages();
    messages = await syncFromResend(messages);

    // Ordonăm descrescător după dată
    messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Eroare la preluarea mesajelor." },
      { status: 500 }
    );
  }
}

// PATCH: Actualizează statusul unui mesaj (ex: replied, reply_text)
export async function PATCH(req: Request) {
  try {
    const isAuthed = await requireAdminAuth();
    if (!isAuthed) {
      return NextResponse.json(
        { error: "Neautorizat: Modificarea mesajelor necesită sesiune de administrator." },
        { status: 401 }
      );
    }

    const { id, status, reply_text } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID-ul este obligatoriu." }, { status: 400 });
    }

    const messages = getStoredMessages();
    const index = messages.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Mesajul nu a fost găsit." }, { status: 404 });
    }

    messages[index] = {
      ...messages[index],
      status: status || messages[index].status,
      reply_text: reply_text !== undefined ? reply_text : messages[index].reply_text,
      replied_at: status === "replied" ? new Date().toISOString() : messages[index].replied_at,
    };

    saveStoredMessages(messages);
    return NextResponse.json({ success: true, message: messages[index] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Eroare la actualizarea mesajului." },
      { status: 500 }
    );
  }
}

// DELETE: Șterge un mesaj din istoric
export async function DELETE(req: Request) {
  try {
    const isAuthed = await requireAdminAuth();
    if (!isAuthed) {
      return NextResponse.json(
        { error: "Neautorizat: Ștergerea mesajelor necesită sesiune de administrator." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID-ul este obligatoriu." }, { status: 400 });
    }

    const messages = getStoredMessages();
    const filtered = messages.filter((m) => m.id !== id);
    saveStoredMessages(filtered);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Eroare la ștergerea mesajului." },
      { status: 500 }
    );
  }
}
