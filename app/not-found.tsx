"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Compass, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] font-sans antialiased flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-[#D62828] selection:text-[#FFF3E0]">
      {/* Pattern de fundal subtil */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(#D62828 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Text Uriaș de fundal pentru un look 3D / Stratificat */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-[0.06] font-black text-[22vw] leading-none text-[#D62828]">
        404
      </div>

      {/* Spațiu gol sus în loc de header */}
      <div className="h-6 relative z-10" />

      {/* Conținut Central ultra-modern */}
      <main className="relative z-10 max-w-2xl w-full mx-auto text-center my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FCE8D5]/90 border border-[#D62828]/30 rounded-3xl p-8 sm:p-12 shadow-xl backdrop-blur-md space-y-8 relative overflow-hidden"
        >
          {/* Accent decorativ sus */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#D62828] to-transparent" />

          {/* Badge Stare */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF3E0] border border-[#D62828]/30 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#D62828] animate-ping" />
            <Terminal size={14} className="text-[#D62828]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#D62828] uppercase">
              STATUS 404 // ROUTE_NOT_FOUND
            </span>
          </div>

          {/* Titlu & Descriere */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-[#2B0808] tracking-tight leading-tight">
              Aici este doar spațiu gol.
            </h1>
            <p className="text-xs sm:text-sm text-[#2B0808]/75 leading-relaxed max-w-md mx-auto">
              Pagina accesată nu există sau a fost mutată. Folosește scurtăturile de mai jos pentru a reveni pe traseu.
            </p>
          </div>

          {/* Butoane de Acțiune */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D62828] text-[#FFF3E0] font-black text-xs uppercase tracking-wider hover:bg-[#2B0808] transition-all flex items-center justify-center gap-2.5 shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Home size={16} />
              <span>Înapoi pe site</span>
            </Link>

            <Link
              href="/#services"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFF3E0] text-[#2B0808] border border-[#D62828]/30 hover:border-[#D62828] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Compass size={16} className="text-[#D62828]" />
              <span>Vezi Serviciile</span>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer Curat */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center text-[11px] font-mono text-[#2B0808]/60">
        <p>© {new Date().getFullYear()} SWING STUDIO. All rights reserved.</p>
      </footer>
    </div>
  );
}