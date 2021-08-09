import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AcceptGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const acceptedTypes = this.reflector.get<string[]>('accept', context.getHandler()) || ['application/json'];
    const request = context.switchToHttp().getRequest();
    const requestAcceptHeaderValue = request?.headers?.accept;

    if (!acceptedTypes || acceptedTypes.length === 0) return true;

    if (requestAcceptHeaderValue === '*/*') return true;

    if (!acceptedTypes.includes(requestAcceptHeaderValue)) {
      throw new NotAcceptableException(`Accept type '${requestAcceptHeaderValue}' is not supported`);
    }
    return true;
  }
}
