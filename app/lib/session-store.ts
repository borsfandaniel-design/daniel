/**
 * RZN-06: Sesiuni Administrative Revocabile Server-Side
 * Permite revocarea instantanee a unei sesiuni la logout sau a tuturor sesiunilor la incident/schimbare parolă.
 * Nu folosește stocare volatilă care se pierde la restart.
 */

import fs from "fs";
import path from "path";

const localRevocationFile = path.join(process.cwd(), "data", "revoked_sessions.local.json");

interface LocalSecurityState {
  globalRevocationEpoch: number;
  revokedJtis: Record<string, number>; // jti -> expiresAt timestamp
}

function readLocalState(): LocalSecurityState {
  try {
    if (!fs.existsSync(localRevocationFile)) {
      return { globalRevocationEpoch: 0, revokedJtis: {} };
    }
    const raw = fs.readFileSync(localRevocationFile, "utf8");
    const parsed = JSON.parse(raw);
    return {
      globalRevocationEpoch: typeof parsed.globalRevocationEpoch === "number" ? parsed.globalRevocationEpoch : 0,
      revokedJtis: parsed.revokedJtis && typeof parsed.revokedJtis === "object" ? parsed.revokedJtis : {},
    };
  } catch {
    return { globalRevocationEpoch: 0, revokedJtis: {} };
  }
}

function writeLocalState(state: LocalSecurityState): void {
  try {
    const dir = path.dirname(localRevocationFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Curățăm jti-urile expirate înainte de salvare
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
    console.error("Eroare la salvarea stării de revocare a sesiunilor:", err);
  }
}

// Suport distribuit prin Upstash Redis REST API dacă este configurat
async function upstashCommand(command: string[]): Promise<any> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch {
    return null;
  }
}

/**
 * Verifică dacă o sesiune a fost revocată explicit sau dacă a fost emisă înainte de o invalidare globală
 */
export async function isSessionRevoked(jti: string, iat: number): Promise<boolean> {
  if (!jti) return true;

  // 1. Verificare Upstash Redis distribuit (dacă este activ)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const epochResult = await upstashCommand(["GET", "security:session_revocation_epoch"]);
      if (epochResult) {
        const epoch = parseInt(epochResult, 10);
        if (!isNaN(epoch) && iat <= epoch) {
          return true; // Sesiune emisă înainte de invalidarea globală
        }
      }

      const revoked = await upstashCommand(["GET", `security:revoked_jti:${jti}`]);
      if (revoked !== null) {
        return true;
      }
    } catch {
      // Fail-secure: continuă cu verificarea locală persistentă
    }
  }

  // 2. Verificare stocare locală persistentă
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
 * Revocă o sesiune specifică (la logout)
 */
export async function revokeSession(jti: string, expiresAt: number): Promise<void> {
  if (!jti) return;
  const ttlSeconds = Math.max(60, Math.ceil((expiresAt - Date.now()) / 1000));

  // 1. Upstash Redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      await upstashCommand(["SETEX", `security:revoked_jti:${jti}`, String(ttlSeconds), "1"]);
    } catch (err) {
      console.warn("Eroare la revocarea sesiunii în Redis:", err);
    }
  }

  // 2. Persistent local store
  const state = readLocalState();
  state.revokedJtis[jti] = expiresAt;
  writeLocalState(state);
}

/**
 * Invalidează TOATE sesiunile active emise până în acest moment (la schimbarea parolei sau alertă de securitate)
 */
export async function revokeAllSessions(): Promise<void> {
  const now = Date.now();

  // 1. Upstash Redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      await upstashCommand(["SET", "security:session_revocation_epoch", String(now)]);
    } catch (err) {
      console.warn("Eroare la setarea global revocation epoch în Redis:", err);
    }
  }

  // 2. Persistent local store
  const state = readLocalState();
  state.globalRevocationEpoch = now;
  writeLocalState(state);
}

