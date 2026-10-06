"use client";

import React from "react";
import { Settings, Save, Shield, Bell, User, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 text-[10px] font-mono font-bold uppercase text-[#D62828] mb-2">
          <Settings size={12} /> SYSTEM CONFIGURATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B0808] tracking-tight">
          Setări Platformă & Profil
        </h1>
        <p className="text-xs sm:text-sm text-[#2B0808]/70">
          Configurează preferințele de administrare, securitate și notificări.
        </p>
      </div>

      {/* Formular Setări */}
      <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        {/* Profil */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#2B0808] uppercase tracking-wider flex items-center gap-2 border-b border-[#D62828]/15 pb-2">
            <User size={16} className="text-[#D62828]" /> Date Profil
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2B0808] mb-1">Nume Administrator</label>
              <input
                type="text"
                defaultValue="Daniel Moisă"
                className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-xl px-3.5 py-2.5 font-medium text-[#2B0808] focus:outline-none focus:border-[#D62828]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2B0808] mb-1">Email Notificări</label>
              <input
                type="email"
                defaultValue="contact@swing.ro"
                className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-xl px-3.5 py-2.5 font-medium text-[#2B0808] focus:outline-none focus:border-[#D62828]"
              />
            </div>
          </div>
        </div>

        {/* Securitate API */}
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-bold text-[#2B0808] uppercase tracking-wider flex items-center gap-2 border-b border-[#D62828]/15 pb-2">
            <Key size={16} className="text-[#D62828]" /> Chei API & Integrări
          </h2>
          <div>
            <label className="block font-bold text-[#2B0808] mb-1 text-xs">Instantly / Smartlead API Key</label>
            <input
              type="password"
              defaultValue="sk_live_123456789abcdef"
              className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#2B0808] focus:outline-none focus:border-[#D62828]"
            />
          </div>
        </div>

        {/* Buton Salvare */}
        <div className="pt-4 flex justify-end">
          <button className="px-6 py-3 rounded-2xl bg-[#D62828] text-[#FFF3E0] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-[#2B0808] transition-all cursor-pointer">
            <Save size={16} />
            <span>Salvează Modificările</span>
          </button>
        </div>
      </div>
    </div>
  );
}