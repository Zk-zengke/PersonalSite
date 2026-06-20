import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
