import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { map, type Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { success: true; data: T; message: string; timestamp: string }>
{
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data,
        message: "请求成功",
        timestamp: new Date().toISOString()
      }))
    );
  }
}
