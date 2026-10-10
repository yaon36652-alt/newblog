import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "仪表盘",
};

export default async function DashboardPage() {
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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="文章总数" value={total} hint="全部已发布文章" />
        <StatCard label="本月新增" value={monthCount} hint={`${now.getMonth() + 1} 月新发布的文章`} />
        <StatCard
          label="最近发布"
          value={latest ? latest.title : "—"}
          hint={latest ? formatDate(latest.createdAt) : "还没有文章"}
        />
      </div>

      {/* 快捷入口 */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-500">快捷操作</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            ✏️ 写一篇新文章
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            管理全部文章 →
          </Link>
        </div>
      </div>
    </div>
  );
}
