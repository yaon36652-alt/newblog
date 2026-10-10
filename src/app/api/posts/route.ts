import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// GET /api/posts —— 文章列表（公开，支持 ?q= 标题搜索）
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  const posts = await prisma.post.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, summary: true, createdAt: true },
  });

  return NextResponse.json({ posts });
}

// POST /api/posts —— 新建文章（仅登录管理员）
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录或会话已过期" }, { status: 401 });
  }

  let body: { title?: string; summary?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const title = body.title?.trim();
  const summary = body.summary?.trim() ?? "";
  const content = body.content?.trim();

  if (!title) {
    return NextResponse.json({ error: "请填写文章标题" }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "请填写文章正文" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { title, summary, content },
  });

  return NextResponse.json({ ok: true, id: post.id }, { status: 201 });
}
