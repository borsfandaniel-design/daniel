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

  // 4. Continuă cererea și aplică anteturi de securitate militare (Strict Security Headers)
  const response = NextResponse.next();

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

  // Content Security Policy (CSP) consolidat: fără unsafe-eval, frame-ancestors none, base-uri & form-action self
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  );

  // HSTS (HTTP Strict Transport Security) - obligă conexiunea HTTPS pe producție
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api/contact|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml).*)"],
};

