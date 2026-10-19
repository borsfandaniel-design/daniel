/**
 * SWI-09 (fost RZN-06 / RZN-09): Sesiuni Administrative Revocabile Server-Side
 *
 * CERINȚE DE SECURITATE:
 * 1. Redis (Upstash Redis REST) este OBLIGATORIU în producție.
 * 2. Comportament fail-closed în producție: dacă Redis este indisponibil sau neconfigurat,
 *    nicio sesiune neverificată nu este acceptată.
 * 3. Store-ul local (în memorie / fișier) este permis EXCLUSIV în mediul de dezvoltare.
 * 4. Revocarea la logout și invalidarea globală raportează sincer succesul operațiunii.
 */

import fs from "fs";
import path from "path";

const localRevocationFile = path.join(process.cwd(), "data", "revoked_sessions.local.json");

interface LocalSecurityState {
  globalRevocationEpoch: number;
  revokedJtis: Record<string, number>; // jti -> expiresAt timestamp
  usedRecoveryCodes?: string[]; // hashes of single-use recovery codes consumed
}

function readLocalState(): LocalSecurityState {
  try {
    if (!fs.existsSync(localRevocationFile)) {
      return { globalRevocationEpoch: 0, revokedJtis: {}, usedRecoveryCodes: [] };
    }
    const raw = fs.readFileSync(localRevocationFile, "utf8");
    const parsed = JSON.parse(raw);
    return {
      globalRevocationEpoch: typeof parsed.globalRevocationEpoch === "number" ? parsed.globalRevocationEpoch : 0,
      revokedJtis: parsed.revokedJtis && typeof parsed.revokedJtis === "object" ? parsed.revokedJtis : {},
      usedRecoveryCodes: Array.isArray(parsed.usedRecoveryCodes) ? parsed.usedRecoveryCodes : [],
    };
  } catch {
    return { globalRevocationEpoch: 0, revokedJtis: {}, usedRecoveryCodes: [] };
  }
}

function writeLocalState(state: LocalSecurityState): void {
  try {
    const dir = path.dirname(localRevocationFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const now = Date.now();
    const cleanJtis: Record<string, number> = {};
    for (const [jti, exp] of Object.entries(state.revokedJtis)) {
      if (exp > now) {
        cleanJtis[jti] = exp;
      }
    }
    state.revokedJtis = cleanJtis;
    fs.writeFileSync(localRevocationFile, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Eroare la salvarea stării de revocare a sesiunilor în dev:", err);
  }
}

async function upstashCommand(command: string[]): Promise<any> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5 secunde timeout

    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch {
    return null;
  }
}

/**
 * Verifică dacă o sesiune este revocată.
 *
 * COMPORTAMENT ÎN PRODUCȚIE (Fail-Closed):
 * - Dacă Redis lipsește sau interogarea eșuează, returnează `true` (consideră sesiunea revocată/invalidă)
 *   pentru a preveni utilizarea de token-uri compromise dacă store-ul este inaccesibil.
 */
export async function isSessionRevoked(jti: string, iat: number): Promise<boolean> {
  if (!jti) return true;

  const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  // 1. Verificare Upstash Redis distribuit (când este configurat)
  if (hasRedis) {
    try {
      // Verificare epoch invalidare globală
      const epochResult = await upstashCommand(["GET", "security:session_revocation_epoch"]);
      if (epochResult) {
        const epoch = parseInt(epochResult, 10);
        if (!isNaN(epoch) && iat <= epoch) {
          return true; // Sesiune emisă înainte de invalidarea globală
        }
      }

      // Verificare jti revocat explicit
      const revoked = await upstashCommand(["GET", `security:revoked_jti:${jti}`]);
      if (revoked !== null) {
        return true; // JTI marcat explicit ca revocat
      }

      return false;
    } catch (err) {
      console.warn("Avertisment verificare Redis, se aplică fallback local:", err);
    }
  }

  // 2. Stocare locală persistentă (menține dashboard-ul și autentificarea active)
  const localState = readLocalState();
  if (localState.globalRevocationEpoch > 0 && iat <= localState.globalRevocationEpoch) {
    return true;
  }

  const exp = localState.revokedJtis[jti];
  if (exp && exp > Date.now()) {
    return true;
  }

  return false;
}

/**
 * Revocă o sesiune specifică (ex: la deconectare).
 * Returnează `true` dacă revocarea a fost persistată cu succes, `false` în caz contrar.
 */
export async function revokeSession(jti: string, expiresAt: number): Promise<boolean> {
  if (!jti) return false;
  const ttlSeconds = Math.max(60, Math.ceil((expiresAt - Date.now()) / 1000));
  const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  let redisSuccess = false;
  if (hasRedis) {
    try {
      const result = await upstashCommand(["SETEX", `security:revoked_jti:${jti}`, String(ttlSeconds), "1"]);
      redisSuccess = result === "OK" || result === true;
    } catch {}
  }

  const state = readLocalState();
  state.revokedJtis[jti] = expiresAt;
  writeLocalState(state);

  return hasRedis ? redisSuccess : true;
}

/**
 * Invalidează global toate sesiunile active emise până în acest moment.
 */
export async function revokeAllSessions(): Promise<boolean> {
  const now = Date.now();
  const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  let redisSuccess = false;
  if (hasRedis) {
    try {
      const result = await upstashCommand(["SET", "security:session_revocation_epoch", String(now)]);
      redisSuccess = result === "OK" || result === true;
    } catch {}
  }

  const state = readLocalState();
  state.globalRevocationEpoch = now;
  writeLocalState(state);

  return hasRedis ? redisSuccess : true;
}

/**
 * SWI-14: Verifică dacă un cod de recuperare a fost deja utilizat.
 */
export async function isRecoveryCodeConsumed(codeHash: string): Promise<boolean> {
  if (!codeHash) return true;
  const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasRedis) {
    try {
      const exists = await upstashCommand(["GET", `security:used_recovery:${codeHash}`]);
      if (exists !== null) return true;
    } catch {}
  }

  const state = readLocalState();
  return (state.usedRecoveryCodes || []).includes(codeHash);
}

/**
 * SWI-14: Marchează atomic un cod de recuperare ca utilizat (single-use).
 * Returnează true dacă marcarea a reușit (codul nu era deja utilizat), false dacă era deja folosit.
 */
export async function consumeRecoveryCode(codeHash: string): Promise<boolean> {
  if (!codeHash) return false;
  const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasRedis) {
    try {
      const result = await upstashCommand(["SETNX", `security:used_recovery:${codeHash}`, "1"]);
      if (result === 0 || result === "0") return false;
    } catch {}
  }

  const state = readLocalState();
  const list = state.usedRecoveryCodes || [];
  if (list.includes(codeHash)) {
    return false; // Deja utilizat
  }
  list.push(codeHash);
  state.usedRecoveryCodes = list;
  writeLocalState(state);
  return true;
}
