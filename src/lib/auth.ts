import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

/** 当前请求是否为已登录管理员（供接口与页面使用） */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return (await verifyToken(token)) !== null;
}
