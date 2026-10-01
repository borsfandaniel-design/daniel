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
  Globe,
  Cpu,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

//--- DICȚIONAR PENTRU TRADUCERI (RO / EN) ---
const translations = {
  ro: {
    navAbout: "Despre",
    navServices: "Servicii",
    navSkills: "Abilități",
    navContact: "Contact",
    systemActive: "SISTEM ACTIV // DISPONIBIL PENTRU PROIECTE",
    heroTitlePart1: "Design Vizual High-End & ",
    heroTitlePart2: "Cold Outreach",
    heroSubtitle: "Ajut brandurile și companiile să se remarce prin estetică impecabilă și să își crească vânzările prin campanii de outreach bine calibrate.",
    profileName: "Daniel Moisă",
    profileRole: "SWING STUDIO",
    profileBio: "Pasionat de minimalism, estetică curată și strategie digitală orientată spre rezultate clare.",
    talkBtn: "Hai să vorbim",
    missionTitle: "Transformă atenția privitorilor în oportunități reale de afaceri.",
    statAttention: "Atenție Detalii",
    statFast: "Livrabile Rapide",
    statFocus: "Focus Rezultate",
    servicesTagline: "// 01. SERVICII",
    servicesHeader: "Cu ce te pot ajuta",
    serv1Title: "Graphic Design & Canva Pro",
    serv1Desc: "Materiale vizuale moderne, pitch deck-uri, bannere promoționale și vizualuri social media concepute pentru a converti.",
    serv2Title: "Cold Emailing & Outreach",
    serv2Desc: "Campanii strategice de cold email, redactare de script-uri persuasive și infrastructură optimizată pentru rata de livrare.",
    serv3Title: "Appointment Setting",
    serv3Desc: "Transformarea lead-urilor reci în întâlniri de afaceri calificate direct în calendarul tău.",
    skillsTagline: "// 02. CAPABILITATI",
    skillsHeader: "Abilități & Stack",
    contactTagline: "// 03. TRANSMITE UN MESAJ",
    contactHeader: "Începe o colaborare",
    contactSubtitle: "Scrie-mi un mesaj și îți voi răspunde în cel mai scurt timp posibil.",
    fieldName: "Nume Complet",
    fieldEmail: "Adresă Email",
    fieldMessage: "Detalii Proiect / Solicitare",
    placeholderName: "Numele tău",
    placeholderEmail: "adresa@email.com",
    placeholderMessage: "Detalii despre proiectul tău...",
    termsCheckbox: "Sunt de acord cu prelucrarea datelor personale conform GDPR și am citit",
    termsLink: "Termenii, Condițiile și Cadrul Legal",
    sendBtn: "Trimite Mesajul",
    sendingBtn: "Se trimite...",
    successMsg: "Mesajul a fost trimis cu succes! Îți voi răspunde curând.",
    errorMsg: "A apărut o eroare. Te rog să încerci din nou.",
    alertTerms: "Te rugăm să bifezi acordul pentru Termeni și Condiții pentru a trimite mesajul.",
    termsTitle: "Termeni, Condiții și Cadrul Legal",
    termsUnderstandBtn: "Am Înțeles și Accept",
    footerRights: "All rights reserved."
  },
  en: {
    navAbout: "About",
    navServices: "Services",
    navSkills: "Skills",
    navContact: "Contact",
    systemActive: "SYSTEM ACTIVE // AVAILABLE FOR PROJECTS",
    heroTitlePart1: "High-End Visual Design & ",
    heroTitlePart2: "Cold Outreach",
    heroSubtitle: "I help brands and companies stand out with clean aesthetics and boost their sales with well-calibrated outreach campaigns.",
    profileName: "Daniel Moisă",
    profileRole: "SWING STUDIO",
    profileBio: "Passionate about minimalism, clean aesthetics, and digital strategy focused on clear results.",
    talkBtn: "Let's talk",
    missionTitle: "Turn viewer attention into real business opportunities.",
    statAttention: "Detail Focus",
    statFast: "Fast Delivery",
    statFocus: "Results Driven",
    servicesTagline: "// 01. SERVICES",
    servicesHeader: "How I can help you",
    serv1Title: "Graphic Design & Canva Pro",
    serv1Desc: "Modern visual materials, pitch decks, promotional banners, and social media visuals crafted to convert.",
    serv2Title: "Cold Emailing & Outreach",
    serv2Desc: "Strategic cold email campaigns, persuasive scriptwriting, and deliverability-optimized infrastructure.",
    serv3Title: "Appointment Setting",
    serv3Desc: "Converting cold leads into qualified business meetings booked directly into your calendar.",
    skillsTagline: "// 02. CAPABILITIES",
    skillsHeader: "Skills & Tech Stack",
    contactTagline: "// 03. SEND A MESSAGE",
    contactHeader: "Start a project",
    contactSubtitle: "Drop me a message and I will get back to you as soon as possible.",
    fieldName: "Full Name",
    fieldEmail: "Email Address",
    fieldMessage: "Project Details / Request",
    placeholderName: "Your name",
    placeholderEmail: "address@email.com",
    placeholderMessage: "Details about your project...",
    termsCheckbox: "I agree to personal data processing under GDPR and I have read the ",
    termsLink: "Terms, Conditions & Legal Framework",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    successMsg: "Message sent successfully! I will reply soon.",
    errorMsg: "An error occurred. Please try again.",
    alertTerms: "Please check the Terms & Conditions agreement to send your message.",
    termsTitle: "Terms, Conditions & Legal Framework",
    termsUnderstandBtn: "Understood & Accepted",
    footerRights: "All rights reserved."
  }
};

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
        {isHovered && <span className="px-2 truncate">{cursorText || "Explore"}</span>}
      </motion.div>
    </>
  );
}

function FuturisticNavbar({ lang, setLang }: { lang: "ro" | "en"; setLang: (l: "ro" | "en") => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

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
    { name: t.navAbout, href: "#about", id: "about" },
    { name: t.navServices, href: "#services", id: "services" },
    { name: t.navSkills, href: "#skills", id: "skills" },
    { name: t.navContact, href: "#contact", id: "contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-5 transition-all duration-300 pointer-events-none flex justify-center">
        <div
          className={`relative max-w-4xl w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all duration-500 pointer-events-auto ${
            isScrolled
              ? "bg-[#070A09]/85 border border-[#075E46]/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(7,94,70,0.25)]"
              : "bg-[#0B0F0D]/50 border border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          }`}
        >
          <div className="absolute inset-[1px] rounded-full bg-gradient-to-r from-[#075E46]/0 via-[#E8FFF2]/20 to-[#075E46]/0 opacity-50 blur-sm pointer-events-none" />
          
          <a href="#" className="flex items-center gap-3 pl-1 group relative z-10">
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

          <nav className="hidden md:flex items-center gap-1 relative z-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
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

          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center bg-[#070A09]/90 border border-[#075E46]/70 rounded-full p-1 relative shadow-inner">
              <Globe size={13} className="text-[#E8FFF2]/70 ml-1.5 mr-1 hidden sm:block" />
              <button
                onClick={() => setLang("ro")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors ${
                  lang === "ro" ? "text-[#075E46]" : "text-white/50 hover:text-white"
                }`}
              >
                {lang === "ro" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#E8FFF2] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">RO</span>
              </button>
              <button
                onClick={() => setLang("en")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors ${
                  lang === "en" ? "text-[#075E46]" : "text-white/50 hover:text-white"
                }`}
              >
                {lang === "en" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#E8FFF2] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#075E46]/30 border border-[#075E46]/60 text-[10px] font-mono text-[#E8FFF2] tracking-wider uppercase">
              <Cpu size={12} className="text-[#E8FFF2] animate-pulse" />
              <span>ONLINE</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#075E46]/40 border border-[#075E46]/60 text-white hover:text-[#E8FFF2] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
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
                    key={link.id}
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
                <span>STATUS: ONLINE</span>
                <span>SWING STUDIO</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

{/* NOUA PAGINĂ DEDICATĂ PENTRU TERMENI ȘI CONDIȚII */}
function TermsPage({ onBack, lang, setLang }: { onBack: () => void; lang: "ro" | "en"; setLang: (l: "ro" | "en") => void }) {
  const t = translations[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#070A09] text-white font-sans antialiased py-12 px-4 sm:px-8 relative z-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Buton Înapoi */}
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-2 text-xs font-mono text-[#E8FFF2] bg-[#075E46]/30 border border-[#075E46]/60 px-4 py-2 rounded-full hover:bg-[#075E46]/60 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Înapoi la pagina principală</span>
        </button>

        {/* Selector Limbă */}
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setLang("ro")}
            className={`px-3 py-1 text-xs font-mono rounded-full border ${lang === "ro" ? "bg-[#E8FFF2] text-[#075E46] border-[#E8FFF2]" : "border-white/20 text-white/60"}`}
          >
            RO
          </button>
          <button 
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-xs font-mono rounded-full border ${lang === "en" ? "bg-[#E8FFF2] text-[#075E46] border-[#E8FFF2]" : "border-white/20 text-white/60"}`}
          >
            EN
          </button>
        </div>

        {/* Conținutul Termenilor și Condițiilor */}
        <div className="bg-[#0B0F0D] border border-[#075E46] rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(7,94,70,0.3)] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#075E46]/40 pb-6">
            <Scale className="text-[#E8FFF2]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {t.termsTitle}
              </h1>
              <p className="text-xs font-mono text-[#E8FFF2]/70">SWING Studio / Daniel Moisă</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#075E46]/20 p-4 rounded-2xl border border-[#075E46]/40 text-xs font-mono">
            <span className="text-[#E8FFF2] font-semibold flex items-center gap-2">
              <ShieldCheck size={16} /> Conformitate Legislație RO & UE / GDPR Compliance
            </span>
            <span className="text-white/40">2026</span>
          </div>

          <div className="space-y-6 text-sm text-white/70 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-[#E8FFF2] font-bold text-base uppercase tracking-wider font-mono">
                1. Cadru General și Identificarea Operatorului
              </h2>
              <p>
                Prezentul site este operat de <strong>Daniel Moisă (SWING)</strong>. Utilizarea site-ului, trimiterea de mesaje prin formularul de contact și contractarea serviciilor presupun acceptarea necondiționată a tuturor termenilor descriși în continuare.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-[#E8FFF2] font-bold text-base uppercase tracking-wider font-mono">
                2. Serviciile Societății Informaționale (Legea nr. 365/2002)
              </h2>
              <p>
                În conformitate cu <strong>Legea nr. 365/2002 privind comerțul electronic</strong>, conținutul furnizat pe acest site web reprezintă o invitație la negociere B2B și informare comercială generală.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-[#E8FFF2] font-bold text-base uppercase tracking-wider font-mono">
                3. Protecția Datelor cu Caracter Personal (GDPR UE 2016/679)
              </h2>
              <p>
                Datele trimise prin formular (nume, adresă de email, mesaj) sunt procesate exclusiv în scopul furnizării de răspunsuri solicitărilor dumneavoastră și comunicării comerciale aferente.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-[#E8FFF2] font-bold text-base uppercase tracking-wider font-mono">
                4. Dreptul de Autor și Proprietatea Intelectuală
              </h2>
              <p>
                Toate materialele grafice, conceptele vizuale, codul sursă, elementele UI/UX și brand-ul "SWING" sunt protejate de dreptul de autor.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}

function TermsModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: "ro" | "en" }) {
  if (!isOpen) return null;
  const t = translations[lang];
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
                <h3 className="text-base font-extrabold text-white tracking-wide">{t.termsTitle}</h3>
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
                <ShieldCheck size={16} /> Conformitate Legislație RO & UE / GDPR Compliance
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
                3. Protecția Datelor cu Caracter Personal (GDPR UE 2016/679)
              </h4>
              <p>
                Datele trimise prin formular (nume, adresă de email, mesaj) sunt procesate exclusiv în scopul furnizării de răspunsuri solicitărilor dumneavoastră și comunicării comerciale aferente.
              </p>
            </section>
            <section className="space-y-2">
              <h4 className="text-[#E8FFF2] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
                4. Dreptul de Autor și Proprietatea Intelectuală
              </h4>
              <p>
                Toate materialele grafice, conceptele vizuale, codul sursă, elementele UI/UX și brand-ul "SWING" sunt protejate de dreptul de autor.
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
              {t.termsUnderstandBtn}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [lang, setLang] = useState<"ro" | "en">("ro");
  const [formData, setFormData] = useState({ name: "", email: "", message: "", acceptedTerms: false });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [termsOpen, setTermsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "terms">("home");

  const t = translations[lang];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert(t.alertTerms);
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
      title: t.serv1Title,
      desc: t.serv1Desc,
      icon: <Palette size={24} className="text-[#E8FFF2]" />,
      tag: "Design"
    },
    {
      num: "02",
      title: t.serv2Title,
      desc: t.serv2Desc,
      icon: <Send size={24} className="text-[#E8FFF2]" />,
      tag: "Outreach"
    },
    {
      num: "03",
      title: t.serv3Title,
      desc: t.serv3Desc,
      icon: <CalendarCheck size={24} className="text-[#E8FFF2]" />,
      tag: "Sales"
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

  if (currentPage === "terms") {
    return <TermsPage onBack={() => setCurrentPage("home")} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="min-h-screen bg-[#070A09] text-white selection:bg-[#E8FFF2] selection:text-[#075E46] font-sans antialiased overflow-x-hidden relative">
      <CustomCursor />
      <FuturisticNavbar lang={lang} setLang={setLang} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} lang={lang} />

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
                {t.systemActive}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]"
            >
              {t.heroTitlePart1}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8FFF2] via-emerald-200 to-[#075E46]">
                {t.heroTitlePart2}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              {t.heroSubtitle}
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
                  <h3 className="text-3xl font-black text-white">{t.profileName}</h3>
                  <p className="text-xs font-mono font-bold text-[#E8FFF2] tracking-widest uppercase">{t.profileRole}</p>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-normal">
                  {t.profileBio}
                </p>
              </div>
              <div className="pt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#075E46]/40 hover:bg-[#E8FFF2] text-[#E8FFF2] hover:text-[#075E46] text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border border-[#075E46]"
                >
                  <span>{t.talkBtn}</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Card Objective */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-cursor="Mission"
              className="md:col-span-7 bg-gradient-to-b from-[#075E46]/20 to-[#0B0F0D] border border-[#075E46]/50 hover:border-[#E8FFF2]/40 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-lg">
                  <span className="text-[10px] font-mono font-bold text-[#E8FFF2] uppercase tracking-widest bg-[#075E46]/50 px-3.5 py-1.5 rounded-full border border-[#E8FFF2]/20 inline-block">
                    [TARGET_MISSION]
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    {t.missionTitle}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[#E8FFF2] hidden sm:block">
                  <Target size={26} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-10">
                <div className="p-4 rounded-2xl bg-[#070A09]/90 border border-[#075E46]/40 text-center space-y-1">
                  <p className="text-xl font-black text-[#E8FFF2]">100%</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">{t.statAttention}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070A09]/90 border border-[#075E46]/40 text-center space-y-1">
                  <p className="text-xl font-black text-[#E8FFF2]">Fast</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">{t.statFast}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070A09]/90 border border-[#075E46]/40 text-center space-y-1">
                  <p className="text-xl font-black text-[#E8FFF2]">B2B</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">{t.statFocus}</p>
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
                {t.servicesTagline}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {t.servicesHeader}
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
                data-cursor="Service"
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
              {t.skillsTagline}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {t.skillsHeader}
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
                  {t.contactTagline}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  {t.contactHeader}
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  {t.contactSubtitle}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                      {t.fieldName}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.placeholderName}
                        className="w-full bg-[#070A09]/90 border border-[#075E46]/60 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FFF2] transition-colors pl-12"
                      />
                      <User size={18} className="absolute left-4 top-3.5 text-[#E8FFF2]/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                      {t.fieldEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.placeholderEmail}
                        className="w-full bg-[#070A09]/90 border border-[#075E46]/60 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FFF2] transition-colors pl-12"
                      />
                      <Mail size={18} className="absolute left-4 top-3.5 text-[#E8FFF2]/60" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">
                    {t.fieldMessage}
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.placeholderMessage}
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
                    {t.termsCheckbox}{" "}
                    <button
                      type="button"
                      onClick={() => setCurrentPage("terms")}
                      className="text-[#E8FFF2] underline hover:text-white font-semibold transition-colors"
                    >
                      {t.termsLink}
                    </button>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#E8FFF2] hover:bg-white text-[#075E46] font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(232,255,242,0.25)] hover:shadow-[0_0_30px_rgba(232,255,242,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-0.5"
                >
                  {formStatus === "submitting" ? (
                    <span>{t.sendingBtn}</span>
                  ) : (
                    <>
                      <span>{t.sendBtn}</span>
                      <Send size={15} />
                    </>
                  )}
                </button>

                {formStatus === "success" && (
                  <div className="flex items-center gap-2.5 text-[#E8FFF2] text-sm font-semibold pt-2">
                    <CheckCircle2 size={18} />
                    <span>{t.successMsg}</span>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-center gap-2.5 text-red-400 text-sm font-semibold pt-2">
                    <AlertCircle size={18} />
                    <span>{t.errorMsg}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#075E46]/30 py-10 px-6 sm:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40 font-mono">
        <p>© {new Date().getFullYear()} SWING (Daniel Moisă). {t.footerRights}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button onClick={() => setCurrentPage("terms")} className="hover:text-[#E8FFF2] transition-colors">
            Termeni & Condiții Legal
          </button>
          <button onClick={() => setCurrentPage("terms")} className="hover:text-[#E8FFF2] transition-colors">
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