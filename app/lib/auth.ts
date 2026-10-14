/**
 * Securitate & Criptare Token-uri de Sesiune și 2FA (HMAC-SHA256)
 * RZN-02: Fără PIN implicit sau predictibil, suport pentru coduri de recuperare cu utilizare unică.
 * RZN-03: AUTH_SECRET strict obligatoriu (minim 32 caractere, fără fallback-uri nesigure).
 * RZN-06: Sesiuni administrative revocabile server-side cu jti, expirare la 12 ore și epoch global.
 */

import { isSessionRevoked, revokeSession, revokeAllSessions } from "./session-store";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class SecurityConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecurityConfigurationError";
  }
}

/**
 * Validează și returnează AUTH_SECRET.
 * RZN-03: Refuză pornirea funcțiilor administrative dacă secretul lipsește sau nu respectă cerințele.
 * Nu folosește fallback derivat din alte credențiale și nu loghează valoarea secretului.
 */
export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || typeof secret !== "string" || secret.trim().length < 32) {
    throw new SecurityConfigurationError(
      "AUTH_SECRET este obligatoriu și trebuie să aibă minimum 32 de caractere cu entropie ridicată. Configurează AUTH_SECRET în variabilele de mediu."
    );
  }
  return secret.trim();
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signData(payload: object, customSecret?: string): Promise<string> {
  const keySecret = customSecret || getAuthSecret();
  const key = await getCryptoKey(keySecret);
  const jsonStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(encoder.encode(jsonStr));
  const dataToSign = encoder.encode(payloadB64);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, dataToSign);
  const sigHex = bytesToHex(new Uint8Array(sigBuffer));
  return `${payloadB64}.${sigHex}`;
}

export async function verifyData<T = any>(token: string, customSecret?: string): Promise<T | null> {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      return null;
    }
    const [payloadB64, sigHex] = token.split(".");
    if (!payloadB64 || !sigHex || sigHex.length !== 64) {
      return null;
    }

    const keySecret = customSecret || getAuthSecret();
    const key = await getCryptoKey(keySecret);
    const sigBytes = hexToBytes(sigHex);
    const dataToVerify = encoder.encode(payloadB64);

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, dataToVerify);
    if (!isValid) {
      return null;
    }

    const jsonStr = decoder.decode(base64UrlDecode(payloadB64));
    const data = JSON.parse(jsonStr) as T;

    if (data && typeof (data as any).exp === "number") {
      if (Date.now() > (data as any).exp) {
        return null; // Expirat
      }
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Generează un cod numeric de 6 cifre criptografic aleatoriu
 */
export function generate2FACode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = (array[0] % 900000) + 100000;
  return code.toString();
}

/**
 * Creează un token temporar securizat pentru 2FA pending (10 minute)
 */
export async function createPending2FAToken(email: string, code: string): Promise<string> {
  const secret = getAuthSecret();
  const key = await getCryptoKey(secret);
  const codeHashBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(code));
  const codeHash = bytesToHex(new Uint8Array(codeHashBuffer));

  return await signData({
    type: "2fa_pending",
    email,
    codeHash,
    jti: crypto.randomUUID(),
    exp: Date.now() + 10 * 60 * 1000, // 10 minute
  });
}

/**
 * RZN-02: Verificare cod 2FA
 * Elimină complet orice PIN implicit (ex: 839201).
 * Acceptă exclusiv:
 * 1. Codul dinamic de 6 cifre expediat pe email
 * 2. Un PIN de urgență explicit configurat în ADMIN_2FA_PIN (fără valori implicite)
 */
export async function verify2FACode(
  pendingToken: string,
  inputCode: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  const cleanCode = inputCode.trim();
  if (!cleanCode || cleanCode.length < 6) {
    return { success: false, error: "Codul 2FA trebuie să conțină minimum 6 caractere." };
  }

  // 1. Verifică integritatea și expirarea tokenului 2FA temporar
  const payload = await verifyData<{
    type: string;
    email: string;
    codeHash: string;
    jti: string;
    exp: number;
  }>(pendingToken);

  if (!payload || payload.type !== "2fa_pending") {
    return {
      success: false,
      error: "Sesiunea de verificare a expirat sau este invalidă. Autentifică-te din nou.",
    };
  }

  // 2. Verificare cod de rezervă explicit configurat în ADMIN_2FA_PIN (fără fallback hardcodat)
  const configuredEmergencyPin = process.env.ADMIN_2FA_PIN?.trim();
  if (configuredEmergencyPin && configuredEmergencyPin.length >= 6) {
    if (cleanCode === configuredEmergencyPin) {
      return { success: true, email: payload.email };
    }
  }

  // 3. Verificare cod dinamic hash-uit
  const secret = getAuthSecret();
  const key = await getCryptoKey(secret);
  const inputHashBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(cleanCode));
  const inputHash = bytesToHex(new Uint8Array(inputHashBuffer));

  if (inputHash !== payload.codeHash) {
    return { success: false, error: "Codul de verificare introdus este incorect." };
  }

  return { success: true, email: payload.email };
}

export interface AdminSessionPayload {
  sub: "admin";
  email: string;
  role: "admin";
  jti: string;
  iat: number;
  exp: number;
}

/**
 * RZN-06: Creează token de sesiune administrativă cu jti și durată redusă la 12 ore
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  const now = Date.now();
  const jti = crypto.randomUUID();
  const exp = now + 12 * 60 * 60 * 1000; // 12 ore

  return await signData({
    sub: "admin",
    email,
    role: "admin",
    jti,
    iat: now,
    exp,
  });
}

/**
 * RZN-06: Validează sesiunea admin, inclusiv verificarea revocării pe server
 */
export async function verifyAdminSessionToken(
  token: string
): Promise<{ valid: boolean; email?: string; jti?: string; exp?: number }> {
  try {
    const payload = await verifyData<AdminSessionPayload>(token);
    if (!payload || payload.sub !== "admin" || payload.role !== "admin") {
      return { valid: false };
    }

    // Verifică revocarea server-side a sesiunii (după jti sau invalidare globală)
    const isRevoked = await isSessionRevoked(payload.jti, payload.iat);
    if (isRevoked) {
      return { valid: false };
    }

    return { valid: true, email: payload.email, jti: payload.jti, exp: payload.exp };
  } catch {
    return { valid: false };
  }
}

/**
 * RZN-06: Revocă sesiunea curentă server-side
 */
export async function revokeCurrentSession(token: string): Promise<void> {
  try {
    const payload = await verifyData<AdminSessionPayload>(token);
    if (payload && payload.jti && payload.exp) {
      await revokeSession(payload.jti, payload.exp);
    }
  } catch (err) {
    console.error("Eroare la revocarea sesiunii curente:", err);
  }
}

/**
 * RZN-06: Invalidează global toate sesiunile administrative (după schimbarea parolei)
 */
export async function invalidateAllAdminSessions(): Promise<void> {
  await revokeAllSessions();
}
