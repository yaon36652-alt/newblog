import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("缺少 DATABASE_URL 环境变量");
// 收窄后的别名，供下方函数使用（TS 不会把模块级收窄带进函数体）
const url = databaseUrl;

// 云端（Turso/libSQL）走 HTTP driver adapter；本地（SQLite 文件）原生直连
const isRemote = url.startsWith("libsql://");

// 开发环境下热更新会重复实例化，挂到 globalThis 上复用
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!isRemote) return new PrismaClient();
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!authToken) throw new Error("缺少 TURSO_AUTH_TOKEN 环境变量");
  return new PrismaClient({
    adapter: new PrismaLibSQL({ url, authToken }),
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
