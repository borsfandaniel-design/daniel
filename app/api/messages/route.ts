import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminSessionToken } from "../../lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);
// RZN-01: Folosim exclusiv fișierul local ignorat de Git pentru a nu stoca date personale în repository
const dataFilePath = path.join(process.cwd(), "data", "messages.local.json");

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
      // Dacă există temporar vechiul fișier de migrare, îl citim dar scriem doar în messages.local.json
      const legacyPath = path.join(process.cwd(), "data", "messages.json");
      if (fs.existsSync(legacyPath)) {
        const legacyData = fs.readFileSync(legacyPath, "utf8");
        return JSON.parse(legacyData) || [];
      }
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.error("Eroare la citirea mesajelor locale:", (error as any)?.message);
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
    console.error("Eroare la salvarea mesajelor locale:", (error as any)?.message);
  }
}

/**
 * RZN-01: Sincronizare sigură din Resend
 * Filtrează STRICT emailurile de contact și exclude explicit orice notificare de autentificare, 2FA sau securitate.
 */
async function syncFromResend(localMessages: Message[]): Promise<Message[]> {
  try {
    if (!process.env.RESEND_API_KEY) return localMessages;

    const listRes = await resend.emails.list();
    const emails = listRes.data?.data || [];

    // RZN-01: Căutăm doar email-urile legitime de contact, excluzând 2FA și codurile de securitate
    const contactEmails = emails.filter((e) => {
      if (!e.subject) return false;
      const lower = e.subject.toLowerCase();
      // Excludere strictă pentru orice mesaj legat de 2FA sau securitate
      if (lower.includes("2fa") || lower.includes("securitate") || lower.includes("verificare") || lower.includes("autentificare")) {
        return false;
      }
      // Păstrăm exclusiv prefixele dedicate de contact
      return e.subject.includes("[SWING CONTACT]") || e.subject.includes("[Contact Nou]") || e.subject.startsWith("[SWING] Mesaj nou de la");
    });

    let hasNew = false;
    for (const item of contactEmails) {
      const exists = localMessages.some((m) => m.id === item.id);
      if (!exists) {
        let name = "Client Nou";
        if (item.subject) {
          const matchContactPrefix = item.subject.match(/\[SWING CONTACT\] Mesaj nou de la (.+)/i);
          const matchLegacyPrefix = item.subject.match(/\[SWING\] Mesaj nou de la (.+)/i);
          const matchContact = item.subject.match(/\[Contact Nou\] - ([^(]+)/i);

          if (matchContactPrefix && matchContactPrefix[1]) {
            name = matchContactPrefix[1].trim();
          } else if (matchLegacyPrefix && matchLegacyPrefix[1]) {
            name = matchLegacyPrefix[1].trim();
          } else if (matchContact && matchContact[1]) {
            name = matchContact[1].trim();
          }
        }

        const email = (item.reply_to && item.reply_to[0]) || "";
        let messageText = "Mesaj recepționat prin formularul de contact.";

        try {
          const detail = await resend.emails.get(item.id);
          if (detail.data) {
            const bodyContent = detail.data.text || detail.data.html || "";
            // Verificare redundantă: dacă din greșeală corpul conține un cod 2FA, îl ignorăm total
            if (bodyContent.includes("verificare în 2 pași") || bodyContent.includes("Codul tău de securitate 2FA")) {
              continue;
            }
            if (detail.data.text) {
              const textMatch = detail.data.text.match(/Mesaj:\s*([\s\S]+?)(?:\n\n---|\n---|$)/i);
              if (textMatch && textMatch[1]) {
                messageText = textMatch[1].trim();
              }
            }
          }
        } catch {
          // Continuă cu textul implicit dacă corpul nu poate fi descărcat
        }

        localMessages.unshift({
          id: item.id,
          name,
          email,
          message: messageText,
          created_at: item.created_at || new Date().toISOString(),
          status: "pending",
        });
        hasNew = true;
      }
    }

    if (hasNew) {
      saveStoredMessages(localMessages);
    }
  } catch (syncErr) {
    console.error("Eroare la sincronizarea din Resend:", (syncErr as any)?.message);
  }

  return localMessages;
}

async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return false;
  const session = await verifyAdminSessionToken(token);
  return session.valid;
}

// GET: Sincronizează din Resend și returnează toate mesajele în timp real
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
    console.error("Eroare la preluarea mesajelor:", err?.message);
    // RZN-07: Nu transmitem detalii interne de eroare
    return NextResponse.json(
      { error: "Nu s-au putut prelua mesajele în acest moment." },
      { status: 500 }
    );
  }
}

// PATCH: Actualizează statusul unui mesaj
export async function PATCH(req: Request) {
  try {
    const isAuthed = await requireAdminAuth();
    if (!isAuthed) {
      return NextResponse.json(
        { error: "Neautorizat: Modificarea mesajelor necesită sesiune de administrator." },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Formatul cererii este invalid." },
        { status: 400 }
      );
    }

    const { id, status, reply_text } = body || {};
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID-ul este obligatoriu." }, { status: 400 });
    }

    const messages = getStoredMessages();
    const index = messages.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Mesajul solicitat nu a fost găsit." }, { status: 404 });
    }

    messages[index] = {
      ...messages[index],
      status: status || messages[index].status,
      reply_text: reply_text !== undefined ? String(reply_text).slice(0, 4000) : messages[index].reply_text,
      replied_at: status === "replied" ? new Date().toISOString() : messages[index].replied_at,
    };

    saveStoredMessages(messages);
    return NextResponse.json({ success: true, message: messages[index] });
  } catch (err: any) {
    console.error("Eroare la actualizarea mesajului:", err?.message);
    return NextResponse.json(
      { error: "A apărut o problemă la actualizarea mesajului." },
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
    console.error("Eroare la ștergerea mesajului:", err?.message);
    return NextResponse.json(
      { error: "A apărut o problemă la ștergerea mesajului." },
      { status: 500 }
    );
  }
}
