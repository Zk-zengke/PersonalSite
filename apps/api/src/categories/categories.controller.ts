import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { CategoriesService } from "./categories.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
