import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// POST /api/auth/logout —— 退出登录（清除会话 cookie）
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
