import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common"
import { Observable, map } from "rxjs"

@Injectable()
export class ConvertResponseFormatInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => ({ data })))
  }
}
