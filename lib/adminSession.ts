import crypto from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8시간

declare global {
  var __sudoSessionSecret: string | undefined;
}

// 세션 서명 키 — ADMIN_SESSION_SECRET 미설정 시 인스턴스마다 랜덤 생성됨.
// Vercel 서버리스는 인스턴스가 여러 개 떠 있을 수 있어, 프로덕션에서는
// ADMIN_SESSION_SECRET을 반드시 고정값으로 설정해야 로그인 세션이 유지된다.
const sessionSecret =
  process.env.ADMIN_SESSION_SECRET || (global.__sudoSessionSecret ??= crypto.randomBytes(32).toString("hex"));

export function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    crypto.timingSafeEqual(aBuf, aBuf); // 타이밍 일관성 유지용 더미 비교
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ADMIN_SESSION_TTL_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expectedSig = crypto.createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  if (!timingSafeEqualString(sig, expectedSig)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function isAuthenticated(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
