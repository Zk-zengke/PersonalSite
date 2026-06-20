import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreatePhotoDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  imageUrl: string;
}

export class UpdatePhotoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
