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
  FileText,
  ShieldCheck
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
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, 0.04), transparent 80%)`,
        }}
      />
      
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none hidden md:flex items-center justify-center rounded-full bg-[#ccff00] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_25px_rgba(204,255,0,0.5)]"
        animate={{
          x: mousePos.x - (isHovered ? 44 : 6),
          y: mousePos.y - (isHovered ? 18 : 6),
          width: isHovered ? 88 : 12,
          height: isHovered ? 36 : 12,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.6 }}
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-[#07080a]/70 backdrop-blur-2xl border-b border-white/[0.08] py-4 shadow-2xl"
          : "bg-transparent py-7"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-12">
          
          <a
            href="#"
            className="flex items-center gap-3 text-white hover:opacity-90 transition-all group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#16181f] to-[#0c0d11] border border-white/10 group-hover:border-[#ccff00]/40 transition-colors shadow-lg">
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="w-7 h-7 object-contain rounded-lg group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<span class="text-[#ccff00] font-black text-xl">S</span>';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-wider text-lg text-white group-hover:text-[#ccff00] transition-colors">
                SWING
              </span>
              <span className="text-[10px] text-white/40 tracking-widest uppercase font-semibold">
                Daniel Moisă
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center space-x-2 p-1.5 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              data-cursor="Contact"
              className="relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs tracking-wide transition-all shadow-[0_0_25px_rgba(204,255,0,0.2)] hover:shadow-[0_0_35px_rgba(204,255,0,0.35)] hover:-translate-y-0.5"
            >
              <span>Discută un proiect</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:text-[#ccff00] transition-colors"
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
            className="md:hidden bg-[#0a0b0d]/95 backdrop-blur-2xl border-b border-white/10 px-8 py-8 space-y-5"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-white/80 hover:text-[#ccff00] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#ccff00] text-black font-extrabold text-sm mt-6 shadow-lg"
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

{/* MODAL TERMENI SI CONDITII */}
function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0e1015] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header Modal */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <FileText className="text-[#ccff00]" size={22} />
              <h3 className="text-lg font-extrabold text-white">Termeni și Condiții Legal</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Continut Modal */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-white/70 leading-relaxed font-normal custom-scrollbar">
            <p className="text-xs text-white/40">Ultima actualizare: Septembrie 2026</p>

            <section className="space-y-2">
              <h4 className="text-white font-bold text-base">1. Introducere și Dispoziții Generale</h4>
              <p>
                Prezentul site web este administrat de Daniel Moisă (SWING). Prin accesarea și utilizarea acestui landing page, vă exprimați acordul expres cu privire la termenii și condițiile descrise mai jos. Acești termeni sunt redactați în conformitate cu legislația din România și Regulamentele Europene în vigoare (Regulamentul GDPR 2016/679, OUG 34/2014 și Directiva Omnibus).
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-white font-bold text-base">2. Servicii Oferite</h4>
              <p>
                SWING furnizează servicii profesionale B2B de Graphic Design (Canva Pro), Cold Outreach / Email Marketing și Appointment Setting. Informațiile prezentate pe site au caracter informativ și nu constituie o ofertă contractuală fermă până la încheierea unui acord formal sau contract de prestări servicii între părți.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-white font-bold text-base">3. Drepturi de Proprietate Intelectuală</h4>
              <p>
                Toate materialele vizuale, elementele de design, conceptele, logo-urile și conținutul text de pe acest site aparțin Daniel Moisă (SWING) și sunt protejate de Legea nr. 8/1996 privind dreptul de autor. Este interzisă copierea, reproducerea sau distribuirea conținutului fără acordul scris prealabil.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-white font-bold text-base">4. Protecția Datelor cu Caracter Personal (GDPR)</h4>
              <p>
                Conform Regulamentului (UE) 2016/679, colectăm date personale (nume, adresă de email) exclusiv prin intermediul formularului de contact pentru a răspunde solicitărilor dumneavoastră. Datele dumneavoastră nu vor fi vândute, închiriate sau înstrăinate către terți fără consimțământul explicit. Puteți solicita oricând ștergerea sau modificarea datelor trimitând un mesaj pe adresa de contact.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-white font-bold text-base">5. Limitarea Răspunderii</h4>
              <p>
                Ne străduim ca informațiile oferite pe site să fie corecte și actualizate. Totuși, nu ne asumăm răspunderea pentru eventuale erori tehnice de funcționare a site-ului sau pentru interpretările eronate ale materialelor prezentate.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-white font-bold text-base">6. Soluționarea Litigiilor</h4>
              <p>
                Orice neînțelegere sau litigiu decurgând din utilizarea site-ului va fi soluționat pe cale amiabilă. În cazul în care acest lucru nu este posibil, competența revine instanțelor judecătorești competente din România. Consumatorii au dreptul de a apela la platformele ANPC (Autoritatea Națională pentru Protecția Consumatorilor) și SOL (Soluționarea Online a Litigiilor).
              </p>
            </section>
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 border-t border-white/10 flex justify-end bg-white/[0.02]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors"
            >
              Am Înțeles
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
      alert("Te rugăm să accepți Termenii și Condițiile pentru a continua.");
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
      title: "Graphic Design & Canva Pro",
      desc: "Creare de vizualuri atractive pentru social media, prezentări, bannere și materiale promoționale cu impact vizual de lungă durată.",
      icon: <Palette size={26} className="text-[#ccff00]" />,
    },
    {
      title: "Cold Emailing & Outreach",
      desc: "Strategii personalizate de cold outreach, redactare de script-uri persuasive și generare de lead-uri ultra-calificate.",
      icon: <Send size={26} className="text-[#ccff00]" />,
    },
    {
      title: "Appointment Setting",
      desc: "Setare de întâlniri calificate pentru afacerea ta, transformând posibilii clienți în oportunități reale și constante de vânzare.",
      icon: <CalendarCheck size={26} className="text-[#ccff00]" />,
    },
  ];

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
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-[#ccff00]/8 via-[#ccff00]/3 to-transparent blur-[160px] opacity-70" />
        <div className="absolute top-[45%] right-[-10%] w-[600px] h-[600px] bg-[#ccff00]/3 rounded-full blur-[180px]" />
      </div>

      <main className="relative z-10 pt-36 sm:pt-48 pb-32 px-6 sm:px-8 max-w-6xl mx-auto space-y-36 md:space-y-48">
        
        {/* SECTIUNEA DESPRE / HERO */}
        <section id="about" className="scroll-mt-40 space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-white/80 uppercase">
                Disponibil pentru proiecte & colaborări
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.12]"
            >
              Soluții Vizuale{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2ff66] to-[#ccff00]">
                Premium
              </span>{" "}
              & Outreach Strategic.
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-cursor="Swing"
              className="md:col-span-5 bg-gradient-to-b from-[#111319] to-[#0b0c0e] border border-white/10 hover:border-[#ccff00]/30 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 hover:shadow-[0_0_40px_rgba(204,255,0,0.08)]"
            >
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                  <Sparkles size={26} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Daniel Moisă</h3>
                  <p className="text-sm font-semibold text-[#ccff00]/80 tracking-wider uppercase">a.k.a. Swing</p>
                </div>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed font-normal pt-2">
                  Specialist în Graphic Design, Canva, Cold Outreach & Appointment Setting. Pasionat de estetică curată și conversii reale.
                </p>
              </div>

              <div className="pt-10 flex items-center gap-3 relative z-10">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#ccff00] hover:text-white tracking-widest uppercase transition-colors"
                >
                  <span>Contactează-mă</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-[#ccff00]/5 rounded-full blur-3xl group-hover:bg-[#ccff00]/10 transition-colors" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-cursor="Servicii"
              className="md:col-span-7 bg-gradient-to-b from-[#111319] to-[#0b0c0e] border border-white/10 hover:border-[#ccff00]/30 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 hover:shadow-[0_0_40px_rgba(204,255,0,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-lg">
                  <span className="text-[11px] font-extrabold text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/10 px-3.5 py-1.5 rounded-full border border-[#ccff00]/20 inline-block">
                    Direcție Principală
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    Transform ideile în materiale vizuale de impact și conversații calificate.
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hidden sm:block">
                  <Target size={30} className="text-[#ccff00]" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-12">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-xs font-bold text-white">Visual Design</p>
                  <p className="text-[11px] text-white/40">Canva & Branding</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-xs font-bold text-white">Cold Email</p>
                  <p className="text-[11px] text-white/40">Lead Gen & Copy</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1 space-y-1">
                  <p className="text-xs font-bold text-white">Appointment</p>
                  <p className="text-[11px] text-white/40">Setting & Sales</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTIUNEA SERVICII */}
        <section id="services" className="scroll-mt-40 space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-[#ccff00] uppercase tracking-widest">
              Ce Pot Face Pentru Tine
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Serviciile Mele
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesList.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                data-cursor="Detalii"
                className="bg-gradient-to-b from-[#111319] to-[#0b0c0e] border border-white/10 hover:border-[#ccff00]/40 rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(204,255,0,0.08)]"
              >
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#ccff00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTIUNEA ABILITATI */}
        <section id="skills" className="scroll-mt-40 space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-[#ccff00] uppercase tracking-widest">
              Expertiză
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Abilități & Instrumente
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {skillsList.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                data-cursor="Skill"
                className="px-6 py-3.5 rounded-2xl bg-[#111319] border border-white/10 hover:border-[#ccff00]/50 hover:bg-[#ccff00]/10 text-white/90 font-semibold text-sm transition-all duration-300 cursor-default shadow-sm"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTIUNEA CONTACT */}
        <section id="contact" className="scroll-mt-40">
          <div className="bg-gradient-to-b from-[#111319] to-[#0b0c0e] border border-white/10 rounded-[2.5rem] p-8 sm:p-16 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-10 relative z-10">
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-[#ccff00] uppercase tracking-widest">
                  Să colaborăm
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  Ai un proiect în minte?
                </h2>
                <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                  Trimite-mi un mesaj și hai să discutăm despre cum te pot ajuta să îți atingi obiectivele.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      Nume
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Numele tău"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ccff00] transition-colors pl-12"
                      />
                      <User size={18} className="absolute left-4 top-4 text-white/30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="adresa@email.com"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ccff00] transition-colors pl-12"
                      />
                      <Mail size={18} className="absolute left-4 top-4 text-white/30" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Mesaj
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descrie pe scurt ce ai nevoie..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ccff00] transition-colors pl-12 pt-4 resize-none"
                    />
                    <MessageSquare size={18} className="absolute left-4 top-4 text-white/30" />
                  </div>
                </div>

                {/* Bifa de acord GDPR / Termeni */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#ccff00] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-white/50 leading-normal cursor-pointer select-none">
                    Sunt de acord cu prelucrarea datelor cu caracter personal și am citit{" "}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="text-[#ccff00] underline hover:text-white transition-colors"
                    >
                      Termenii și Condițiile
                    </button>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(204,255,0,0.2)] hover:shadow-[0_0_35px_rgba(204,255,0,0.35)] flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-0.5"
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
                  <div className="flex items-center gap-2.5 text-green-400 text-sm font-semibold pt-2">
                    <CheckCircle2 size={18} />
                    <span>Mesajul a fost trimis cu succes! Îți voi răspunde în cel mai scurt timp.</span>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-center gap-2.5 text-red-400 text-sm font-semibold pt-2">
                    <AlertCircle size={18} />
                    <span>A apărut o eroare. Te rog să încerci din nou mai târziu.</span>
                  </div>
                )}
              </form>
            </div>

            <div className="absolute right-[-120px] bottom-[-120px] w-[450px] h-[450px] bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

      </main>

      {/* FOOTER CU LINK-URI LEGALE */}
      <footer className="border-t border-white/[0.08] py-12 px-6 sm:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40">
        <p>© {new Date().getFullYear()} SWING (Daniel Moisă). Toate drepturile rezervate.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">
            Termeni & Condiții
          </button>
          <button onClick={() => setTermsOpen(true)} className="hover:text-white transition-colors">
            Confidențialitate (GDPR)
          </button>
          <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            ANPC
          </a>
        </div>
      </footer>
    </div>
  );
}