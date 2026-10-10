import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// GET /api/stats —— 仪表盘统计（仅登录管理员）
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录或会话已过期" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, monthCount, latest] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.post.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({ total, monthCount, latest });
}
