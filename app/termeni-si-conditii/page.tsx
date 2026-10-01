"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, ShieldCheck, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const [lang, setLang] = useState<"ro" | "en">("ro");

  return (
    <div className="min-h-screen bg-[#070A09] text-white font-sans antialiased py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Buton de întoarcere la prima pagină */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-[#E8FFF2] bg-[#075E46]/30 border border-[#075E46]/60 px-4 py-2 rounded-full hover:bg-[#075E46]/60 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Înapoi la pagina principală</span>
        </Link>

        {/* Schimbare limbă */}
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
                {lang === "ro" ? "Termeni, Condiții și Cadrul Legal" : "Terms, Conditions & Legal Framework"}
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