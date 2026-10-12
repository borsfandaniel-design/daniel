"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Radio, SearchX, Zap } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans antialiased flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-[#FF5400] selection:text-white">
      {/* Pattern de fundal discret */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#FF5400 1.5px, transparent 1.5px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Cercuri concentrice animate */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-orange-500/10 animate-ping opacity-20" />
        <div className="w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] rounded-full border border-orange-500/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="h-4 relative z-10" />

      {/* Container Central */}
      <main className="relative z-10 max-w-lg w-full mx-auto my-auto py-6">
        <div className="relative">
          {/* FLOATING BADGE 1 */}
          <div className="absolute -top-6 -right-2 sm:-right-8 z-20 bg-[#FF5400] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-[11px] font-mono font-bold rotate-3">
            <Radio size={14} className="animate-pulse" />
            <span>RADAR - NO_SIGNAL</span>
          </div>

          {/* FLOATING BADGE 2 */}
          <div className="absolute -bottom-5 -left-2 sm:-left-6 z-20 bg-zinc-950 text-white px-4 py-2 rounded-2xl shadow-xl border border-orange-500/30 flex items-center gap-2 text-[11px] font-mono font-bold -rotate-2">
            <Zap size={14} className="text-[#FF5400]" />
            <span>SWING_CORE_404</span>
          </div>

          {/* CARDUL PRINCIPAL */}
          <div className="bg-white border-2 border-orange-500/30 rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(255,84,0,0.08)] backdrop-blur-xl text-center space-y-8 relative z-10">
            {/* Iconiță Sus */}
            <div className="mx-auto w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#FF5400] shadow-inner">
              <SearchX size={30} />
            </div>

            {/* Cifre 404 */}
            <div className="space-y-1">
              <div className="inline-block bg-[#FF5400] text-white px-6 py-2 rounded-2xl text-5xl sm:text-6xl font-black font-mono tracking-widest shadow-lg">
                404
              </div>
              <p className="text-[10px] font-mono font-bold text-[#FF5400] uppercase tracking-widest pt-2">
                 LINK BROKEN OR MOVED
              </p>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Destinație indisponibilă
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xs mx-auto font-medium">
                Pagina la care încerci să ajungi nu a fost găsită în rețeaua noastră.
              </p>
            </div>

            {/* Butoane */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#FF5400] text-white font-black text-xs uppercase tracking-wider hover:bg-orange-600 transition-all flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Home size={16} />
                <span>Pagina Principală</span>
              </Link>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white text-zinc-950 border-2 border-orange-500/30 hover:border-[#FF5400] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
              >
                <ArrowLeft size={16} className="text-[#FF5400]" />
                <span>Pasul Anterior</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Subsol Minimal */}
      <footer className="relative z-10 max-w-md w-full mx-auto text-center text-[10px] font-mono text-zinc-500 tracking-wider">
        SWING STUDIO // DANIEL MOISĂ
      </footer>
    </div>
  );
}