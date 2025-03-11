import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private jwtService: JwtService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        
        const request = context.switchToHttp().getRequest();
        console.log(request.originalUrl)
        if (request.originalUrl == '/auth' ||request.originalUrl =='/clerk' ||request.originalUrl =='/bi-product/login') {

        }else if(request.originalUrl == '/common/docDayWiseClaction'){

        }else {
            let token = request.headers['authorization'];

            
            // if (token) {
            //     token = token.replace('Bearer', '').trim();
            //     let secret = 'BDS';
            //     try {
            //         const result = jwt.verify(token, 'BDS');
            //     } catch (error) {
            //         throw new UnauthorizedException()
            //     }
            // } else {
            //     throw new UnauthorizedException();
            // }
        }
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => console.log()),
            );
    }
}