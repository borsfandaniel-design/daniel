/**
 * Securitate & Criptare Token-uri de Sesiune și 2FA (HMAC-SHA256)
 * RZN-02: Fără PIN implicit sau predictibil, suport pentru coduri de recuperare cu utilizare unică.
 * RZN-03: AUTH_SECRET strict obligatoriu (minim 32 caractere, fără fallback-uri nesigure).
 * RZN-06: Sesiuni administrative revocabile server-side cu jti, expirare la 12 ore și epoch global.
 */

import {
  isSessionRevoked,
  revokeSession,
  revokeAllSessions,
  isRecoveryCodeConsumed,
  consumeRecoveryCode,
} from "./session-store";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const WEAK_PINS = new Set(["123456", "839201", "000000", "111111", "999999", "654321", "123123"]);

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
 * SWI-14: Generează un set de coduri de recuperare criptografice unice (ex: format SWING-XXXX-XXXX)
 */
export function generateSingleUseRecoveryCodes(count = 6): string[] {
  const codes: string[] = [];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Base32 fără caractere ambigue (O, 0, I, 1)
  for (let i = 0; i < count; i++) {
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    let part1 = "";
    let part2 = "";
    for (let j = 0; j < 4; j++) {
      part1 += chars[randomBytes[j] % chars.length];
      part2 += chars[randomBytes[j + 4] % chars.length];
    }
    codes.push(`SWING-${part1}-${part2}`);
  }
  return codes;
}

/**
 * Normalizare cod de recuperare (elimină spații, cratime și convertește la majuscule)
 */
function normalizeRecoveryCode(raw: string): string {
  return raw.replace(/[-\s]/g, "").toUpperCase();
}

/**
 * SWI-14 (fost RZN-02 / RZN-14): Verificare securizată a codului 2FA
 *
 * Ierarhie de acceptare:
 * 1. Codul OTP dinamic de 6 cifre expediat pe email (valabil 10 minute).
 * 2. Coduri de recuperare unice generate criptografic (ADMIN_RECOVERY_CODES),
 *    verificate prin hash și marcate atomic ca utilizate (single-use).
 * 3. PIN de rezervă configurat explicit (ADMIN_2FA_PIN), cu respingerea strictă
 *    a valorilor implicite/slabe (ex: 123456, 839201).
 */
export async function verify2FACode(
  pendingToken: string,
  inputCode: string
): Promise<{ success: boolean; email?: string; error?: string; isRecovery?: boolean }> {
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

  const secret = getAuthSecret();
  const key = await getCryptoKey(secret);

  // 2. SWI-14: Verificare cod dinamic OTP (HMAC-SHA256)
  const inputOtpHashBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(cleanCode));
  const inputOtpHash = bytesToHex(new Uint8Array(inputOtpHashBuffer));

  if (inputOtpHash === payload.codeHash) {
    return { success: true, email: payload.email, isRecovery: false };
  }

  // 3. SWI-14: Verificare coduri de recuperare criptografice unice (ADMIN_RECOVERY_CODES)
  const recoveryCodesEnv = process.env.ADMIN_RECOVERY_CODES?.trim();
  if (recoveryCodesEnv) {
    const validCodes = recoveryCodesEnv.split(",").map((c) => c.trim()).filter(Boolean);
    const normalizedInput = normalizeRecoveryCode(cleanCode);

    for (const validCode of validCodes) {
      if (normalizeRecoveryCode(validCode) === normalizedInput) {
        // Hash unic al codului pentru stocare și verificare atomică
        const recHashBuffer = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(`rec_${normalizedInput}`)
        );
        const recHash = bytesToHex(new Uint8Array(recHashBuffer));

        const isUsed = await isRecoveryCodeConsumed(recHash);
        if (isUsed) {
          return {
            success: false,
            error: "Acest cod de recuperare a fost deja utilizat. Folosește un alt cod de rezervă.",
          };
        }

        // Marcare atomică ca utilizat (single-use)
        const consumed = await consumeRecoveryCode(recHash);
        if (!consumed) {
          return {
            success: false,
            error: "Eroare la validarea codului de recuperare (posibil cod deja utilizat).",
          };
        }

        return { success: true, email: payload.email, isRecovery: true };
      }
    }
  }

  // 4. Verificare fallback PIN de urgență explicit (ADMIN_2FA_PIN)
  const configuredEmergencyPin = process.env.ADMIN_2FA_PIN?.trim();
  if (configuredEmergencyPin && configuredEmergencyPin.length >= 6) {
    // Respingere valori implicite slabe sau predictibile
    if (WEAK_PINS.has(configuredEmergencyPin)) {
      console.error(
        "SECURITATE CRITICĂ: ADMIN_2FA_PIN conține o valoare slabă/predictibilă interzisă. PIN-ul este ignorat."
      );
    } else if (cleanCode === configuredEmergencyPin) {
      return { success: true, email: payload.email, isRecovery: true };
    }
  }

  return { success: false, error: "Codul de verificare introdus este incorect." };
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
