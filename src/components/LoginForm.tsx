"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("请输入账号和密码");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "登录失败，请稍后重试");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
          账号
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入管理员账号"
          autoComplete="username"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
          密码
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "登录中…" : "登 录"}
      </button>
    </form>
  );
}
