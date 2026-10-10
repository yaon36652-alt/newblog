import Link from "next/link";
import { formatDate } from "@/lib/format";

export type PostCardData = {
  id: number;
  title: string;
  summary: string;
  createdAt: Date;
};

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-900 transition group-hover:text-indigo-600">
        {post.title}
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
        {post.summary || "（暂无摘要）"}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <time>{formatDate(post.createdAt)}</time>
        <span className="font-medium text-indigo-500 opacity-0 transition group-hover:opacity-100">
          阅读全文 →
        </span>
      </div>
    </Link>
  );
}
