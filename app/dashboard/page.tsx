"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Inbox,
  CheckCircle2,
  Clock,
  Send,
  Mail,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  Zap,
  Radio,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

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

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "replied">("all");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [secondsSinceSync, setSecondsSinceSync] = useState(0);

  // Încărcare mesaje reale din API
  const loadMessages = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
        setLastSyncTime(new Date());
        setSecondsSinceSync(0);

        // Dacă nu avem mesaj selectat sau cel selectat a fost actualizat
        setSelectedMsg((prevSelected) => {
          if (!prevSelected && data.messages.length > 0) {
            return data.messages[0];
          }
          if (prevSelected) {
            const updated = data.messages.find((m: Message) => m.id === prevSelected.id);
            return updated || data.messages[0] || null;
          }
          return null;
        });
      }
    } catch (err) {
      console.error("Eroare la preluarea mesajelor:", err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  // Efect inițial și interval de sincronizare automată în timp real (la fiecare 7 secunde)
  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Timer pentru secunde trecute de la ultima sincronizare
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceSync((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatare relativă a datei
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 1) return "chiar acum";
      if (diffMin < 60) return `acum ${diffMin} min`;
      if (diffHours < 24) return `acum ${diffHours} ore`;
      if (diffDays === 1) return "ieri";
      return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  // Calcul statistici în timp real
  const total = messages.length;
  const replied = messages.filter((m) => m.status === "replied").length;
  const pending = total - replied;
  const responseRate = total > 0 ? Math.round((replied / total) * 100) : 100;

  // Filtrare mesaje
  const filteredMessages = messages.filter((msg) => {
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "pending"
        ? msg.status === "pending"
        : msg.status === "replied";

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  // Copiază adresa de e-mail în clipboard
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Șabloane rapide de răspuns
  const applyQuickTemplate = (type: "offer" | "call" | "quick") => {
    if (!selectedMsg) return;
    const name = selectedMsg.name.split(" ")[0] || selectedMsg.name;
    if (type === "offer") {
      setReplyText(
        `Salut ${name},\n\nMulțumesc pentru mesaj! Am analizat solicitarea ta și ți-am pregătit o ofertă adaptată pentru serviciile SWING. Când ai 10 minute libere pentru o scurtă discuție?\n\nToate cele bune,\nDaniel Moisă // SWING`
      );
    } else if (type === "call") {
      setReplyText(
        `Salut ${name},\n\nAm primit mesajul tău de pe site. Propun să stabilim un apel scurt de 15 minute pentru a parcurge obiectivele tale și strategia potrivită.\n\nCe zi și oră ți-ar fi convenabile?\n\nO zi excelentă,\nDaniel Moisă`
      );
    } else if (type === "quick") {
      setReplyText(
        `Salut ${name},\n\nConfirm primirea mesajului. Am preluat cerințele tale și revin în cel mai scurt timp cu detaliile complete.\n\nMulțumesc,\nDaniel`
      );
    }
  };

  // Trimite răspuns prin Resend API și actualizează starea
  const handleSendReply = async () => {
    if (!selectedMsg || !replyText.trim()) return;
    setSending(true);

    try {
      // 1. Trimitere e-mail prin Resend API
      const res = await fetch("/api/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedMsg.email,
          subject: `Re: Mesaj SWING - ${selectedMsg.name}`,
          message: replyText,
        }),
      });

      // 2. Salvare status în /api/messages
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMsg.id,
          status: "replied",
          reply_text: replyText,
        }),
      });

      // 3. Actualizare interfață locală
      const updatedMessages = messages.map((m) =>
        m.id === selectedMsg.id
          ? { ...m, status: "replied" as const, reply_text: replyText, replied_at: new Date().toISOString() }
          : m
      );

      setMessages(updatedMessages);
      setSelectedMsg({
        ...selectedMsg,
        status: "replied",
        reply_text: replyText,
        replied_at: new Date().toISOString(),
      });
      setReplyText("");
      setActionSuccess("Răspunsul a fost expediat și marcat cu succes!");
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      console.error("Eroare la trimiterea răspunsului:", err);
    } finally {
      setSending(false);
    }
  };

  // Marchează manual ca rezolvat fără email
  const handleMarkAsReplied = async (id: string) => {
    try {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "replied",
          reply_text: "Marcat manual ca rezolvat.",
        }),
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: "replied" as const, reply_text: "Marcat manual ca rezolvat." } : m
        )
      );

      if (selectedMsg?.id === id) {
        setSelectedMsg((prev) => (prev ? { ...prev, status: "replied", reply_text: "Marcat manual ca rezolvat." } : null));
      }

      setActionSuccess("Mesaj marcat ca rezolvat.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Eroare:", err);
    }
  };

  // Ștergere mesaj din dashboard
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Ești sigur că vrei să elimini acest mesaj din istoric?")) return;
    try {
      await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      const remaining = messages.filter((m) => m.id !== id);
      setMessages(remaining);
      if (selectedMsg?.id === id) {
        setSelectedMsg(remaining[0] || null);
      }
      setActionSuccess("Mesajul a fost șters.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Eroare la ștergere:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#2B0808]">
      
      {/* HEADER FUTURISTIC // TELEMETRY BAR */}
      <div className="relative overflow-hidden bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-lg">
        {/* Glow de fundal */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D62828]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D62828]">
                FEED STREAM LIVE TRANSMISSION
              </span>
              <span className="text-[10px] font-mono opacity-40">|</span>
              <span className="text-[10px] font-mono text-[#2B0808]/60">
                Sincronizat acum {secondsSinceSync}s
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2B0808]">
              Consolă Mesaje & Lead-uri
            </h1>
            <p className="text-xs text-[#2B0808]/70">
              Mesaje primite în timp real de la vizitatorii site-ului prin sistemul Resend.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => loadMessages(true)}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-2xl bg-[#FFF3E0] hover:bg-[#D62828] text-[#2B0808] hover:text-[#FFF3E0] border border-[#D62828]/25 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Sincronizează acum"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-[#D62828]" : ""} />
              <span>{refreshing ? "SINCRONIZARE..." : "REFRESH LIVE"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICARE REUȘITĂ ACȚIUNE */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <Check size={14} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* METRICI TELEMETRIE HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Mesaje */}
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#2B0808]/60 uppercase tracking-wider">
              Total Recepționate
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-0.5">{total}</div>
            <div className="text-[10px] text-[#2B0808]/50 mt-1 font-mono">flux contact activ</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#D62828]/10 flex items-center justify-center text-[#D62828]">
            <Inbox size={22} />
          </div>
        </div>

        {/* În Așteptare */}
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#D62828] uppercase tracking-wider flex items-center gap-1.5">
              <span>În Așteptare</span>
              {pending > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#D62828] animate-ping" />}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#D62828] mt-0.5">{pending}</div>
            <div className="text-[10px] text-[#2B0808]/50 mt-1 font-mono">necesită răspuns</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#D62828]/15 flex items-center justify-center text-[#D62828]">
            <Clock size={22} />
          </div>
        </div>

        {/* Răspunse */}
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
              Soluționate
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-0.5">{replied}</div>
            <div className="text-[10px] text-[#2B0808]/50 mt-1 font-mono">răspuns expediat</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Rata Răspuns */}
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#2B0808]/60 uppercase tracking-wider">
              Rată Răspuns
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-0.5">{responseRate}%</div>
            <div className="text-[10px] text-[#2B0808]/50 mt-1 font-mono">eficiență conversie</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#D62828]/10 flex items-center justify-center text-[#D62828]">
            <Zap size={22} />
          </div>
        </div>
      </div>

      {/* BARA DE CĂUTARE & FILTRE */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FCE8D5]/60 p-3 rounded-2xl border border-[#D62828]/15">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2B0808]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrează după expeditor, email sau text..."
            className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#2B0808] placeholder-[#2B0808]/40 focus:outline-none focus:ring-2 focus:ring-[#D62828]/40 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "all"
                ? "bg-[#D62828] text-[#FFF3E0] shadow-sm"
                : "bg-[#FFF3E0]/70 text-[#2B0808]/70 hover:bg-[#FFF3E0]"
            }`}
          >
            TOATE ({total})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "pending"
                ? "bg-[#D62828] text-[#FFF3E0] shadow-sm"
                : "bg-[#FFF3E0]/70 text-[#2B0808]/70 hover:bg-[#FFF3E0]"
            }`}
          >
            ÎN AȘTEPTARE ({pending})
          </button>
          <button
            onClick={() => setFilterStatus("replied")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "replied"
                ? "bg-[#D62828] text-[#FFF3E0] shadow-sm"
                : "bg-[#FFF3E0]/70 text-[#2B0808]/70 hover:bg-[#FFF3E0]"
            }`}
          >
            RĂSPUNSE ({replied})
          </button>
        </div>
      </div>

      {/* ZONA PRINCIPALĂ: FEED STREAM (STÂNGA) + INSPECTOR / COMPOSER (DREAPTA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* COLOANA STÂNGA: LISTA MESAJELOR REALE */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {loading && messages.length === 0 ? (
            <div className="p-12 text-center bg-[#FCE8D5]/60 rounded-3xl border border-[#D62828]/15 space-y-3">
              <Loader2 size={24} className="animate-spin mx-auto text-[#D62828]" />
              <p className="text-xs font-mono uppercase text-[#2B0808]/70">
                Se inițializează fluxul de date...
              </p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-10 text-center bg-[#FCE8D5]/40 rounded-3xl border border-[#D62828]/15 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E0] border border-[#D62828]/20 flex items-center justify-center mx-auto text-[#D62828]">
                <Radio size={20} className="animate-pulse" />
              </div>
              <h3 className="font-bold text-sm text-[#2B0808]">Niciun mesaj găsit</h3>
              <p className="text-xs text-[#2B0808]/60 max-w-xs mx-auto">
                {searchQuery
                  ? "Nu există mesaje care să corespundă căutării tale."
                  : "Radarul este activ. Când un vizitator trimite un mesaj pe site, va apărea aici automat."}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              const isReplied = msg.status === "replied";

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 relative overflow-hidden group ${
                    isSelected
                      ? "bg-[#D62828] text-[#FFF3E0] border-[#D62828] shadow-md -translate-y-0.5"
                      : "bg-[#FCE8D5]/70 hover:bg-[#FCE8D5] border-[#D62828]/15 hover:border-[#D62828]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected
                            ? "bg-[#FFF3E0] text-[#D62828]"
                            : "bg-[#D62828] text-[#FFF3E0]"
                        }`}
                      >
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm truncate">{msg.name}</span>
                    </div>

                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider shrink-0 ${
                        isReplied
                          ? isSelected
                            ? "bg-emerald-300/30 text-emerald-100"
                            : "bg-emerald-100 text-emerald-800"
                          : isSelected
                          ? "bg-amber-300/30 text-amber-100"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isReplied ? "Răspuns" : "Așteaptă"}
                    </span>
                  </div>

                  <div className={`text-[11px] mb-2 truncate ${isSelected ? "text-[#FFF3E0]/80" : "text-[#2B0808]/60 font-mono"}`}>
                    {msg.email}
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? "text-[#FFF3E0]/90" : "text-[#2B0808]/80"}`}>
                    {msg.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                    <span className={`font-mono ${isSelected ? "text-[#FFF3E0]/70" : "text-[#2B0808]/50"}`}>
                      {formatTimeAgo(msg.created_at)}
                    </span>

                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold uppercase flex items-center gap-1 text-[#FFF3E0]">
                        <span>ACTIV</span>
                        <ArrowRight size={10} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* COLOANA DREAPTA: INSPECTOR MESAJ & COMPOSER RĂSPUNS */}
        <div className="lg:col-span-7 bg-[#FCE8D5]/80 border border-[#D62828]/25 rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between shadow-md space-y-6">
          {selectedMsg ? (
            <div className="space-y-5">
              
              {/* Header Expeditor */}
              <div className="border-b border-[#D62828]/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#D62828] text-[#FFF3E0] flex items-center justify-center font-black text-lg shadow-sm">
                    {selectedMsg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2B0808] leading-tight">
                      {selectedMsg.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-[#2B0808]/70">{selectedMsg.email}</span>
                      <button
                        onClick={() => handleCopyEmail(selectedMsg.email)}
                        className="text-[#D62828] hover:text-[#2B0808] transition-colors p-1"
                        title="Copiază email"
                      >
                        {copiedEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: Mesaj SWING`}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF3E0] hover:bg-[#D62828] text-[#2B0808] hover:text-[#FFF3E0] border border-[#D62828]/20 text-[11px] font-bold font-mono uppercase flex items-center gap-1.5 transition-all shadow-xs"
                    title="Răspunde din clientul tău de e-mail (Gmail)"
                  >
                    <ExternalLink size={12} />
                    <span>Gmail</span>
                  </a>

                  <button
                    onClick={() => handleDeleteMessage(selectedMsg.id)}
                    className="p-2 rounded-xl text-[#2B0808]/40 hover:text-[#D62828] hover:bg-[#D62828]/10 transition-all cursor-pointer"
                    title="Șterge mesaj"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Data & ID Transmisie */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#2B0808]/60 bg-[#FFF3E0]/60 p-2.5 rounded-xl border border-[#D62828]/10">
                <span>
                  TRANSMIS: {new Date(selectedMsg.created_at).toLocaleString("ro-RO")}
                </span>
                <span className="uppercase">
                  STATUS: {selectedMsg.status === "replied" ? "SOLUȚIONAT" : "AȘTEAPTĂ RĂSPUNS"}
                </span>
              </div>

              {/* Conținut Mesaj Recepționat */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase text-[#D62828] tracking-wider flex items-center gap-1">
                  <span>MESAJ CLIENT</span>
                </div>
                <div className="bg-[#FFF3E0] p-4 sm:p-5 rounded-2xl border border-[#D62828]/15 text-xs sm:text-sm leading-relaxed text-[#2B0808] whitespace-pre-wrap shadow-inner font-sans">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Istoric Răspuns Trimis (dacă există) */}
              {selectedMsg.reply_text && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-2xl space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span>RĂSPUNS SALVAT</span>
                    {selectedMsg.replied_at && (
                      <span className="opacity-60 text-[9px]">
                        ({formatTimeAgo(selectedMsg.replied_at)})
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed whitespace-pre-wrap">
                    {selectedMsg.reply_text}
                  </p>
                </div>
              )}

              {/* Șabloane Rapide de Răspuns */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-[#2B0808]/60">
                  <span className="flex items-center gap-1">
                    <Sparkles size={11} className="text-[#D62828]" />
                    <span>Șabloane Rapide</span>
                  </span>
                  <span>1-CLICK INSERT</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyQuickTemplate("offer")}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FFF3E0] hover:bg-[#D62828]/10 border border-[#D62828]/20 text-[11px] font-medium text-[#2B0808] transition-all cursor-pointer"
                  >
                    💼 Ofertă adaptată
                  </button>
                  <button
                    onClick={() => applyQuickTemplate("call")}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FFF3E0] hover:bg-[#D62828]/10 border border-[#D62828]/20 text-[11px] font-medium text-[#2B0808] transition-all cursor-pointer"
                  >
                    📞 Programare apel 15m
                  </button>
                  <button
                    onClick={() => applyQuickTemplate("quick")}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FFF3E0] hover:bg-[#D62828]/10 border border-[#D62828]/20 text-[11px] font-medium text-[#2B0808] transition-all cursor-pointer"
                  >
                    ⚡ Confirmare primire
                  </button>
                </div>
              </div>

              {/* Editor Răspuns Direct */}
              <div className="space-y-3 pt-1">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Scrie un răspuns pentru ${selectedMsg.name}...`}
                    className="w-full bg-[#FFF3E0] border border-[#D62828]/30 rounded-2xl p-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D62828]/50 text-[#2B0808] placeholder-[#2B0808]/40 resize-none shadow-xs font-sans"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    onClick={() => handleMarkAsReplied(selectedMsg.id)}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-[#2B0808]/70 hover:text-[#D62828] hover:bg-[#D62828]/10 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Schimbă statusul fără a trimite email"
                  >
                    <CheckCircle2 size={13} />
                    <span>Doar marchează ca rezolvat</span>
                  </button>

                  <button
                    onClick={handleSendReply}
                    disabled={sending || !replyText.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-[#D62828] hover:bg-[#2B0808] text-[#FFF3E0] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>SE EXPEDIAZĂ...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Trimite Răspuns</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 space-y-3 opacity-60">
              <Inbox size={36} className="mx-auto text-[#D62828]" />
              <p className="text-xs font-mono uppercase tracking-wider">
                Selectează un mesaj din fluxul din stânga pentru vizualizare completă.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}