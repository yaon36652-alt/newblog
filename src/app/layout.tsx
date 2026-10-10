import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyBlog · 个人博客",
    template: "%s · MyBlog",
  },
  description: "一个记录技术笔记与生活思考的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
