"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  Send,
  CalendarCheck,
  ArrowUpRight,
  Zap,
  Activity,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Email-uri Trimise",
      value: "14,280",
      change: "+12.5%",
      icon: Send,
    },
    {
      title: "Meeting-uri Programate",
      value: "48",
      change: "+18.2%",
      icon: CalendarCheck,
    },
    {
      title: "Rată de Răspuns",
      value: "8.4%",
      change: "+2.1%",
      icon: TrendingUp,
    },
    {
      title: "Lead-uri Active",
      value: "312",
      change: "+5.4%",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner Bun Venit */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#2B0808] to-[#421010] text-[#FFF3E0] p-6 sm:p-8 overflow-hidden shadow-xl border border-[#D62828]/30">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-[#D62828]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62828]/30 border border-[#D62828]/40 text-[10px] font-mono font-bold tracking-wider uppercase text-[#FFF3E0]">
            <Zap size={12} className="text-[#D62828]" /> SYSTEM LIVE OVERVIEW
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Salut, Daniel! SWING OS funcționează la capacitate maximă.
          </h1>
          <p className="text-xs sm:text-sm text-[#FFF3E0]/70 max-w-xl">
            Ai 4 meeting-uri noi confirmate astăzi și o rată de deschidere a email-urilor de peste 62%.
          </p>
        </div>
      </div>

      {/* Grid Carduri KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all backdrop-blur-md relative overflow-hidden group"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-mono font-bold text-[#2B0808]/70 uppercase">
                  {stat.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFF3E0] border border-[#D62828]/20 flex items-center justify-center text-[#D62828]">
                  <Icon size={16} />
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl font-black text-[#2B0808]">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-[#D62828] flex items-center gap-0.5 bg-[#D62828]/10 px-2 py-0.5 rounded-lg">
                  {stat.change}
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secțiunea Centrală: Grafic / Activitate Recentă */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Monitorizare Campanii (2 coloane) */}
        <div className="lg:col-span-2 bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-3xl p-6 shadow-sm backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#D62828]/15 pb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#D62828]" />
              <h2 className="font-bold text-sm text-[#2B0808] uppercase tracking-wider">
                Performanță Cold Outreach
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-[#FFF3E0] px-3 py-1 rounded-full border border-[#D62828]/20 font-bold text-[#D62828]">
              LIVE METRICS
            </span>
          </div>

          {/* Vizualizare Simulat-Futuristică de Grafic */}
          <div className="h-48 w-full bg-[#FFF3E0]/80 rounded-2xl border border-[#D62828]/20 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#2B0808]/50">
              <span>OUTREACH VOLUME</span>
              <span>OCTOBER 2026</span>
            </div>
            {/* Linii decorative de rețea */}
            <div className="flex items-end justify-between h-28 gap-2 pt-4">
              {[40, 65, 45, 80, 95, 70, 85, 100, 75, 90].map((height, i) => (
                <div key={i} className="flex-1 bg-[#D62828]/15 rounded-t-lg h-full flex items-end">
                  <div
                    className="w-full bg-[#D62828] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Feed Activitate Live (1 coloană) */}
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-3xl p-6 shadow-sm backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#D62828]/15 pb-4">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#D62828]" />
              <h2 className="font-bold text-sm text-[#2B0808] uppercase tracking-wider">
                Live Feed
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { text: "Meeting nou rezervat cu TechCorp", time: "2m ago" },
              { text: "Campania 'Design Q4' a trimis 500 emailuri", time: "14m ago" },
              { text: "Lead nou adăugat din LinkedIn", time: "1h ago" },
              { text: "Răspuns pozitiv primit de la Client X", time: "2h ago" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-[#FFF3E0] border border-[#D62828]/15 flex items-center justify-between text-xs"
              >
                <span className="font-medium text-[#2B0808]">{item.text}</span>
                <span className="text-[10px] font-mono text-[#D62828] font-bold">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}