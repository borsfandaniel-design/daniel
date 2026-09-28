"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Palette,
  Send,
  CalendarCheck,
  CheckCircle2,
  Mail,
  User,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  ArrowUpRight,
  MousePointer,
  Layers,
  Zap,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      const hoverEl = target?.closest("[data-cursor]");
      if (hoverEl) {
        setIsHovered(true);
        setCursorText(hoverEl.getAttribute("data-cursor") || "");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, 0.06), transparent 80%)`,
        }}
      />
      
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none hidden md:flex items-center justify-center rounded-full bg-[#ccff00] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.6)]"
        animate={{
          x: mousePos.x - (isHovered ? 40 : 6),
          y: mousePos.y - (isHovered ? 16 : 6),
          width: isHovered ? 80 : 12,
          height: isHovered ? 32 : 12,
          scale: isHovered ? 1 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.5 }}
      >
        {isHovered && <span className="px-2 truncate">{cursorText || "Vezi"}</span>}
      </motion.div>
    </>
  );
}

function AppleNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Despre", href: "#about" },
    { name: "Servicii", href: "#services" },
    { name: "Abilități", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08090a]/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          <a
            href="#"
            className="flex items-center gap-3 text-white hover:opacity-90 transition-all group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#181a20] to-[#0d0e12] border border-white/10 group-hover:border-[#ccff00]/50 transition-colors">
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="w-7 h-7 object-contain rounded-lg group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-[#ccff00] font-black text-lg">S</span>';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-base text-white group-hover:text-[#ccff00] transition-colors">
                SWING
              </span>
              <span className="text-[10px] text-white/50 tracking-widest uppercase font-semibold">
                Daniel Moisă
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center space-x-1 p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              data-cursor="Contact"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)]"
            >
              <span>Discută un proiect</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#ccff00] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0b0d] border-b border-white/10 px-6 py-6 space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-white/80 hover:text-[#ccff00] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#ccff00] text-black font-extrabold text-sm mt-4"
            >
              <span>Discută un proiect</span>
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const skillsList = [
    "Canva Pro",
    "Graphic Design",
    "Cold Emailing",
    "Appointment Setting",
    "Copywriting",
    "Lead Generation",
    "UI/UX Basics",
    "Social Media Strategy",
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#ccff00] selection:text-black font-sans antialiased overflow-x-hidden relative">
      <CustomCursor />
      <AppleNavbar />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#ccff00]/10 via-[#ccff00]/5 to-transparent blur-[120px] opacity-60" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#ccff00]/5 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <section id="about" className="scroll-mt-32">
          
          <div className="text-center mb-10 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-white/90 uppercase">
                Disponibil pentru proiecte & colaborări
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
            >
              Soluții Vizuale{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2ff66] to-[#ccff00]">
                Premium
              </span>{" "}
              & Outreach Strategic.
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-cursor="Swing"
              className="md:col-span-5 bg-gradient-to-b from-[#12141a] to-[#0c0d10] border border-white/10 hover:border-[#ccff00]/40 rounded-3xl p-8 flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)]"
            >
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">Daniel Moisă</h3>
                <p className="text-sm text-white/70 leading-relaxed font-normal">
                  (a.k.a. Swing) — Specialist în Graphic Design, Canva, Cold Outreach & Appointment Setting.
                </p>
              </div>

              <div className="pt-8 flex items-center gap-3 relative z-10">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#ccff00] hover:underline tracking-wider uppercase"
                >
                  <span>Contactează-mă</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-[#ccff00]/5 rounded-full blur-2xl group-hover:bg-[#ccff00]/10 transition-colors" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-cursor="Servicii"
              className="md:col-span-7 bg-gradient-to-b from-[#12141a] to-[#0c0d10] border border-white/10 hover:border-[#ccff00]/40 rounded-3xl p-8 flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 max-w-md">
                  <span className="text-[11px] font-extrabold text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/10 px-3 py-1 rounded-full border border-[#ccff00]/20 inline-block">
                    Direcție Principală
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    Transform ideile în materiale vizuale de impact și conversații calificate.
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 hidden sm:block">
                  <Target size={28} className="text-[#ccff00]" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs font-bold text-white">Visual Design</p>
                  <p className="text-[11px] text-white/50">Canva & Branding</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs font-bold text-white">Cold Outreach</p>
                  <p className="text-[11px] text-white/50">Lead Generation</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                  <p className="text-xs font-bold text-white">Appointment</p>
                  <p className="text-[11px] text-white/50">Closing & Setting</p>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        <section id="services" className="scroll-mt-32 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold tracking-widest text-[#ccff00] uppercase">
                Ce Ofer
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Servicii Principale
              </h2>
            </div>
            <p className="text-sm text-white/60 max-w-md">
              Apropiere strategică pentru afacerea ta: de la identitate vizuală la atragerea proactivă a clienților.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              data-cursor="Design"
              className="bg-gradient-to-b from-[#111318] to-[#0a0b0e] border border-white/10 hover:border-[#ccff00]/50 rounded-3xl p-8 space-y-6 flex flex-col justify-between group transition-all shadow-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.12)]"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00] group-hover:scale-110 transition-transform">
                  <Palette size={28} />
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#ccff00] transition-colors">
                  Graphic Design & Canva
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  Design vizual modern, identități de brand, postări Social Media și prezentări profesionale.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-semibold">
                <span>Visuals & Branding</span>
                <ArrowUpRight size={16} className="text-[#ccff00]" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              data-cursor="Outreach"
              className="bg-gradient-to-b from-[#111318] to-[#0a0b0e] border border-white/10 hover:border-[#ccff00]/50 rounded-3xl p-8 space-y-6 flex flex-col justify-between group transition-all shadow-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.12)]"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00] group-hover:scale-110 transition-transform">
                  <Send size={28} />
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#ccff00] transition-colors">
                  Cold Outreach
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  Strategii personalizate de contactare a clienților potențiali prin Email și Social Media.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-semibold">
                <span>Strategy & Contact</span>
                <ArrowUpRight size={16} className="text-[#ccff00]" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              data-cursor="Setting"
              className="bg-gradient-to-b from-[#111318] to-[#0a0b0e] border border-white/10 hover:border-[#ccff00]/50 rounded-3xl p-8 space-y-6 flex flex-col justify-between group transition-all shadow-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.12)]"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00] group-hover:scale-110 transition-transform">
                  <CalendarCheck size={28} />
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#ccff00] transition-colors">
                  Appointment Setting
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  Preluarea conversațiilor și programarea de întâlniri calificate pentru afacerea ta.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 font-semibold">
                <span>Lead Conversion</span>
                <ArrowUpRight size={16} className="text-[#ccff00]" />
              </div>
            </motion.div>

          </div>
        </section>

        <section id="skills" className="scroll-mt-32 space-y-8">
          <div className="bg-gradient-to-b from-[#12141a] to-[#0a0b0d] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            
            <div className="max-w-2xl space-y-3 mb-10">
              <span className="text-xs font-extrabold tracking-widest text-[#ccff00] uppercase">
                Competențe
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Abilități & Unelte
              </h2>
              <p className="text-sm text-white/60">
                Aparatura tehnologică și aptitudinile utilizate pentru livrarea rezultatelor.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {skillsList.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  data-cursor={skill}
                  className="px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#ccff00]/60 hover:bg-[#ccff00]/10 hover:text-[#ccff00] text-sm font-bold text-white/90 transition-all duration-200 cursor-pointer flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] opacity-60 group-hover:opacity-100" />
                  <span>{skill}</span>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        <section id="contact" className="scroll-mt-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-extrabold tracking-widest text-[#ccff00] uppercase">
                  Hai să vorbim
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                  Ai un proiect în minte?
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Trimite-mi un mesaj pentru colaborări, proiecte de graphic design sau strategii de cold outreach.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#111318] border border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 font-semibold">Contact Direct</p>
                    <p className="text-sm font-bold text-white">Daniel Moisă (Swing)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-[#ccff00] font-bold pt-2 border-t border-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                  <span>Răspund rapid la mesajele noi</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-gradient-to-b from-[#12141a] to-[#0b0c0f] border border-white/10 hover:border-white/20 transition-colors rounded-3xl p-8 sm:p-10 relative">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-white/80 uppercase tracking-wider">
                      Numele tău
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="ex. Alexandru Popescu"
                        className="w-full bg-[#08090b] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-white/80 uppercase tracking-wider">
                      Adresa de email
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ex. alex@companie.ro"
                        className="w-full bg-[#08090b] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-white/80 uppercase tracking-wider">
                    Mesajul tău
                  </label>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-4 top-4 text-white/30" />
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descrie pe scurt ce ai nevoie..."
                      className="w-full bg-[#08090b] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] resize-none transition-all"
                    />
                  </div>
                </div>

                {formStatus === "success" && (
                  <div className="p-4 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center gap-3 text-[#ccff00] text-sm font-semibold">
                    <CheckCircle2 size={18} />
                    <span>Mesajul a fost trimis cu succes!</span>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm font-semibold">
                    <AlertCircle size={18} />
                    <span>A apărut o eroare. Te rog să încerci din nou.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  data-cursor="Trimite"
                  className="w-full py-4 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_25px_rgba(204,255,0,0.25)] hover:shadow-[0_0_35px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2"
                >
                  <span>{formStatus === "submitting" ? "Se trimite..." : "Trimite Mesajul"}</span>
                  <ArrowUpRight size={18} />
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 py-10 relative z-10 bg-[#050607]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Swing (Daniel Moisă). Toate drepturile rezervate.</p>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#about" className="hover:text-white transition-colors">Despre</a>
            <a href="#services" className="hover:text-white transition-colors">Servicii</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* NEXO / REZNEX ENGINEERING NETWORK */