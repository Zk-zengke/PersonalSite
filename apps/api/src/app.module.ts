import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ArticlesModule } from "./articles/articles.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard.js";
import { CategoriesModule } from "./categories/categories.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { MomentsModule } from "./moments/moments.module.js";
import { PhotosModule } from "./photos/photos.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { UploadsModule } from "./uploads/uploads.module.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    PhotosModule,
    MomentsModule,
    DashboardModule,
    UploadsModule,
    HealthModule
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
