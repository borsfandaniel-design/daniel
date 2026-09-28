"use client";

import React, { useState, useEffect } from "react";
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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- NAVBAR COMPONENT MĂRIT CU LOGO SWING ---
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-1"
          : "bg-black/50 backdrop-blur-md py-2"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16 text-sm font-medium text-white/80">
          
          {/* LOGO SWING (logo.png) */}
          <a href="#" className="flex items-center gap-3 text-white hover:opacity-80 transition-all group">
            <img
              src="/logo.png"
              alt="Swing Logo"
              className="w-10 h-10 object-contain rounded-xl group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold tracking-widest text-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] bg-clip-text text-transparent">
              SWING
            </span>
          </a>

          {/* LINK-URI DESKTOP */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* BUTON MOBIL */}
          <div className="flex items-center text-white/80">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENIU MOBIL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 px-8 py-8 space-y-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-white/90 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- MAIN PAGE ---
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

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white selection:bg-[#FF5722] selection:text-white font-sans antialiased overflow-x-hidden scroll-smooth">
      <AppleNavbar />

      {/* HERO / DESPRE SECTION */}
      <section id="about" className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5722]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[#FF5722]" />
            <span className="text-xs font-semibold tracking-wide text-white/90">
              Disponibil pentru proiecte & colaborări
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]"
          >
            Soluții Vizuale{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] to-[#FF9800]">
              Premium & Outreach
            </span>{" "}
            Strategic
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 leading-relaxed font-normal"
          >
            Daniel Moisă (a.k.a. Swing) — Specialist în Graphic Design, Canva, Cold Outreach & Appointment Setting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5722] hover:bg-[#FF6D00] text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(255,87,34,0.4)] text-center"
            >
              Discută un proiect
            </a>
          </motion.div>
        </div>
      </section>

      {/* SERVICII SECTION */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold tracking-widest text-[#FF5722] uppercase">Ce Ofer</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Servicii Principale</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#161920] border border-white/10 rounded-2xl p-8 space-y-4 hover:border-[#FF5722]/50 transition-colors">
            <Palette className="w-10 h-10 text-[#FF5722]" />
            <h3 className="text-xl font-bold text-white">Graphic Design & Canva</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Design vizual modern, identități de brand, postări Social Media și prezentări profesionale.
            </p>
          </div>

          <div className="bg-[#161920] border border-white/10 rounded-2xl p-8 space-y-4 hover:border-[#FF5722]/50 transition-colors">
            <Send className="w-10 h-10 text-[#FF5722]" />
            <h3 className="text-xl font-bold text-white">Cold Outreach</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Strategii personalizate de contactare a clienților potențiali prin Email și Social Media.
            </p>
          </div>

          <div className="bg-[#161920] border border-white/10 rounded-2xl p-8 space-y-4 hover:border-[#FF5722]/50 transition-colors">
            <CalendarCheck className="w-10 h-10 text-[#FF5722]" />
            <h3 className="text-xl font-bold text-white">Appointment Setting</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Preluarea conversațiilor și programarea de întâlniri calificate pentru afacerea ta.
            </p>
          </div>
        </div>
      </section>

      {/* ABILITATI SECTION */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold tracking-widest text-[#FF5722] uppercase">Competențe</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Abilități & Unelte</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {["Canva Pro", "Graphic Design", "Cold Emailing", "Appointment Setting", "Copywriting", "Lead Generation", "UI/UX Basics", "Social Media Strategy"].map((skill) => (
            <span key={skill} className="px-5 py-2.5 rounded-xl bg-[#161920] border border-white/10 text-sm font-medium text-white/90">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/5">
        <div className="bg-[#161920] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold tracking-widest text-[#FF5722] uppercase">Hai să vorbim</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Trimite-mi un Mesaj</h2>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">Numele tău</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex. Alexandru Popescu"
                    className="w-full bg-[#0d0f12] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">Adresa de email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ex. alex@companie.ro"
                    className="w-full bg-[#0d0f12] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">Mesajul tău</label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-4 top-4 text-white/30" />
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descrie pe scurt ce ai nevoie..."
                  className="w-full bg-[#0d0f12] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#FF5722] resize-none"
                />
              </div>
            </div>

            {formStatus === "success" && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
                <CheckCircle2 size={18} />
                <span>Mesajul a fost trimis cu succes!</span>
              </div>
            )}

            {formStatus === "error" && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
                <AlertCircle size={18} />
                <span>A apărut o eroare. Te rog să încerci din nou.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="w-full py-4 rounded-xl bg-[#FF5722] hover:bg-[#FF6D00] text-white font-bold text-sm transition-all disabled:opacity-50"
            >
              {formStatus === "submitting" ? "Se trimite..." : "Trimite Mesajul"}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Swing (Daniel Moisă). Toate drepturile rezervate.
      </footer>
    </div>
  );
}