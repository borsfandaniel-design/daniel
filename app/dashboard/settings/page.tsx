"use client";

import React from "react";
import { Settings, Save, User, Key, ShieldCheck, Mail } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans text-zinc-950">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold uppercase text-[#FF5400] mb-2.5">
          <Settings size={12} /> SYSTEM CONFIGURATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
          Setări Platformă & Profil
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 font-normal">
          Configurează preferințele de administrare, securitate și notificări SWING.
        </p>
      </div>

      {/* Formular Setări */}
      <div className="bg-white border-2 border-orange-500/20 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-8">
        {/* Profil */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-orange-500/10 pb-3">
            <User size={16} className="text-[#FF5400]" /> Date Profil Administrator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-800">Nume Administrator</label>
              <input
                type="text"
                defaultValue="Moisă Ionuț Daniel"
                className="w-full bg-white border-2 border-orange-500/20 focus:border-[#FF5400] rounded-2xl px-4 py-3 font-medium text-zinc-950 focus:outline-none transition-colors shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-800">Email Notificări</label>
              <input
                type="email"
                defaultValue="borsfandaniel@gmail.com"
                className="w-full bg-white border-2 border-orange-500/20 focus:border-[#FF5400] rounded-2xl px-4 py-3 font-medium text-zinc-950 focus:outline-none transition-colors shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Securitate API */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-orange-500/10 pb-3">
            <Key size={16} className="text-[#FF5400]" /> Chei API & Integrări
          </h2>
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-800 text-xs">Instantly / Smartlead API Key</label>
            <input
              type="password"
              defaultValue="sk_live_123456789abcdef"
              className="w-full bg-white border-2 border-orange-500/20 focus:border-[#FF5400] rounded-2xl px-4 py-3 text-xs font-mono text-zinc-950 focus:outline-none transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Notă Securitate */}
        <div className="p-4 rounded-2xl bg-orange-500/[0.04] border border-orange-500/15 flex items-center gap-3 text-xs text-zinc-600">
          <ShieldCheck size={18} className="text-[#FF5400] shrink-0" />
          <span>Datele de autentificare și sesiunea sunt protejate prin criptare securizată.</span>
        </div>

        {/* Buton Salvare */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => alert("Setările au fost salvate cu succes!")}
            className="px-6 py-3.5 rounded-2xl bg-[#FF5400] hover:bg-[#E04800] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_16px_rgba(255,84,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,84,0,0.35)] transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>Salvează Modificările</span>
          </button>
        </div>
      </div>
    </div>
  );
}