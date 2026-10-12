"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  Globe,
  ArrowLeft,
  Flame,
} from "lucide-react";
import { logoutUser } from "../login/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { id: "overview", label: "Consolă Mesaje", icon: LayoutDashboard, href: "/dashboard" },
    { id: "settings", label: "Setări & Profil", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans flex flex-col md:flex-row relative selection:bg-[#FF5400] selection:text-white">
      {/* GLOW DE FUNDAL */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#FF5400 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-[#FF5400]/[0.04] to-transparent rounded-full blur-3xl" />
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-white border-r-2 border-orange-500/20 flex flex-col justify-between p-6 relative z-20 hidden md:flex shrink-0 shadow-xs">
        <div className="space-y-8">
          {/* Logo Dashboard */}
          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-1 cursor-pointer group">
              <div className="relative w-10 h-10 rounded-2xl bg-white border border-orange-500/30 shadow-xs flex items-center justify-center p-1.5 group-hover:border-[#FF5400] group-hover:scale-105 transition-all">
                <img
                  src="/logo.png"
                  alt="SWING Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <h2 className="font-black text-sm tracking-wider text-zinc-950 group-hover:text-[#FF5400] transition-colors">
                  SWING OS
                </h2>
                <p className="text-[9px] font-mono font-bold text-[#FF5400] uppercase tracking-wider flex items-center gap-1">
                  <Flame size={10} /> CONTROL CENTER
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/15 text-xs font-mono font-bold text-[#FF5400] hover:text-[#E04800] transition-colors w-full"
            >
              <ArrowLeft size={13} />
              <span>Înapoi pe site-ul principal</span>
            </Link>
          </div>

          {/* Meniu Navigare */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF5400] text-white shadow-[0_4px_16px_rgba(255,84,0,0.25)]"
                      : "text-zinc-600 hover:bg-orange-500/10 hover:text-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status Sistem & Deconectare */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border-2 border-orange-500/20 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#FF5400]">
              <span className="w-2 h-2 rounded-full bg-[#FF5400] animate-ping" />
              <span>SYSTEM ONLINE</span>
            </div>
            <p className="text-[11px] text-zinc-600 font-medium">
              Sincronizare în timp real activă.
            </p>
          </div>

          <button
            onClick={async () => {
              await logoutUser();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-zinc-600 hover:text-[#FF5400] hover:bg-orange-500/10 transition-all cursor-pointer"
          >
            <LogOut size={15} />
            <span>Deconectare</span>
          </button>
        </div>
      </aside>

      {/* ZONA PRINCIPALĂ */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-20 md:pb-0">
        {/* HEADER TOP */}
        <header className="h-16 border-b-2 border-orange-500/20 bg-white/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="md:hidden flex items-center gap-2 p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF5400]"
              title="Înapoi pe site"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="flex items-center gap-2 sm:hidden">
              <span className="font-black text-sm tracking-tight text-zinc-950">SWING OS</span>
              <span className="text-[9px] font-mono font-bold text-[#FF5400] bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                LIVE
              </span>
            </div>

            <div className="relative max-w-xs w-full hidden sm:block">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Caută în consolă..."
                className="w-full bg-white border border-orange-500/20 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-[#FF5400] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Telemetry Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-orange-500/20 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5400] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5400]"></span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-800 uppercase hidden sm:inline">
                LIVE FEED
              </span>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-zinc-700 hover:text-[#FF5400] hover:bg-orange-500/10 border border-orange-500/20 transition-all"
            >
              <Globe size={13} />
              <span>Site Web</span>
            </Link>

            <button
              onClick={async () => {
                await logoutUser();
                window.location.href = "/login";
              }}
              title="Deconectare Admin"
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono uppercase text-[#FF5400] hover:bg-orange-500/10 border border-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Ieșire</span>
            </button>
          </div>
        </header>

        {/* CONȚINUT PAGINĂ */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>

        {/* BARA DE NAVIGARE PE TELEFON (MOBILE BOTTOM DOCK) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-orange-500/20 px-4 py-2.5 shadow-[0_-8px_24px_rgba(255,84,0,0.1)]">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-[10px] font-bold font-mono transition-colors ${
                    isActive
                      ? "text-[#FF5400] font-black"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl transition-all ${
                      isActive ? "bg-orange-500/15 text-[#FF5400]" : ""
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span>{item.label.split(" ")[0]}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-[10px] font-bold font-mono text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              <div className="p-1.5 rounded-xl">
                <Globe size={18} />
              </div>
              <span>Site</span>
            </Link>

            <button
              onClick={async () => {
                await logoutUser();
                window.location.href = "/login";
              }}
              className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-[10px] font-bold font-mono text-red-500 hover:text-red-700 transition-colors"
            >
              <div className="p-1.5 rounded-xl">
                <LogOut size={18} />
              </div>
              <span>Ieșire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}