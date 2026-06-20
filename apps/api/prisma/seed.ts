import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });

  const category = await prisma.category.upsert({
    where: { slug: "programming-foundations" },
    update: {},
    create: {
      name: "编程基础",
      slug: "programming-foundations",
      description: "记录语言基础、算法思维与工程实践。",
      sortOrder: 1
    }
  });

  await prisma.article.upsert({
    where: { slug: "welcome-to-my-learning-space" },
    update: {},
    create: {
      title: "欢迎来到我的学习空间",
      slug: "welcome-to-my-learning-space",
      summary: "从这里开始，持续记录、复盘与构建。",
      content: "# 欢迎\n\n这是第一篇学习文章。你可以在后台使用 **Markdown** 继续编辑内容。\n\n## 下一步\n\n- 建立知识体系\n- 持续输出\n- 用项目验证学习成果",
      categoryId: category.id,
      tags: ["开始", "学习"],
      published: true
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
