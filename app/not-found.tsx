"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ArrowLeft,
  AlertTriangle,
  Compass,
  Radio,
  Terminal,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] font-sans antialiased flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-[#D62828] selection:text-[#FFF3E0]">
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

      {/* 404 uriaș pe tot fundalul */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-[0.06] font-black text-[35vw] leading-none text-[#2B0808]">
        404
      </div>

      <div className="h-4 relative z-10" />

      {/* Container Central */}
      <main className="relative z-10 max-w-xl w-full mx-auto my-auto py-6">
        <div className="relative">
          {/* FLOATING BADGE TOP-LEFT */}
          <motion.div
            initial={{ opacity: 0, y: -10, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-5 -left-2 sm:-left-6 z-20 bg-[#D62828] text-[#FFF3E0] px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#2B0808]/20 flex items-center gap-2 text-[11px] font-bold tracking-wide -rotate-3"
          >
            <AlertTriangle size={14} />
            <span>Semnal Pierdut</span>
          </motion.div>

          {/* FLOATING BADGE TOP-RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: -10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-5 -right-2 sm:-right-6 z-20 bg-[#FCE8D5] text-[#2B0808] border border-[#D62828]/40 px-3.5 py-1.5 rounded-2xl shadow-md flex items-center gap-2 text-[11px] font-mono font-bold rotate-2"
          >
            <Compass size={14} className="text-[#D62828]" />
            <span>Rută Necunoscută</span>
          </motion.div>

          {/* CARDUL CENTRAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#FCE8D5]/90 border border-[#D62828]/30 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl backdrop-blur-md text-center space-y-6 relative z-10"
          >
            {/* Tag Categorie Sus */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3E0] border border-[#D62828]/30 shadow-inner">
              <Compass size={13} className="text-[#D62828]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#D62828] uppercase">
                404 // ERROR
              </span>
            </div>

            {/* CIFRE 404 STILIZATE CU 0 RELEVAT ÎN CARD ROȘU */}
            <div className="flex items-center justify-center gap-2 font-black text-7xl sm:text-8xl tracking-tight select-none py-2">
              <span className="text-[#2B0808]">4</span>
              <div className="bg-[#D62828] text-[#FFF3E0] px-5 py-1 rounded-3xl shadow-lg border-2 border-[#2B0808]/10 flex items-center justify-center transform hover:scale-105 transition-transform">
                0
              </div>
              <span className="text-[#2B0808]">4</span>
            </div>

            {/* Titlu și Mesaj */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#2B0808] tracking-tight">
                Pagina nu a fost găsită
              </h1>
              <p className="text-xs sm:text-sm text-[#2B0808]/75 leading-relaxed max-w-sm mx-auto">
                Resursa solicitată nu există sau a fost mutată. Verifică adresa URL sau revino la pagina principală.
              </p>
            </div>

            {/* Butoane */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#D62828] text-[#FFF3E0] font-black text-xs uppercase tracking-wider hover:bg-[#2B0808] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Home size={15} />
                <span>Mergi pe Home</span>
              </Link>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FFF3E0] text-[#2B0808] border border-[#D62828]/30 hover:border-[#D62828] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={15} className="text-[#D62828]" />
                <span>Înapoi</span>
              </button>
            </div>

            {/* Subsol Card */}
            <div className="pt-6 border-t border-[#D62828]/20 flex items-center justify-between text-[10px] font-mono text-[#2B0808]/60">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#D62828] animate-pulse" />
                SWING STUDIO ENGINE
              </span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </motion.div>

          {/* FLOATING BADGE BOTTOM-LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 10, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-4 -left-2 sm:-left-4 z-2