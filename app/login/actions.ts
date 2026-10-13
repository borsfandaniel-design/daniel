"use server";

import { cookies, headers } from "next/headers";
import { Resend } from "resend";
import {
  createPending2FAToken,
  verify2FACode,
  createAdminSessionToken,
  generate2FACode,
} from "../lib/auth";
import { checkRateLimit, resetRateLimit, getClientIp } from "../lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Pasul 1: Verificare Email + Parolă din variabilele de mediu
 * Trimitere cod 2FA de securitate pe email
 */
export async function authenticateUser(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = getClientIp(reqHeaders);

  // Rate Limiting anti-brute force: Max 10 încercări per 60 secunde per IP (cooldown rapid de 1 minut)
  const rateLimit = checkRateLimit(`login_${clientIp}`, {
    limit: 10,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.success) {
    return {
      success: false,
      error: `Prea multe încercări. Te rugăm să aștepți ${rateLimit.retryAfterSeconds} secunde înainte de a reîncerca.`,
    };
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
  const password = (formData.get("password") as string)?.trim() || "";

  const validEmail = (process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com").trim().toLowerCase();
  const validPassword = (process.env.ADMIN_PASSWORD || "").trim();

  if (!validPassword) {
    console.error("Configurare critică: ADMIN_PASSWORD nu este setată în variabilele de mediu.");
    return {
      success: false,
      error: "Lipsește variabila ADMIN_PASSWORD din panoul Vercel (Settings -> Environment Variables). Adaugă ADMIN_PASSWORD și dă Redeploy.",
    };
  }

  if (!email || !password) {
    return {
      success: false,
      error: "Te rugăm să completezi atât email-ul, cât și parola.",
    };
  }

  if (email !== validEmail || password !== validPassword) {
    return {
      success: false,
      error: "Credențiale incorecte. Verifică email-ul și parola configurate pe server.",
    };
  }

  // Resetează contorul de rate limit pentru acest IP la parolă corectă
  resetRateLimit(`login_${clientIp}`);

  // Generare cod 2FA de 6 cifre
  const code2FA = generate2FACode();
  const pendingToken = await createPending2FAToken(email, code2FA);

  // Salvează tokenul temporar 2FA într-un cookie HttpOnly securizat (10 minute)
  const cookieStore = await cookies();
  cookieStore.set("pending_2fa_token", pendingToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minute
    path: "/",
  });

  // Trimitere email cu codul 2FA către adresa de admin
  let emailSent = false;
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "SWING Security <onboarding@resend.dev>",
        to: [validEmail],
        subject: `[SWING] Codul tău de verificare 2FA: ${code2FA}`,
        text: `Codul tău de verificare în 2 pași pentru panoul SWING este: ${code2FA}\n\nAcest cod este valabil 10 minute.\nDacă nu ai încercat să te autentifici, schimbă imediat parola din .env.local!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 2px solid #FF5400; border-radius: 20px; padding: 32px; color: #09090b;">
            <div style="border-bottom: 1px solid #f4f4f5; padding-bottom: 16px; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 800; font-family: monospace; color: #FF5400; letter-spacing: 2px; text-transform: uppercase;">SWING // SECURITY GUARD</span>
              <h2 style="margin: 8px 0 0; font-size: 22px; font-weight: 900; color: #09090b; letter-spacing: -0.5px;">Verificare în 2 Pași (2FA)</h2>
            </div>
            
            <p style="font-size: 14px; color: #52525b; line-height: 1.6; margin: 0 0 24px;">
              A fost inițiată o încercare de autentificare în Dashboard-ul SWING de la adresa IP <code style="background: #f4f4f5; padding: 2px 6px; border-radius: 6px; font-weight: 700;">${clientIp}</code>.
            </p>

            <div style="background-color: #FFF7ED; border: 2px dashed #FF5400; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #C2410C; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Codul tău de securitate 2FA</div>
              <div style="font-size: 38px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #EA580C;">${code2FA}</div>
              <div style="font-size: 11px; color: #9A3412; margin-top: 8px;">Valabil timp de 10 minute • O singură utilizare</div>
            </div>

            <p style="font-size: 12px; color: #71717a; line-height: 1.5; margin: 0;">
              Dacă nu ai solicitat tu acest cod, ignoră acest email și verifică securitatea serverului.
            </p>
          </div>
        `,
      });
      emailSent = true;
    }
  } catch (emailErr) {
    console.error("Eroare la expedierea email-ului 2FA prin Resend:", emailErr);
  }

  return {
    success: true,
    requires2FA: true,
    emailSent,
    message: emailSent
      ? `Codul 2FA a fost expediat la ${validEmail}.`
      : "Introdu codul 2FA primit sau PIN-ul de backup din setări.",
  };
}

/**
 * Pasul 2: Validare cod 2FA și emitere sesiune criptată admin
 */
export async function verifyTwoFactor(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = getClientIp(reqHeaders);

  // Rate Limiting anti-brute force 2FA: Max 10 încercări per 60 secunde (cooldown 1 minut)
  const rateLimit = checkRateLimit(`2fa_${clientIp}`, {
    limit: 10,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.success) {
    return {
      success: false,
      error: `Prea multe încercări incorecte. Așteaptă ${rateLimit.retryAfterSeconds} secunde.`,
    };
  }

  const code = (formData.get("code") as string)?.trim() || "";
  if (!code) {
    return { success: false, error: "Introdu codul de securitate 2FA." };
  }

  const cookieStore = await cookies();
  const pendingToken = cookieStore.get("pending_2fa_token")?.value;

  if (!pendingToken) {
    return {
      success: false,
      error: "Sesiunea de autentificare a expirat. Te rugăm să reintroduci emailul și parola.",
    };
  }

  const verification = await verify2FACode(pendingToken, code);
  if (!verification.success || !verification.email) {
    return {
      success: false,
      error: verification.error || "Codul 2FA este incorect.",
    };
  }

  // Resetează contorul 2FA și șterge tokenul temporar
  resetRateLimit(`2fa_${clientIp}`);
  cookieStore.delete("pending_2fa_token");

  // Generează tokenul criptat de sesiune (HMAC-SHA256, valid 7 zile)
  const sessionToken = await createAdminSessionToken(verification.email);

  // Setează cookie-ul de sesiune strict securizat (HttpOnly, SameSite Strict)
  cookieStore.set("auth_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 zile
    path: "/",
  });

  return { success: true };
}

/**
 * Retrimitere cod 2FA
 */
export async function resendTwoFactorCode() {
  const reqHeaders = await headers();
  const clientIp = getClientIp(reqHeaders);

  // Limitează retrimiterea la 1 dată pe minut
  const rateLimit = checkRateLimit(`resend_2fa_${clientIp}`, {
    limit: 2,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.success) {
    return {
      success: false,
      error: `Așteaptă ${rateLimit.retryAfterSeconds} secunde înainte de a solicita un cod nou.`,
    };
  }

  const cookieStore = await cookies();
  const pendingToken = cookieStore.get("pending_2fa_token")?.value;

  if (!pendingToken) {
    return {
      success: false,
      error: "Sesiunea a expirat. Autentifică-te din nou cu email și parolă.",
    };
  }

  const validEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const code2FA = generate2FACode();
  const newPendingToken = await createPending2FAToken(validEmail, code2FA);

  cookieStore.set("pending_2fa_token", newPendingToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  try {
    if (process.env.RESEND_API_KEY && validEmail) {
      await resend.emails.send({
        from: "SWING Security <onboarding@resend.dev>",
        to: [validEmail],
        subject: `[SWING] Cod nou de verificare 2FA: ${code2FA}`,
        text: `Codul tău de verificare 2FA este: ${code2FA}`,
      });
    }
    return { success: true, message: "Un cod nou a fost trimis pe email." };
  } catch {
    return { success: false, error: "Eroare la trimiterea noului cod. Încearcă din nou." };
  }
}

/**
 * Deconectare administrator
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("pending_2fa_token");
  return { success: true };
}