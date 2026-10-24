"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CodeIcon,
  CalendarIcon,
  UserIcon,
  MailIcon,
  MessageIcon,
  SendIcon,
  CheckIcon,
  AlertIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  CloseIcon,
} from "./components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingPumpkins } from "./components/FloatingPumpkins";

//--- DICȚIONAR PENTRU TRADUCERI (RO / EN) ---
const translations = {
  ro: {
    navAbout: "Despre",
    navServices: "Servicii",
    navSkills: "Abilități",
    navContact: "Contact",
    systemActive: "Available for new projects",
    seasonalTag: "Disponibil pentru proiecte noi.",
    seasonalBadge: "SYSTEM",
    heroTitlePart1: "Less Noise. ",
    heroTitlePart2: "More Growth.",
    heroSubtitle:
      "Construiesc sisteme web rapide, pagini de vânzare optimizate și procese directe de calificare care transformă contactele în clienți reali.",
    profileName: "Moisă Ionuț Daniel",
    profileRole: "SWING STUDIO",
    profileBio:
      "Lucrez direct cu fondatori și echipe B2B pentru a construi platforme web performante, copywriting de impact și lead-uri calificate fără intermediari sau birocrație inutilă.",
    missionTitle: "De la primul contact rece până la discuții calificate de vânzări.",
    statAttention: "Zero Ghosting",
    statAttentionSub: "Comunicare Directă",
    statAttentionDesc:
      "Comunicare garantată și transparentă: răspund rapid la mesaje, ofer update-uri la fiecare etapă și nu las niciun proiect sau discuție în aer. Fără mesaje ignorate, fără timp pierdut.",
    statFast: "Claritate Totală",
    statFastSub: "Fără Ambiguitate",
    statFastDesc:
      "Proces deschis și predictibil: știi din prima clipă exact ce livrabile primești, calendarul ferm de lucru și costul agreat. Fără costuri ascunse, fără termeni tehnici complicați.",
    statFocus: "Rezultate B2B",
    statFocusSub: "Fără Trucuri",
    statFocusDesc:
      "Impact comercial măsurabil: materiale vizuale și pitch deck-uri care inspiră autoritate, mesaje directe către factori de decizie și discuții calificate de vânzări, nu vanity metrics.",
    servicesTagline: "Servicii",
    servicesHeader: "Cum te pot ajuta să crești",
    serv1Title: "Web Development & Landing Pages",
    serv1Desc:
      "Site-uri de prezentare ultra-rapide și pagini de vânzare optimizate pentru conversie, complet responsive și ușor de administrat.",
    serv2Title: "Appointment Setting & Calificări",
    serv2Desc:
      "Calificare atentă a lead-urilor, eliminarea obiecțiilor și programarea întâlnirilor 1-la-1 cu decidenți direct în calendar.",
    skillsTagline: "Competențe",
    skillsHeader: "Abilități & Unelte",
    contactTagline: "Contact Direct",
    contactHeader: "Hai să colaborăm",
    contactSubtitle: "Trimite-mi câteva detalii despre proiectul tău și revin în maxim 24 de ore cu o propunere clară.",
    contactNote: "Răspuns garantat în 24 de ore. Vorbești direct cu Moisă Ionuț Daniel, fără intermediari.",
    fieldName: "Nume Complet",
    fieldEmail: "Adresă Email",
    fieldMessage: "Detalii Proiect / Solicitare",
    placeholderName: "Numele tău",
    placeholderEmail: "adresa@email.com",
    placeholderMessage: "Descrie pe scurt ce ai dori să realizăm împreună...",
    termsCheckbox: "Sunt de acord cu prelucrarea datelor personale conform GDPR şi am citit",
    termsLink: "Termenii, Condițiile și Cadrul Legal",
    sendBtn: "Trimite Mesajul",
    sendingBtn: "Se trimite...",
    successMsg: "Mesajul a fost trimis cu succes! Îți voi răspunde curând.",
    errorMsg: "A apărut o eroare. Te rog să încerci din nou.",
    alertTerms: "Te rugăm să bifezi acordul pentru Termeni și Condiții pentru a trimite mesajul.",
    footerRights: "Toate drepturile rezervate.",
  },
  en: {
    navAbout: "About",
    navServices: "Services",
    navSkills: "Skills",
    navContact: "Contact",
    systemActive: "Available for new projects",
    seasonalTag: "Available for new projects.",
    seasonalBadge: "SYSTEM",
    heroTitlePart1: "Less Noise. ",
    heroTitlePart2: "More Growth.",
    heroSubtitle:
      "Building high-speed web systems, direct-response copy, and qualified appointment pipelines engineered for real business growth.",
    profileName: "Moisă Ionuț Daniel",
    profileRole: "SWING STUDIO",
    profileBio:
      "I work directly with founders and B2B teams to build high-performance web systems, sharp sales copy, and qualified appointment pipelines without unnecessary agency overhead.",
    missionTitle: "From the first cold impression to booked sales conversations.",
    statAttention: "Zero Ghosting",
    statAttentionSub: "Direct Sync",
    statAttentionDesc:
      "Guaranteed transparent communication: fast responses, proactive progress reports, and zero radio silence. You never have to chase for updates or wonder where things stand.",
    statFast: "Crystal Clear",
    statFastSub: "No Ambiguity",
    statFastDesc:
      "Predictable and honest workflow: you know upfront the exact deliverables, agreed milestones, firm deadlines, and fixed pricing. No hidden fees or confusing jargon.",
    statFocus: "B2B Results",
    statFocusSub: "No Fluff",
    statFocusDesc:
      "Measurable commercial outcomes: authoritative web assets, clear positioning, and qualified sales calls booked with real decision-makers instead of vanity metrics.",
    servicesTagline: "Services",
    servicesHeader: "How I can help you scale",
    serv1Title: "Web Development & Landing Pages",
    serv1Desc:
      "High-speed websites and high-converting landing pages built for performance, conversion rates, and seamless maintenance.",
    serv2Title: "Appointment Setting & Qualification",
    serv2Desc:
      "Careful prospect vetting, objection resolution, and confirmed 1-on-1 discovery calls scheduled directly into your calendar.",
    skillsTagline: "Capabilities",
    skillsHeader: "Skills & Stack",
    contactTagline: "Direct Reach",
    contactHeader: "Let's work together",
    contactSubtitle: "Drop a brief note about your project and I'll get back to you within 24 hours with clear next steps.",
    contactNote: "Guaranteed 24-hour response. You speak directly with Moisă Ionuț Daniel.",
    fieldName: "Full Name",
    fieldEmail: "Email Address",
    fieldMessage: "Project Scope / Note",
    placeholderName: "Your name",
    placeholderEmail: "your@email.com",
    placeholderMessage: "Tell me briefly about what you'd like to build together...",
    termsCheckbox: "I agree to personal data processing under GDPR and confirm I have read the",
    termsLink: "Terms, Conditions and Legal Framework",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    successMsg: "Message sent successfully! I will reply shortly.",
    errorMsg: "An error occurred. Please try again.",
    alertTerms: "Please accept the Terms & Conditions before sending your message.",
    footerRights: "All rights reserved.",
  },
};

function FuturisticNavbar({
  lang,
  setLang,
  theme,
  toggleTheme,
}: {
  lang: "ro" | "en";
  setLang: (l: "ro" | "en") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
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
    { name: t.navAbout, slug: lang === "ro" ? "despre" : "about", id: "about" },
    { name: t.navServices, slug: lang === "ro" ? "servicii" : "services", id: "services" },
    { name: t.navSkills, slug: lang === "ro" ? "abilitati" : "skills", id: "skills" },
    { name: t.navContact, slug: "contact", id: "contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    slug: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", `/${slug}`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* LOGO & BRAND - FĂRĂ FUNDAL, CURAT ȘI VIZIBIL MARE */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/");
            }}
            className="flex items-center gap-3 sm:gap-4 group shrink-0"
          >
            <img
              src="/logo.png"
              alt="SWING Logo"
              className="h-10 sm:h-12 w-auto object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex flex-col">
              <span className="font-black tracking-[0.16em] text-xs sm:text-sm text-zinc-950 dark:text-white leading-none">
                SWING
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono font-medium tracking-wider uppercase mt-1">
                Moisă Ionuț Daniel
              </span>
            </div>
          </a>

          {/* DESKTOP NAV LINKS (CENTER) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`/${link.slug}`}
                  onClick={(e) => handleNavClick(e, link.id, link.slug)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                    isActive
                      ? "text-[#FF5400] dark:text-[#FF5400] font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="fullNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF5400] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Buton Dark Mode / Light Mode */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Comută pe modul luminos" : "Comută pe modul întunecat"}
              title={theme === "dark" ? "Mod Luminos" : "Mod Întunecat"}
              className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            >
              {theme === "dark" ? (
                <SunIcon size={15} className="text-zinc-200" />
              ) : (
                <MoonIcon size={15} className="text-zinc-700" />
              )}
            </button>

            {/* Selector Limbă */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                  lang === "ro"
                    ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                RO
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl md:hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER (FULL WIDTH) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-800 md:hidden shadow-lg"
          >
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.id}
                    href={`/${link.slug}`}
                    onClick={(e) => {
                      handleNavClick(e, link.id, link.slug);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs font-mono text-zinc-400">0{idx + 1}</span>
                  </a>
                ))}
              </div>
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Moisă Ionuț Daniel</span>
                <span className="text-[10px] font-mono font-bold text-[#FF5400] uppercase tracking-wider">SWING STUDIO</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  const [lang, setLang] = useState<"ro" | "en">("ro");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    acceptedTerms: false,
    website_hp: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const t = translations[lang];

  useEffect(() => {
    // Sincronizare Dark / Light mode din localStorage sau preferințe OS
    const savedTheme = localStorage.getItem("swing_theme") as "light" | "dark" | null;
    const initialTheme =
      savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Navigare curată pe rute fără '#' (e.g. /despre, /servicii, /abilitati, /contact)
    const path = window.location.pathname.replace(/^\//, "").toLowerCase();
    const pathToIdMap: Record<string, string> = {
      about: "about",
      despre: "about",
      services: "services",
      servicii: "services",
      skills: "skills",
      abilitati: "skills",
      contact: "contact",
    };
    const targetId = pathToIdMap[path];
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("swing_theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptedTerms) {
      alert(t.alertTerms);
      return;
    }

    // Verificare anti-bot prin câmpul honeypot
    if (formData.website_hp) {
      setFormStatus("success");
      return;
    }

    setFormStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website_hp: formData.website_hp,
        }),
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({
          name: "",
          email: "",
          message: "",
          acceptedTerms: false,
          website_hp: "",
        });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const servicesList = [
    {
      title: t.serv1Title,
      desc: t.serv1Desc,
      icon: <CodeIcon size={22} className="text-[#FF5400]" />,
    },
    {
      title: t.serv2Title,
      desc: t.serv2Desc,
      icon: <CalendarIcon size={22} className="text-[#FF5400]" />,
    },
  ];

  const skillsData = {
    ro: [
      {
        name: "Web Development",
        icon: <CodeIcon size={20} />,
        desc: "Construiesc landing pages orientate pe conversie și site-uri moderne de prezentare, ultra-rapide, responsive și optimizate pentru claritate și viteză.",
      },
      {
        name: "Appointment Setting",
        icon: <CalendarIcon size={20} />,
        desc: "Calific contactele primite, elimin obiecțiile timpurii și programez întâlniri 1-la-1 cu factori de decizie direct în calendarul tău de vânzări.",
      },
    ],
    en: [
      {
        name: "Web Development",
        icon: <CodeIcon size={20} />,
        desc: "I develop fast, responsive landing pages and business websites engineered for conversion, speed, and seamless navigation.",
      },
      {
        name: "Appointment Setting",
        icon: <CalendarIcon size={20} />,
        desc: "I qualify prospective leads, handle early objections, and book high-intent 1-on-1 sales calls with decision-makers directly into your calendar.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-950 dark:text-zinc-100 selection:bg-[#FF5400] selection:text-white font-sans antialiased overflow-x-hidden relative transition-colors duration-200">
      <FuturisticNavbar lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />

      {/* FLOATING PUMPKINS BACKGROUND */}
      <FloatingPumpkins />

      <main className="relative z-10 pt-28 sm:pt-36 pb-24 px-4 sm:px-8 max-w-4xl mx-auto space-y-24 md:space-y-32">
        {/* HERO SECTION */}
        <section id="about" className="scroll-mt-36 space-y-10">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                {t.seasonalTag}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-950 dark:bg-zinc-900 text-[#FF5400] font-bold uppercase tracking-wider">
                {t.seasonalBadge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
              {t.heroTitlePart1}
              <span className="text-[#FF5400]">{t.heroTitlePart2}</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* CARD PROFILE */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-xs">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/logo.png"
                    alt="SWING Logo"
                    className="h-11 sm:h-12 w-auto object-contain shrink-0"
                  />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white leading-tight">
                      {t.profileName}
                    </h3>
                    <p className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                      SWING STUDIO
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {t.profileBio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICII (CARDS IN A ROW - NO BENTO GRID) */}
        <section id="services" className="scroll-mt-36 space-y-8">
          <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <span className="text-xs font-mono font-bold text-[#FF5400] uppercase tracking-wider">
              {t.servicesTagline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              {lang === "ro" ? (
                <>Cum te pot ajuta <span className="text-[#FF5400]">să crești</span></>
              ) : (
                <>How I can help you <span className="text-[#FF5400]">scale</span></>
              )}
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {servicesList.map((service, index) => (
              <div
                key={service.title}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors shadow-xs"
              >
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0">
                    {service.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400 shrink-0 self-end sm:self-center">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ABILITATI (CARDS IN A ROW - NO BENTO GRID) */}
        <section id="skills" className="scroll-mt-36 space-y-8">
          <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <span className="text-xs font-mono font-bold text-[#FF5400] uppercase tracking-wider">
              {t.skillsTagline}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              {lang === "ro" ? (
                <>Abilități & <span className="text-[#FF5400]">Unelte</span></>
              ) : (
                <>Skills & <span className="text-[#FF5400]">Tools</span></>
              )}
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {skillsData[lang].map((skill) => (
              <div
                key={skill.name}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-start justify-between gap-5 transition-colors shadow-xs"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0">
                    {skill.icon}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        {lang === "ro" ? "Competență" : "Skill"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {skill.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-36">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-xs">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#FF5400] uppercase tracking-wider">
                  {t.contactTagline}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
                  {lang === "ro" ? (
                    <>Hai să <span className="text-[#FF5400]">colaborăm</span></>
                  ) : (
                    <>Let&apos;s <span className="text-[#FF5400]">connect</span></>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {t.contactSubtitle}
                </p>

                {/* NOTĂ PERSONALĂ DANIEL MOISĂ */}
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                    <span className="font-mono font-bold text-[#FF5400]">SWING</span>
                    <span>{t.contactNote}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      {t.fieldName}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.placeholderName}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5400] dark:focus:border-[#FF5400] transition-colors pl-11"
                      />
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <UserIcon size={18} />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      {t.fieldEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.placeholderEmail}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5400] dark:focus:border-[#FF5400] transition-colors pl-11"
                      />
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <MailIcon size={18} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    {t.fieldMessage}
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.placeholderMessage}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5400] dark:focus:border-[#FF5400] transition-colors pl-11 pt-3 resize-none"
                    />
                    <span className="absolute left-3.5 top-3.5 text-zinc-400">
                      <MessageIcon size={18} />
                    </span>
                  </div>
                </div>

                {/* Honeypot invizibil pentru blocarea automată a roboților de spam */}
                <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                  <input
                    type="text"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_hp}
                    onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  />
                </div>

                {/* LINK TERMENI SI CONDITII */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.acceptedTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, acceptedTerms: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-[#FF5400] focus:ring-[#FF5400] cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal cursor-pointer select-none"
                  >
                    {t.termsCheckbox}{" "}
                    <Link
                      href="/termeni-si-conditii"
                      className="text-zinc-950 dark:text-white underline font-bold transition-colors cursor-pointer"
                    >
                      {t.termsLink}
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#FF5400] hover:bg-[#E04800] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                >
                  {formStatus === "submitting" ? (
                    <span>{t.sendingBtn}</span>
                  ) : (
                    <>
                      <span>{t.sendBtn}</span>
                      <SendIcon size={14} />
                    </>
                  )}
                </button>

                {formStatus === "success" && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold pt-1">
                    <CheckIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{t.successMsg}</span>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold pt-1">
                    <AlertIcon size={18} />
                    <span>{t.errorMsg}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <p>© {new Date().getFullYear()} SWING (Daniel Moisă). {t.footerRights}</p>
        <div className="flex flex-wrap items-center justify-center gap-5 font-bold">
          <Link
            href="/termeni-si-conditii"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Termeni & Condiții Legal
          </Link>
          <Link
            href="/termeni-si-conditii"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Confidențialitate GDPR
          </Link>
          <a
            href="https://anpc.ro/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            ANPC
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            Platforma SOL (UE)
          </a>
        </div>
      </footer>
    </div>
  );
}
