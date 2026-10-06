"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertOctagon, Compass, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] font-sans antialiased flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-[#D62828] selection:text-[#FFF3E0]">
      {/* Element de fundal subtil cu puncte */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(#D62828 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Header minim */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#D62828] flex items-center justify-center text-[#FFF3E0] shadow-md group-hover:scale-105 transition-transform">
            <span className="font-black text-lg tracking-tighter">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-wider text-sm text-[#2B0808]">
              SWING STUDIO
            </span>
            <span className="text-[9px] text-[#2B0808]/60 font-mono tracking-widest uppercase">
              BY DANIEL MOISĂ
            </span>
          </div>
        </Link>
      </header>

      {/* Conținut Central 404 */}
      <main className="relative z-10 max-w-xl w-full mx-auto text-center my-auto py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FCE8D5] border border-[#D62828]/30 shadow-sm"
        >
          <AlertOctagon size={16} className="text-[#D62828]" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#D62828] uppercase">
            ERROR 404 // PAGE NOT FOUND
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-7xl sm:text-9xl font-black text-[#D62828] tracking-tighter leading-none select-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B0808] tracking-tight">
            Pagina pe care o cauți nu există.
          </h2>
          <p className="text-sm text-[#2B0808]/70 leading-relaxed max-w-md mx-auto">
            S-ar putea ca adresa să fie scrisă greșit sau pagina să fi fost mutată într-o altă secțiune a studio-ului.
          </p>
        </motion.div>

        {/* Card interactiv cu acțiuni rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-[#FCE8D5]/80 border border-[#D62828]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md backdrop-blur-sm"
        >
          <p className="text-xs font-mono text-[#2B0808]/80 font-bold uppercase tracking-wider">
            Unde dorești să mergi mai departe?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3.5 rounded-xl bg-[#D62828] text-[#FFF3E0] font-bold text-xs uppercase tracking-wider hover:bg-[#2B0808] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Home size={15} />
              <span>Pagina Principală</span>
            </Link>
            <Link
              href="/#services"
              className="px-6 py-3.5 rounded-xl bg-[#FFF3E0] text-[#2B0808] border border-[#D62828]/30 hover:border-[#D62828] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Compass size={15} className="text-[#D62828]" />
              <span>Vezi Serviciile</span>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer minim */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center text-[11px] font-mono text-[#2B0808]/60">
        <p>© {new Date().getFullYear()} SWING STUDIO. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
}