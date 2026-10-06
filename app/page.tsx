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
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

//--- DICȚIONAR PENTRU TRADUCERI (RO / EN) ---
const translations = {
  ro: {
    navAbout: "Despre",
    navServices: "Servicii",
    navSkills: "Abilități",
    navContact: "Contact",
    systemActive: "SISTEM ACTIV, DISPONIBIL PENTRU PROIECTE",
    heroTitlePart1: "Design Vizual High-End & ",
    heroTitlePart2: "Cold Outreach",
    heroSubtitle:
      "Ajut brandurile și companiile să se remarce prin estetică impecabilă și să își crească vânzările prin campanii de outreach bine calibrate.",
    profileName: "Daniel Moisă",
    profileRole: "SWING STUDIO",
    profileBio:
      "Pasionat de minimalism, estetică curată și strategie digitală orientată spre rezultate clare.",
    talkBtn: "Hai să vorbim",
    missionTitle: "Transformă atenţia privitorilor în oportunități reale de afaceri.",
    statAttention: "Atenție Detalii",
    statFast: "Livrabile Rapide",
    statFocus: "Focus Rezultate",
    servicesTagline: " 01. SERVICII",
    servicesHeader: "Cu ce te pot ajuta",
    serv1Title: "Graphic Design & Canva Pro",
    serv1Desc:
      "Materiale vizuale moderne, pitch deck-uri, bannere promoționale și vizualuri social media concepute pentru a converti.",
    serv2Title: "Cold Emailing & Outreach",
    serv2Desc:
      "Campanii strategice de cold email, redactare de script-uri persuasive și infrastructură optimizată pentru rata de livrare.",
    serv3Title: "Appointment Setting",
    serv3Desc:
      "Transformarea lead-urilor reci în întâlniri de afaceri calificate direct în calendarul tău.",
    skillsTagline: " 02. CAPABILITATI",
    skillsHeader: "Abilități & Stack",
    contactTagline: " 03. TRANSMITE UN MESAJ",
    contactHeader: "Începe o colaborare",
    contactSubtitle: "Scrie-mi un mesaj și îți voi răspunde în cel mai scurt timp posibil.",
    fieldName: "Nume Complet",
    fieldEmail: "Adresă Email",
    fieldMessage: "Detalii Proiect / Solicitare",
    placeholderName: "Numele tău",
    placeholderEmail: "adresa@email.com",
    placeholderMessage: "Detalii despre proiectul tău...",
    termsCheckbox: "Sunt de acord cu prelucrarea datelor personale conform GDPR şi am citit",
    termsLink: "Termenii, Condițiile și Cadrul Legal",
    sendBtn: "Trimite Mesajul",
    sendingBtn: "Se trimite...",
    successMsg: "Mesajul a fost trimis cu succes! Îți voi răspunde curând.",
    errorMsg: "A apărut o eroare. Te rog să încerci din nou.",
    alertTerms: "Te rugăm să bifezi acordul pentru Termeni și Condiții pentru a trimite mesajul.",
    termsTitle: "TERMENI ȘI CONDIŢII",
    backBtn: "Înapoi la pagina principală",
    footerRights: "All rights reserved.",
    terms: {
      subtitle: "SWING Studio / Daniel Moisă — Ultima actualizare: Octombrie 2026",
      compliance: "Conformitate Legislație RO & UE / GDPR Compliance",
      s1Title: "1. Prestatorul",
      s1Text: "Acest site este operat de SWING (Daniel Moisă, \"Prestatorul\"), email: borsfandaniel@gmail.com.",
      s2Title: "2. Obiectul",
      s2Text:
        "Site-ul prezintă serviciile Prestatorului: design grafic (Canva Pro, pitch deck-uri, bannere, social media), cold emailing și outreach, appointment setting. Conținutul are caracter informativ și nu reprezintă o ofertă fermă. Colaborarea se stabilește printr-o ofertă sau un contract acceptat în scris de ambele părți (inclusiv prin email).",
      s3Title: "3. Clienți",
      s3Text:
        "Serviciile se adresează în principal persoanelor juridice și profesioniștilor (B2B). Dacă ești consumator, se aplică și dispozițiile legale de protecție a consumatorilor.",
      s4Title: "4. Plată",
      s4Text:
        "Tarifele și termenele de plată sunt cele din ofertă. Prestatorul poate cere avans. Întârzierea plății permite suspendarea livrării și aplicarea penalităților prevăzute de lege.",
      s5Title: "5. Livrare și revizii",
      s5Text:
        "Termenele sunt cele din ofertă. Reviziile incluse sunt cele menționate în ofertă; cele suplimentare se taxează separat. Întârzierile clientului în furnizarea materialelor sau a feedback-ului prelungesc termenele corespunzător.",
      s6Title: "6. Drepturi de autor",
      s6Text:
        "Materialele create rămân proprietatea Prestatorului până la plata integrală. După plata integrală, clientul primește dreptul de a folosi livrabilele finale în scopul convenit. Prestatorul poate prezenta lucrările în portofoliu, dacă nu s-a convenit altfel în scris. Clientul garantează că deține drepturile asupra materialelor furnizate de el. Elementele terțe (fonturi, imagini stock, șabloane) sunt supuse licențelor proprii.",
      s7Title: "7. Cold emailing și outreach",
      s7a: "a) Clientul răspunde de legalitatea listelor de contacte furnizate sau aprobate de el și de activitatea sa comercială.",
      s7b: "b) Campaniile respectă legislația aplicabilă (GDPR, Legea 506/2004): mesajele indică expeditorul, motivul contactării și o modalitate simplă de dezabonare, iar cererile de dezabonare se respectă prompt.",
      s7c: "c) Prestatorul poate refuza sau opri o campanie despre care are motive rezonabile să credă că încalcă legea, politicile furnizorilor de email sau drepturile terților.",
      s7d: "d) Când prelucrează date în numele clientului, părțile încheie un acord de prelucrare a datelor (DPA) conform art. 28 GDPR.",
      s7e: "e) Prestatorul nu garantează rate de deschidere, de răspuns sau un anumit număr de întâlniri; rezultatele depind de ofertă, piață, listă și mesaj.",
      s8Title: "8. Appointment setting",
      s8Text:
        "O întâlnire este \"calificată\" conform criteriilor agreate în ofertă. Prestatorul nu răspunde pentru închiderea vânzării.",
      s9Title: "9. Confidențialitate",
      s9Text:
        "Informațiile non-publice primite de la client sunt tratate confidențial și folosite doar pentru executarea colaborării.",
      s10Title: "10. Limitarea răspunderii",
      s10Text:
        "În limitele permise de lege, răspunderea Prestatorului este limitată la suma plătită pentru serviciul în cauză și nu include pierderi indirecte (profit nerealizat, oportunități pierdute). Nu se limitează răspunderea pentru fraudă sau culpă gravă.",
      s11Title: "11. Conținutul site-ului",
      s11Text:
        "Textele, elementele grafice și designul site-ului sunt protejate de drepturi de autor și nu pot fi copiate fără acord scris.",
      s12Title: "12. Forță majoră",
      s12Text:
        "Nicio parte nu răspunde pentru neexecutarea cauzată de forță majoră, cu notificarea celeilalte părți.",
      s13Title: "13. Reclamații și litigii",
      s13Text:
        "Reclamațiile se trimit la adresa de email și primesc răspuns în maximum 30 de zile. Consumatorii se pot adresa ANPC (anpc.ro). Litigiile se rezolvă amiabil, iar în caz contrar de instanțele române competente. Se aplică legea română.",
      s14Title: "14. Modificări",
      s14Text:
        "Prestatorul poate actualiza acești termeni. Versiunea în vigoare este cea publicată pe site.",
    },
  },
  en: {
    navAbout: "About",
    navServices: "Services",
    navSkills: "Skills",
    navContact: "Contact",
    systemActive: "SYSTEM ACTIVE // AVAILABLE FOR PROJECTS",
    heroTitlePart1: "High-End Visual Design & ",
    heroTitlePart2: "Cold Outreach",
    heroSubtitle:
      "I help brands and companies stand out with clean aesthetics and boost their sales with well-calibrated outreach campaigns.",
    profileName: "Daniel Moisă",
    profileRole: "SWING STUDIO",
    profileBio:
      "Passionate about minimalism, clean aesthetics, and digital strategy focused on clear results.",
    talkBtn: "Let's talk",
    missionTitle: "Turn viewer attention into real business opportunities.",
    statAttention: "Detail Focus",
    statFast: "Fast Delivery",
    statFocus: "Results Driven",
    servicesTagline: "// 01. SERVICES",
    servicesHeader: "How I can help you",
    serv1Title: "Graphic Design & Canva Pro",
    serv1Desc:
      "Modern visual materials, pitch decks, promotional banners, and social media visuals crafted to convert.",
    serv2Title: "Cold Emailing & Outreach",
    serv2Desc:
      "Strategic cold email campaigns, persuasive scriptwriting, and deliverability-optimized infrastructure.",
    serv3Title: "Appointment Setting",
    serv3Desc:
      "Converting cold leads into qualified business meetings booked directly into your calendar.",
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
    termsTitle: "TERMS AND CONDITIONS",
    backBtn: "Back to main page",
    footerRights: "All rights reserved.",
    terms: {
      subtitle: "SWING Studio / Daniel Moisă — Last updated: October 2026",
      compliance: "RO & EU Law Compliance / GDPR Compliance",
      s1Title: "1. Service Provider",
      s1Text: "This website is operated by SWING (Daniel Moisă, \"Provider\"), email: borsfandaniel@gmail.com.",
      s2Title: "2. Subject Matter",
      s2Text:
        "The website showcases the Provider's services: graphic design (Canva Pro, pitch decks, banners, social media), cold emailing and outreach, appointment setting. Content is informational and does not represent a binding offer. Collaboration is established through an offer or written contract accepted by both parties (including via email).",
      s3Title: "3. Clients",
      s3Text:
        "Services are primarily aimed at legal entities and professionals (B2B). Consumer protection laws apply if you are an individual consumer.",
      s4Title: "4. Payment",
      s4Text:
        "Rates and payment terms are specified in the offer. The Provider may request an advance payment. Delay in payment permits suspension of delivery and application of statutory penalties.",
      s5Title: "5. Delivery & Revisions",
      s5Text:
        "Deadlines are as agreed in the offer. Revisions included are specified in the offer; additional ones are charged separately. Client delays in providing materials or feedback extend deadlines accordingly.",
      s6Title: "6. Copyright",
      s6Text:
        "Created materials remain Provider property until paid in full. Upon full payment, the client receives rights to use final deliverables for agreed purposes. Provider may showcase work in portfolios unless agreed otherwise in writing. Client guarantees ownership of provided materials. Third-party elements follow their own licenses.",
      s7Title: "7. Cold Emailing & Outreach",
      s7a: "a) The client is responsible for the legality of contact lists provided or approved and their commercial activity.",
      s7b: "b) Campaigns comply with applicable laws (GDPR, Law 506/2004): messages identify sender, contact reason, and easy opt-out mechanism.",
      s7c: "c) Provider reserves the right to suspend campaigns that reasonably appear to violate laws or third-party rights.",
      s7d: "d) A Data Processing Agreement (DPA) under Art. 28 GDPR is executed when processing data on behalf of client.",
      s7e: "e) Provider does not guarantee open, response rates, or exact booking numbers; results depend on market factors.",
      s8Title: "8. Appointment Setting",
      s8Text:
        "A meeting is considered 'qualified' based on criteria defined in the offer. Provider is not responsible for closing sales.",
      s9Title: "9. Confidentiality",
      s9Text:
        "Non-public information received from clients is kept strictly confidential and used solely for contract execution.",
      s10Title: "10. Limitation of Liability",
      s10Text:
        "To the maximum extent permitted by law, Provider's liability is limited to the amount paid for the specific service.",
      s11Title: "11. Website Content",
      s11Text:
        "All text, graphics, and design are protected by copyright and cannot be copied without written consent.",
      s12Title: "12. Force Majeure",
      s12Text: "Neither party is liable for failure caused by force majeure events upon written notification.",
      s13Title: "13. Disputes & Governing Law",
      s13Text:
        "Complaints should be sent via email with response given within 30 days. Romanian law applies.",
      s14Title: "14. Amendments",
      s14Text: "Provider may update these terms. The active version is always published on this page.",
    },
  },
};

function FuturisticNavbar({
  lang,
  setLang,
}: {
  lang: "ro" | "en";
  setLang: (l: "ro" | "en") => void;
}) {
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
              ? "bg-[#FFF3E0]/90 border border-[#D62828]/40 backdrop-blur-2xl shadow-[0_10px_30px_rgba(214,40,40,0.15)]"
              : "bg-[#FFF3E0]/60 border border-[#D62828]/20 backdrop-blur-md shadow-sm"
          }`}
        >
          <a href="#" className="flex items-center gap-3 pl-1 group relative z-10">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#FFF3E0] border border-[#D62828]/30 shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="w-5 h-5 object-contain rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML =
                      '<span class="text-[#D62828] font-black text-sm tracking-tighter">S</span>';
                  }
                }}
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFF3E0] opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFF3E0] border border-[#D62828]/50 shadow-sm"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.2em] text-xs text-[#2B0808] group-hover:text-[#D62828] transition-colors">
                SWING
              </span>
              <span className="text-[8px] text-[#2B0808]/70 tracking-widest uppercase font-mono">
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
                    isActive ? "text-[#FFF3E0]" : "text-[#2B0808]/80 hover:text-[#D62828]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="futuristicTab"
                      className="absolute inset-0 bg-[#D62828] rounded-full shadow-[0_2px_10px_rgba(214,40,40,0.4)]"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center bg-[#FCE8D5] border border-[#D62828]/30 rounded-full p-1 relative shadow-inner">
              <Globe size={13} className="text-[#D62828] ml-1.5 mr-1 hidden sm:block" />
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "ro" ? "text-[#FFF3E0]" : "text-[#2B0808]/70 hover:text-[#2B0808]"
                }`}
              >
                {lang === "ro" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#D62828] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">RO</span>
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "en" ? "text-[#FFF3E0]" : "text-[#2B0808]/70 hover:text-[#2B0808]"
                }`}
              >
                {lang === "en" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#D62828] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 text-[10px] font-mono text-[#D62828] tracking-wider uppercase font-bold">
              <Cpu size={12} className="text-[#D62828] animate-pulse" />
              <span>ONLINE</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#D62828] text-[#FFF3E0] transition-colors"
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
            className="fixed inset-0 z-30 bg-[#FFF3E0]/98 backdrop-blur-3xl md:hidden pt-28 px-6 pb-12 flex flex-col justify-between border-b border-[#D62828]/30"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D62828]/20 pb-4">
                <span className="text-[10px] font-mono text-[#D62828] font-bold tracking-widest uppercase bg-[#D62828]/10 px-3 py-1 rounded-full border border-[#D62828]/30">
                  SYSTEM // NAVIGATION
                </span>
                <span className="text-[10px] font-mono text-[#2B0808]/50">v2.6</span>
              </div>
              <div className="space-y-3">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#FCE8D5] border border-[#D62828]/30 text-base font-bold text-[#2B0808] hover:text-[#D62828] transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#D62828]">0{idx + 1}</span>
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#D62828]" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-[#D62828]/20">
              <div className="flex items-center justify-between text-xs text-[#2B0808]/60 font-mono">
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

{/* PAGINA DEDICATĂ PENTRU TERMENI ȘI CONDIŢII */}
function TermsPage({
  onBack,
  lang,
  setLang,
}: {
  onBack: () => void;
  lang: "ro" | "en";
  setLang: (l: "ro" | "en") => void;
}) {
  const t = translations[lang];
  const terms = t.terms;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] font-sans antialiased py-12 px-4 sm:px-8 relative z-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#D62828] bg-[#D62828]/10 border border-[#D62828]/30 px-4 py-2 rounded-full hover:bg-[#D62828] hover:text-[#FFF3E0] transition-all cursor-pointer font-bold"
          >
            <ArrowLeft size={14} />
            <span>{t.backBtn}</span>
          </button>

          <div className="flex items-center bg-[#FCE8D5] border border-[#D62828]/30 rounded-full p-1 relative shadow-inner">
            <button
              type="button"
              onClick={() => setLang("ro")}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full transition-all cursor-pointer ${
                lang === "ro" ? "bg-[#D62828] text-[#FFF3E0]" : "text-[#2B0808]/70 hover:text-[#2B0808]"
              }`}
            >
              RO
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full transition-all cursor-pointer ${
                lang === "en" ? "bg-[#D62828] text-[#FFF3E0]" : "text-[#2B0808]/70 hover:text-[#2B0808]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="bg-[#FCE8D5]/80 border border-[#D62828]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-[#D62828]/20 pb-6">
            <Scale className="text-[#D62828]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#2B0808]">{t.termsTitle}</h1>
              <p className="text-xs font-mono text-[#2B0808]/70">{terms.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#D62828]/10 p-4 rounded-2xl border border-[#D62828]/20 text-xs font-mono">
            <span className="text-[#2B0808] font-semibold flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#D62828]" />
              {terms.compliance}
            </span>
            <span className="text-[#2B0808]/50">2026</span>
          </div>

          <div className="space-y-6 text-sm text-[#2B0808]/80 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s1Title}
              </h2>
              <p>{terms.s1Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s2Title}
              </h2>
              <p>{terms.s2Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s3Title}
              </h2>
              <p>{terms.s3Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s4Title}
              </h2>
              <p>{terms.s4Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s5Title}
              </h2>
              <p>{terms.s5Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s6Title}
              </h2>
              <p>{terms.s6Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s7Title}
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>{terms.s7a}</li>
                <li>{terms.s7b}</li>
                <li>{terms.s7c}</li>
                <li>{terms.s7d}</li>
                <li>{terms.s7e}</li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s8Title}
              </h2>
              <p>{terms.s8Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s9Title}
              </h2>
              <p>{terms.s9Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s10Title}
              </h2>
              <p>{terms.s10Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s11Title}
              </h2>
              <p>{terms.s11Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s12Title}
              </h2>
              <p>{terms.s12Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s13Title}
              </h2>
              <p>{terms.s13Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#D62828] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s14Title}
              </h2>
              <p>{terms.s14Text}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<"ro" | "en">("ro");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    acceptedTerms: false,
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
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
      title: t.serv1Title,
      desc: t.serv1Desc,
      icon: <Palette size={24} className="text-[#D62828]" />,
    },
    {
      title: t.serv2Title,
      desc: t.serv2Desc,
      icon: <Send size={24} className="text-[#D62828]" />,
    },
    {
      title: t.serv3Title,
      desc: t.serv3Desc,
      icon: <CalendarCheck size={24} className="text-[#D62828]" />,
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
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] selection:bg-[#D62828] selection:text-[#FFF3E0] font-sans antialiased overflow-x-hidden relative">
      <FuturisticNavbar lang={lang} setLang={setLang} />

      {/* BACKGROUND MESH & AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#D62828 1px, transparent 1px), linear-gradient(to right, #D62828 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#D62828]/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] left-[-10%] w-[450px] h-[450px] bg-[#D62828]/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 pt-32 sm:pt-40 pb-32 px-6 sm:px-8 max-w-6xl mx-auto space-y-36 md:space-y-44">
        {/* HERO SECTION */}
        <section id="about" className="scroll-mt-40 space-y-12">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 backdrop-blur-xl shadow-sm"
            >
              <Zap size={13} className="text-[#D62828]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#D62828] uppercase">
                {t.systemActive}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#2B0808] leading-[1.08]"
            >
              {t.heroTitlePart1}
              <span className="text-[#D62828]">{t.heroTitlePart2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg text-[#2B0808]/70 max-w-2xl mx-auto font-normal leading-relaxed"
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
              className="md:col-span-5 bg-[#FCE8D5]/90 border border-[#D62828]/30 hover:border-[#D62828] rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 shadow-sm"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#D62828]/10 border border-[#D62828]/30 flex items-center justify-center text-[#D62828]">
                    <Sparkles size={22} className="text-[#D62828]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#2B0808]/50 font-bold">
                    [PROFILE]
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-[#2B0808]">{t.profileName}</h3>
                  <p className="text-xs font-mono font-bold text-[#D62828] tracking-widest uppercase">
                    {t.profileRole}
                  </p>
                </div>
                <p className="text-sm text-[#2B0808]/70 leading-relaxed font-normal">
                  {t.profileBio}
                </p>
              </div>
              <div className="pt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#D62828] hover:bg-[#2B0808] text-[#FFF3E0] text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md"
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
              className="md:col-span-7 bg-[#FCE8D5]/90 border border-[#D62828]/30 hover:border-[#D62828] rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between relative group transition-all duration-500 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-lg">
                  <span className="text-[10px] font-mono font-bold text-[#D62828] uppercase tracking-widest bg-[#D62828]/10 px-3.5 py-1.5 rounded-full border border-[#D62828]/30 inline-block">
                    [TARGET_MISSION]
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#2B0808] leading-snug">
                    {t.missionTitle}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-[#D62828]/10 border border-[#D62828]/20 text-[#D62828] hidden sm:block">
                  <Target size={26} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-10">
                <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#D62828]/20 text-center space-y-1">
                  <p className="text-xl font-black text-[#D62828]">100%</p>
                  <p className="text-[9px] font-mono text-[#2B0808]/60 uppercase tracking-wider font-bold">
                    {t.statAttention}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#D62828]/20 text-center space-y-1">
                  <p className="text-xl font-black text-[#D62828]">Fast</p>
                  <p className="text-[9px] font-mono text-[#2B0808]/60 uppercase tracking-wider font-bold">
                    {t.statFast}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#D62828]/20 text-center space-y-1">
                  <p className="text-xl font-black text-[#D62828]">B2B</p>
                  <p className="text-[9px] font-mono text-[#2B0808]/60 uppercase tracking-wider font-bold">
                    {t.statFocus}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SERVICII */}
        <section id="services" className="scroll-mt-40 space-y-12">
          <div className="flex items-end justify-between border-b border-[#D62828]/30 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#D62828] uppercase tracking-widest">
                {t.servicesTagline}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2B0808]">
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
                className="bg-[#FCE8D5]/90 border border-[#D62828]/30 hover:border-[#D62828] rounded-[2rem] p-8 flex flex-col justify-between group transition-all duration-500 hover:-translate-y-2 hover:shadow-md relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#D62828]/10 border border-[#D62828]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#2B0808] group-hover:text-[#D62828] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#2B0808]/70 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABILITATI */}
        <section id="skills" className="scroll-mt-40 space-y-10">
          <div className="space-y-2 border-b border-[#D62828]/30 pb-6">
            <span className="text-xs font-mono font-bold text-[#D62828] uppercase tracking-widest">
              {t.skillsTagline}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2B0808]">
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
                className="px-6 py-3.5 rounded-2xl bg-[#FCE8D5] border border-[#D62828]/30 hover:border-[#D62828] hover:bg-[#D62828] hover:text-[#FFF3E0] text-[#2B0808] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-40">
          <div className="bg-[#FCE8D5]/90 border border-[#D62828]/40 rounded-[2.5rem] p-8 sm:p-14 relative overflow-hidden shadow-lg">
            <div className="max-w-2xl space-y-8 relative z-10">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#D62828] uppercase tracking-widest">
                  {t.contactTagline}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2B0808]">
                  {t.contactHeader}
                </h2>
                <p className="text-sm text-[#2B0808]/70 leading-relaxed">
                  {t.contactSubtitle}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-[#2B0808]/70 uppercase tracking-wider">
                      {t.fieldName}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.placeholderName}
                        className="w-full bg-[#FFF3E0] border border-[#D62828]/30 rounded-2xl px-5 py-3.5 text-sm text-[#2B0808] placeholder:text-[#2B0808]/40 focus:outline-none focus:border-[#D62828] transition-colors pl-12"
                      />
                      <User size={18} className="absolute left-4 top-3.5 text-[#D62828]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-[#2B0808]/70 uppercase tracking-wider">
                      {t.fieldEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.placeholderEmail}
                        className="w-full bg-[#FFF3E0] border border-[#D62828]/30 rounded-2xl px-5 py-3.5 text-sm text-[#2B0808] placeholder:text-[#2B0808]/40 focus:outline-none focus:border-[#D62828] transition-colors pl-12"
                      />
                      <Mail size={18} className="absolute left-4 top-3.5 text-[#D62828]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-[#2B0808]/70 uppercase tracking-wider">
                    {t.fieldMessage}
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.placeholderMessage}
                      className="w-full bg-[#FFF3E0] border border-[#D62828]/30 rounded-2xl px-5 py-3.5 text-sm text-[#2B0808] placeholder:text-[#2B0808]/40 focus:outline-none focus:border-[#D62828] transition-colors pl-12 pt-3.5 resize-none"
                    />
                    <MessageSquare size={18} className="absolute left-4 top-3.5 text-[#D62828]" />
                  </div>
                </div>

                {/* LINK TERMENI SI CONDITII */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.acceptedTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, acceptedTerms: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 rounded border-[#D62828] bg-[#FFF3E0] text-[#D62828] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-[#2B0808]/70 leading-normal cursor-pointer select-none"
                  >
                    {t.termsCheckbox}{" "}
                    <button
                      type="button"
                      onClick={() => setCurrentPage("terms")}
                      className="text-[#D62828] underline hover:text-[#2B0808] font-bold transition-colors cursor-pointer"
                    >
                      {t.termsLink}
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#D62828] hover:bg-[#2B0808] text-[#FFF3E0] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
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
                  <div className="flex items-center gap-2.5 text-[#D62828] text-sm font-bold pt-2">
                    <CheckCircle2 size={18} className="text-[#D62828]" />
                    <span>{t.successMsg}</span>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="flex items-center gap-2.5 text-red-600 text-sm font-bold pt-2">
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
      <footer className="border-t border-[#D62828]/30 py-10 px-6 sm:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#2B0808]/60 font-mono">
        <p>© {new Date().getFullYear()} SWING (Daniel Moisă). {t.footerRights}</p>
        <div className="flex flex-wrap items-center justify-center gap-6 font-bold">
          <button
            onClick={() => setCurrentPage("terms")}
            className="hover:text-[#D62828] transition-colors cursor-pointer"
          >
            Termeni & Condiții Legal
          </button>
          <button
            onClick={() => setCurrentPage("terms")}
            className="hover:text-[#D62828] transition-colors cursor-pointer"
          >
            Confidențialitate GDPR
          </button>
          <a
            href="https://anpc.ro/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D62828] transition-colors"
          >
            ANPC
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#D62828] transition-colors"
          >
            Platforma SOL (UE)
          </a>
        </div>
      </footer>
    </div>
  );
}