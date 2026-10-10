import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <p className="text-6xl font-bold text-gray-300">404</p>
      <p className="text-lg text-gray-600">页面不存在或已被删除</p>
      <Link
        href="/"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-700"
      >
        返回首页
      </Link>
    </div>
  );
}
