import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength
} from "class-validator";

export class CreateArticleDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  slug: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
