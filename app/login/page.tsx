"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3E0] text-[#2B0808] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#FCE8D5]/90 border border-[#D62828]/30 rounded-3xl p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#D62828] text-[#FFF3E0] flex items-center justify-center mx-auto shadow-md">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-black">Acces Restricționat</h1>
          <p className="text-xs text-[#2B0808]/70">Autentifică-te pentru a accesa SWING OS.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-2xl px-4 py-3 text-sm text-[#2B0808] focus:outline-none focus:border-[#D62828]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Parolă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#FFF3E0] border border-[#D62828]/20 rounded-2xl px-4 py-3 text-sm text-[#2B0808] focus:outline-none focus:border-[#D62828]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-[#D62828] font-bold">
              <ShieldAlert size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#D62828] text-[#FFF3E0] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#2B0808] transition-all cursor-pointer shadow-md"
          >
            <span>Autentificare</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}