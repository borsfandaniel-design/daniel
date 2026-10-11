import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

// GET: Returnează toate mesajele în timp real (cele mai noi primele)
export async function GET() {
  try {
    const messages = getStoredMessages();
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

