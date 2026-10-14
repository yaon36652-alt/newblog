import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// 云端（Turso/libSQL）走 HTTP driver adapter；本地（SQLite 文件）直连
// 注意：schema.prisma 里的 file: URL 仅用于本地与 CLI 校验，云端连接靠这里接管
const tursoUrl = process.env.TURSO_DATABASE_URL ?? "";
const isRemote = tursoUrl.startsWith("libsql://");

// 开发环境下热更新会重复实例化，挂到 globalThis 上复用
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!isRemote) return new PrismaClient();
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!authToken) throw new Error("缺少 TURSO_AUTH_TOKEN 环境变量");
  return new PrismaClient({
    adapter: new PrismaLibSQL({ url: tursoUrl, authToken }),
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
