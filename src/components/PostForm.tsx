"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PostFormProps = {
  /** 传入则为编辑模式，不传则为新建模式 */
  post?: { id: number; title: string; summary: string; content: string };
};

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("请填写文章标题");
      return;
    }
    if (!content.trim()) {
      setError("请填写文章正文");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/posts/${post!.id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "保存失败，请稍后重试");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入文章标题"
          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="summary" className="mb-1.5 block text-sm font-medium text-gray-700">
          摘要
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          placeholder="一句话介绍这篇文章（显示在首页卡片上）"
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-gray-700">
          正文 <span className="text-red-500">*</span>
          <span className="ml-2 font-normal text-gray-400">（支持 Markdown 语法）</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          placeholder={"# 标题\n\n在这里开始写作…"}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 font-mono text-sm leading-relaxed outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "保存中…" : isEdit ? "保存修改" : "发布文章"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          取消
        </button>
      </div>
    </form>
  );
}
