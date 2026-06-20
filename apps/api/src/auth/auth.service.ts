import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service.js";
import { LoginDto } from "./dto/login.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { username: dto.username }
    });
    if (!admin || !(await bcrypt.compare(dto.password, admin.passwordHash))) {
      throw new UnauthorizedException("账号或密码错误");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id,
      username: admin.username
    });

    return {
      accessToken,
      admin: { id: admin.id, username: admin.username }
    };
  }

  async profile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
      select: { id: true, username: true, createdAt: true }
    });
    if (!admin) throw new UnauthorizedException("管理员不存在");
    return admin;
  }
}
