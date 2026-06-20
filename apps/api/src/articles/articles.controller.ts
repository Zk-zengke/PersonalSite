import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { ArticlesService } from "./articles.service.js";
import { ArticleQueryDto } from "./dto/article-query.dto.js";
import { CreateArticleDto } from "./dto/create-article.dto.js";
import { UpdateArticleDto } from "./dto/update-article.dto.js";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Public()
  @Get()
  findAll(@Query() query: ArticleQueryDto) {
    return this.service.findAll(query, true);
  }

  @Get("admin/all")
  findAllForAdmin(@Query() query: ArticleQueryDto) {
    return this.service.findAll(query, false);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id, true);
  }

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
