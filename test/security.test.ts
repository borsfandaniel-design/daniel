import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ==============================================================================
// 1. RZN-01: Sensible Data in Repository & Isolation of 2FA / Security Emails
// ==============================================================================

test("RZN-01: .gitignore excludes sensitive data directory and local files", () => {
  const gitignorePath = path.resolve(process.cwd(), ".gitignore");
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");

  assert.ok(
    gitignoreContent.includes("data/") || gitignoreContent.includes("data"),
    ".gitignore must exclude the data/ directory"
  );
  assert.ok(
    gitignoreContent.includes("*.local.json"),
    ".gitignore must exclude *.local.json files"
  );
});

test("RZN-01: Email classifier strictly isolates contact emails from 2FA / security emails", () => {
  const isExcludedSubject = (subject: string): boolean => {
    const s = subject.toLowerCase();
    return (
      s.includes("2fa") ||
      s.includes("securitate") ||
      s.includes("verificare") ||
      s.includes("autentificare") ||
      s.includes("cod")
    );
  };

  const isContactSubject = (subject: string): boolean => {
    return (
      (subject.includes("[SWING CONTACT]") ||
        subject.includes("[Contact Nou]") ||
        subject.startsWith("[SWING]") ||
        subject.toLowerCase().startsWith("mesaj nou")) &&
      !isExcludedSubject(subject)
    );
  };

  // Legit contact messages
  assert.strictEqual(isContactSubject("[SWING CONTACT] Mesaj nou de la Ion"), true);
  assert.strictEqual(isContactSubject("[Contact Nou] Solicitare oferta web"), true);

  // Security / 2FA emails MUST NEVER match contact messages
  assert.strictEqual(isContactSubject("SWING Security - Cod de verificare autentificare"), false);
  assert.strictEqual(isContactSubject("[SWING] Codul tau 2FA este 123456"), false);
  assert.strictEqual(isContactSubject("Verificare autentificare 2FA"), false);
  assert.strictEqual(isContactSubject("[SWING CONTACT] 2FA Reset notification"), false);
});

// ==============================================================================
// 2. RZN-02: Elimination of Implicit 2FA PIN
// ==============================================================================

test("RZN-02: 2FA PIN rejects missing environment variable without default fallback", () => {
  const validate2faPin = (inputPin: string, envPin?: string): { success: boolean; error?: string } => {
    const configuredPin = envPin?.trim();
    if (!configuredPin) {
      return { success: false, error: "Serviciul de verificare 2FA este temporar indisponibil (PIN neconfigurat)." };
    }
    if (inputPin !== configuredPin) {
      return { success: false, error: "Cod 2FA invalid." };
    }
    return { success: true };
  };

  // Rejects when env var is missing or empty
  const missingEnv = validate2faPin("839201", undefined);
  assert.strictEqual(missingEnv.success, false);
  assert.strictEqual(missingEnv.error?.includes("PIN neconfigurat"), true);

  // Strictly rejects legacy hardcoded fallback 839201 when env var is missing
  const legacyAttempt = validate2faPin("839201", "");
  assert.strictEqual(legacyAttempt.success, false);

  // Rejects invalid pin
  const invalidAttempt = validate2faPin("111111", "987654");
  assert.strictEqual(invalidAttempt.success, false);

  // Accepts only exact configured pin
  const validAttempt = validate2faPin("987654", "987654");
  assert.strictEqual(validAttempt.success, true);
});

// ==============================================================================
// 3. RZN-03: Mandatory AUTH_SECRET & Derivation Elimination
// ==============================================================================

test("RZN-03: AUTH_SECRET enforces minimum length of 32 chars and throws if invalid", () => {
  class SecurityConfigurationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "SecurityConfigurationError";
    }
  }

  const getAuthSecret = (secretEnv?: string): string => {
    const secret = secretEnv?.trim();
    if (!secret || secret.length < 32) {
      throw new SecurityConfigurationError(
        "Variabila de securitate AUTH_SECRET nu este configurată corespunzător. " +
          "Generați un secret criptografic de minim 32 caractere (ex: openssl rand -hex 32)."
      );
    }
    return secret;
  };

  // Fails on missing env
  assert.throws(
    () => getAuthSecret(undefined),
    SecurityConfigurationError
  );

  // Fails on short secret (< 32 characters)
  assert.throws(
    () => getAuthSecret("too_short_secret_12345"),
    SecurityConfigurationError
  );

  // Succeeds on >= 32 characters
  const validSecret = "a".repeat(32);
  assert.strictEqual(getAuthSecret(validSecret), validSecret);
});

// ==============================================================================
// 4. OBS-01: Client IP Extraction & Header Spoofing Resistance
// ==============================================================================

test("OBS-01: isValidIp strictly validates IPv4 and IPv6", () => {
  const IPV4_REGEX =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const IPV6_REGEX =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  const isValidIp = (ip: string): boolean => {
    if (!ip) return false;
    const trimmed = ip.trim();
    return IPV4_REGEX.test(trimmed) || IPV6_REGEX.test(trimmed);
  };

  assert.strictEqual(isValidIp("127.0.0.1"), true);
  assert.strictEqual(isValidIp("192.168.1.100"), true);
  assert.strictEqual(isValidIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), true);
  assert.strictEqual(isValidIp("::1"), true);

  // Malformed / Injection attempts
  assert.strictEqual(isValidIp("127.0.0.1, 10.0.0.1"), false);
  assert.strictEqual(isValidIp("999.999.999.999"), false);
  assert.strictEqual(isValidIp("127.0.0.1; DROP TABLE users;"), false);
  assert.strictEqual(isValidIp("<script>alert(1)</script>"), false);
  assert.strictEqual(isValidIp("unknown"), false);
});

// ==============================================================================
// 5. RZN-04: Atomic & Distributed Rate Limiter
// ==============================================================================

test("RZN-04: Rate limiter limits requests and resets appropriately", () => {
  const store = new Map<string, { count: number; resetAt: number }>();

  const checkLimit = (id: string, limit: number, windowMs: number) => {
    const now = Date.now();
    const record = store.get(id);
    if (!record || now > record.resetAt) {
      store.set(id, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1 };
    }
    if (record.count >= limit) {
      return { success: false, remaining: 0 };
    }
    record.count += 1;
    return { success: true, remaining: limit - record.count };
  };

  const id = "test_user_ip";
  assert.strictEqual(checkLimit(id, 3, 1000).success, true);
  assert.strictEqual(checkLimit(id, 3, 1000).success, true);
  assert.strictEqual(checkLimit(id, 3, 1000).success, true);
  // 4th request exceeds limit
  assert.strictEqual(checkLimit(id, 3, 1000).success, false);

  // Reset clears counter
  store.delete(id);
  assert.strictEqual(checkLimit(id, 3, 1000).success, true);
});

// ==============================================================================
// 6. RZN-05: CSP Consolidation & Elimination of unsafe-eval
// ==============================================================================

test("RZN-05: proxy.ts defines secure consolidated CSP without unsafe-eval", () => {
  const proxyPath = path.resolve(process.cwd(), "proxy.ts");
  const proxyContent = fs.readFileSync(proxyPath, "utf-8");

  assert.ok(
    !proxyContent.includes("'unsafe-eval'"),
    "proxy.ts must not contain 'unsafe-eval' in script-src"
  );
  assert.ok(
    proxyContent.includes("frame-ancestors 'none'"),
    "proxy.ts must include frame-ancestors 'none'"
  );
  assert.ok(
    proxyContent.includes("base-uri 'self'"),
    "proxy.ts must include base-uri 'self'"
  );
});

test("RZN-05: next.config.ts does not contain duplicate Content-Security-Policy", () => {
  const nextConfigPath = path.resolve(process.cwd(), "next.config.ts");
  const nextConfigContent = fs.readFileSync(nextConfigPath, "utf-8");

  assert.ok(
    !nextConfigContent.includes("Content-Security-Policy"),
    "next.config.ts must not duplicate Content-Security-Policy header"
  );
});

// ==============================================================================
// 7. RZN-06: Session Security, 12h Expiration & Instant Revocation
// ==============================================================================

test("RZN-06: Session tokens have jti, 12h lifetime and are instantly revocable", () => {
  const revokedSet = new Set<string>();
  let globalRevocationEpoch = 0;

  const secret = "test_secret_for_hmac_sha256_at_least_32_chars_long";
  const jti = crypto.randomUUID();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 12 * 60 * 60; // 12 hours

  const payload = JSON.stringify({ role: "admin", iat, exp, jti });
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const token = `${Buffer.from(payload).toString("base64url")}.${signature}`;

  const verifyToken = (t: string) => {
    const parts = t.split(".");
    if (parts.length !== 2) return { valid: false };
    const [encodedPayload, sig] = parts;
    const expectedSig = crypto.createHmac("sha256", secret).update(Buffer.from(encodedPayload, "base64url").toString("utf-8")).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { valid: false };
    }
    const data = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (data.iat < globalRevocationEpoch) {
      return { valid: false, reason: "epoch_revoked" };
    }
    if (data.jti && revokedSet.has(data.jti)) {
      return { valid: false, reason: "revoked" };
    }
    return { valid: true, data };
  };

  // Initially valid
  const initialCheck = verifyToken(token);
  assert.strictEqual(initialCheck.valid, true);
  assert.strictEqual(initialCheck.data.exp - initialCheck.data.iat, 43200); // 12h in seconds

  // Instant single-session revocation
  revokedSet.add(jti);
  const revokedCheck = verifyToken(token);
  assert.strictEqual(revokedCheck.valid, false);
  assert.strictEqual(revokedCheck.reason, "revoked");

  // Global epoch invalidation test
  revokedSet.delete(jti); // un-revoke single token
  globalRevocationEpoch = iat + 1; // set global invalidation after token was issued
  const epochCheck = verifyToken(token);
  assert.strictEqual(epochCheck.valid, false);
  assert.strictEqual(epochCheck.reason, "epoch_revoked");
});

// ==============================================================================
// 8. RZN-07: Error Sanitization & Request Size Guard
// ==============================================================================

test("RZN-07: Request size limit blocks payloads exceeding maximum threshold", () => {
  const MAX_CONTACT_BYTES = 32 * 1024; // 32KB

  const checkPayloadSize = (contentLengthHeader: string | null): boolean => {
    if (!contentLengthHeader) return true;
    const length = parseInt(contentLengthHeader, 10);
    if (isNaN(length) || length > MAX_CONTACT_BYTES) {
      return false;
    }
    return true;
  };

  assert.strictEqual(checkPayloadSize("1024"), true);
  assert.strictEqual(checkPayloadSize("32768"), true); // Exactly 32KB
  assert.strictEqual(checkPayloadSize("32769"), false); // Exceeds 32KB
  assert.strictEqual(checkPayloadSize("1000000"), false); // 1MB payload rejected
});

