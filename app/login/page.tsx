"use client";

import { useState } from "react";
import { authenticateUser } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const result = await authenticateUser(email, password);

    // Dacă credențialele sunt incorecte și nu s-a executat redirect-ul din server
    if (result && !result.success) {
      setErrorMsg(result.error || "Autentificare eșuată.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF3E0] p-4">
      <div className="w-full max-w-md bg-[#FFF3E0] border border-[#D62828]/20 shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#D62828] text-white shadow-md mb-2">
            🔒
          </div>
          <h1 className="text-3xl font-bold text-[#2B2D42]">Acces Restricționat</h1>
          <p className="text-sm text-gray-600">
            Autentifică-te pentru a accesa SWING OS.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D62828] text-gray-900"
              placeholder="nume@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Parolă
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#FFF3E0] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D62828] text-gray-900"
              placeholder="••••••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#D62828] hover:bg-[#b52020] text-white font-bold rounded-xl shadow-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "SE VERIFICĂ..." : "AUTENTIFICARE →"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}