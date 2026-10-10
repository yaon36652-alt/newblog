import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

// "门卫"：所有 /admin 开头的后台页面，未登录一律弹回登录页
// 注意：这里只做页面拦截，接口层在各自的 route.ts 里另行校验（双保险）
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminArea && !isLoginPage) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
