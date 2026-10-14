import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { MAX_AGE, SESSION_COOKIE, signToken, verifyToken } from "@/lib/session";

// POST /api/auth/password —— 修改管理员密码（仅登录管理员）
export async function POST(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "未登录或会话已过期" }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "请填写当前密码和新密码" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "新密码至少需要 8 位" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: session.username },
  });
  if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return NextResponse.json({ error: "当前密码不正确" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: bcrypt.hashSync(newPassword, 10) },
  });

  // 重新签发当前会话；旧 token 在有效期内的其他会话仍有效（单管理员场景可接受）
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await signToken(user.username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}
