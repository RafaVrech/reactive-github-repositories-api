import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as _ from 'lodash';

const logger = new Logger('ErrorHandler');

@Catch(HttpException)
export class ErrorHandlingConfig implements ExceptionFilter<HttpException> {
  catch(error: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const request: Request = host.switchToHttp().getRequest();
    const status = error.getStatus();

    logger.error(`${error?.message} on http ${request?.method} ${request?.url}`, JSON.stringify(error?.stack || error));

    return response.status(status).json(
      {
        status: status,
        message: error.message || 'Something went wrong, please try again later',
      },
    );
  }
}

