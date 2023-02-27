import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
interface IResponse<T> {
  data: T;
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse<Response>();
        const code = response.statusCode;

        const logFormat = ` \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        Type: Response
        Request original url: ${request.originalUrl}
        Method: ${request.method}
        IP: ${request.ip}
        User: ${JSON.stringify(request.user)}
        Response data:\n ${JSON.stringify(data)}
        \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        Logger.log(logFormat);
        return {
          code,
          data,
          message: response.locals.message || '请求成功',
        };
      }),
    );
  }
}
