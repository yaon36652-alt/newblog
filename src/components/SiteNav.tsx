"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          My<span className="text-indigo-600">Blog</span>
        </Link>

        {/* 桌面端菜单 */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                pathname === item.href
                  ? "bg-indigo-50 font-medium text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 移动端汉堡按钮 */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
          aria-label="切换菜单"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* 移动端折叠菜单 */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-2 sm:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-4 py-2.5 text-sm ${
                pathname === item.href
                  ? "bg-indigo-50 font-medium text-indigo-600"
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
