import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { MAX_AGE, SESSION_COOKIE, signToken } from "@/lib/session";

// POST /api/auth/login —— 管理员登录
export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "请输入账号和密码" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  // 账号不存在或密码错误时返回同样的提示，避免泄露账号是否存在
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  }

  const token = await signToken(user.username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });

  return response;
}
