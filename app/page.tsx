"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Ghost,
  Flame,
  Moon,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    heroTitlePart1: "SWING CHANGE ",
    heroTitlePart2: "THE GAME",
    heroSubtitle:
      "Construiesc sisteme web rapide, pagini de vânzare optimizate și procese directe de calificare care transformă contactele în clienți reali.",
    profileName: "Moisă Ionuț Daniel",
    profileRole: "SWING STUDIO",
    profileBio:
      "Lucrez direct cu fondatori și echipe B2B pentru a construi platforme web performante, copywriting de impact și lead-uri calificate  fără intermediari sau birocrație inutilă.",
    talkBtn: "Hai să discutăm",
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
    systemActive: "Available for new projects",
    seasonalTag: "SWING MOISĂ IONUȚ DANIEL",
    seasonalBadge: "SYSTEM",
    heroTitlePart1: "SWING CHANGE ",
    heroTitlePart2: "THE GAME",
    heroSubtitle:
      "Building high-speed web systems, direct-response copy, and qualified appointment pipelines engineered for real business growth.",
    profileName: "Moisă Ionuț Daniel",
    profileRole: "SWING STUDIO",
    profileBio:
      "I work directly with founders and B2B teams to build high-performance web systems, sharp sales copy, and qualified appointment pipelines — without unnecessary agency overhead.",
    talkBtn: "Let's talk",
    missionTitle: "From the first cold impression to booked sales conversations.",
    statAttention: "Zero Ghosting",
    statAttentionSub: "Direct Sync",
    statAttentionDesc:
      "Guaranteed transparent communication: fast responses, proactive progress reports, and zero radio silence. You never have to chase for updates or wonder where things stand.",
    statFast: "Crystal Clear",
    statFastSub: "No Ambiguity",
    statFastDesc:
      "Predictable and honest workflow: you know upfront the exact deliverables, agreed milestones, firm deadlines, and fixed pricing. No hidden fees or confusing jargon.",
    statFocus: "Real B2B Results",
    statFocusSub: "All Treats, No Tricks",
    statFocusDesc:
      "Measurable commercial impact: persuasive sales decks, high-deliverability outreach, and booked meetings with qualified decision-makers, not empty vanity metrics.",
    servicesTagline: "Services",
    servicesHeader: "How I can help you grow",
    serv1Title: "Web Development & Landing Pages",
    serv1Desc:
      "High-speed business websites and conversion-optimized landing pages engineered for speed, clean UX, and results.",
    serv2Title: "Appointment Setting & Calls",
    serv2Desc:
      "Qualifying incoming leads, handling objections, and booking qualified 1-on-1 sales calls directly into your calendar.",
    skillsTagline: "Competencies",
    skillsHeader: "Skills & Stack",
    contactTagline: "Direct Contact",
    contactHeader: "Let's collaborate",
    contactSubtitle: "Send me a few details about your project and I will get back within 24 hours with a clear plan.",
    contactNote: "Guaranteed reply within 24 hours. You talk directly with Moisă Ionuț Daniel, without middlemen.",
    fieldName: "Full Name",
    fieldEmail: "Email Address",
    fieldMessage: "Project Details / Request",
    placeholderName: "Your name",
    placeholderEmail: "address@email.com",
    placeholderMessage: "Tell me briefly about what you want to build...",
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
              ? "bg-white/95 border border-[#FF5400]/40 backdrop-blur-2xl shadow-[0_10px_30px_rgba(255,84,0,0.12)]"
              : "bg-white/90 border border-zinc-200 backdrop-blur-md shadow-xs"
          }`}
        >
          <a href="#" className="flex items-center gap-3 pl-1 group relative z-10">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#FF5400]/30 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="w-5 h-5 object-contain rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML =
                      '<span class="text-[#FF5400] font-black text-sm tracking-tighter">S</span>';
                  }
                }}
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5400] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5400] border border-white shadow-xs"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.2em] text-xs text-zinc-950 group-hover:text-[#FF5400] transition-colors">
                SWING
              </span>
              <span className="text-[8px] text-[#FF5400] font-bold tracking-widest uppercase font-mono">
                MOISĂ IONUȚ DANIEL
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
                    isActive ? "text-white" : "text-zinc-600 hover:text-[#FF5400]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="futuristicTab"
                      className="absolute inset-0 bg-[#FF5400] rounded-full shadow-[0_2px_12px_rgba(255,84,0,0.35)]"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 relative shadow-xs">
              <Globe size={13} className="text-[#FF5400] ml-1.5 mr-1 hidden sm:block" />
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "ro" ? "text-white" : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {lang === "ro" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#FF5400] rounded-full shadow-xs"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">RO</span>
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "en" ? "text-white" : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {lang === "en" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#FF5400] rounded-full shadow-xs"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>

            {/* SHORTCUT DASHBOARD PE MOBIL */}
            <Link
              href="/dashboard"
              className="md:hidden p-2 rounded-full bg-white border border-orange-500/30 text-[#FF5400] hover:bg-[#FF5400] hover:text-white transition-colors shadow-2xs"
              title="Dashboard Admin"
            >
              <LayoutDashboard size={18} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#FF5400] text-white transition-colors shadow-2xs"
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
            className="fixed inset-0 z-30 bg-white/98 backdrop-blur-3xl md:hidden pt-28 px-6 pb-12 flex flex-col justify-between border-b border-orange-500/20"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  Meniu Navigare
                </span>
                <span className="text-[10px] font-mono text-[#FF5400] font-bold">SWING STUDIO</span>
              </div>
              <div className="space-y-3">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200 text-base font-bold text-zinc-950 hover:border-[#FF5400] hover:text-[#FF5400] transition-all active:scale-[0.98] shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#FF5400]">0{idx + 1}</span>
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#FF5400]" />
                  </a>
                ))}

                {/* ACCES RAPID DASHBOARD PE TELEFON */}
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-orange-500/10 border-2 border-orange-500/25 text-zinc-950 hover:bg-[#FF5400] hover:text-white transition-all active:scale-[0.98] shadow-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FF5400] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#FF5400] transition-colors shadow-2xs">
                        <LayoutDashboard size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black">Dashboard & Lead-uri</div>
                        <div className="text-[10px] font-mono text-[#FF5400] group-hover:text-white/90 font-bold uppercase">
                          Panou Admin →
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#FF5400] group-hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-mono font-medium">
                <span className="text-[#FF5400] font-bold">Moisă Ionuț Daniel</span>
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased py-12 px-4 sm:px-8 relative z-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white transition-all cursor-pointer font-bold"
          >
            <ArrowLeft size={14} />
            <span>{t.backBtn}</span>
          </button>

          <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 relative shadow-xs">
            <button
              type="button"
              onClick={() => setLang("ro")}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full transition-all cursor-pointer ${
                lang === "ro" ? "bg-[#FF5400] text-white" : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              RO
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full transition-all cursor-pointer ${
                lang === "en" ? "bg-[#FF5400] text-white" : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-orange-500/20 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-6">
            <Scale className="text-[#FF5400]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-950">{t.termsTitle}</h1>
              <p className="text-xs font-mono text-zinc-500">{terms.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 text-xs font-mono">
            <span className="text-zinc-950 font-semibold flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FF5400]" />
              {terms.compliance}
            </span>
            <span className="text-zinc-400">2026</span>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s1Title}
              </h2>
              <p>{terms.s1Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s2Title}
              </h2>
              <p>{terms.s2Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s3Title}
              </h2>
              <p>{terms.s3Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s4Title}
              </h2>
              <p>{terms.s4Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s5Title}
              </h2>
              <p>{terms.s5Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s6Title}
              </h2>
              <p>{terms.s6Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
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
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s8Title}
              </h2>
              <p>{terms.s8Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s9Title}
              </h2>
              <p>{terms.s9Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s10Title}
              </h2>
              <p>{terms.s10Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s11Title}
              </h2>
              <p>{terms.s11Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s12Title}
              </h2>
              <p>{terms.s12Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                {terms.s13Title}
              </h2>
              <p>{terms.s13Text}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
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
      icon: <Cpu size={24} />,
    },
    {
      title: t.serv2Title,
      desc: t.serv2Desc,
      icon: <CalendarCheck size={24} />,
    },
  ];

  const skillsData = {
    ro: [
      {
        name: "Web Development",
        icon: <Cpu size={20} />,
        desc: "Construiesc landing pages orientate pe conversie și site-uri moderne de prezentare, ultra-rapide, responsive și optimizate pentru claritate și viteză.",
      },
      {
        name: "Appointment Setting",
        icon: <CalendarCheck size={20} />,
        desc: "Calific contactele primite, elimin obiecțiile timpurii și programez întâlniri 1-la-1 cu factori de decizie direct în calendarul tău de vânzări.",
      },
    ],
    en: [
      {
        name: "Web Development",
        icon: <Cpu size={20} />,
        desc: "I develop fast, responsive landing pages and business websites engineered for conversion, speed, and seamless navigation.",
      },
      {
        name: "Appointment Setting",
        icon: <CalendarCheck size={20} />,
        desc: "I qualify prospective leads, handle early objections, and book high-intent 1-on-1 sales calls with decision-makers directly into your calendar.",
      },
    ],
  };

  if (currentPage === "terms") {
    return <TermsPage onBack={() => setCurrentPage("home")} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 selection:bg-[#FF5400] selection:text-white font-sans antialiased overflow-x-hidden relative">
      <FuturisticNavbar lang={lang} setLang={setLang} />

      {/* MINIMAL AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#FF5400]/[0.05] to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      <main className="relative z-10 pt-32 sm:pt-40 pb-32 px-6 sm:px-8 max-w-6xl mx-auto space-y-32 md:space-y-40">
        {/* HERO SECTION */}
        <section id="about" className="scroll-mt-40 space-y-12">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-orange-500/30 shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5400] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5400]"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-900 uppercase">
                {t.seasonalTag}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-950 text-[#FF5400] font-bold uppercase tracking-wider border border-zinc-800">
                {t.seasonalBadge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-950 leading-[1.08]"
            >
              {t.heroTitlePart1}
              <span className="text-[#FF5400]">{t.heroTitlePart2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              {t.heroSubtitle}
            </motion.p>
          </div>

          {/* CARD PROFILE */}
          <div className="max-w-3xl mx-auto pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-[2.5rem] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative group transition-all duration-300 shadow-sm hover:shadow-[0_12px_36px_rgba(255,84,0,0.1)]"
            >
              <div className="space-y-5 flex-1">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#FF5400]/30 flex items-center justify-center p-2 shadow-xs shrink-0">
                    <img src="/logo.png" alt="SWING Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 leading-tight">
                      {t.profileName}
                    </h3>
                    <p className="text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
                      <span className="text-[#FF5400]">SWING</span>
                      <span className="text-zinc-300"></span>
                      <span className="text-zinc-500">STUDIO</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {t.profileBio}
                </p>
              </div>
              <div className="shrink-0 self-start sm:self-center">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-[#FF5400] hover:bg-[#E04800] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(255,84,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,84,0,0.35)]"
                >
                  <span>{t.talkBtn}</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SERVICII */}
        <section id="services" className="scroll-mt-40 space-y-12">
          <div className="flex items-end justify-between border-b border-orange-500/20 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#FF5400] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-0.5 bg-[#FF5400]" />
                {t.servicesTagline}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950">
                {lang === "ro" ? (
                  <>Cum te pot ajuta <span className="text-[#FF5400]">să crești</span></>
                ) : (
                  <>How I can help you <span className="text-[#FF5400]">scale</span></>
                )}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesList.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-[2rem] p-8 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-[0_12px_36px_rgba(255,84,0,0.12)] relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5400] group-hover:bg-[#FF5400] group-hover:text-white group-active:bg-[#FF5400] group-active:text-white active:bg-[#FF5400] active:text-white [&>svg]:transition-colors transition-all shadow-xs">
                      {service.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-[#FF5400] transition-colors">
                      0{index + 1} 
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950 group-hover:text-[#FF5400] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABILITATI & UNELTE */}
        <section id="skills" className="scroll-mt-40 space-y-10">
          <div className="space-y-2 border-b border-orange-500/20 pb-6">
            <span className="text-xs font-mono font-bold text-[#FF5400] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-0.5 bg-[#FF5400]" />
              {t.skillsTagline}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950">
              {lang === "ro" ? (
                <>Abilități & <span className="text-[#FF5400]">Unelte</span></>
              ) : (
                <>Skills & <span className="text-[#FF5400]">Tools</span></>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsData[lang].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-[0_12px_36px_rgba(255,84,0,0.12)] relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5400] group-hover:bg-[#FF5400] group-hover:text-white group-active:bg-[#FF5400] group-active:text-white active:bg-[#FF5400] active:text-white [&>svg]:transition-colors transition-all shadow-xs">
                      {skill.icon}
                    </div>
                   
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-zinc-950 group-hover:text-[#FF5400] transition-colors">
                      {skill.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5400]" />
                      <span className="text-zinc-500">{lang === "ro" ? "Ce pot să fac:" : "What I can do:"}</span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 leading-relaxed font-normal pt-2 border-t border-orange-500/15">
                    {skill.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-40">
          <div className="bg-white border-2 border-orange-500/30 rounded-[2.5rem] p-8 sm:p-14 relative overflow-hidden shadow-sm">
            <div className="max-w-2xl space-y-8 relative z-10">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#FF5400] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-0.5 bg-[#FF5400]" />
                {t.contactTagline}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950">
                  {lang === "ro" ? (
                    <>Hai să <span className="text-[#FF5400]">colaborăm</span></>
                  ) : (
                    <>Let&apos;s <span className="text-[#FF5400]">connect</span></>
                  )}
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {t.contactSubtitle}
                </p>

                {/* NOTĂ PERSONALĂ DANIEL MOISĂ */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/25 text-xs text-zinc-900 font-medium">
                    <span className="font-mono font-bold text-[#FF5400]">SWING</span>
                    <span className="text-zinc-700">{t.contactNote}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                      {t.fieldName}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.placeholderName}
                        className="w-full bg-white border-2 border-zinc-200 rounded-2xl px-5 py-3.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-[#FF5400] transition-colors pl-12 shadow-xs"
                      />
                      <User size={18} className="absolute left-4 top-3.5 text-[#FF5400]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                      {t.fieldEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.placeholderEmail}
                        className="w-full bg-white border-2 border-zinc-200 rounded-2xl px-5 py-3.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-[#FF5400] transition-colors pl-12 shadow-xs"
                      />
                      <Mail size={18} className="absolute left-4 top-3.5 text-[#FF5400]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                    {t.fieldMessage}
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.placeholderMessage}
                      className="w-full bg-white border-2 border-zinc-200 rounded-2xl px-5 py-3.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-[#FF5400] transition-colors pl-12 pt-3.5 resize-none shadow-xs"
                    />
                    <MessageSquare size={18} className="absolute left-4 top-3.5 text-[#FF5400]" />
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
                    className="mt-1 w-4 h-4 rounded border-zinc-300 bg-white text-[#FF5400] focus:ring-[#FF5400] cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-zinc-600 leading-normal cursor-pointer select-none"
                  >
                    {t.termsCheckbox}{" "}
                    <button
                      type="button"
                      onClick={() => setCurrentPage("terms")}
                      className="text-[#FF5400] underline hover:text-zinc-950 font-bold transition-colors cursor-pointer"
                    >
                      {t.termsLink}
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#FF5400] hover:bg-[#E04800] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(255,84,0,0.3)] hover:shadow-[0_6px_24px_rgba(255,84,0,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
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
                  <div className="flex items-center gap-2.5 text-emerald-600 text-sm font-bold pt-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
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
      <footer className="border-t border-orange-500/20 py-10 px-6 sm:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
        <p>© {new Date().getFullYear()} SWING (Daniel Moisă). {t.footerRights}</p>
        <div className="flex flex-wrap items-center justify-center gap-6 font-bold">
          <button
            onClick={() => setCurrentPage("terms")}
            className="hover:text-[#FF5400] transition-colors cursor-pointer"
          >
            Termeni & Condiții Legal
          </button>
          <button
            onClick={() => setCurrentPage("terms")}
            className="hover:text-[#FF5400] transition-colors cursor-pointer"
          >
            Confidențialitate GDPR
          </button>
          <a
            href="https://anpc.ro/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF5400] transition-colors"
          >
            ANPC
          </a>
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF5400] transition-colors"
          >
            Platforma SOL (UE)
          </a>
        </div>
      </footer>
    </div>
  );
}