/**
 * SWI-11 (fost RZN-11 / OBS-01): Identificare Sigură & Anti-Spoofing a IP-ului Clientului
 *
 * SECURITATE:
 * 1. Nu acordă încredere headerelor arbitrare transmise de clienți (ex: x-vercel-id, cf-ray).
 * 2. Determină infrastructura de încredere exclusiv din mediul serverului (ex: VERCEL, TRUST_PROXY).
 * 3. Validează strict formatele IPv4 și IPv6 împotriva atacurilor de tip injection.
 * 4. Fără logare inutilă a datelor personale (GDPR / Privacy).
 */

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$|^::(?:[A-F0-9]{1,4}:){0,6}[A-F0-9]{1,4}$|^(?:[A-F0-9]{1,4}:){1,7}:$/i;

export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  const clean = ip.trim();
  return IPV4_REGEX.test(clean) || IPV6_REGEX.test(clean);
}

/**
 * Extrage adresa IP a clientului pe baza infrastructurii de server verificate.
 */
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

    // SWI-11: Infrastructura se determină EXCLUSIV din variabile de mediu ale serverului,
    // NICIODATĂ din headere furnizate de client (precum x-vercel-id sau cf-ray din request).
    const isVercelEnv = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
    const trustProxy = (process.env.TRUST_PROXY || "").trim().toLowerCase();

    // 1. Mediul Vercel verificat pe server: x-vercel-forwarded-for este garantat și suprascris de Edge-ul Vercel
    if (isVercelEnv) {
      const vercelIp = headers.get("x-vercel-forwarded-for");
      if (vercelIp) {
        const candidate = vercelIp.split(",")[0]?.trim();
        if (isValidIp(candidate)) {
          return candidate;
        }
      }

      // Fallback Vercel pentru primul IP din x-forwarded-for
      const forwarded = headers.get("x-forwarded-for");
      if (forwarded) {
        const candidate = forwarded.split(",")[0]?.trim();
        if (isValidIp(candidate)) {
          return candidate;
        }
      }
    }

    // 2. Cloudflare configurat explicit pe server prin TRUST_PROXY=cloudflare
    if (trustProxy === "cloudflare") {
      const cfIp = headers.get("cf-connecting-ip");
      if (cfIp && isValidIp(cfIp.trim())) {
        return cfIp.trim();
      }
    }

    // 3. Reverse Proxy intern configurat explicit prin TRUST_PROXY=true sau 1
    if (trustProxy === "true" || trustProxy === "1") {
      const forwarded = headers.get("x-forwarded-for");
      if (forwarded) {
        const parts = forwarded.split(",").map((s) => s.trim()).filter(Boolean);
        const candidate = parts[parts.length - 1]; // Ultimul hop adăugat de proxy-ul intern
        if (candidate && isValidIp(candidate)) {
          return candidate;
        }
      }

      const realIp = headers.get("x-real-ip");
      if (realIp && isValidIp(realIp.trim())) {
        return realIp.trim();
      }
    }

    // 4. Default sigur dacă proxy-ul nu este de încredere sau adresa este invalidă
    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}
