/**
 * RZN-04: Rate Limiting Distribuit & Prevenire DDoS / Brute-Force
 * OBS-01: Integrare cu identificarea securizată a IP-ului clientului
 * Suportă Upstash Redis REST pentru medii serverless / multi-instance cu fallback local și tratare explicită a erorilor.
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
}

interface LocalMemoryRecord {
  count: number;
  resetAt: number;
}

// Stocare locală de rezervă (folosită în dev sau când serviciul distribuit este indisponibil)
const localStore = new Map<string, LocalMemoryRecord>();

if (typeof setInterval !== "undefined") {
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

    // Pipeline atomic Redis: INCR urmat de EXPIRE la prima incrementare
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

    // Dacă cheia nu avea TTL (-1), setăm TTL
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
    console.warn("Serviciul distribuit de rate limiting este temporar indisponibil. Se aplică fallback local:", (err as any)?.message);
    return null;
  }
}

/**
 * Verifică rata de cereri apelând store-ul distribuit dacă este configurat, cu fallback local sigur
 */
export async function checkRateLimitAsync(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    const distributedResult = await checkDistributedRedisRateLimit(identifier, options, redisUrl, redisToken);
    if (distributedResult !== null) {
      return distributedResult;
    }
  }

  // Fallback local garantat
  return checkLocalRateLimit(identifier, options);
}

/**
 * Versiune sincronă compatibilă (folosește memoria locală direct)
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
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
        headers: { Authorization: `Bearer ${tokenFromUrl(redisToken)}` },
        cache: "no-store",
      });
    } catch {}
  }
}

function tokenFromUrl(token: string): string {
  return token.trim();
}

export function resetRateLimit(identifier: string): void {
  localStore.delete(identifier);
}
