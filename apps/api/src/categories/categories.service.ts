import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { _count: { select: { articles: true } } }
    });
  }

  async findOne(idOrSlug: string) {
    const category = await this.prisma.category.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { _count: { select: { articles: true } } }
    });
    if (!category) throw new NotFoundException("学习板块不存在");
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException("slug 已存在");
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    const articleCount = await this.prisma.article.count({ where: { categoryId: id } });
    if (articleCount > 0) {
      throw new ConflictException("该板块仍有文章，请先移动或删除文章");
    }
    await this.prisma.category.delete({ where: { id } });
    return { id };
  }
}
