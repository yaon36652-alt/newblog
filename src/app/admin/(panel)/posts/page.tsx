import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import DeletePostButton from "@/components/DeletePostButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "文章管理",
};

type PostsAdminPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PostsAdminPage({
  searchParams,
}: PostsAdminPageProps) {
  const { q = "" } = await searchParams;
  const keyword = q.trim();

  const posts = await prisma.post.findMany({
    where: keyword ? { title: { contains: keyword } } : undefined,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, summary: true, createdAt: true },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + 新建文章
        </Link>
      </div>

      {/* 搜索 */}
      <form method="GET" action="/admin/posts" className="mb-5 flex max-w-md gap-2">
        <input
          type="text"
          name="q"
          defaultValue={keyword}
          placeholder="按标题搜索文章…"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          搜索
        </button>
        {keyword && (
          <Link
            href="/admin/posts"
            className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:text-gray-600"
          >
            清除
          </Link>
        )}
      </form>

      {/* 文章表格 */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            {keyword ? "没有找到匹配的文章" : "还没有文章，点击右上角「新建文章」开始创作吧"}
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                <th className="px-5 py-3.5 font-medium">标题</th>
                <th className="w-40 px-5 py-3.5 font-medium">发布时间</th>
                <th className="w-44 px-5 py-3.5 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="max-w-md px-5 py-3.5">
                    <p className="truncate font-medium text-gray-900">{post.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {post.summary || "（无摘要）"}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/posts/${post.id}`}
                        target="_blank"
                        className="text-sm text-gray-500 transition hover:text-gray-900"
                      >
                        查看
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-sm text-indigo-600 transition hover:text-indigo-800"
                      >
                        编辑
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-400">共 {posts.length} 篇</p>
    </div>
  );
}
