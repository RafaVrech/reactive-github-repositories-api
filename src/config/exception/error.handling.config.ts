import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as _ from 'lodash';

const logger = new Logger('ErrorHandler');

@Catch(HttpException)
export class ErrorHandlingConfig implements ExceptionFilter<HttpException> {
  catch(error: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const status = error.getStatus();

    logger.error(error?.message, JSON.stringify(error?.stack || error));

    return response.status(status).json({
      status: status,
      message: error.message || 'Something went wrong, please try again later',
    });
  }
}
