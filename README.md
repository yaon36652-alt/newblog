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
