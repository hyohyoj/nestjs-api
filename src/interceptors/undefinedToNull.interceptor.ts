import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class undefinedToNullInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext, 
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        // controller 들어가기 전 부분의 코드 작성

       /* 
       controller 실행되고 난 후는 handle() 다음에 작성
       data는 controller에서 return 해주는 데이터
       */
      return next
        .handle()
        .pipe(map((data) => (data === undefined ? null : data)));
    }
}