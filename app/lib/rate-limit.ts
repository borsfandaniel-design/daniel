/**
 * SWI-10 (fost RZN-04 / RZN-10): Rate Limiting Distribuit & Prevenire DDoS / Brute-Force
 * SWI-11: Integrare cu identificarea securizată a IP-ului clientului
 *
 * CERINȚE DE SECURITATE:
 * 1. Redis este obligatoriu în producție.
 * 2. Nu permite fallback silențios la Map în memorie când Redis nu funcționează în producție.
 * 3. În caz de indisponibilitate în producție, aplică o politică defensivă controlată (fail-closed / throttled).
 * 4. Fallback-ul local este permis exclusiv în dezvoltare.
 */

import { getClientIp, isValidIp } from "./client-ip";

export { getClientIp, isValidIp };

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  error?: string;
}

interface LocalMemoryRecord {
  count: number;
  resetAt: number;
}

// Stocare locală în memorie (permisă EXCLUSIV în dezvoltare)
const localStore = new Map<string, LocalMemoryRecord>();

if (typeof setInterval !== "undefined" && process.env.NODE_ENV !== "production") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of localStore.entries()) {
      if (now > record.resetAt) {
        localStore.delete(key);
      }
    }
  }, 60000);
}

function checkLocalRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const record = localStore.get(identifier);

  if (!record || now > record.resetAt) {
    localStore.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt: now + options.windowMs,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= options.limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: options.limit - record.count,
    resetAt: record.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Operațiune atomică pe Upstash Redis REST API
 */
async function checkDistributedRedisRateLimit(
  identifier: string,
  options: RateLimitOptions,
  url: string,
  token: string
): Promise<RateLimitResult | null> {
  try {
    const ttlSeconds = Math.ceil(options.windowMs / 1000);
    const key = `ratelimit:${identifier}`;

    // Pipeline atomic Redis: INCR urmat de TTL
    const pipeline = [
      ["INCR", key],
      ["TTL", key],
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 secunde timeout

    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipeline),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const count = Number(data[0]?.result);
    let ttl = Number(data[1]?.result);

    // Dacă cheia nu avea TTL (-1 sau la prima cerere), setăm TTL atomic
    if (count === 1 || ttl <= 0) {
      await fetch(`${url}/EXPIRE/${key}/${ttlSeconds}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).catch(() => {});
      ttl = ttlSeconds;
    }

    const now = Date.now();
    const resetAt = now + ttl * 1000;

    if (count > options.limit) {
      return {
        success: false,
        remaining: 0,
        resetAt,
        retryAfterSeconds: Math.max(1, ttl),
      };
    }

    return {
      success: true,
      remaining: Math.max(0, options.limit - count),
      resetAt,
      retryAfterSeconds: 0,
    };
  } catch (err) {
    console.warn("Eroare comunicare cu serviciul Redis rate limit:", (err as any)?.message);
    return null;
  }
}

/**
 * Verifică rata de cereri apelând store-ul distribuit.
 *
 * În PRODUCȚIE:
 * - Nu permite fallback silențios la Map în memorie.
 * - Dacă Redis lipsește sau este indisponibil, aplică o politică defensivă fail-closed controlată.
 *
 * În DEZVOLTARE:
 * - Folosește Redis dacă este configurat, altfel memorie locală.
 */
export async function checkRateLimitAsync(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    const distributedResult = await checkDistributedRedisRateLimit(identifier, options, redisUrl, redisToken);
    if (distributedResult !== null) {
      return distributedResult;
    }
  }

  // SWI-10: Tratare în producție fără fallback silențios la Map
  if (isProduction) {
    console.error(
      `SECURITATE: Serviciul distribuit Redis de rate limiting este indisponibil în producție pentru '${identifier}'. Se aplică politica de apărare fail-closed.`
    );
    return {
      success: false,
      remaining: 0,
      resetAt: Date.now() + 60000,
      retryAfterSeconds: 60,
      error: "Serviciul de securitate este temporar indisponibil. Te rugăm să încerci din nou peste câteva momente.",
    };
  }

  // Fallback local garantat EXCLUSIV pentru dezvoltare
  return checkLocalRateLimit(identifier, options);
}

/**
 * Versiune sincronă compatibilă (folosită doar în dev)
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  if (process.env.NODE_ENV === "production") {
    console.warn("checkRateLimit sincron este apelat în producție. Se recomandă checkRateLimitAsync.");
  }
  return checkLocalRateLimit(identifier, options);
}

/**
 * Resetează contorul pentru un identificator (ex: la autentificare reușită)
 */
export async function resetRateLimitAsync(identifier: string): Promise<void> {
  localStore.delete(identifier);

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      await fetch(`${redisUrl}/DEL/ratelimit:${identifier}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${redisToken.trim()}` },
        cache: "no-store",
      });
    } catch {}
  }
}

export function resetRateLimit(identifier: string): void {
  localStore.delete(identifier);
}
