/**
 * Rate Limiter & DDoS Mitigation Helper
 * Previne atacurile de tip brute-force, flood și spam.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Stocare în memorie pentru rate limiting
const store = new Map<string, RateLimitRecord>();

// Curățare periodică a intrărilor expirate pentru prevenirea scurgerilor de memorie
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  }, 60000);
}

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

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetAt) {
    store.set(identifier, {
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

export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

export function getClientIp(headersOrRequest: Headers | Request): string {
  try {
    let headers: Headers;
    if ("headers" in headersOrRequest && typeof headersOrRequest.headers?.get === "function") {
      headers = headersOrRequest.headers;
    } else if (typeof (headersOrRequest as Headers).get === "function") {
      headers = headersOrRequest as Headers;
    } else {
      return "127.0.0.1";
    }

    const cfIp = headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

