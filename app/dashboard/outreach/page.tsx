"use client";

import React from "react";
import { Send, Plus, Mail, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function OutreachPage() {
  const campaigns = [
    { name: "SaaS Cold Outreach Q4", status: "Active", sent: "4,820", replies: "342", rate: "7.1%" },
    { name: "Graphic Design LinkedIn Leads", status: "Active", sent: "2,150", replies: "210", rate: "9.7%" },
    { name: "E-Commerce Decision Makers", status: "Paused", sent: "1,200", replies: "84", rate: "7.0%" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 text-[10px] font-mono font-bold uppercase text-[#D62828] mb-2">
            <Send size={12} /> EMAIL & OUTREACH ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B0808] tracking-tight">
            Campanii de Outreach
          </h1>
          <p className="text-xs sm:text-sm text-[#2B0808]/70">
            Gestionează secvențele de cold email și mesajele automatizate.
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-[#D62828] text-[#FFF3E0] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-[#2B0808] transition-all cursor-pointer">
          <Plus size={16} />
          <span>Campanie Nouă</span>
        </button>
      </div>

      {/* Tabel Campanii */}
      <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <h2 className="font-bold text-sm text-[#2B0808] uppercase tracking-wider flex items-center gap-2">
          <Mail size={16} className="text-[#D62828]" /> Campanii În Desfășurare
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D62828]/20 text-[#2B0808]/60 font-mono">
                <th className="py-3 px-2">NUME CAMPANIE</th>
                <th className="py-3 px-2">STATUS</th>
                <th className="py-3 px-2">TRIMISE</th>
                <th className="py-3 px-2">RĂSPUNSURI</th>
                <th className="py-3 px-2">RATĂ CONVERSIE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D62828]/10 font-medium">
              {campaigns.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FFF3E0]/50 transition-colors">
                  <td className="py-4 px-2 font-bold text-[#2B0808]">{c.name}</td>
                  <td className="py-4 px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        c.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-800 border border-amber-500/30"
                      }`}
                    >
                      {c.status === "Active" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-mono text-[#2B0808]">{c.sent}</td>
                  <td className="py-4 px-2 font-mono text-[#2B0808]">{c.replies}</td>
                  <td className="py-4 px-2 font-mono font-bold text-[#D62828]">{c.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}