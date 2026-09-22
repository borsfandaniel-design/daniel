"use client";

import React, { useState } from "react";
import {
  Layout,
  MessageSquare,
  FileText,
  Mail,
  Send,
  Globe,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  PhoneCall,
  Flame,
  Zap,
  Menu,
  X
} from "lucide-react";

const translations = {
  RO: {
    nav: {
      services: "Servicii",
      about: "Despre Mine",
      approach: "Abordare",
      contact: "Contact",
      cta: "Hai să vorbim",
    },
    hero: {
      badge: "Graphic Design & Direct Lead Generation",
      titleName: "Daniel Moisă",
      aka: "(a.k.a. Swing)",
      subtitle: "Ajut afacerile și creatorii să iasă în evidență prin vizualuri curate și outreach direct, fără bullshit sau promisiuni exagerate.",
      primaryCta: "Trimite un mesaj",
      secondaryCta: "Vezi ce pot face",
    },
    skills: {
      tag: "Competențe Directe",
      title: "Ce fac cu adevărat bine",
      sub: "Fără agenții umflate, fără cifre fabricate. Doar muncă practică și orientată spre rezultate.",
      items: [
        {
          icon: Layout,
          title: "Prezentări & Pitch Deck-uri",
          desc: "Structurez și desenez prezentări clare în Canva și Figma care captează atenția investitorilor și clienților.",
        },
        {
          icon: ImageIcon,
          title: "Thumbnails & Vizualuri Social Media",
          desc: "Thumbnails optimizate pentru rata de click (CTR) și elemente grafice de impact pentru branduri personale.",
        },
        {
          icon: Mail,
          title: "Cold Outreach & Prospectare",
          desc: "Mesaje directe, personalizate, fără spam automatizat. Găsesc decidenții și inițiez conversații reale.",
        },
        {
          icon: PhoneCall,
          title: "Appointment Setting",
          desc: "Preluarea lead-urilor calificate și programarea lor direct în calendarul tău de vânzări.",
        },
        {
          icon: FileText,
          title: "Design de Materiale de Vânzare",
          desc: "PDF-uri, ghiduri, one-pagere și propuneri comerciale lizibile, estetice și ușor de parcurs.",
        },
        {
          icon: MessageSquare,
          title: "Comunicare Directă & Follow-up",
          desc: "Menținerea relației cu posibilii clienți prin răspunsuri rapide și follow-up consecvent.",
        },
      ],
    },
    about: {
      tag: "Autenticitate",
      title: "Cine este Daniel Moisă (a.k.a. Swing)?",
      p1: "Nu spun că am condus agenții de milioane sau că am lucrat cu corporații Fortune 500 dacă nu este cazul. Sunt un profesionist independent determinat, orientat pe execuție curată.",
      p2: "Mă concentrez pe două verticale mari care mișcă acul în orice afacere: aspectul vizual (cum arăți în fața clienților) și comunicarea directă (cum ajungi la ei).",
      bullets: [
        "Muncă transparentă și comunicare zilnică",
        "Atenție la detalii în Canva, Figma și unelte de outreach",
        "Mă adaptez rapid la stilul și tonul brandului tău",
        "Corectitudine: dacă nu pot face ceva, îți spun din start",
      ],
    },
    process: {
      tag: "Cum lucrăm",
      title: "Un proces simplu și direct",
      steps: [
        {
          num: "01",
          title: "Discuția Inițială",
          desc: "Clarificăm exact ce ai nevoie: fie că e vorba de o prezentare, thumbnails sau o campanie de outreach.",
        },
        {
          num: "02",
          title: "Execuția & Draftul",
          desc: "Trec la treabă repede și îți trimit o primă versiune pentru feedback concret.",
        },
        {
          num: "03",
          title: "Rafinarea",
          desc: "Ajustăm detaliile până când materialul sau campania este exact așa cum trebuie.",
        },
        {
          num: "04",
          title: "Livrarea & Rezultatul",
          desc: "Primești fișierele finale sau începem prospectarea efectivă și programarea întâlnirilor.",
        },
      ],
    },
    contact: {
      tag: "Contact Direct",
      title: "Să începem o conversație",
      sub: "Scrie-mi un mesaj mai jos sau contactează-mă direct. Răspund de obicei în câteva ore.",
      form: {
        name: "Numele tău",
        namePlaceholder: "ex. Ion Popescu",
        email: "Adresa de email",
        emailPlaceholder: "ex. ion@company.com",
        service: "Serviciul dorit",
        serviceDefault: "Selectează o opțiune",
        serviceOptions: [
          "Graphic Design / Pitch Decks",
          "Thumbnails / Social Media",
          "Cold Outreach / Lead Gen",
          "Appointment Setting",
          "Altele / Discuție generală",
        ],
        message: "Mesajul tău",
        messagePlaceholder: "Spune-mi scurt despre proiectul sau ideea ta...",
        submit: "Trimite Mesajul",
        sending: "Se trimite...",
        success: "Mesajul a fost trimis cu succes! Îți voi răspunde în cel mai scurt timp.",
        error: "A apărut o eroare la trimiterea mesajului. Te rog încearcă din nou.",
      },
    },
    footer: {
      rights: "Toate drepturile rezervate.",
      tagline: "Design simplu. Outreach eficient. Comunicare directă.",
    },
  },
  EN: {
    nav: {
      services: "Services",
      about: "About",
      approach: "Approach",
      contact: "Contact",
      cta: "Let's Talk",
    },
    hero: {
      badge: "Graphic Design & Direct Lead Generation",
      titleName: "Daniel Moisă",
      aka: "(a.k.a. Swing)",
      subtitle: "Helping businesses and creators stand out through clean visuals and direct outreach—no fluff, no exaggerated claims.",
      primaryCta: "Send a Message",
      secondaryCta: "See What I Do",
    },
    skills: {
      tag: "Core Competencies",
      title: "What I Actually Do Well",
      sub: "No bloated agency speak, no fabricated numbers. Just practical, result-driven execution.",
      items: [
        {
          icon: Layout,
          title: "Presentations & Pitch Decks",
          desc: "Structuring and designing clear pitch decks in Canva & Figma that capture client and investor attention.",
        },
        {
          icon: ImageIcon,
          title: "Thumbnails & Social Visuals",
          desc: "CTR-optimized thumbnails and high-impact graphic assets for personal brands and channels.",
        },
        {
          icon: Mail,
          title: "Cold Outreach & Prospecting",
          desc: "Direct, highly personalized messages without automated spam. Reaching real decision-makers.",
        },
        {
          icon: PhoneCall,
          title: "Appointment Setting",
          desc: "Handling qualified leads and placing booked calls directly into your sales calendar.",
        },
        {
          icon: FileText,
          title: "Sales Asset Design",
          desc: "Clean, visually appealing PDFs, one-pagers, and proposal documents that are easy to digest.",
        },
        {
          icon: MessageSquare,
          title: "Direct Outreach & Follow-up",
          desc: "Maintaining prospect engagement with quick response times and persistent, respectful follow-ups.",
        },
      ],
    },
    about: {
      tag: "Authenticity",
      title: "Who is Daniel Moisă (a.k.a. Swing)?",
      p1: "I won't claim to have run multi-million dollar agencies or worked with Fortune 500s unless that's the truth. I am a dedicated independent professional focused on clean execution.",
      p2: "I focus on two major drivers of business growth: visual presentation (how you look to prospective clients) and direct outreach (how you actually reach them).",
      bullets: [
        "Transparent workflow and daily communication",
        "Attention to detail in Canva, Figma, and outreach tools",
        "Quick adaptation to your brand's voice and aesthetic",
        "Honesty first: if I can't deliver something, I'll tell you upfront",
      ],
    },
    process: {
      tag: "Workflow",
      title: "A Simple & Straightforward Process",
      steps: [
        {
          num: "01",
          title: "Initial Contact",
          desc: "We clarify exactly what you need—whether it's pitch decks, thumbnails, or outbound outreach.",
        },
        {
          num: "02",
          title: "Drafting & Execution",
          desc: "I get straight to work and send over an initial draft or campaign strategy for your input.",
        },
        {
          num: "03",
          title: "Refinement",
          desc: "We tweak and adjust until the design assets or message sequences hit the exact right tone.",
        },
        {
          num: "04",
          title: "Delivery & Execution",
          desc: "You get the final ready-to-use files, or we initiate active prospect engagement.",
        },
      ],
    },
    contact: {
      tag: "Direct Contact",
      title: "Let's Start a Conversation",
      sub: "Drop me a message below or reach out directly. I usually reply within a few hours.",
      form: {
        name: "Your Name",
        namePlaceholder: "e.g. John Doe",
        email: "Email Address",
        emailPlaceholder: "e.g. john@company.com",
        service: "Interested Service",
        serviceDefault: "Select an option",
        serviceOptions: [
          "Graphic Design / Pitch Decks",
          "Thumbnails / Social Media",
          "Cold Outreach / Lead Gen",
          "Appointment Setting",
          "Other / General Inquiry",
        ],
        message: "Your Message",
        messagePlaceholder: "Tell me briefly about your project or goals...",
        submit: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully! I will get back to you shortly.",
        error: "There was an error sending your message. Please try again.",
      },
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Clean design. Effective outreach. Direct communication.",
    },
  },
};

export default function Page() {
  const [lang, setLang] = useState<"RO" | "EN">("RO");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setStatus("success");
        setFormState({ name: "", email: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f3f4f6] font-sans antialiased selection:bg-[#FF5722] selection:text-white">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#0d0f12]/90 backdrop-blur-md border-b border-[#1f2430]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-[#161920] border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="w-10 h-10 object-contain rounded-lg"
                onError={(e) => {
                  // Hide image if image file is not found in public directory
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-wide group-hover:text-[#FF5722] transition-colors">
                Swing
              </span>
              <span className="text-xs text-gray-400">Daniel Moisă</span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-gray-300 hover:text-[#FF5722] transition-colors">
              {t.nav.services}
            </a>
            <a href="#about" className="text-sm text-gray-300 hover:text-[#FF5722] transition-colors">
              {t.nav.about}
            </a>
            <a href="#approach" className="text-sm text-gray-300 hover:text-[#FF5722] transition-colors">
              {t.nav.approach}
            </a>
            <a href="#contact" className="text-sm text-gray-300 hover:text-[#FF5722] transition-colors">
              {t.nav.contact}
            </a>
          </nav>

          {/* Right Controls: Language Switch, CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setLang(lang === "RO" ? "EN" : "RO")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161920] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#FF5722]/50 transition-all"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>{lang}</span>
            </button>

            <a
              href="#contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#FF5722] text-white font-medium text-sm hover:bg-[#FF6D00] transition-all shadow-lg shadow-[#FF5722]/20"
            >
              {t.nav.cta}
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#161920] border border-white/10 text-gray-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#161920] border-b border-[#1f2430] px-4 py-6 space-y-4">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-[#FF5722]"
            >
              {t.nav.services}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-[#FF5722]"
            >
              {t.nav.about}
            </a>
            <a
              href="#approach"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-[#FF5722]"
            >
              {t.nav.approach}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-[#FF5722]"
            >
              {t.nav.contact}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block w-full text-center px-4 py-3 rounded-lg bg-[#FF5722] text-white font-semibold text-sm hover:bg-[#FF6D00]"
            >
              {t.nav.cta}
            </a>
          </div>
        )}
      </header>

      {}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161920] border border-[#FF5722]/30 text-[#FF5722] text-xs font-semibold mb-6">
            <Flame className="w-4 h-4 text-[#FF5722]" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            {t.hero.titleName}{" "}
            <span className="text-[#FF5722] font-normal block sm:inline">{t.hero.aka}</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed font-normal">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF5722] hover:bg-[#FF6D00] text-white font-semibold text-base transition-all shadow-xl shadow-[#FF5722]/25"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#161920] hover:bg-white/5 border border-white/10 text-white font-semibold text-base transition-all"
            >
              <span>{t.hero.secondaryCta}</span>
            </a>
          </div>
        </div>
      </section>

      {}
      <section id="services" className="py-20 bg-[#161920]/40 border-y border-[#1f2430] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-[#FF5722] text-sm font-semibold tracking-wider uppercase">
              {t.skills.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {t.skills.title}
            </h2>
            <p className="text-gray-400 mt-2 max-w-2xl">
              {t.skills.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.skills.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#161920] border border-white/5 hover:border-[#FF5722]/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0d0f12] border border-white/10 flex items-center justify-center text-[#FF5722] mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-[#FF5722] text-sm font-semibold tracking-wider uppercase">
              {t.about.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.about.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-[#161920] border border-white/10 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5722]/10 rounded-full blur-2xl pointer-events-none" />
              <Zap className="w-10 h-10 text-[#FF5722] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Focus pe Execuție Curată
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Nimic inutil, fără livrabile complicate care nu aduc valoare. Fiecare material de design sau mesaj trimis are un scop clar.
              </p>
              <div className="p-4 rounded-xl bg-[#0d0f12] border border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400">Direct Availability</span>
                <span className="text-xs font-semibold text-[#FF5722]">Open for projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="approach" className="py-20 bg-[#161920]/40 border-y border-[#1f2430] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-[#FF5722] text-sm font-semibold tracking-wider uppercase">
              {t.process.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {t.process.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.process.steps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#161920] border border-white/5 relative">
                <span className="text-4xl font-black text-white/10 mb-4 block">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#FF5722] text-sm font-semibold tracking-wider uppercase">
            {t.contact.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            {t.contact.title}
          </h2>
          <p className="text-gray-400 mt-2">
            {t.contact.sub}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#161920] border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                {t.contact.form.name}
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder={t.contact.form.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5722] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                {t.contact.form.email}
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder={t.contact.form.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5722] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
              {t.contact.form.service}
            </label>
            <select
              required
              value={formState.service}
              onChange={(e) => setFormState({ ...formState, service: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-white/10 text-white focus:outline-none focus:border-[#FF5722] transition-colors"
            >
              <option value="" disabled>
                {t.contact.form.serviceDefault}
              </option>
              {t.contact.form.serviceOptions.map((opt, i) => (
                <option key={i} value={opt} className="bg-[#0d0f12] text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
              {t.contact.form.message}
            </label>
            <textarea
              rows={5}
              required
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              placeholder={t.contact.form.messagePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5722] transition-colors resize-none"
            />
          </div>

          {status === "success" && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {t.contact.form.success}
            </div>
          )}

          {status === "error" && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {t.contact.form.error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 rounded-xl bg-[#FF5722] hover:bg-[#FF6D00] text-white font-bold text-base transition-all shadow-xl shadow-[#FF5722]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "sending" ? (
              <span>{t.contact.form.sending}</span>
            ) : (
              <>
                <span>{t.contact.form.submit}</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </section>

      {}
      <footer className="py-8 border-t border-[#1f2430] bg-[#0d0f12] px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">Swing</span> — Daniel Moisă
          </div>
          <div>{t.footer.tagline}</div>
          <div>
            © {new Date().getFullYear()} Daniel Moisă. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
}