// 种子脚本：初始化管理员账号、示例文章、关于我信息
// 运行方式：npm run db:seed
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

/** 云端（Turso/libSQL）走 HTTP driver adapter；本地 SQLite 文件直连 */
async function createPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("缺少 DATABASE_URL 环境变量");
  if (url.startsWith("libsql://")) {
    const { PrismaLibSQL } = await import("@prisma/adapter-libsql");
    return new PrismaClient({
      adapter: new PrismaLibSQL({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    });
  }
  return new PrismaClient();
}

async function main() {
  const prisma = await createPrisma();
  // 1. 管理员账号：admin / admin123
  const passwordHash = bcrypt.hashSync("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });
  console.log("✔ 管理员账号已就绪（admin / admin123）");

  // 2. 示例文章
  const posts = [
    {
      title: "我的博客上线了",
      summary: "记录这个博客从想法到上线的全过程，以及我对内容创作的思考。",
      content: `# 我的博客上线了

经过一番折腾，这个博客终于上线了。写这篇文章，记录一下 **想法 → 设计 → 开发 → 上线** 的全过程。

## 为什么要做个人博客

- 沉淀自己的知识和思考
- 有一个完全属于自己的空间
- 练习写作，倒逼输入

## 技术栈

\`\`\`ts
const stack = ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "SQLite"];
\`\`\`

## 下一步

保持更新，先从每周一篇开始。

> 种一棵树最好的时间是十年前，其次是现在。`,
    },
    {
      title: "如何高效地学习一门新技术",
      summary: "从目标、实践到输出的三步学习法，让新技术不再学了就忘。",
      content: `# 如何高效地学习一门新技术

学习新技术最重要的是**以输出为导向**。

## 三步学习法

1. **定目标**：想清楚学它要解决什么问题
2. **动手做**：用一个小项目驱动学习，而不是只看文档
3. **写出来**：把踩过的坑写成文章，教是最好的学

## 我的实践

学习 Next.js 时，我直接拿「个人博客」当练习项目，边做边查文档，效率比看视频高得多。

> 学习任何东西的最好方式，就是开始用它。`,
    },
    {
      title: "SQLite 与 MySQL 该怎么选",
      summary: "个人项目和团队项目的数据库选型建议，聊聊我的取舍标准。",
      content: `# SQLite 与 MySQL 该怎么选

很多人一听数据库就觉得必须是 MySQL，其实**个人项目用 SQLite 往往是更好的选择**。

## 对比

| 维度 | SQLite | MySQL |
| --- | --- | --- |
| 部署 | 零配置，一个文件 | 需要独立服务 |
| 并发 | 适合小规模读写 | 适合高并发 |
| 迁移 | 直接拷文件 | 需要导入导出 |

## 结论

个人博客这种数据量，SQLite 完全够用；团队协作或高并发场景再上 MySQL 也不迟。`,
    },
    {
      title: "Markdown 写作的十个常用语法",
      summary: "标题、列表、代码块、引用、链接……一篇搞定日常写作需要的 Markdown 语法。",
      content: `# Markdown 写作的十个常用语法

Markdown 是写博客最舒服的格式，掌握下面这些就够日常用了。

## 常用语法清单

- **加粗**：\`**文字**\`
- *斜体*：\`*文字*\`
- 代码块：三个反引号包裹
- 行内代码：\`\`单反引号\`\`
- 引用：行首加 \`>\`
- 链接：\`[文字](网址)\`
- 列表：\`-\` 或 \`1.\`
- 标题：\`#\` 到 \`######\`

## 小结

语法只是工具，重要的是**持续地写**。`,
    },
    {
      title: "为什么我选择自己搭建博客",
      summary: "第三方平台很方便，但自己的数据、自己的空间才是长期主义。",
      content: `# 为什么我选择自己搭建博客

市面上有知乎、掘金、公众号，为什么还要自己搭博客？

## 三个理由

1. **数据是自己的**：平台会改规则、会倒闭，自己的博客不会
2. **空间是自由的**：想放什么放什么，没有审核和广告
3. **技术是增值的**：搭建的过程本身就是一次很好的技术实践

## 付出的代价

当然也有代价：要自己维护、自己推广。但我觉得，**这笔账划得来**。`,
    },
    {
      title: "你好，世界",
      summary: "博客的第一篇文章，简单介绍一下我自己和这个博客的定位。",
      content: `# 你好，世界

欢迎来到我的博客！这里是第一篇文章。

## 我是谁

一个喜欢写代码、也喜欢写字的开发者。

## 这里会有什么

- 技术笔记：踩坑记录、学习心得
- 生活思考：读书、效率、成长

感谢你的到来，希望这里的内容对你有帮助。`,
    },
  ];

  for (const p of posts) {
    await prisma.post.create({ data: p });
  }
  console.log(`✔ 已创建 ${posts.length} 篇示例文章`);

  // 3. 关于我
  const about = {
    avatar: "",
    intro:
      "你好，我是一名热爱技术的开发者。这个博客记录我的技术笔记与生活思考，希望这里的内容能对你有帮助。",
    contact: "邮箱：hello@myblog.dev | GitHub：github.com/myblog",
  };
  const first = await prisma.about.findFirst();
  if (first) {
    await prisma.about.update({ where: { id: first.id }, data: about });
  } else {
    await prisma.about.create({ data: about });
  }
  console.log("✔ 关于我信息已就绪");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
