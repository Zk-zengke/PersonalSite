import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateMomentDto, UpdateMomentDto } from "./dto/moment.dto.js";

@Controller("moments")
export class MomentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  findAll() {
    return this.prisma.moment.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post()
  create(@Body() dto: CreateMomentDto) {
    return this.prisma.moment.create({ data: dto });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateMomentDto) {
    return this.prisma.moment.update({ where: { id }, data: dto });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.prisma.moment.delete({ where: { id } });
    return { id };
  }
}
