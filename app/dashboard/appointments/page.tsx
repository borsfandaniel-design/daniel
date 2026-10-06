"use client";

import React from "react";
import { Users, Calendar, Video, Clock, Check, Plus } from "lucide-react";

export default function AppointmentsPage() {
  const meetings = [
    { client: "Alexandru Popa", company: "TechScale SRL", time: "11:00 AM - Astăzi", type: "Discovery Call" },
    { client: "Elena Ionescu", company: "Brand Studio", time: "02:30 PM - Astăzi", type: "Graphic Design Review" },
    { client: "Mihai Radu", company: "Outreach Pros", time: "10:00 AM - Mâine", type: "Appointment Setting Sync" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62828]/10 border border-[#D62828]/30 text-[10px] font-mono font-bold uppercase text-[#D62828] mb-2">
            <Users size={12} /> APPOINTMENT SETTING
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B0808] tracking-tight">
            Întâlniri & Ședințe Programate
          </h1>
          <p className="text-xs sm:text-sm text-[#2B0808]/70">
            Programări confirmate de la lead-urile calificate.
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-[#D62828] text-[#FFF3E0] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-[#2B0808] transition-all cursor-pointer">
          <Plus size={16} />
          <span>Programează Manual</span>
        </button>
      </div>

      {/* Listă Meeting-uri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {meetings.map((m, idx) => (
          <div
            key={idx}
            className="bg-[#FCE8D5]/90 border border-[#D62828]/25 rounded-2xl p-5 backdrop-blur-md space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF3E0] border border-[#D62828]/20 text-[10px] font-mono font-bold text-[#D62828]">
                <Clock size={12} /> {m.time}
              </div>
              <h3 className="font-black text-lg text-[#2B0808]">{m.client}</h3>
              <p className="text-xs text-[#2B0808]/70 font-medium">{m.company}</p>
              <p className="text-[11px] font-mono text-[#D62828] font-bold pt-1">{m.type}</p>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#2B0808] text-[#FFF3E0] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#D62828] transition-all cursor-pointer">
              <Video size={14} />
              <span>Intră în Call</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}