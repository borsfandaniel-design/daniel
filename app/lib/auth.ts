/**
 * Securitate & Criptare Token-uri de Sesiune și 2FA (HMAC-SHA256)
 * Nu expune parole, previne atacurile de tip timing și manipularea cookie-urilor.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  // Fallback bazat pe variabile de mediu existente dacă AUTH_SECRET nu este definit
  const fallbackSource = `${process.env.ADMIN_EMAIL || "admin"}_${process.env.RESEND_API_KEY || "swing_auth"}_fallback_key`;
  return fallbackSource;
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

export async function signData(payload: object, secret?: string): Promise<string> {
  const keySecret = secret || getAuthSecret();
  const key = await getCryptoKey(keySecret);
  const jsonStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(encoder.encode(jsonStr));
  const dataToSign = encoder.encode(payloadB64);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, dataToSign);
  const sigHex = bytesToHex(new Uint8Array(sigBuffer));
  return `${payloadB64}.${sigHex}`;
}

export async function verifyData<T = any>(token: string, secret?: string): Promise<T | null> {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      return null;
    }
    const [payloadB64, sigHex] = token.split(".");
    if (!payloadB64 || !sigHex || sigHex.length !== 64) {
      return null;
    }

    const keySecret = secret || getAuthSecret();
    const key = await getCryptoKey(keySecret);
    const sigBytes = hexToBytes(sigHex);
    const dataToVerify = encoder.encode(payloadB64);

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, dataToVerify);
    if (!isValid) {
      return null;
    }

    const jsonStr = decoder.decode(base64UrlDecode(payloadB64));
    const data = JSON.parse(jsonStr) as T;

    // Verifică expirarea dacă există câmpul exp
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
 * Generează un cod numeric aleatoriu de 6 cifre pentru 2FA
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
    exp: Date.now() + 10 * 60 * 1000, // 10 minute
  });
}

/**
 * Verifică codul 2FA primit
 */
export async function verify2FACode(
  pendingToken: string,
  inputCode: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  const cleanCode = inputCode.trim();
  if (!cleanCode || cleanCode.length < 6) {
    return { success: false, error: "Codul 2FA trebuie să aibă 6 cifre." };
  }

  // Permite și codul de urgență / PIN backup din .env.local
  const emergencyPin = process.env.ADMIN_2FA_PIN?.trim();
  if (emergencyPin && cleanCode === emergencyPin) {
    const payload = await verifyData(pendingToken);
    if (payload && payload.type === "2fa_pending") {
      return { success: true, email: payload.email };
    }
  }

  const payload = await verifyData<{
    type: string;
    email: string;
    codeHash: string;
    exp: number;
  }>(pendingToken);

  if (!payload || payload.type !== "2fa_pending") {
    return { success: false, error: "Sesiunea 2FA a expirat sau este invalidă. Te rugăm să te autentifici din nou." };
  }

  const secret = getAuthSecret();
  const key = await getCryptoKey(secret);
  const inputHashBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(cleanCode));
  const inputHash = bytesToHex(new Uint8Array(inputHashBuffer));

  if (inputHash !== payload.codeHash) {
    return { success: false, error: "Codul 2FA introdus este incorect." };
  }

  return { success: true, email: payload.email };
}

/**
 * Creează un token criptat de sesiune admin valid 7 zile
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  return await signData({
    sub: "admin",
    email,
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 zile
  });
}

/**
 * Validează un token de sesiune admin
 */
export async function verifyAdminSessionToken(token: string): Promise<{ valid: boolean; email?: string }> {
  const payload = await verifyData<{
    sub: string;
    email: string;
    role: string;
    exp: number;
  }>(token);

  if (payload && payload.sub === "admin" && payload.role === "admin") {
    return { valid: true, email: payload.email };
  }
  return { valid: false };
}

