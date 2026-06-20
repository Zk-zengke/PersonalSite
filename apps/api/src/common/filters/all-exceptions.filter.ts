import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const detail =
      exception instanceof HttpException ? exception.getResponse() : "服务器内部错误";
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray((detail as { message?: unknown }).message)
          ? (detail as { message: string[] }).message.join("；")
          : ((detail as { message?: string }).message ?? "请求失败");

    response.status(status).json({
      success: false,
      data: null,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
