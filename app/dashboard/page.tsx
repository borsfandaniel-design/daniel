"use client";

import React, { useState, useEffect } from "react";
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
  Zap,
  Radio,
  Sparkles,
  ArrowRight,
  Flame,
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
  const [secondsSinceSync, setSecondsSinceSync] = useState(0);

  // Încărcare mesaje reale din API
  const loadMessages = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
        setSecondsSinceSync(0);

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

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceSync((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const total = messages.length;
  const replied = messages.filter((m) => m.status === "replied").length;
  const pending = total - replied;
  const responseRate = total > 0 ? Math.round((replied / total) * 100) : 100;

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

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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

  const handleSendReply = async () => {
    if (!selectedMsg || !replyText.trim()) return;
    setSending(true);

    try {
      await fetch("/api/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedMsg.email,
          subject: `Re: Mesaj SWING - ${selectedMsg.name}`,
          message: replyText,
        }),
      });

      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMsg.id,
          status: "replied",
          reply_text: replyText,
        }),
      });

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
    <div className="max-w-7xl mx-auto space-y-6 text-zinc-950 font-sans">
      
      {/* HEADER PRINCIPAL // BARA DE COMANDĂ */}
      <div className="relative overflow-hidden bg-white border-2 border-orange-500/20 rounded-[2.5rem] p-5 sm:p-7 shadow-sm">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF5400]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5400] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5400]"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF5400]">
                FEED STREAM LIVE TRANSMISSION
              </span>
              <span className="text-[10px] font-mono text-zinc-300">|</span>
              <span className="text-[10px] font-mono text-zinc-500 font-medium">
                Sincronizat acum {secondsSinceSync}s
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Consolă <span className="text-[#FF5400]">Lead-uri</span> & Mesaje
            </h1>
            <p className="text-xs text-zinc-600 font-normal">
              Mesaje recepționate în timp real prin formularul site-ului SWING.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => loadMessages(true)}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-2xl bg-[#FF5400] hover:bg-[#E04800] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,84,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,84,0,0.35)] disabled:opacity-50"
              title="Sincronizează acum"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? "SINCRONIZARE..." : "REFRESH LIVE"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICARE REUȘITĂ ACȚIUNE */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 shadow-2xs">
          <Check size={14} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* METRICI TELEMETRIE HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Mesaje */}
        <div className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs transition-colors group">
          <div>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Total Recepționate
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">{total}</div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">flux contact activ</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5400] group-hover:bg-[#FF5400] group-hover:text-white transition-all">
            <Inbox size={20} />
          </div>
        </div>

        {/* În Așteptare */}
        <div className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs transition-colors group">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#FF5400] uppercase tracking-wider flex items-center gap-1.5">
              <span>În Așteptare</span>
              {pending > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5400] animate-ping" />}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#FF5400] mt-0.5">{pending}</div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">necesită răspuns</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-[#FF5400] group-hover:bg-[#FF5400] group-hover:text-white transition-all">
            <Clock size={20} />
          </div>
        </div>

        {/* Răspunse */}
        <div className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs transition-colors group">
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Soluționate
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5">{replied}</div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">răspuns expediat</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Rata Răspuns */}
        <div className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs transition-colors group">
          <div>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Rată Răspuns
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">{responseRate}%</div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">eficiență conversie</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5400] group-hover:bg-[#FF5400] group-hover:text-white transition-all">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* BARA DE CĂUTARE & FILTRE */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-orange-500/20 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrează după expeditor, email sau text..."
            className="w-full bg-white border border-orange-500/20 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-[#FF5400] transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "all"
                ? "bg-[#FF5400] text-white shadow-xs"
                : "bg-orange-500/5 text-zinc-700 hover:bg-orange-500/10"
            }`}
          >
            TOATE ({total})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "pending"
                ? "bg-[#FF5400] text-white shadow-xs"
                : "bg-orange-500/5 text-zinc-700 hover:bg-orange-500/10"
            }`}
          >
            ÎN AȘTEPTARE ({pending})
          </button>
          <button
            onClick={() => setFilterStatus("replied")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "replied"
                ? "bg-[#FF5400] text-white shadow-xs"
                : "bg-orange-500/5 text-zinc-700 hover:bg-orange-500/10"
            }`}
          >
            RĂSPUNSE ({replied})
          </button>
        </div>
      </div>

      {/* ZONA PRINCIPALĂ: LISTĂ MESAJ (STÂNGA) + INSPECTOR (DREAPTA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* COLOANA STÂNGA: FEED STREAM MESAJ */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
          {loading && messages.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border-2 border-orange-500/20 space-y-3">
              <Loader2 size={24} className="animate-spin mx-auto text-[#FF5400]" />
              <p className="text-xs font-mono uppercase text-zinc-500 font-bold">
                Se inițializează fluxul de date...
              </p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border-2 border-orange-500/20 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-[#FF5400]">
                <Radio size={20} className="animate-pulse" />
              </div>
              <h3 className="font-bold text-sm text-zinc-950">Niciun mesaj găsit</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? "Nu există mesaje care să corespundă căutării tale."
                  : "Radarul este activ. Când un vizitator trimite un mesaj pe site, va apărea aici instant."}
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
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 relative overflow-hidden group shadow-2xs ${
                    isSelected
                      ? "bg-[#FF5400] text-white border-[#FF5400] shadow-[0_8px_24px_rgba(255,84,0,0.22)] -translate-y-0.5"
                      : "bg-white hover:bg-orange-500/[0.04] border-orange-500/20 hover:border-[#FF5400]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected
                            ? "bg-white text-[#FF5400]"
                            : "bg-[#FF5400] text-white"
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
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-emerald-800"
                          : isSelected
                          ? "bg-white/20 text-white"
                          : "bg-orange-500/10 text-[#FF5400]"
                      }`}
                    >
                      {isReplied ? "Răspuns" : "Așteaptă"}
                    </span>
                  </div>

                  <div className={`text-[11px] mb-2 truncate ${isSelected ? "text-white/80" : "text-zinc-500 font-mono"}`}>
                    {msg.email}
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? "text-white/95" : "text-zinc-700"}`}>
                    {msg.message}
                  </p>

                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${isSelected ? "border-white/20" : "border-orange-500/10"}`}>
                    <span className={`font-mono ${isSelected ? "text-white/80" : "text-zinc-400"}`}>
                      {formatTimeAgo(msg.created_at)}
                    </span>

                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold uppercase flex items-center gap-1 text-white">
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
        <div className="lg:col-span-7 bg-white border-2 border-orange-500/20 rounded-[2.5rem] p-5 sm:p-7 flex flex-col justify-between shadow-sm space-y-6">
          {selectedMsg ? (
            <div className="space-y-5">
              
              {/* Header Expeditor */}
              <div className="border-b-2 border-orange-500/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5400] text-white flex items-center justify-center font-black text-lg shadow-[0_4px_16px_rgba(255,84,0,0.25)]">
                    {selectedMsg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-zinc-950 leading-tight">
                      {selectedMsg.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-zinc-600">{selectedMsg.email}</span>
                      <button
                        onClick={() => handleCopyEmail(selectedMsg.email)}
                        className="text-[#FF5400] hover:text-[#E04800] transition-colors p-1"
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
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-[#FF5400] text-zinc-900 hover:text-white border border-orange-500/20 text-[11px] font-bold font-mono uppercase flex items-center gap-1.5 transition-all shadow-2xs"
                    title="Deschide în Gmail"
                  >
                    <ExternalLink size={12} />
                    <span>Gmail</span>
                  </a>

                  <button
                    onClick={() => handleDeleteMessage(selectedMsg.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    title="Șterge mesaj"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Data & ID Transmisie */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 bg-orange-500/[0.04] p-2.5 rounded-xl border border-orange-500/15">
                <span>
                  TRANSMIS: {new Date(selectedMsg.created_at).toLocaleString("ro-RO")}
                </span>
                <span className="uppercase font-bold text-[#FF5400]">
                  STATUS: {selectedMsg.status === "replied" ? "SOLUȚIONAT" : "AȘTEAPTĂ RĂSPUNS"}
                </span>
              </div>

              {/* Conținut Mesaj Recepționat */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase text-[#FF5400] tracking-wider flex items-center gap-1">
                  <span>MESAJ CLIENT</span>
                </div>
                <div className="bg-orange-500/[0.02] p-4 sm:p-5 rounded-2xl border-2 border-orange-500/15 text-xs sm:text-sm leading-relaxed text-zinc-900 whitespace-pre-wrap font-sans shadow-2xs">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Istoric Răspuns Trimis (dacă există) */}
              {selectedMsg.reply_text && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
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
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-zinc-500">
                  <span className="flex items-center gap-1 text-[#FF5400]">
                    <Sparkles size={11} />
                    <span>Șabloane Rapide</span>
                  </span>
                  <span>1-CLICK INSERT</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyQuickTemplate("offer")}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-500/10 border border-orange-500/25 text-[11px] font-medium text-zinc-800 hover:text-[#FF5400] transition-all cursor-pointer shadow-2xs"
                  >
                    💼 Ofertă adaptată
                  </button>
                  <button
                    onClick={() => applyQuickTemplate("call")}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-500/10 border border-orange-500/25 text-[11px] font-medium text-zinc-800 hover:text-[#FF5400] transition-all cursor-pointer shadow-2xs"
                  >
                    📞 Programare apel 15m
                  </button>
                  <button
                    onClick={() => applyQuickTemplate("quick")}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-500/10 border border-orange-500/25 text-[11px] font-medium text-zinc-800 hover:text-[#FF5400] transition-all cursor-pointer shadow-2xs"
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
                    className="w-full bg-white border-2 border-orange-500/20 focus:border-[#FF5400] rounded-2xl p-4 text-xs sm:text-sm focus:outline-none text-zinc-950 placeholder-zinc-400 resize-none shadow-2xs font-sans transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    onClick={() => handleMarkAsReplied(selectedMsg.id)}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-zinc-600 hover:text-[#FF5400] hover:bg-orange-500/10 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Schimbă statusul fără a trimite email"
                  >
                    <CheckCircle2 size={13} />
                    <span>Doar marchează ca rezolvat</span>
                  </button>

                  <button
                    onClick={handleSendReply}
                    disabled={sending || !replyText.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-[#FF5400] hover:bg-[#E04800] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-[0_4px_16px_rgba(255,84,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,84,0,0.35)]"
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
              <Inbox size={36} className="mx-auto text-[#FF5400]" />
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Selectează un mesaj din fluxul din stânga pentru vizualizare completă.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}