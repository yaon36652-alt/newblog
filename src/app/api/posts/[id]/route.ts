import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(id: string): number | null {
  const n = parseInt(id, 10);
  return Number.isNaN(n) ? null : n;
}

// GET /api/posts/:id —— 文章详情（公开）
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const postId = parseId(id);

  if (postId === null) {
    return NextResponse.json({ error: "无效的文章 ID" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// PUT /api/posts/:id —— 更新文章（仅登录管理员）
export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录或会话已过期" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parseId(id);
  if (postId === null) {
    return NextResponse.json({ error: "无效的文章 ID" }, { status: 400 });
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

  const exists = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: { title, summary, content },
  });

  return NextResponse.json({ ok: true, id: post.id });
}

// DELETE /api/posts/:id —— 删除文章（仅登录管理员）
export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录或会话已过期" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parseId(id);
  if (postId === null) {
    return NextResponse.json({ error: "无效的文章 ID" }, { status: 400 });
  }

  const exists = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id: postId } });

  return NextResponse.json({ ok: true });
}
