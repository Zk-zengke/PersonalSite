import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class ArticleQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  published?: boolean;
}
