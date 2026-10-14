// Prisma CLI 配置文件：让 prisma db push 等命令能直连云端 Turso（libSQL）
// 注意：schema.prisma 里的 url 必须保持 file: 开头（CLI 校验要求），
// 云端连接地址通过 TURSO_DATABASE_URL 交给这里的 adapter。
import { defineConfig, type PrismaConfig } from "prisma/config";

const tursoUrl = process.env.TURSO_DATABASE_URL ?? "";
const isRemote = tursoUrl.startsWith("libsql://");

const config: PrismaConfig = isRemote
  ? {
      schema: "prisma/schema.prisma",
      experimental: { adapter: true },
      engine: "js",
      adapter: async () => {
        const { PrismaLibSQL } = await import("@prisma/adapter-libsql");
        return new PrismaLibSQL({
          url: tursoUrl,
          authToken: process.env.TURSO_AUTH_TOKEN,
        });
      },
    }
  : { schema: "prisma/schema.prisma" };

export default defineConfig(config);
