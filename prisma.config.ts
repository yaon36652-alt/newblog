// Prisma CLI 配置文件：让 prisma db push 等命令能直连云端 Turso（libSQL）
// 本地开发（DATABASE_URL 为 file: 开头）时走默认引擎，行为与之前完全一致
import { defineConfig, type PrismaConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL ?? "";
const isRemote = databaseUrl.startsWith("libsql://");

const config: PrismaConfig = isRemote
  ? {
      schema: "prisma/schema.prisma",
      engine: "js",
      adapter: async () => {
        const { PrismaLibSQL } = await import("@prisma/adapter-libsql");
        return new PrismaLibSQL({
          url: databaseUrl,
          authToken: process.env.TURSO_AUTH_TOKEN,
        });
      },
    }
  : { schema: "prisma/schema.prisma" };

export default defineConfig(config);
