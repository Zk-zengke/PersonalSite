import { Module } from "@nestjs/common";
import { PhotosController } from "./photos.controller.js";

@Module({ controllers: [PhotosController] })
export class PhotosModule {}
