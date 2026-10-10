import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) || 0 },
    select: { title: true, summary: true },
  });
  return {
    title: post ? post.title : "文章不存在",
    description: post?.summary ?? undefined,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (Number.isNaN(postId)) notFound();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      {/* 返回首页 */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-indigo-600"
      >
        ← 返回首页
      </Link>

      {/* 标题与元信息 */}
      <header className="mb-8 border-b border-gray-200 pb-8">
        <h1 className="text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-gray-400">
          发布于 {formatDate(post.createdAt)}
          {post.updatedAt.getTime() !== post.createdAt.getTime() &&
            ` · 更新于 ${formatDate(post.updatedAt)}`}
        </p>
      </header>

      {/* 正文（Markdown 渲染） */}
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
