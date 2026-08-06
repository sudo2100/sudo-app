import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS, createSessionToken, timingSafeEqualString } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 관리자 로그인 — 아이디/비밀번호가 맞으면 서명된 세션 쿠키 발급
export async function POST(req: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return NextResponse.json({ error: "관리자 계정이 설정되지 않았습니다." }, { status: 503 });
  }

  const { username, password } = await req.json().catch(() => ({}));
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const isValid =
    timingSafeEqualString(username, adminUsername) && timingSafeEqualString(password, adminPassword);

  if (!isValid) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_TTL_MS / 1000,
    path: "/",
  });
  return res;
}
