import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreatePhotoDto, UpdatePhotoDto } from "./dto/photo.dto.js";

@Controller("photos")
export class PhotosController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  findAll() {
    return this.prisma.photo.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post()
  create(@Body() dto: CreatePhotoDto) {
    return this.prisma.photo.create({ data: dto });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePhotoDto) {
    return this.prisma.photo.update({ where: { id }, data: dto });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.prisma.photo.delete({ where: { id } });
    return { id };
  }
}
