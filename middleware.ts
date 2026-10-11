import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const referer = request.headers.get("referer")?.toLowerCase() || "";
  const origin = request.headers.get("origin")?.toLowerCase() || "";

  // 1. Blocare activă a crawlerilor, botilor și referer-urilor de la slop-detect.com
  if (
    userAgent.includes("slop-detect") ||
    userAgent.includes("slopdetect") ||
    userAgent.includes("aislop") ||
    referer.includes("slop-detect.com") ||
    origin.includes("slop-detect.com")
  ) {
    return new NextResponse("Access Denied: Slop detector crawlers are blocked.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "X-Frame-Options": "DENY",
        "Content-Security-Policy": "frame-ancestors 'none';",
      },
    });
  }

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isLogin = pathname === "/login" || pathname.startsWith("/login/");

  // 2. Verificare cookie sesiune directă (auth_token)
  const authToken = request.cookies.get("auth_token")?.value;
  if (authToken === "authenticated") {
    if (isLogin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 3. Verificare sesiune Supabase (dacă este folosit Supabase Auth)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (isLogin) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return response;
      }
    } catch {
      // Ignoră eventualele erori de conectare Supabase
    }
  }

  // 4. Redirecționează utilizatorii neautentificați care încearcă să acceseze dashboard-ul
  if (isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Adaugă anteturi de securitate împotriva iframing-ului la toate răspunsurile
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Content-Security-Policy", "frame-ancestors 'none';");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};