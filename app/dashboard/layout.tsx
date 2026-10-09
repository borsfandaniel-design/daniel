"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Send,
  Settings,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },

    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] font-sans flex relative overflow-hidden selection:bg-[#D62828] selection:text-[#FFF3E0]">
      {/* Grid de fundal */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#D62828 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#FCE8D5]/80 border-r border-[#D62828]/20 backdrop-blur-xl flex flex-col justify-between p-5 relative z-20 hidden md:flex shrink-0">
        <div className="space-y-8">
          {/* Logo Dashboard */}
          <Link href="/dashboard" className="flex items-center gap-3 px-2 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-[#D62828] flex items-center justify-center text-[#FFF3E0] shadow-md font-black">
              S
            </div>
            <div>
              <h2 className="font-black text-sm tracking-wider text-[#2B0808]">
                SWING OS
              </h2>
              <p className="text-[9px] font-mono font-bold text-[#D62828] uppercase">
                v2.4 // CONTROL CENTER
              </p>
            </div>
          </Link>

          {/* Meniu Navigare */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#D62828] text-[#FFF3E0] shadow-md"
                      : "text-[#2B0808]/70 hover:bg-[#FFF3E0] hover:text-[#2B0808]"
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

        {/* Status Sistem */}
        <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#D62828]/20 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#D62828]">
            <span className="w-2 h-2 rounded-full bg-[#D62828] animate-ping" />
            <span>SYSTEM ONLINE</span>
          </div>
          <p className="text-[11px] text-[#2B0808]/70 font-medium">
            Toate motoarele funcționează optim.
          </p>
        </div>
      </aside>

      {/* ZONA PRINCIPALĂ */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* HEADER TOP */}
        <header className="h-16 border-b border-[#D62828]/15 bg-[#FCE8D5]/50 backdrop-blur-md px-6 flex items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2B0808]/40"
            />
            <input
              type="text"
              placeholder="Caută..."
              className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#2B0808] placeholder-[#2B0808]/40 focus:outline-none focus:border-[#D62828] transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-[#FFF3E0] border border-[#D62828]/20 flex items-center justify-center text-[#2B0808] hover:border-[#D62828] transition-all relative cursor-pointer">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D62828] rounded-full" />
            </button>

            <div className="h-6 w-[1px] bg-[#D62828]/20" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2B0808] text-[#FFF3E0] flex items-center justify-center font-bold text-xs">
                DM
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold leading-none">Daniel Moisă</p>
                <p className="text-[9px] font-mono text-[#D62828]">ADMINISTRATOR</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONȚINUT PAGINĂ */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}