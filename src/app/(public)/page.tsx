import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 5;

type HomePageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [total, posts] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, title: true, summary: true, createdAt: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* 页头 */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          记录技术笔记与生活思考
        </h1>
        <p className="mt-3 text-gray-500">欢迎来到我的博客，希望这里的内容对你有帮助。</p>
      </section>

      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
          暂无文章，敬请期待
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4 text-sm">
          {page > 1 ? (
            <Link
              href={`/?page=${page - 1}`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              ← 上一页
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-300">
              ← 上一页
            </span>
          )}
          <span className="text-gray-500">
            第 {page} / {totalPages} 页
          </span>
          {page < totalPages ? (
            <Link
              href={`/?page=${page + 1}`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              下一页 →
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-300">
              下一页 →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
