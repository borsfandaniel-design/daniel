"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { BarChart3, TrendingUp, Eye, MousePointerClick, PieChart } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    openRate: "64.2%",
    clickRate: "18.7%",
    conversion: "8.4%",
    roi: "3.8x",
  });

  useEffect(() => {
    // Încărcare inițială a datelor
    const fetchStats = async () => {
      const { data } = await supabase.from("analytics_stats").select("*").single();
      if (data) {
        setStats({
          openRate: data.open_rate || "64.2%",
          clickRate: data.click_rate || "18.7%",
          conversion: data.conversion || "8.4%",
          roi: data.roi || "3.8x",
        });
      }
    };

    fetchStats();

    // Ascultă modificările în timp real!
    const channel = supabase
      .channel("analytics_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "analytics_stats" },
        (payload: any) => {
          if (payload.new) {
            setStats({
              openRate: payload.new.open_rate,
              clickRate: payload.new.click_rate,
              conversion: payload.new.conversion,
              roi: payload.new.roi,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 text-[10px] font-mono font-bold uppercase text-[#D62828] mb-2">
          <BarChart3 size={12} /> REALTIME ANALYTICS
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B0808] tracking-tight">
          Analiză & Performanță
        </h1>
        <p className="text-xs sm:text-sm text-[#2B0808]/70">
          Date actualizate în timp real direct din baza de date.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">OPEN RATE</span>
            <Eye size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">{stats.openRate}</div>
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">CLICK RATE</span>
            <MousePointerClick size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">{stats.clickRate}</div>
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">CONVERSIE</span>
            <TrendingUp size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">{stats.conversion}</div>
        </div>

        <div className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#2B0808]/70">ROI CAMPANIE</span>
            <PieChart size={16} className="text-[#D62828]" />
          </div>
          <div className="text-3xl font-black text-[#2B0808] mt-2">{stats.roi}</div>
        </div>
      </div>
    </div>
  );
}