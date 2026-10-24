"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ScaleIcon,
  ShieldIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
} from "../components/Icons";

const termsData = {
  ro: {
    backBtn: "Înapoi la site",
    pageTitle: "TERMENI ȘI CONDIȚII DE UTILIZARE",
    pageSubtitle: "SWING Studio | Moisă Ionuț Daniel - Versiunea oficială actualizată la zi (2026)",
    legalBadge: "Conformitate Legislație România & Uniunea Europeană (GDPR)",
    introSummary:
      "Prezentele clauze contractuale și condiții generale guvernează accesul pe acest site web și furnizarea serviciilor profesionale de dezvoltare web, landing pages și appointment setting de către SWING (Moisă Ionuț Daniel). Vă rugăm să citiți cu atenție prevederile înainte de a trimite o solicitare de colaborare.",
    quickNavTitle: "Navigare rapidă prin secțiuni",
    sections: [
      {
        id: "prestator",
        number: "01",
        title: "Identificarea Prestatorului",
        content:
          "Platforma online SWING și toate serviciile asociate sunt operate și furnizate de către Moisă Ionuț Daniel (denumit în continuare \"Prestatorul\" sau \"SWING\"), cu adresa de corespondență electronică oficială: borsfandaniel@gmail.com. Orice comunicare formală sau notificare legală transmisă către Prestator se realizează prin intermediul acestui canal digital oficial.",
      },
      {
        id: "aplicare",
        number: "02",
        title: "Domeniul de Aplicare și Acceptarea Termenilor",
        content:
          "Accesarea site-ului, completarea formularului de contact sau inițierea oricărei discuții comerciale reprezintă acceptarea deplină a acestor Termeni și Condiții. Serviciile oferite se adresează cu prioritate persoanelor juridice, companiilor și profesioniștilor independenți (relații B2B). În măsura în care un utilizator acționează în calitate de consumator persoană fizică, acesta beneficiază de toate drepturile conferite de legislația aplicabilă privind protecția consumatorilor din România.",
      },
      {
        id: "servicii",
        number: "03",
        title: "Descrierea Serviciilor",
        content:
          "SWING oferă servicii specializate în mediul digital, incluzând, dar fără a se limita la:",
        list: [
          "Dezvoltare web modernă, optimizare de performanță, arhitectură frontend și landing pages concepute pentru conversie maximă;",
          "Sisteme și procese de calificare a contactelor comerciale și programare de întâlniri de vânzări (Appointment Setting B2B);",
          "Consultanță strategică privind copywriting-ul comercial, poziționarea ofertelor și optimizarea fluxurilor digitale de achiziție de clienți.",
        ],
        extra:
          "Informațiile prezentate pe site au un caracter informativ și orientativ, neconstituind o ofertă fermă și obligatorie de a contracta în lipsa unei confirmări scrise individuale.",
      },
      {
        id: "contractare",
        number: "04",
        title: "Procesul de Contractare și Încheierea Acordului",
        content:
          "Colaborarea formală dintre Prestator și Client se perfectează printr-o ofertă comercială agreată în scris (inclusiv prin e-mail sau semnătură electronică) sau printr-un contract individual de prestări servicii. Oferta va stipula în mod expres livrabilele convenite, etapele de implementare, termenele limită de predare și costurile aferente fiecărei faze a proiectului.",
      },
      {
        id: "preturi",
        number: "05",
        title: "Onorarii, Plăți și Mecanisme de Facturare",
        content:
          "Prețurile pentru serviciile furnizate sunt exprimate în mod clar în oferta comercială transmisă Clientului. Prestatorul își rezervă dreptul de a solicita un avans obligatoriu (standard 30% - 50%) înainte de demararea lucrărilor efective. Facturile emise au un termen de plată de maximum 5 zile lucrătoare de la emitere, dacă nu s-a stipulat altfel în scris. Întârzierea la plată oferă Prestatorului dreptul legal de a suspenda temporar prestarea serviciilor sau predarea livrabilelor finale până la achitarea integrală.",
      },
      {
        id: "livrare",
        number: "06",
        title: "Livrabile, Termene de Execuție și Runda de Revizii",
        content:
          "Termenele de livrare convenite încep să curgă din momentul în care Clientul a furnizat integral toate materialele, credențialele, textele și informațiile necesare demarării. Fiecare pachet include un număr standard de 2 runde de revizii constructive în limitele specificațiilor stabilite inițial. Solicitările ce depășesc cadrul agreat sau modificările de viziune formulate ulterior aprobării conceptului vor fi tarifate ca servicii suplimentare.",
      },
      {
        id: "proprietate",
        number: "07",
        title: "Drepturi de Proprietate Intelectuală și Autor",
        content:
          "Toate conceptele, codul sursă, elementele de design și materialele dezvoltate rămân în patrimoniul exclusiv al Prestatorului până la momentul achitării integrale a tuturor facturilor datorate de Client. După plata completă, Clientului i se acordă un drept neexclusiv sau exclusiv (conform contractului) de utilizare comercială a livrabilelor finale. Prestatorul își păstrează dreptul legitim de a menționa proiectul în portofoliul propriu de prezentare, cu excepția cazului în care s-a semnat în prealabil un acord scris de confidențialitate (NDA) expres.",
      },
      {
        id: "appointment",
        number: "08",
        title: "Cadrul Specific pentru Appointment Setting și Outreach",
        content:
          "Pentru serviciile de outreach și calificare de lead-uri:",
        list: [
          "Clientul poartă responsabilitatea juridică deplină privind corectitudinea și legalitatea oricăror baze de date sau informații comerciale pe care le pune la dispoziție;",
          "Toate campaniile se desfășoară cu respectarea strictă a reglementărilor GDPR și a Legii 506/2004 privind comunicațiile electronice, asigurând identificarea clară a expeditorului și mecanisme automate de dezabonare (opt-out);",
          "Prestatorul optimizează procesul de calificare și programare a discuțiilor, însă nu garantează vânzarea finală a produselor sau serviciilor Clientului, decizia de achiziție aparținând exclusiv părților terțe.",
        ],
      },
      {
        id: "gdpr",
        number: "09",
        title: "Protecția Datelor cu Caracter Personal (GDPR)",
        content:
          "Datele colectate prin intermediul site-ului (nume, adresă de email, mesaje) sunt prelucrate exclusiv în scopul comunicării comerciale, transmiterii ofertelor și executării contractului, conform Regulamentului (UE) 2016/679 (GDPR). Datele nu sunt înstrăinate sau vândute către terți. Utilizatorul are dreptul de acces, rectificare, ștergere a datelor (\"dreptul de a fi uitat\") și opoziție, drepturi ce pot fi exercitate printr-o simplă solicitare scrisă la adresa borsfandaniel@gmail.com.",
      },
      {
        id: "raspundere",
        number: "10",
        title: "Limitarea Răspunderii",
        content:
          "În limitele permise de legislația română, răspunderea totală a Prestatorului pentru orice pretenție, culpă sau prejudiciu izvorât din sau în legătură cu serviciile furnizate este limitată strict la valoarea sumelor efectiv încasate de la Client pentru proiectul sau etapa respectivă. Prestatorul nu poate fi tras la răspundere pentru daune indirecte, pierderi de oportunități de afaceri sau profituri nerealizate ca urmare a factorilor de piață independenți de controlul său.",
      },
      {
        id: "litigii",
        number: "11",
        title: "Legea Aplicabilă și Soluționarea Litigiilor",
        content:
          "Prezentele condiții sunt guvernate de legea română. În cazul oricărei neînțelegeri apărute, părțile vor depune toate diligențele rezonabile pentru soluționarea acesteia pe cale amiabilă în termen de 30 de zile calendaristice. În cazul în care rezolvarea amiabilă nu este posibilă, diferendul va fi deferit spre competentă soluționare instanțelor judecătorești române competente din circumscripția teritorială a Prestatorului.",
      },
      {
        id: "modificari",
        number: "12",
        title: "Modificarea Termenilor",
        content:
          "Prestatorul își rezervă dreptul de a actualiza sau revizui acești Termeni și Condiții periodic pentru a reflecta cerințele legislative sau modificările aduse serviciilor. Versiunea publicată pe această pagină web constituie forma oficială, valabilă și aplicabilă la data consultării.",
      },
    ],
    footerNotice: "Pentru orice întrebări privind termenii legali, contactează-ne direct la",
  },
  en: {
    backBtn: "Back to website",
    pageTitle: "TERMS AND CONDITIONS OF USE",
    pageSubtitle: "SWING Studio | Moisă Ionuț Daniel - Official up-to-date version (2026)",
    legalBadge: "Compliance with Romanian & EU Legislation (GDPR)",
    introSummary:
      "These contractual terms and general conditions govern access to this website and the provision of professional web development, landing pages, and appointment setting services by SWING (Moisă Ionuț Daniel). Please read these provisions carefully before submitting an inquiry.",
    quickNavTitle: "Quick Section Navigation",
    sections: [
      {
        id: "prestator",
        number: "01",
        title: "Identification of the Service Provider",
        content:
          "The SWING online platform and all associated services are operated and provided by Moisă Ionuț Daniel (referred to as \"Provider\" or \"SWING\"), with official electronic contact address: borsfandaniel@gmail.com. All official legal notices or communications must be directed through this verified digital channel.",
      },
      {
        id: "aplicare",
        number: "02",
        title: "Scope and Acceptance of Terms",
        content:
          "Browsing this website, submitting the contact form, or initiating commercial discussions constitutes full acceptance of these Terms and Conditions. Services are primarily tailored for legal entities, registered companies, and independent professionals (B2B). If a user acts as an individual consumer, they retain all statutory consumer protection rights provided under Romanian and EU law.",
      },
      {
        id: "servicii",
        number: "03",
        title: "Description of Services",
        content:
          "SWING provides dedicated digital services including, but not limited to:",
        list: [
          "Modern web development, speed optimization, responsive frontend architecture, and high-converting landing pages;",
          "B2B qualified appointment setting pipelines, prospect qualification, and sales calendar bookings;",
          "Direct-response copywriting, commercial offer structure, and strategic customer acquisition advisory.",
        ],
        extra:
          "Information displayed on this website is for presentation purposes and does not constitute a legally binding contractual offer until mutually confirmed in writing.",
      },
      {
        id: "contractare",
        number: "04",
        title: "Contracting Process and Agreement Execution",
        content:
          "Formal collaboration between Provider and Client is established through an agreed written commercial proposal (including email or electronic signatures) or an individual service agreement detailing specific deliverables, agreed milestones, project timelines, and fee schedules.",
      },
      {
        id: "preturi",
        number: "05",
        title: "Fees, Payment Terms, and Invoicing",
        content:
          "Service fees are clearly specified in each proposal. The Provider reserves the right to require an advance payment (typically 30% - 50%) prior to project kickoff. Invoices are payable within 5 business days of receipt unless explicitly agreed otherwise. Payment delays entitle the Provider to suspend delivery or execution until full payment is received.",
      },
      {
        id: "livrare",
        number: "06",
        title: "Deliverables, Milestones, and Revisions Policy",
        content:
          "Project delivery deadlines begin once the Client provides all required source materials, access credentials, and briefs. Each project includes up to 2 rounds of constructive revisions within the agreed project scope. Major changes requested outside the original specifications will be quoted as separate work orders.",
      },
      {
        id: "proprietate",
        number: "07",
        title: "Intellectual Property and Usage Rights",
        content:
          "All source code, proprietary design files, and concepts remain the exclusive property of the Provider until all invoices have been settled in full. Following complete payment, the Client receives the agreed usage rights for the final deliverables. The Provider retains the right to display the completed work in its professional portfolio unless a formal NDA was mutually signed in advance.",
      },
      {
        id: "appointment",
        number: "08",
        title: "Specific Framework for Appointment Setting",
        content:
          "For outreach and appointment setting services:",
        list: [
          "The Client holds full legal responsibility for the validity and source compliance of any contact lists or databases provided;",
          "All outreach adheres strictly to GDPR and applicable direct electronic marketing statutes, including unambiguous sender identification and clear opt-out mechanisms;",
          "The Provider guarantees structured qualification of booked meetings but does not guarantee final sales closing, which depends on market variables and Client closing ability.",
        ],
      },
      {
        id: "gdpr",
        number: "09",
        title: "Personal Data Protection (GDPR)",
        content:
          "Personal data collected through this website (name, email address, inquiry text) is processed solely for project correspondence, quotation, and contract fulfillment under Regulation (EU) 2016/679. Data is never sold or transferred to unauthorized third parties. You have the right to request access, rectification, or deletion of your data at any time via borsfandaniel@gmail.com.",
      },
      {
        id: "raspundere",
        number: "10",
        title: "Limitation of Liability",
        content:
          "To the maximum extent permitted by applicable law, the Provider's total liability for any claim arising from or related to the services shall not exceed the total fees actually received from the Client for that specific engagement. The Provider shall not be held liable for indirect, consequential, or lost business opportunity damages.",
      },
      {
        id: "litigii",
        number: "11",
        title: "Governing Law and Dispute Resolution",
        content:
          "These Terms are governed by and construed in accordance with the laws of Romania. Any dispute shall first be addressed through good-faith amicable negotiation within 30 days. Should amicable resolution fail, the dispute will be submitted to the competent courts of Romania within the Provider's jurisdiction.",
      },
      {
        id: "modificari",
        number: "12",
        title: "Modifications of Terms",
        content:
          "The Provider reserves the right to amend these terms at any time. The version published on this page represents the currently applicable framework.",
      },
    ],
    footerNotice: "For any questions regarding legal compliance or terms, contact us directly at",
  },
};

export default function TermeniSiConditiiPage() {
  const [lang, setLang] = useState<"ro" | "en">("ro");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Sincronizare tema la încărcarea paginii
    const savedTheme = localStorage.getItem("swing_theme") as "light" | "dark" | null;
    const initialTheme =
      savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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

  const t = termsData[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      {/* HEADER / NAVBAR SIMPLIFICAT */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            title="SWING Studio - Pagina Principală"
          >
            <img
              src="/logo.png"
              alt="SWING Logo"
              className="h-9 sm:h-11 w-auto object-contain shrink-0"
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
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Buton Dark / Light Mode */}
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

            {/* Buton Înapoi */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <ArrowLeftIcon size={14} />
              <span className="hidden sm:inline">{t.backBtn}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* CONTINUT PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        {/* HERO TITLE */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300">
            <ShieldIcon size={14} className="text-[#FF5400]" />
            <span>{t.legalBadge}</span>
          </div>

          <div className="flex items-center gap-3">
            <ScaleIcon size={32} className="text-[#FF5400] shrink-0" />
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              {t.pageTitle}
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400">
            {t.pageSubtitle}
          </p>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed pt-2">
            {t.introSummary}
          </p>
        </div>

        {/* LISTA SECȚIUNILOR LEGALE */}
        <div className="space-y-6">
          {t.sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-black text-[#FF5400] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  {sec.number}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                  {sec.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {sec.content}
              </p>

              {sec.list && (
                <ul className="space-y-2 pt-2">
                  {sec.list.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-300"
                    >
                      <span className="mt-1 shrink-0 text-[#FF5400]">
                        <CheckIcon size={14} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.extra && (
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                  {sec.extra}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* NOTĂ FINALĂ & LINKURI UTILE */}
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono">
            {t.footerNotice}{" "}
            <a
              href="mailto:borsfandaniel@gmail.com"
              className="text-[#FF5400] font-bold underline"
            >
              borsfandaniel@gmail.com
            </a>
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <a
              href="https://anpc.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white underline transition-colors"
            >
              Autoritatea Națională pentru Protecția Consumatorilor (ANPC)
            </a>
            <span>•</span>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white underline transition-colors"
            >
              Platforma SOL a Comisiei Europene
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <p>© {new Date().getFullYear()} SWING (Moisă Ionuț Daniel). Toate drepturile rezervate.</p>
        <Link
          href="/"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors font-bold"
        >
          {t.backBtn}
        </Link>
      </footer>
    </div>
  );
}
