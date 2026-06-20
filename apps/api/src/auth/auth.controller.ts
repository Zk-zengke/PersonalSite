import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import type { JwtPayload } from "./interfaces/jwt-payload.interface.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("profile")
  profile(@Request() request: { user: JwtPayload }) {
    return this.authService.profile(request.user.sub);
  }
}
