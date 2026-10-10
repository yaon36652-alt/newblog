import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";
import AdminNav from "@/components/AdminNav";

// 后台面板布局：服务端再次校验登录（proxy.ts 之外的兜底），未登录跳转登录页
export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
