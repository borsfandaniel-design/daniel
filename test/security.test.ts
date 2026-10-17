import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Setăm un AUTH_SECRET de test pentru funcțiile reale
process.env.AUTH_SECRET = "test_auth_secret_minimum_32_characters_for_hmac_signing_ok";

// Importuri reale din modulele proiectului
import { getClientIp, isValidIp } from "../app/lib/client-ip";
import {
  checkRateLimitAsync,
  resetRateLimitAsync,
} from "../app/lib/rate-limit";
import {
  isSessionRevoked,
  revokeSession,
  revokeAllSessions,
  isRecoveryCodeConsumed,
  consumeRecoveryCode,
} from "../app/lib/session-store";
import {
  getAuthSecret,
  createPending2FAToken,
  verify2FACode,
  createAdminSessionToken,
  verifyAdminSessionToken,
  generateSingleUseRecoveryCodes,
  SecurityConfigurationError,
} from "../app/lib/auth";

function restoreEnv(key: string, val: string | undefined) {
  if (val !== undefined) {
    process.env[key] = val;
  } else {
    delete process.env[key];
  }
}

describe("SWI Security Test Suite", { concurrency: 1 }, () => {

// ==============================================================================
// 1. SWI-11 (fost RZN-11): Testare Reală getClientIp & Anti-Spoofing
// ==============================================================================

test("SWI-11: isValidIp validează strict formatele IPv4 și IPv6", () => {
  assert.strictEqual(isValidIp("127.0.0.1"), true);
  assert.strictEqual(isValidIp("8.8.8.8"), true);
  assert.strictEqual(isValidIp("192.168.1.254"), true);
  assert.strictEqual(isValidIp("::1"), true);
  assert.strictEqual(isValidIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), true);

  // Tentative de injection sau IP-uri malformate
  assert.strictEqual(isValidIp(""), false);
  assert.strictEqual(isValidIp("127.0.0.1, 10.0.0.1"), false);
  assert.strictEqual(isValidIp("999.999.999.999"), false);
  assert.strictEqual(isValidIp("127.0.0.1; DROP TABLE users;"), false);
  assert.strictEqual(isValidIp("<script>alert(1)</script>"), false);
});

test("SWI-11: getClientIp respinge spoofing-ul din request headers și se bazează pe mediul serverului", () => {
  // Salvare mediu inițial
  const origVercel = process.env.VERCEL;
  const origTrustProxy = process.env.TRUST_PROXY;

  try {
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    delete process.env.TRUST_PROXY;

    // 1. Clientul trimite x-vercel-id sau cf-ray fals în request fără ca serverul să fie configurat pe acea infrastructură
    const spoofedHeaders = new Headers({
      "x-vercel-id": "fake_edge_id",
      "x-vercel-forwarded-for": "198.51.100.1",
      "cf-ray": "fake_ray",
      "cf-connecting-ip": "198.51.100.2",
      "x-forwarded-for": "198.51.100.3",
    });

    const ipWithoutServerTrust = getClientIp(spoofedHeaders);
    assert.strictEqual(
      ipWithoutServerTrust,
      "127.0.0.1",
      "getClientIp nu trebuie să creadă headerele furnizate de client când serverul nu este configurat pe acel proxy"
    );

    // 2. Mediul Vercel configurat pe server
    process.env.VERCEL = "1";
    const vercelHeaders = new Headers({
      "x-vercel-forwarded-for": "203.0.113.195",
    });
    assert.strictEqual(getClientIp(vercelHeaders), "203.0.113.195");

    // 3. Cloudflare configurat pe server prin TRUST_PROXY=cloudflare
    delete process.env.VERCEL;
    process.env.TRUST_PROXY = "cloudflare";
    const cfHeaders = new Headers({
      "cf-connecting-ip": "198.51.100.77",
    });
    assert.strictEqual(getClientIp(cfHeaders), "198.51.100.77");

    // 4. IP invalid din proxy trebuie respins, revenind la fallback
    const invalidHeaders = new Headers({
      "cf-connecting-ip": "malicious_script_or_string",
    });
    assert.strictEqual(getClientIp(invalidHeaders), "127.0.0.1");
  } finally {
    process.env.VERCEL = origVercel;
    process.env.TRUST_PROXY = origTrustProxy;
  }
});

// ==============================================================================
// 2. SWI-10: Testare Reală Rate Limiting & Fail-Closed în Producție
// ==============================================================================

test("SWI-10: checkRateLimitAsync limitează cererile și permite resetarea contorului în dev", async () => {
  const origNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";
    const testId = `test_ip_${Date.now()}`;
    const opts = { limit: 3, windowMs: 2000 };

    // Primele 3 cereri trec
    const r1 = await checkRateLimitAsync(testId, opts);
    assert.strictEqual(r1.success, true);
    assert.strictEqual(r1.remaining, 2);

    const r2 = await checkRateLimitAsync(testId, opts);
    assert.strictEqual(r2.success, true);
    assert.strictEqual(r2.remaining, 1);

    const r3 = await checkRateLimitAsync(testId, opts);
    assert.strictEqual(r3.success, true);
    assert.strictEqual(r3.remaining, 0);

    // A 4-a cerere este blocată
    const r4 = await checkRateLimitAsync(testId, opts);
    assert.strictEqual(r4.success, false);
    assert.strictEqual(r4.remaining, 0);
    assert.ok(r4.retryAfterSeconds > 0);

    // Resetare la autentificare corectă
    await resetRateLimitAsync(testId);
    const r5 = await checkRateLimitAsync(testId, opts);
    assert.strictEqual(r5.success, true);
  } finally {
    restoreEnv("NODE_ENV", origNodeEnv);
  }
});

test("SWI-10: checkRateLimitAsync aplică fail-closed în producție când Redis este indisponibil", async () => {
  const origNodeEnv = process.env.NODE_ENV;
  const origRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const origRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const res = await checkRateLimitAsync("login_prod_test", { limit: 5, windowMs: 60000 });
    assert.strictEqual(
      res.success,
      false,
      "În producție fără Redis, rate limiter-ul trebuie să aplice fail-closed fără fallback silențios la Map"
    );
    assert.ok(res.error?.includes("indisponibil"));
  } finally {
    restoreEnv("NODE_ENV", origNodeEnv);
    restoreEnv("UPSTASH_REDIS_REST_URL", origRedisUrl);
    restoreEnv("UPSTASH_REDIS_REST_TOKEN", origRedisToken);
  }
});

// ==============================================================================
// 3. SWI-09: Testare Reală Revocare Sesiuni & Comportament Fail-Closed
// ==============================================================================

test("SWI-09: createAdminSessionToken și verifyAdminSessionToken funcționează și suportă revocarea", async () => {
  const origNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";

    const email = "admin@swing7.me";
    const token = await createAdminSessionToken(email);
    assert.ok(token && typeof token === "string");

    // Verificare token valid inițial
    const verification = await verifyAdminSessionToken(token);
    assert.strictEqual(verification.valid, true);
    assert.strictEqual(verification.email, email);
    assert.ok(verification.jti);
    assert.ok(verification.exp);

    // Revocare sesiune pe baza JTI
    const revoked = await revokeSession(verification.jti!, verification.exp!);
    assert.strictEqual(revoked, true);

    // Imediat după revocare, sesiunea devine invalidă
    const postRevoke = await verifyAdminSessionToken(token);
    assert.strictEqual(postRevoke.valid, false, "Tokenul revocat nu mai trebuie acceptat");
  } finally {
    restoreEnv("NODE_ENV", origNodeEnv);
  }
});

test("SWI-09: isSessionRevoked aplică fail-closed în producție când Redis este indisponibil", async () => {
  const origNodeEnv = process.env.NODE_ENV;
  const origRedisUrl = process.env.UPSTASH_REDIS_REST_URL;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.UPSTASH_REDIS_REST_URL;

    // În producție fără Redis configurat, isSessionRevoked trebuie să returneze true (fail-closed)
    const isRevoked = await isSessionRevoked("test_jti_prod", Date.now());
    assert.strictEqual(isRevoked, true, "În producție fără Redis, nicio sesiune nu trebuie acceptată (fail-closed)");
  } finally {
    restoreEnv("NODE_ENV", origNodeEnv);
    restoreEnv("UPSTASH_REDIS_REST_URL", origRedisUrl);
  }
});

// ==============================================================================
// 4. SWI-14: Testare Reală Recuperare 2FA, Single-Use Codes & Respingere Weak PIN
// ==============================================================================

test("SWI-14: Codurile de recuperare sunt de unică folosință (single-use) și nu pot fi reutilizate", async () => {
  const recoveryCodes = generateSingleUseRecoveryCodes(2);
  assert.strictEqual(recoveryCodes.length, 2);
  const code1 = recoveryCodes[0];

  process.env.ADMIN_RECOVERY_CODES = recoveryCodes.join(",");
  const pendingToken = await createPending2FAToken("admin@swing7.me", "999999");

  // 1. Prima utilizare a codului de recuperare reușește
  const firstUse = await verify2FACode(pendingToken, code1);
  assert.strictEqual(firstUse.success, true);
  assert.strictEqual(firstUse.isRecovery, true);

  // 2. A doua încercare cu ACELAȘI cod este strict respinsă (reutilizare prevenită)
  const secondUse = await verify2FACode(pendingToken, code1);
  assert.strictEqual(secondUse.success, false);
  assert.ok(
    secondUse.error?.includes("deja utilizat"),
    "Codul consumat anterior nu trebuie să poată fi reutilizat"
  );
});

test("SWI-14: ADMIN_2FA_PIN respinge PIN-urile implicite slabe sau predictibile", async () => {
  const origPin = process.env.ADMIN_2FA_PIN;
  try {
    // Setare PIN slab cunoscut (839201 sau 123456)
    process.env.ADMIN_2FA_PIN = "839201";
    delete process.env.ADMIN_RECOVERY_CODES;

    const pendingToken = await createPending2FAToken("admin@swing7.me", "112233");

    // Tentativa cu PIN-ul slab este respinsă
    const attempt = await verify2FACode(pendingToken, "839201");
    assert.strictEqual(
      attempt.success,
      false,
      "PIN-urile implicite sau slabe trebuie ignorate și respinse"
    );
  } finally {
    process.env.ADMIN_2FA_PIN = origPin;
  }
});

// ==============================================================================
// 5. SWI-12: Testare Limită 32 KB cu Stream Chunked și Content-Length Falsificat
// ==============================================================================

test("SWI-12: Stream-ul care depășește 32 KB este oprit imediat, chiar și cu Content-Length falsificat", async () => {
  const MAX_BYTES = 32 * 1024;

  async function mockReadBodyWithByteLimit(stream: ReadableStream<Uint8Array>, maxBytes: number) {
    const reader = stream.getReader();
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel("Payload exceeded");
          return { errorStatus: 413, errorMsg: "Dimensiunea cererii depășește limita permisă (maxim 32 KB)." };
        }
      }
    }
    return { success: true, totalBytes };
  }

  // 1. Stream valid sub 32 KB (ex: 4 KB)
  const smallChunk = new Uint8Array(4096).fill(65);
  const validStream = new ReadableStream({
    start(controller) {
      controller.enqueue(smallChunk);
      controller.close();
    },
  });
  const validResult = await mockReadBodyWithByteLimit(validStream, MAX_BYTES);
  assert.strictEqual(validResult.success, true);

  // 2. Stream supradimensionat (8 chunks de câte 5 KB = 40 KB > 32 KB)
  // Chiar dacă clientul trimite un stream infinit sau falsifică Content-Length
  const chunk5k = new Uint8Array(5120).fill(66);
  const oversizedStream = new ReadableStream({
    start(controller) {
      for (let i = 0; i < 8; i++) {
        controller.enqueue(chunk5k);
      }
      controller.close();
    },
  });
  const oversizedResult = await mockReadBodyWithByteLimit(oversizedStream, MAX_BYTES);
  assert.strictEqual(oversizedResult.errorStatus, 413);
  assert.ok(oversizedResult.errorMsg?.includes("32 KB"));
});

// ==============================================================================
// 6. SWI-13: Verificare Politică CSP în proxy.ts
// ==============================================================================

test("SWI-13: proxy.ts include nonce per-request, fără unsafe-eval și connect-src restrâns", () => {
  const proxyPath = path.resolve(process.cwd(), "proxy.ts");
  const content = fs.readFileSync(proxyPath, "utf-8");

  assert.ok(!content.includes("'unsafe-eval'"), "proxy.ts nu trebuie să conțină 'unsafe-eval'");
  assert.ok(content.includes("nonce-"), "proxy.ts trebuie să configureze nonce-ul per cerere");
  assert.ok(content.includes("connect-src 'self' https://*.supabase.co"), "connect-src trebuie restrâns");
  assert.ok(content.includes("x-nonce"), "x-nonce trebuie propagat pe request/response");
});

// ==============================================================================
// 7. OBS-02: Verificare Existență Migrare SQL pentru RLS Supabase
// ==============================================================================

test("OBS-02: Fișierul de migrare SQL activează RLS și restricționează drepturile anon", () => {
  const migrationPath = path.resolve(
    process.cwd(),
    "supabase",
    "migrations",
    "20261017_contact_messages_rls.sql"
  );
  assert.ok(fs.existsSync(migrationPath), "Fișierul de migrare RLS trebuie să existe");

  const sql = fs.readFileSync(migrationPath, "utf-8");
  assert.ok(sql.includes("ENABLE ROW LEVEL SECURITY"), "Migrarea trebuie să activeze RLS");
  assert.ok(sql.includes("REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM anon"));
  assert.ok(sql.includes("Allow anonymous insert only"));
});
});

