import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { diskStorage } from "multer";

const uploadDirectory = join(process.cwd(), "uploads");
mkdirSync(uploadDirectory, { recursive: true });

@Controller("uploads")
export class UploadsController {
  @Post("images")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: uploadDirectory,
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname).toLowerCase() || ".jpg";
          callback(null, `${Date.now()}-${randomUUID()}${extension}`);
        }
      }),
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype));
      }
    })
  )
  uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("请选择 JPG、PNG、WebP 或 GIF 图片，且不超过 8MB");
    }
    return {
      path: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    };
  }
}
