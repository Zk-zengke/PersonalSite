import { Module } from "@nestjs/common";
import { MomentsController } from "./moments.controller.js";

@Module({ controllers: [MomentsController] })
export class MomentsModule {}
