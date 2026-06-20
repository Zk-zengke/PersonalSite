import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("stats")
  async stats() {
    const [categories, articles, photos, moments, recentArticles] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.article.count(),
      this.prisma.photo.count(),
      this.prisma.moment.count(),
      this.prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: { select: { id: true, name: true, slug: true } } }
      })
    ]);
    return { categories, articles, photos, moments, recentArticles };
  }
}
