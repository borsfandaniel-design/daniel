"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Smartphone,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { authenticateUser, verifyTwoFactor, resendTwoFactorCode } from "./actions";

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Pasul 1: Verificare Email + Parolă
  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessInfo("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await authenticateUser(formData);

      if (result.success && result.requires2FA) {
        setStep("2fa");
        setSuccessInfo(result.message || "Codul de verificare 2FA a fost expediat.");
        setLoading(false);
      } else {
        setErrorMsg(result.error || "Autentificare eșuată.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("A apărut o problemă de conexiune. Te rugăm să reîncerci.");
      setLoading(false);
    }
  };

  // Pasul 2: Verificare Cod 2FA
  const handleTwoFactorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("code", twoFactorCode);

      const result = await verifyTwoFactor(formData);

      if (result.success) {
        window.location.href = "/dashboard";
      } else {
        setErrorMsg(result.error || "Cod 2FA invalid.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("Eroare la verificarea codului 2FA. Te rugăm să reîncerci.");
      setLoading(false);
    }
  };

  // Retrimitere cod 2FA
  const handleResendCode = async () => {
    setResending(true);
    setErrorMsg("");
    try {
      const res = await resendTwoFactorCode();
      if (res.success) {
        setSuccessInfo(res.message || "Un nou cod 2FA a fost expediat.");
      } else {
        setErrorMsg(res.error || "Nu s-a putut retrimite codul.");
      }
    } catch {
      setErrorMsg("Eroare la retransmiterea codului.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-zinc-950 selection:bg-[#FF5400] selection:text-white p-4 relative overflow-hidden font-sans">
      {/* GLOW DE FUNDAL */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5400]/[0.06] to-transparent rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#FF5400 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* LINK REVENIRE SITE */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold font-mono text-zinc-500 hover:text-[#FF5400] transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            <span>Înapoi la site</span>
          </Link>
          <span className="text-[10px] font-mono font-bold text-[#FF5400] uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            SWING - 2FA GUARD
          </span>
        </div>

        {/* CARD LOGIN */}
        <div className="bg-white border-2 border-orange-500/20 hover:border-[#FF5400] transition-all duration-300 shadow-[0_12px_40px_rgba(255,84,0,0.08)] rounded-[2.5rem] p-8 sm:p-10 space-y-7">
          {step === "credentials" ? (
            <>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-[#FF5400] shadow-xs mb-1">
                  <Lock size={26} />
                </div>
                <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
                  Panou <span className="text-[#FF5400]">Admin</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                  Introdu credențialele de acces pentru a deschide dashboard-ul SWING.
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-5" autoComplete="off">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    Adresă Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      required
                      autoFocus
                      className="w-full pl-11 pr-4 py-3 bg-white border-2 border-orange-500/20 hover:border-orange-500/40 focus:border-[#FF5400] rounded-2xl focus:outline-none text-zinc-950 font-medium text-sm transition-colors placeholder:text-zinc-400 shadow-2xs"
                      placeholder="nume@domain.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    Parolă de Acces
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="w-full pl-11 pr-11 py-3 bg-white border-2 border-orange-500/20 hover:border-orange-500/40 focus:border-[#FF5400] rounded-2xl focus:outline-none text-zinc-950 font-medium text-sm transition-colors placeholder:text-zinc-400 shadow-2xs"
                      placeholder="Introdu parola..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-2xl text-center animate-in fade-in">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#FF5400] hover:bg-[#E04800] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_16px_rgba(255,84,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,84,0,0.35)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  <span>{loading ? "SE VERIFICĂ..." : "CONTINUĂ CU PASUL 2 (2FA)"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* PASUL 2: VERIFICARE 2FA */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-[#FF5400] shadow-xs mb-1">
                  <Smartphone size={26} />
                </div>
                <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
                  Verificare <span className="text-[#FF5400]">2FA</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                  Introdu codul numeric de 6 cifre expediat pe email sau PIN-ul de backup.
                </p>
              </div>

              {successInfo && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{successInfo}</span>
                </div>
              )}

              <form onSubmit={handleTwoFactorSubmit} className="space-y-5" autoComplete="off">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider text-center">
                    Cod de Securitate (6 Cifre)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="code"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\s+/g, ""))}
                      autoComplete="one-time-code"
                      required
                      autoFocus
                      className="w-full py-4 px-4 bg-white border-2 border-orange-500/30 focus:border-[#FF5400] rounded-2xl focus:outline-none text-zinc-950 font-mono font-black text-2xl text-center tracking-[8px] transition-colors placeholder:text-zinc-300 shadow-2xs"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-2xl text-center animate-in fade-in">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#FF5400] hover:bg-[#E04800] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_16px_rgba(255,84,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,84,0,0.35)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  <span>{loading ? "SE AUTENTIFICĂ..." : "CONFIRMĂ & INTRĂ ÎN DASHBOARD"}</span>
                  <ArrowRight size={14} />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setErrorMsg("");
                      setSuccessInfo("");
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-950 font-mono font-semibold transition-colors cursor-pointer"
                  >
                    ← Înapoi la email
                  </button>

                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResendCode}
                    className="text-xs text-[#FF5400] hover:text-[#E04800] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                    <span>{resending ? "Se trimite..." : "Retrimite codul"}</span>
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="pt-2 border-t border-orange-500/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500">
            <ShieldCheck size={14} className="text-[#FF5400]" />
            <span>Sesiune Criptată HMAC • SWING STUDIO</span>
          </div>
        </div>
      </div>
    </div>
  );
}