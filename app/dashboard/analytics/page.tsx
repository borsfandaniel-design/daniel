"use client";

import React from "react";
import { BarChart3, TrendingUp, Eye, MousePointerClick, PieChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 text-[10px] font-mono font-bold uppercase text-[#D62828] mb-2">
          <BarChart3 size={12} /> ANALYTICS
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B0808] tracking-tight">
          Analiză & Perfomanță
        </h1>
        <p className="text-xs sm:text-sm text-[#2B0808]/70">
          Monitorizarea campaniilor active de outreach și conversii.
        </p>
      </div>

      {/* Grid Carduri Metrici */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">OPEN RATE</span>
            <Eye size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">64.2%</div>
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">CLICK RATE</span>
            <MousePointerClick size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">18.7%</div>
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">CONVERSIE</span>
            <TrendingUp size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">8.4%</div>
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">ROI CAMPANIE</span>
            <PieChart size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">3.8x</div>
        </div>
      </div>

      {/* Panou Simplu de Date */}
      <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-3xl p-6 backdrop-blur-md">
        <h2 className="font-bold text-sm text-[#2B0808] uppercase tracking-wider mb-4">
          Performanță Zilnică
        </h2>
        <div className="h-40 bg-[#FFF3E0] rounded-2xl border border-[#D62828]/20 flex items-center justify-center text-xs font-mono text-[#2B0808]/60">
          Sistemul de monitorizare în timp real este activ.
        </div>
      </div>
    </div>
  );
}