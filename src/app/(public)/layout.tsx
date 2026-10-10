import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

// 用户端布局：顶部导航 + 内容 + 页脚
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
