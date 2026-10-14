/**
 * OBS-01: Identificare Sigură & Validare a IP-ului Clientului
 * Previne atacurile de tip IP-spoofing și bypass al rate limiting-ului.
 */

// Regex pentru validare strictă a formatului IPv4 și IPv6
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$|^::(?:[A-F0-9]{1,4}:){0,6}[A-F0-9]{1,4}$|^(?:[A-F0-9]{1,4}:){1,7}:$/i;

export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  const clean = ip.trim();
  return IPV4_REGEX.test(clean) || IPV6_REGEX.test(clean);
}

/**
 * Extrage adresa IP a clientului bazându-se pe infrastructura de încredere detectată.
 *
 * Ierarhie de încredere:
 * 1. Vercel: `x-vercel-forwarded-for` (adăugat și garantat de edge-ul Vercel, nu poate fi falsificat de client)
 * 2. Cloudflare: `cf-connecting-ip` (când rulează în spatele Cloudflare cu TRUST_PROXY=cloudflare)
 * 3. Reverse proxy configurat (`TRUST_PROXY=true`): ultimul hop din `x-forwarded-for` adăugat de proxy-ul intern
 * 4. Fallback sigur: `127.0.0.1` (evită acordarea de încredere headerelor injectate direct)
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

    const isVercel = !!process.env.VERCEL || !!headers.get("x-vercel-id");
    const trustProxy = (process.env.TRUST_PROXY || "").toLowerCase();

    // 1. Vercel Hosting: x-vercel-forwarded-for este garantat de proxy-ul edge Vercel
    if (isVercel) {
      const vercelIp = headers.get("x-vercel-forwarded-for");
      if (vercelIp) {
        const first = vercelIp.split(",")[0]?.trim();
        if (isValidIp(first)) return first;
      }
    }

    // 2. Cloudflare Proxy garantat (când este declarat explicit sau detectat)
    if (trustProxy === "cloudflare" || (!isVercel && headers.get("cf-ray"))) {
      const cfIp = headers.get("cf-connecting-ip");
      if (cfIp && isValidIp(cfIp.trim())) {
        return cfIp.trim();
      }
    }

    // 3. Trusted Reverse Proxy configurat explicit (TRUST_PROXY=true)
    if (trustProxy === "true" || trustProxy === "1") {
      const forwarded = headers.get("x-forwarded-for");
      if (forwarded) {
        // În reverse proxy de încredere, luăm ultimul IP de încredere din lanț
        const parts = forwarded.split(",").map((s) => s.trim()).filter(Boolean);
        const candidate = parts[parts.length - 1];
        if (candidate && isValidIp(candidate)) {
          return candidate;
        }
      }

      const realIp = headers.get("x-real-ip");
      if (realIp && isValidIp(realIp.trim())) {
        return realIp.trim();
      }
    }

    // 4. Dacă suntem pe Vercel dar x-vercel-forwarded-for lipsește, luăm primul IP valid din x-forwarded-for
    if (isVercel) {
      const forwarded = headers.get("x-forwarded-for");
      if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();
        if (first && isValidIp(first)) return first;
      }
    }

    // 5. Fallback sigur pentru conexiuni directe sau headere neverificabile
    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

