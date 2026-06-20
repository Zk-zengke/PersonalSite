import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { ArticleQueryDto } from "./dto/article-query.dto.js";
import { CreateArticleDto } from "./dto/create-article.dto.js";
import { UpdateArticleDto } from "./dto/update-article.dto.js";

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ArticleQueryDto, publicOnly = true) {
    return this.prisma.article.findMany({
      where: {
        ...(publicOnly ? { published: true } : query.published !== undefined ? { published: query.published } : {}),
        ...(query.category
          ? { category: { is: { OR: [{ id: query.category }, { slug: query.category }] } } }
          : {}),
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: "insensitive" as const } },
                { summary: { contains: query.search, mode: "insensitive" as const } }
              ]
            }
          : {})
      },
      include: {
        category: { select: { id: true, name: true, slug: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findOne(idOrSlug: string, publicOnly = true) {
    const article = await this.prisma.article.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        ...(publicOnly ? { published: true } : {})
      },
      include: { category: { select: { id: true, name: true, slug: true } } }
    });
    if (!article) throw new NotFoundException("文章不存在");
    return article;
  }

  async create(dto: CreateArticleDto) {
    const exists = await this.prisma.article.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException("slug 已存在");
    return this.prisma.article.create({
      data: dto,
      include: { category: { select: { id: true, name: true, slug: true } } }
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.findOne(id, false);
    return this.prisma.article.update({
      where: { id },
      data: dto,
      include: { category: { select: { id: true, name: true, slug: true } } }
    });
  }

  async remove(id: string) {
    await this.findOne(id, false);
    await this.prisma.article.delete({ where: { id } });
    return { id };
  }
}
