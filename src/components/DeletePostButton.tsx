"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    // 二次确认，防止误删
    if (!window.confirm("确定要删除这篇文章吗？删除后不可恢复。")) return;

    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "删除失败，请稍后重试");
        return;
      }
      router.refresh();
    } catch {
      alert("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 transition hover:text-red-700 disabled:opacity-50"
    >
      {loading ? "删除中…" : "删除"}
    </button>
  );
}
