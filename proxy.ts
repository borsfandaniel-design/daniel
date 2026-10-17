import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSessionToken } from "./app/lib/auth";
import { checkRateLimitAsync, getClientIp } from "./app/lib/rate-limit";

// Lista de User-Agent suspicioși sau crawler-i/scanere malițioase blocate direct la intrare
const BLOCKED_USER_AGENTS = [
  "slop-detect",
  "slopdetect",
  "aislop",
  "sqlmap",
  "nikto",
  "havij",
  "acunetix",
  "wprecon",
  "masscan",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const referer = request.headers.get("referer")?.toLowerCase() || "";
  const origin = request.headers.get("origin")?.toLowerCase() || "";
  const clientIp = getClientIp(request);

  // 1. Blocare scanere de vulnerabilități, bot-uri malițioase și crawl-uri neautorizate
  const isMaliciousBot = BLOCKED_USER_AGENTS.some((bot) => userAgent.includes(bot)) ||
    referer.includes("slop-detect.com") ||
    origin.includes("slop-detect.com");

  if (isMaliciousBot) {
    return new NextResponse("Access Denied: Automated scanners and unauthorized bots are strictly blocked.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "X-Frame-Options": "DENY",
        "Content-Security-Policy": "frame-ancestors 'none';",
      },
    });
  }

  // 2. Protecție DDoS & Flood: Max 120 cereri / minut per IP pentru întregul site (distribuit / atomic)
  const globalRate = await checkRateLimitAsync(`global_${clientIp}`, {
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (!globalRate.success) {
    return new NextResponse("Too Many Requests. Rate limit exceeded to prevent server overload.", {
      status: 429,
      headers: {
        "Retry-After": String(globalRate.retryAfterSeconds),
        "Content-Type": "text/plain",
      },
    });
  }

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isLogin = pathname === "/login" || pathname.startsWith("/login/");

  // 3. Verificare sesiune criptată (HMAC-SHA256 cu suport pentru revocare instantanee)
  const authToken = request.cookies.get("auth_token")?.value;
  let isAuthenticated = false;

  if (authToken) {
    const session = await verifyAdminSessionToken(authToken);
    isAuthenticated = session.valid;
  }

  // Utilizator autentificat care accesează /login este redirecționat în /dashboard
  if (isLogin && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Utilizator neautentificat care încearcă accesarea /dashboard este redirecționat la /login
  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. SWI-13: Generare nonce criptografic per cerere și propagare pe requestHeaders
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Expunere x-nonce pe răspuns pentru verificare și consumare server components
  response.headers.set("x-nonce", nonce);

  // Protecție anti-clickjacking (site-ul nu poate fi încorporat în iframes ascunse)
  response.headers.set("X-Frame-Options", "DENY");

  // Protecție anti-MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Politică strictă de referer
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Blocare acces permisiuni neutilizate ale browserului
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  // Protecție XSS
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // SWI-13: Content Security Policy (CSP) consolidat cu nonce per cerere, fără unsafe-eval, connect-src restrâns la Supabase & self
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);

  // HSTS (HTTP Strict Transport Security) - obligă conexiunea HTTPS pe producție
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api/contact|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml).*)"],
};

