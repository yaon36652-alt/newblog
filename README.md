# MyBlog —— 个人博客系统

一个轻量、美观的个人博客系统，包含**用户端**（访客浏览）与**博主管理后台**（内容管理）。

- 文档：[产品需求 PRD](doc/PRD.md) · [技术方案](doc/tech.md)
- 技术栈：Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma + SQLite

## 功能

**用户端**（公开访问）

| 页面 | 地址 |
| --- | --- |
| 首页（文章列表 + 分页） | `/` |
| 文章详情（Markdown 渲染） | `/posts/[id]` |
| 关于我 | `/about` |

**博主管理后台**（需登录，未登录访问自动跳转登录页）

| 页面 | 地址 |
| --- | --- |
| 管理员登录 | `/admin/login` |
| 仪表盘（文章统计） | `/admin` |
| 文章管理（列表 / 搜索 / 增删改查） | `/admin/posts` |
| 修改密码 | `/admin/password` |

默认管理员账号：`admin` / `admin123`（首次部署后请修改 `prisma/seed.js` 并重新 seed，或直接改库）。

## 快速开始

```bash
npm install        # 安装依赖
npm run db:migrate # 建库（会同时执行种子脚本，写入示例数据）
npm run dev        # 启动开发服务器 → http://localhost:3000
```

生产构建：

```bash
npm run build
npm run start
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发模式 |
| `npm run build` / `npm run start` | 生产构建 / 启动 |
| `npm run db:migrate` | 数据库迁移（含 seed） |
| `npm run db:seed` | 重新写入种子数据（管理员账号 + 示例文章 + 关于我） |
| `npm run db:studio` | 打开 Prisma Studio 可视化查看数据库 |
| `npm run lint` | 代码检查 |

## 目录结构

```
prisma/         数据库 schema 与种子脚本
src/app/        页面与接口（(public) 用户端 / admin 后台 / api 接口）
src/components/ 复用组件
src/lib/        prisma 客户端、会话（jose）、鉴权、格式化工具
src/proxy.ts    后台页面"门卫"：未登录访问 /admin 一律跳转登录页
doc/            产品需求文档与技术方案
```

## 部署（Vercel + Turso）

生产环境运行在 **Vercel**（代码托管于 GitHub 自动部署）+ **Turso**（云端 SQLite/libSQL）。

**为什么用 Turso 而不是本地 SQLite**：Vercel 的文件系统只读且每次部署重置，本地 `dev.db` 文件无法持久化，必须使用云端数据库。

**连接机制**：`prisma/schema.prisma` 里的 `file:./dev.db` 仅用于本地开发与 CLI 校验（Prisma CLI 要求 sqlite 的 url 必须以 `file:` 开头）；部署到云端时，代码与 CLI 通过 driver adapter（`@prisma/adapter-libsql`）读取 `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` 环境变量直连 Turso。

**Vercel 环境变量**（Dashboard → Project → Settings → Environment Variables）：

| 变量 | 说明 |
| --- | --- |
| `TURSO_DATABASE_URL` | Turso 数据库地址（`libsql://...turso.io`） |
| `TURSO_AUTH_TOKEN` | Turso 读写 token |
| `AUTH_SECRET` | 会话 JWT 签名密钥（随机 64 位十六进制串） |

**建库与初始化**（首次或 schema 变更后，在本地执行）：

```bash
# 1. 把 Turso 凭据写入 .env.turso（已被 gitignore，模板见该文件）
# 2. 推表结构（prisma.config.ts 会自动走 driver adapter 直连 Turso）
set -a && source .env.turso && set +a
npx prisma db push
# 3. 写入种子数据（admin 账号 + 示例文章；重复执行会重复建文章）
node prisma/seed.js
```

**域名**：生产域名 `www.yao-95.xyz`（裸域 308 跳转到 www）。DNS 托管在阿里云：`@ → A 76.76.21.21`、`www → CNAME cname.vercel.com`（`*.vercel.app` 默认域名在国内网络不可达，必须绑自定义域名）。

**改管理员密码**：登录后台 → 顶部导航「修改密码」，验证当前密码后设置新密码（至少 8 位）。默认账号 `admin/admin123` 首次登录后请立即修改。
