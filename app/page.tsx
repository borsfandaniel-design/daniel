"use client";

import React, { useState, useEffect } from "react";
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
  ArrowLeftIcon,
  ShieldIcon,
  ScaleIcon,
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
      subtitle: "SWING Studio / Daniel Moisă - Ultima actualizare: Octombrie 2026",
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
      subtitle: "SWING Studio / Daniel Moisă - Last updated: October 2026",
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
  theme,
  toggleTheme,
}: {
  lang: "ro" | "en";
  setLang: (l: "ro" | "en") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
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
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-5 pointer-events-none flex justify-center">
        <div
          className={`relative max-w-4xl w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-colors duration-200 pointer-events-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm`}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/");
            }}
            className="flex items-center gap-3 pl-1 group relative z-10"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
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
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-xs text-zinc-950 dark:text-white">
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
                  href={`/${link.slug}`}
                  onClick={(e) => handleNavClick(e, link.id, link.slug)}
                  className={`relative px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="futuristicTab"
                      className="absolute inset-0 bg-[#FF5400] rounded-full"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 relative z-10">
            {/* Buton Dark Mode / Light Mode */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Comută pe modul luminos" : "Comută pe modul întunecat"}
              title={theme === "dark" ? "Mod Luminos" : "Mod Întunecat"}
              className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:text-[#FF5400] dark:hover:text-[#FF5400] transition-colors cursor-pointer flex items-center justify-center"
            >
              {theme === "dark" ? (
                <SunIcon size={15} className="text-zinc-200" />
              ) : (
                <MoonIcon size={15} className="text-zinc-700" />
              )}
            </button>

            {/* Selector Limbă */}
            <div className="flex items-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full p-1 relative">
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "ro"
                    ? "text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {lang === "ro" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#FF5400] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">RO</span>
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`relative px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "en"
                    ? "text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {lang === "en" && (
                  <motion.div
                    layoutId="langPill"
                    className="absolute inset-0 bg-[#FF5400] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-30 bg-white dark:bg-zinc-950 md:hidden pt-24 px-6 pb-12 flex flex-col justify-between border-b border-zinc-200 dark:border-zinc-800"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100 uppercase tracking-wider">
                  Meniu Navigare
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-bold">SWING STUDIO</span>
              </div>
              <div className="space-y-2">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.id}
                    href={`/${link.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      const element = document.getElementById(link.id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      window.history.pushState(null, "", `/${link.slug}`);
                    }}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-950 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-400">0{idx + 1}</span>
                      <span>{link.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-mono font-medium">
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">Moisă Ionuț Daniel</span>
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
  theme,
  toggleTheme,
}: {
  onBack: () => void;
  lang: "ro" | "en";
  setLang: (l: "ro" | "en") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const t = translations[lang];
  const terms = t.terms;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans antialiased py-12 px-4 sm:px-8 relative z-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-900 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-700 transition-colors cursor-pointer font-bold"
          >
            <ArrowLeftIcon size={14} />
            <span>{t.backBtn}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:text-[#FF5400] transition-colors cursor-pointer flex items-center justify-center"
            >
              {theme === "dark" ? (
                <SunIcon size={15} className="text-zinc-200" />
              ) : (
                <MoonIcon size={15} className="text-zinc-700" />
              )}
            </button>

            <div className="flex items-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full p-1 relative">
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "ro"
                    ? "bg-[#FF5400] text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                RO
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-[#FF5400] text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <ScaleIcon className="text-zinc-900 dark:text-zinc-100" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">{t.termsTitle}</h1>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{terms.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold flex items-center gap-2">
              <ShieldIcon size={16} className="text-[#FF5400]" />
              {terms.compliance}
            </span>
            <span className="text-zinc-400">2026</span>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
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
  const [currentPage, setCurrentPage] = useState<"home" | "terms">("home");
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
    setFormStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "", acceptedTerms: false, website_hp: "" });
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
      icon: <CodeIcon size={20} />,
    },
    {
      title: t.serv2Title,
      desc: t.serv2Desc,
      icon: <CalendarIcon size={20} />,
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

  if (currentPage === "terms") {
    return (
      <TermsPage
        onBack={() => setCurrentPage("home")}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

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
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-2 shrink-0">
                    <img src="/logo.png" alt="SWING Logo" className="w-full h-full object-contain" />
                  </div>
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
              <div className="shrink-0">
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "/contact");
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#FF5400] hover:bg-[#E04800] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>{t.talkBtn}</span>
                </a>
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
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors shadow-sm"
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
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-start justify-between gap-5 transition-colors shadow-sm"
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
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-sm">
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
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors pl-11"
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
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors pl-11"
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
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors pl-11 pt-3 resize-none"
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
                    <button
                      type="button"
                      onClick={() => setCurrentPage("terms")}
                      className="text-zinc-950 dark:text-white underline font-bold transition-colors cursor-pointer"
                    >
                      {t.termsLink}
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#FF5400] hover:bg-[#E04800] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
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
          <button
            onClick={() => setCurrentPage("terms")}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Termeni & Condiții Legal
          </button>
          <button
            onClick={() => setCurrentPage("terms")}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Confidențialitate GDPR
          </button>
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