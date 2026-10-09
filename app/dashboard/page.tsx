"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  Send, 
  Mail, 
  Loader2,
  RefreshCw
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: "pending" | "replied";
  reply_text?: string;
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Încărcare mesaje din Supabase
  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setMessages(data);
      if (!selectedMsg) setSelectedMsg(data[0]);
    } else {
      // Date demonstrative dacă nu ai mesaje încă
      const demoData: Message[] = [
        {
          id: "1",
          name: "Alexandru Popa",
          email: "alex@client.ro",
          message: "Salut Daniel, aș dori o ofertă pentru un pachet de outreach și appointment setting.",
          created_at: new Date().toISOString(),
          status: "pending",
        },
      ];
      setMessages(demoData);
      setSelectedMsg(demoData[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Calculare statistici simple
  const total = messages.length;
  const replied = messages.filter((m) => m.status === "replied").length;
  const pending = total - replied;

  // Trimite răspuns e-mail
  const handleSendReply = async () => {
    if (!selectedMsg || !replyText.trim()) return;
    setSending(true);

    try {
      // 1. Trimitere e-mail prin Resend API
      await fetch("/api/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedMsg.email,
          subject: `Re: Mesaj SWING - ${selectedMsg.name}`,
          message: replyText,
        }),
      });

      // 2. Salvare status în Supabase
      await supabase
        .from("contact_messages")
        .update({ status: "replied", reply_text: replyText })
        .eq("id", selectedMsg.id);

      // 3. Update starea interfeței
      const updated = messages.map((m) =>
        m.id === selectedMsg.id
          ? { ...m, status: "replied" as const, reply_text: replyText }
          : m
      );

      setMessages(updated);
      setSelectedMsg({ ...selectedMsg, status: "replied", reply_text: replyText });
      setReplyText("");
    } catch (err) {
      console.error("Eroare la trimiterea răspunsului:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-[#2B0808]">
      
      {/* Header Minimalist */}
      <div className="flex items-center justify-between bg-[#FCE8D5]/80 p-5 rounded-2xl border border-[#D62828]/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-black">SWING Admin</h1>
          <p className="text-xs text-[#2B0808]/70">
            Gestionare mesaje de la clienți și răspunsuri rapide
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="p-2 rounded-xl bg-[#D62828]/10 text-[#D62828] hover:bg-[#D62828]/20 transition-all"
          title="Reîmprospătează"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Doar 3 Numere Importante */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#2B0808]/60 uppercase">Primite</div>
            <div className="text-2xl font-black">{total}</div>
          </div>
          <Inbox size={20} className="text-[#D62828]" />
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#2B0808]/60 uppercase">Răspunse</div>
            <div className="text-2xl font-black text-green-700">{replied}</div>
          </div>
          <CheckCircle2 size={20} className="text-green-700" />
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#2B0808]/60 uppercase">În Așteptare</div>
            <div className="text-2xl font-black text-[#D62828]">{pending}</div>
          </div>
          <Clock size={20} className="text-[#D62828]" />
        </div>
      </div>

      {/* Zona Principală: Lista Mesaje + Răspuns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Coloana Stânga: Lista de Mesaje */}
        <div className="lg:col-span-5 space-y-2 max-h-[550px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isSelected = selectedMsg?.id === msg.id;
            return (
              <div
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? "bg-[#D62828] text-[#FFF3E0] border-[#D62828] shadow-md"
                    : "bg-[#FCE8D5]/60 hover:bg-[#FCE8D5] border-[#D62828]/15"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm truncate">{msg.name}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                      msg.status === "replied"
                        ? isSelected ? "bg-green-300/30 text-green-200" : "bg-green-100 text-green-800"
                        : isSelected ? "bg-amber-300/30 text-amber-200" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {msg.status === "replied" ? "Răspuns" : "Așteaptă"}
                  </span>
                </div>
                <p className={`text-xs line-clamp-2 ${isSelected ? "opacity-90" : "opacity-70"}`}>
                  {msg.message}
                </p>
              </div>
            );
          })}
        </div>

        {/* Coloana Dreapta: Citire & Răspuns Direct */}
        <div className="lg:col-span-7 bg-[#FCE8D5]/60 border border-[#D62828]/20 rounded-2xl p-5 flex flex-col justify-between">
          {selectedMsg ? (
            <div className="space-y-4">
              {/* Info Expeditor */}
              <div className="border-b border-[#D62828]/15 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base">{selectedMsg.name}</h3>
                  <div className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                    <Mail size={12} /> {selectedMsg.email}
                  </div>
                </div>
              </div>

              {/* Mesaj Client */}
              <div className="bg-[#FFF3E0] p-4 rounded-xl border border-[#D62828]/10 text-xs sm:text-sm leading-relaxed">
                <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-1">Mesaj primit:</div>
                {selectedMsg.message}
              </div>

              {/* Istoric Răspuns Trimis */}
              {selectedMsg.reply_text && (
                <div className="bg-green-600/10 border border-green-600/20 p-3 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-green-800 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Răspuns trimis:
                  </div>
                  <p className="text-green-900 opacity-90">{selectedMsg.reply_text}</p>
                </div>
              )}

              {/* Câmp de Scris Răspuns */}
              <div className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Scrie un răspuns pentru ${selectedMsg.name}...`}
                  className="w-full bg-[#FFF3E0] border border-[#D62828]/30 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D62828]/50 resize-none"
                />
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#D62828] hover:bg-[#2B0808] text-[#FFF3E0] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {sending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Se trimite...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Trimite E-mail</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 opacity-50 text-xs">
              Selectează un mesaj din stânga.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}