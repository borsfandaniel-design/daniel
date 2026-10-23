"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ScaleIcon, ShieldIcon, ArrowLeftIcon } from "../components/Icons";

const termsContent = {
  ro: {
    backBtn: "Înapoi la pagina principală",
    termsTitle: "TERMENI ȘI CONDIȚII",
    subtitle: "SWING Studio / Daniel Moisă - Ultima actualizare: Octombrie 2026",
    compliance: "Conformitate Legislație RO & UE / GDPR Compliance",
    sections: [
      {
        title: "1. Prestatorul",
        text: "Acest site este operat de SWING (Daniel Moisă, \"Prestatorul\"), email: borsfandaniel@gmail.com.",
      },
      {
        title: "2. Obiectul",
        text: "Site-ul prezintă serviciile Prestatorului: design grafic (Canva Pro, pitch deck-uri, bannere, social media), cold emailing și outreach, appointment setting. Conținutul are caracter informativ și nu reprezintă o ofertă fermă. Colaborarea se stabilește printr-o ofertă sau un contract acceptat în scris de ambele părți (inclusiv prin email).",
      },
      {
        title: "3. Clienți",
        text: "Serviciile se adresează în principal persoanelor juridice și profesioniștilor (B2B). Dacă ești consumator, se aplică și dispozițiile legale de protecție a consumatorilor.",
      },
      {
        title: "4. Plată",
        text: "Tarifele și termenele de plată sunt cele din ofertă. Prestatorul poate cere avans. Întârzierea plății permite suspendarea livrării și aplicarea penalităților prevăzute de lege.",
      },
      {
        title: "5. Livrare și revizii",
        text: "Termenele sunt cele din ofertă. Reviziile incluse sunt cele menționate în ofertă; cele suplimentare se taxează separat. Întârzierile clientului în furnizarea materialelor sau a feedback-ului prelungesc termenele corespunzător.",
      },
      {
        title: "6. Drepturi de autor",
        text: "Materialele create rămân proprietatea Prestatorului până la plata integrală. După plata integrală, clientul primește dreptul de a folosi livrabilele finale în scopul convenit. Prestatorul poate prezenta lucrările în portofoliu, dacă nu s-a convenit altfel în scris. Clientul garantează că deține drepturile asupra materialelor furnizate de el. Elementele terțe (fonturi, imagini stock, șabloane) sunt supuse licențelor proprii.",
      },
      {
        title: "7. Cold emailing și outreach",
        bullets: [
          "a) Clientul răspunde de legalitatea listelor de contacte furnizate sau aprobate de el și de activitatea sa comercială.",
          "b) Campaniile respectă legislația aplicabilă (GDPR, Legea 506/2004): mesajele indică expeditorul, motivul contactării și o modalitate simplă de dezabonare, iar cererile de dezabonare se respectă prompt.",
          "c) Prestatorul poate refuza sau opri o campanie despre care are motive rezonabile să credă că încalcă legea, politicile furnizorilor de email sau drepturile terților.",
          "d) Când prelucrează date în numele clientului, părțile încheie un acord de prelucrare a datelor (DPA) conform art. 28 GDPR.",
          "e) Prestatorul nu garantează rate de deschidere, de răspuns sau un anumit număr de întâlniri; rezultatele depind de ofertă, piață, listă și mesaj.",
        ],
      },
      {
        title: "8. Appointment setting",
        text: "O întâlnire este \"calificată\" conform criteriilor agreate în ofertă. Prestatorul nu răspunde pentru închiderea vânzării.",
      },
      {
        title: "9. Confidențialitate",
        text: "Informațiile non-publice primite de la client sunt tratate confidențial și folosite doar pentru executarea colaborării.",
      },
      {
        title: "10. Limitarea răspunderii",
        text: "În limitele permise de lege, răspunderea Prestatorului este limitată la suma plătită pentru serviciul în cauză și nu include pierderi indirecte (profit nerealizat, oportunități pierdute). Nu se limitează răspunderea pentru fraudă sau culpă gravă.",
      },
      {
        title: "11. Conținutul site-ului",
        text: "Textele, elementele grafice și designul site-ului sunt protejate de drepturi de autor și nu pot fi copiate fără acord scris.",
      },
      {
        title: "12. Forță majoră",
        text: "Nicio parte nu răspunde pentru neexecutarea cauzată de forță majoră, cu notificarea celeilalte părți.",
      },
      {
        title: "13. Reclamații și litigii",
        text: "Reclamațiile se trimit la adresa de email și primesc răspuns în maximum 30 de zile. Consumatorii se pot adresa ANPC (anpc.ro). Litigiile se rezolvă amiabil, iar în caz contrar de instanțele române competente. Se aplică legea română.",
      },
      {
        title: "14. Modificări",
        text: "Prestatorul poate actualiza acești termeni. Versiunea în vigoare este cea publicată pe site.",
      },
    ],
  },
  en: {
    backBtn: "Back to main page",
    termsTitle: "TERMS AND CONDITIONS",
    subtitle: "SWING Studio / Daniel Moisă - Last updated: October 2026",
    compliance: "RO & EU Law Compliance / GDPR Compliance",
    sections: [
      {
        title: "1. Service Provider",
        text: "This website is operated by SWING (Daniel Moisă, \"Provider\"), email: borsfandaniel@gmail.com.",
      },
      {
        title: "2. Subject Matter",
        text: "The website showcases the Provider's services: graphic design (Canva Pro, pitch decks, banners, social media), cold emailing and outreach, appointment setting. Content is informational and does not represent a binding offer. Collaboration is established through an offer or written contract accepted by both parties (including via email).",
      },
      {
        title: "3. Clients",
        text: "Services are primarily aimed at legal entities and professionals (B2B). Consumer protection laws apply if you are an individual consumer.",
      },
      {
        title: "4. Payment",
        text: "Rates and payment terms are specified in the offer. The Provider may request an advance payment. Delay in payment permits suspension of delivery and application of statutory penalties.",
      },
      {
        title: "5. Delivery & Revisions",
        text: "Deadlines are as agreed in the offer. Revisions included are specified in the offer; additional ones are charged separately. Client delays in providing materials or feedback extend deadlines accordingly.",
      },
      {
        title: "6. Copyright",
        text: "Created materials remain Provider property until paid in full. Upon full payment, the client receives rights to use final deliverables for agreed purposes. Provider may showcase work in portfolios unless agreed otherwise in writing. Client guarantees ownership of provided materials. Third-party elements follow their own licenses.",
      },
      {
        title: "7. Cold Emailing & Outreach",
        bullets: [
          "a) The client is responsible for the legality of contact lists provided or approved and their commercial activity.",
          "b) Campaigns comply with applicable laws (GDPR, Law 506/2004): messages identify sender, contact reason, and easy opt-out mechanism.",
          "c) Provider reserves the right to suspend campaigns that reasonably appear to violate laws or third-party rights.",
          "d) A Data Processing Agreement (DPA) under Art. 28 GDPR is executed when processing data on behalf of client.",
          "e) Provider does not guarantee open, response rates, or exact booking numbers; results depend on market factors.",
        ],
      },
      {
        title: "8. Appointment Setting",
        text: "A meeting is considered 'qualified' based on criteria defined in the offer. Provider is not responsible for closing sales.",
      },
      {
        title: "9. Confidentiality",
        text: "Non-public information received from clients is kept strictly confidential and used solely for contract execution.",
      },
      {
        title: "10. Limitation of Liability",
        text: "To the maximum extent permitted by law, Provider's liability is limited to the amount paid for the specific service.",
      },
      {
        title: "11. Website Content",
        text: "All text, graphics, and design are protected by copyright and cannot be copied without written consent.",
      },
      {
        title: "12. Force Majeure",
        text: "Neither party is liable for failure caused by force majeure events upon written notification.",
      },
      {
        title: "13. Disputes & Governing Law",
        text: "Complaints should be sent via email with response given within 30 days. Romanian law applies.",
      },
      {
        title: "14. Amendments",
        text: "Provider may update these terms. The active version is always published on this page.",
      },
    ],
  },
};

export default function TermsPage() {
  const [lang, setLang] = useState<"ro" | "en">("ro");
  const t = termsContent[lang];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Buton de întoarcere la pagina principală & Schimbare limbă */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white transition-all font-bold cursor-pointer"
          >
            <ArrowLeftIcon size={14} />
            <span>{t.backBtn}</span>
          </Link>

          <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 shadow-xs">
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

        {/* Conținutul Termenilor și Condițiilor */}
        <div className="bg-white border-2 border-orange-500/20 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-6">
            <ScaleIcon className="text-[#FF5400]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-950">
                {t.termsTitle}
              </h1>
              <p className="text-xs font-mono text-zinc-500">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 text-xs font-mono">
            <span className="text-zinc-950 font-semibold flex items-center gap-2">
              <ShieldIcon size={16} className="text-[#FF5400]" /> {t.compliance}
            </span>
            <span className="text-zinc-400">2026</span>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed font-normal">
            {t.sections.map((sec) => (
              <section key={sec.title} className="space-y-2">
                <h2 className="text-[#FF5400] font-bold text-base uppercase tracking-wider font-mono">
                  {sec.title}
                </h2>
                {sec.text && <p>{sec.text}</p>}
                {sec.bullets && (
                  <ul className="list-disc pl-5 space-y-1">
                    {sec.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}