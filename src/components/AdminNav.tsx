"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "仪表盘", exact: true },
  { href: "/admin/posts", label: "文章管理" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-white">
            My<span className="text-indigo-400">Blog</span>
            <span className="ml-2 rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-normal text-indigo-300">
              管理后台
            </span>
          </span>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive(item.href, item.exact)
                    ? "bg-gray-700 font-medium text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden text-sm text-gray-400 transition hover:text-white sm:inline"
          >
            查看博客 ↗
          </Link>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
