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
  X,
  ArrowUpRight,
  Target,
  Zap,
  ChevronRight,
  ShieldCheck,
  Scale,
  Terminal,
  Cpu
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
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-500 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(232, 255, 242, 0.05), transparent 80%)`,
        }}
      />
      
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none hidden md:flex items-center justify-center rounded-full bg-[#E8FFF2] text-[#075E46] font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(232,255,242,0.5)] border border-white/50"
        animate={{
          x: mousePos.x - (isHovered ? 48 : 6),
          y: mousePos.y - (isHovered ? 18 : 6),
          width: isHovered ? 96 : 12,
          height: isHovered ? 36 : 12,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.5 }}
      >
        {isHovered && <span className="px-2 truncate">{cursorText || "Explorează"}</span>}
      </motion.div>
    </>
  );
}

{/* NAVBAR ULTRA-FUTURISTIC & CLEAN (FĂRĂ BUTONUL DISCUTĂ ACUM) */}
function FuturisticNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["about", "services", "skills", "contact"];
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Despre", href: "#about", id: "about" },
    { name: "Servicii", href: "#services", id: "services" },
    { name: "Abilități", href: "#skills", id: "skills" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-5 transition-all duration-300 pointer-events-none flex justify-center">
        <div
          className={`relative max-w-3xl w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-500 pointer-events-auto ${
            isScrolled
              ? "bg-[#070A09]/85 border border-[#075E46]/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(7,94,70,0.25)]"
              : "bg-[#0B0F0D]/50 border border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* Futuristic Border Glow */}
          <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#075E46]/0 via-[#E8FFF2]/20 to-[#075E46]/0 opacity-50 blur-sm pointer-events-none" />

          {/* BRAND LOGO / IDENTITY */}
          <a
            href="#"
            className="flex items-center gap-3 pl-1 group relative z-10"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#075E46]/40 border border-[#E8FFF2]/30 backdrop-blur-xl group-hover:border-[#E8FFF2] transition-colors">
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="w-4 h-4 object-contain rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<span class="text-[#E8FFF2] font-black text-sm tracking-tighter">S</span>';
                  }
                }}
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8FFF2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8FFF2]"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-black tracking-[0.2em] text-xs text-white group-hover:text-[#E8FFF2] transition-colors">
                SWING
              </span>
              <span className="text-[8px] text-[#E8FFF2]/70 tracking-widest uppercase font-mono">
                DANIEL MOISĂ
              </span>
            </div>
          </a>

          {/* DESKTOP NAV - CLEAN & BALANCED (CENTRATA) */}
          <nav className="hidden md:flex items-center gap-1 relative z-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    isActive ? "text-[#075E46]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="futuristicTab"
                      className="absolute inset-0 bg-[#E8FFF2] rounded-full shadow-[0_0_15px_rgba(232,255,242,0.6)]"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* STATUS DISPLAY - FUTURISTIC MINIMAL BADGE */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#075E46]/30 border border-[#075E46]/60 text-[10px] font-mono text-[#E8FFF2] tracking-wider uppercase relative z-10">
            <Cpu size={12} className="text-[#E8FFF2] animate-pulse" />
            <span>ONLINE</span>
          </div>

          {/* TOGGLE MOBIL */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-[#075E46]/40 border border-[#075E46]/60 text-white hover:text-[#E8FFF2] transition-colors relative z-10"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* MENIU MOBIL OVERLAY FUTURISTIC */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="fixed inset-0 z-30 bg-[#070A09]/95 backdrop-blur-3xl md:hidden pt-28 px-6 pb-12 flex flex-col justify-between border-b border-[#075E46]/50"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono text-[#E8FFF2] tracking-widest uppercase bg-[#075E46]/40 px-3 py-1 rounded-full border border-[#075E46]/60">
                  SYSTEM // NAVIGATION
                </span>
                <span className="text-[10px] font-mono text-white/40">v2.6</span>
              </div>

              <div className="space-y-3">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#0B0F0D]/80 border border-[#075E46]/40 text-base font-bold text-white hover:text-[#E8FFF2] hover:border-[#E8FFF2]/40 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#E8FFF2]/50">0{idx + 1}</span>
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#E8FFF2]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                <span>STATUS: DISPONIBIL</span>
                <span>SWING STUDIO</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

{/* MODAL TERMENI SI CONDITII */}
function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0B0F0D] border border-[#075E46] rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(7,94,70,0.3)] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-[#075E46]/40 flex items-center justify-between bg-[#075E46]/20">
            <div className="flex items-center gap-3">
              <Scale className="text-[#E8FFF2]" size={22} />
              <div>
                <h3 className="text-base font-extrabold text-white tracking-wide">Termeni, Condiții și Cadrul Legal</h3>
                <p className="text-[10px] font-mono text-[#E8FFF2]/70">SWING Studio / Daniel Moisă</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-white/70 leading-relaxed font-normal custom-scrollbar">
            <div className="flex items-center justify-between bg-[#075E46]/20 p-4 rounded-2xl border border-[#075E46]/40 text-xs font-mono">
              <span className="text-[#E8FFF2] font-semibold flex items-center gap-2">
                <ShieldCheck size={16} /> Conformitate Legislație RO & UE
              </span>
              <span className="text-white/40">2026</span>
            </div>

            <section className="space-y-2">
              <h4 className="text-[#E8FFF2] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
                1. Cadru General și Identificarea Operatorului
              </h4>
              <p>
                Prezentul site este operat de <strong>Daniel Moisă (SWING)</strong>. Utilizarea site-ului, trimiterea de mesaje prin formularul de contact și contractarea serviciilor presupun acceptarea necondiționată a tuturor termenilor descriși în continuare.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-[#E8FFF2] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
                2. Serviciile Societății Informaționale (Legea nr. 365/2002)
              </h4>
              <p>
                În conformitate cu <strong>Legea nr. 365/2002 privind comerțul electronic</strong>, conținutul furnizat pe acest site web reprezintă o invitație la negociere B2B și informare comercială generală.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-[#E8FFF2] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
                3. Protecția Datelor cu Caracter Personal (GDPR UE 2016/679 & Legea nr. 190/2018)
              </h4>
              <p>
                Datele trimise prin formular (nume, adresă de email, mesaj) sunt procesate exclusiv în scopul furnizării de răspunsuri solicitărilor dumneavoastră și comunicării comerciale aferente.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-[#E8FFF2] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
                4. Dreptul de Autor și Proprietatea Intelectuală (Legea nr. 8/1996)
              </h4>
              <p>
                Toate materialele grafice, conceptele vizuale, codul sursă, elementele UI/UX și brand-ul "SWING" sunt protejate de <strong>Legea nr. 8/1996 privind dreptul de autor</strong>.
              </p>
            </section>
          </div>

          <div className="px-6 py-4 border-t border-[#075E46]/30 flex items-center justify-between bg-[#075E46]/10">
            <span className="text-[11px] font-mono text-white/50 hidden sm:inline">
              [CONFIRMATION_REQUIRED]
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#E8FFF2] text-[#075E46] font-black text-xs uppercase tracking-wider hover:bg-white transition-colors ml-auto"
            >
              Am Înțeles și Accept
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", acceptedTerms: false });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [termsOpen, setTermsOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert("Te rugăm să bifezi acordul pentru Termeni și Condiții pentru a trimite mesajul.");
      return;
    }

    setFormStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "", acceptedTerms: false });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const servicesList = [
    {
      num: "01",
      title: "Graphic Design & Canva Pro",
      desc: "Materiale vizuale moderne, pitch deck-uri, bannere promoționale și vizualuri social media concepute pentru a converti.",
      icon: <Palette size={24} className="text-[#E8FFF2]" />,
      tag: "Design"
    },
    {
      num: "02",
      title: "Cold Emailing & Outreach",
      desc: "Campanii strategice de cold email, redactare de script-uri persuasive și infrastructură optimizată pentru rata de livrare.",
      icon: <Send size={24} className="text-[#E8FFF2]" />,
      tag: "Outreach"
    },
    {
      num: "03",
      title: "Appointment Setting",
      desc: "Transformarea lead-urilor reci în întâlniri de afaceri calificate direct în calendarul tău.",
      icon: <CalendarCheck size={24} className="text-[#E8FFF2]" />,
      tag: "Vânzări"
    },
  ];

  const skillsList = [
    "Canva Pro",
    "Graphic Design",
    "Cold Outreach",
    "Appointment Setting",
    "Copywriting Persuasiv",
    "Generare Lead-uri",
    "UI/UX Visuals",
    "Social Media Branding",
  ];

  return (
    <div className="min-h-screen bg-[#070A09] text-white selection:bg-[#E8FFF2] selection:text-[#075E46] font-sans antialiased overflow-x-hidden relative">
      <CustomCursor />
      <FuturisticNavbar />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* BACKGROUND SCI-FI MESH & AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `linear-gradient(#075E46 1px, transparent 1px), linear-gradient(to right, #075E46 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} 
        />
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#075E46]/20 blur-[180px] rounded-full" />
        <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] bg-[#075E46]/15 blur-[170px] rounded-full" />
      </div>

      <main className="relative z-10 pt-32 sm:pt-40 pb-32 px-6 sm:px-8 max-w-6xl mx-auto space-y-36 md:space-y-44">
        
        {/* HERO SECTION */}
        <section id="about" className="scroll-mt-40 space-y-12">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#075E46]/30 border border-[#075E46]/60 backdrop-blur-xl shadow-[0_0_20px_rgba(7,94,70,0.3)]"
            >
              <Zap size={13} className="text-[#E8FFF2]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#E8FFF2] uppercase">
                SYSTEM ACTIVE // AVAILABLE FOR PROJECTS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]"
            >
              Design Vizual High-End &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8FFF2] via-emerald-200 to-[#075E46]">
                Cold Outreach
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              Ajut brandurile și companiile să se remarce prin estetică impecabilă și să își crească vânzările prin campanii de outreach bine calibrate.
            </motion.p>
          </div>

          {/* BENTO GRID HERO */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
            
            {/* Card Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-cursor="Swing"
              className="md:col-span-5 bg-gradient-to-b from-[#075E46]/20 to-[#0B0F0D] border border-[#075E46]/50 hover:border-[#E8FFF2]/40 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 shadow-xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#075E46]/40 border border-[#E8FFF2]/30 flex items-center justify-center text-[#E8FFF2] shadow-lg">
                    <Sparkles size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-[#E8FFF2]/60">[PROFILE]</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white">Daniel Moisă</h3>
                  <p className="text-xs font-mono font-bold text-[#E8FFF2] tracking-widest uppercase">SWING STUDIO</p>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-normal">
                  Pasionat de minimalism, estetică curată și strategie digitală orientată spre rezultate clare.
                </p>
              </div>

              <div className="pt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#075E46]/40 hover:bg-[#E8FFF2] text-[#E8FFF2] hover:text-[#075E46] text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border border-[#075E46]"
                >
                  <span>Hai să vorbim</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Card Objective */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-cursor="Misiune"
              className="md:col-span-7 bg-gradient-to-b from-[#075E46]/20 to-[#0B0F0D] border border-[#075E46]/50 hover:border-[#E8FFF2]/40 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-lg">
                  <span className="text-[10px] font-mono font-bold text-[#E8FFF2] uppercase tracking-widest bg-[#075E46]/50 px-3.5 py-1.5 rounded-full border border-[#E8FFF2]/20 inline-block">
                    [TARGET_MISSION]
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    Transformă atenția privitorilor în oportunități reale de afaceri.
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[#E8FFF2] hidden sm:block">
                  <Target size={26} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-10">
                <div className="p-4 rounded-2xl bg-[#070A09]/90 border border-[#075E46]/40 text-center space-y-1">
                  <p className="text-xl font-black text-[#E8FFF2]">100%</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Atenție Detalii</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070A09]/90 border border-[#075E46]/40 text-center space-y-1">
                  <p className="text-xl font-black text-[#E8FFF2]">Fast</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Livrabile Rapide</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070A09]/90 border border-[#075E46]/40 text-center space-y-1">
                  <p className="text-xl font-black text-[#E8FFF2]">B2B</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Focus Rezultate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SERVICII */}
        <section id="services" className="scroll-mt-40 space-y-12">
          <div className="flex items-end justify-between border-b border-[#075E46]/30 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#E8FFF2] uppercase tracking-widest">
                // 01. SERVICII
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Cu ce te pot ajuta
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesList.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                data-cursor="Serviciu"
                className="bg-gradient-to-b from-[#075E46]/15 to-[#070A09] border border-[#075E46]/50 hover:border-[#E8FFF2]/50 rounded-[2rem] p-8 flex flex-col justify-between group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(7,94,70,0.25)] relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#075E46]/40 border border-[#E8FFF2]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#E8FFF2]/70 uppercase tracking-widest bg-[#075E46]/30 px-3 py-1 rounded-full border border-[#075E46]/50">
                      [{service.num}] {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#E8FFF2] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABILITATI */}
        <section id="skills" className="scroll-mt-40 space-y-10">
          <div className="space-y-2 border-b border-[#075E46]/30 pb-6">
            <span className="text-xs font-mono font-bold text-[#E8FFF2] uppercase tracking-widest">
              // 02. CAPABILITĂȚI
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Abilități & Stack
            </h2>
          </div>

          <div className="flex flex-wrap gap-3.5">
            {skillsList.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                data-cursor="Skill"
                className="px-6 py-3.5 rounded-2xl bg-[#075E46]/20 border border-[#075E46]/50 hover:border-[#E8FFF2] hover:bg-[#075E46]/40 text-white/90 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-40">
          <div className="bg-gradient-to-b from-[#075E46]/25 to-[#070A09] border border-[#075E46]/60 rounded-[2.5rem] p-8 sm:p-14 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-8 relative z-10">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#E8FFF2] uppercase tracking-widest">
                  // 03. TRANSMITE UN MESAJ
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  Începe o colaborare
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Scrie-mi un mesaj și îți voi răspunde în cel mai scurt timp posibil.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                      Nume Complete
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Numele tău"
                        className="w-full bg-[#070A09]/90 border border-[#075E46]/60 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FFF2] transition-colors pl-12"
                      />
                      <User size={18} className="absolute left-4 top-3.5 text-[#E8FFF2]/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                      Adresă Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="adresa@email.com"
                        className="w-full bg-[#070A09]/90 border border-[#075E46]/60 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FFF2] transition-colors pl-12"
                      />
                      <Mail size={18} className="absolute left-4 top-3.5 text-[#E8FFF2]/60" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                    Detalii Proiect / Solicitare
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detalii despre proiectul tău..."
                      className="w-full bg-[#070A09]/90 border border-[#075E46]/60 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FFF2] transition-colors pl-12 pt-3.5 resize-none"
                    />
                    <MessageSquare size={18} className="absolute left-4 top-3.5 text-[#E8FFF2]/60" />
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-[#075E46] bg-[#070A09] text-[#075E46] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-white/60 leading-normal cursor-pointer select-none">
                    Sunt de acord cu prelucrarea datelor personale conform GDPR și am citit{" "}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="text-[#E8FFF2] underline hover:text-white font-semibold transition-colors"
                    >
                      Termenii, Condițiile și Cadrul Legal
                    </button>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#E8FFF2] hover:bg-white text-[#075E46] font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(232,255,242,0.25)] hover:shadow-[0_0_30px_rgba(232,255,242,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-0.5"
                >
                  {formStatus === "submitting" ? (
                    <span>Se trimite...</span>
                  ) : (
                    <>
                      <span>Trimite Mesajul</span>
                      <Send size={15} />
                    </>
                  )}
                </button>

                {formStatus === "success" && (
                  <div className="flex items-center gap-2.5 text-[#E8FFF2] text-sm font-semibold pt-2">
                    <CheckCircle2 size={18} />
                    <span>Mesajul a fost trimis cu succes! Îți voi răspunde curând.</span>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-center gap-2.5 text-red-400 text-sm font-semibold pt-2">
                    <AlertCircle size={18} />
                    <span>A apărut o eroare. Te rog să încerci din nou.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#075E46]/30 py-10 px-6 sm:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40 font-mono">
        <p>© {new Date().getFullYear()} SWING (Daniel Moisă). All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button onClick={() => setTermsOpen(true)} className="hover:text-[#E8FFF2] transition-colors">
            Termeni & Condiții Legal
          </button>
          <button onClick={() => setTermsOpen(true)} className="hover:text-[#E8FFF2] transition-colors">
            Confidențialitate GDPR
          </button>
          <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E8FFF2] transition-colors">
            ANPC
          </a>
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="hover:text-[#E8FFF2] transition-colors">
            Platforma SOL (UE)
          </a>
        </div>
      </footer>
    </div>
  );
}