import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ErrorService } from '@services';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private service: ErrorService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  async catch(_exception: NotFoundException | Error, host: ArgumentsHost) {
    let responseBody: any = { message: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
    const statusCode = _exception instanceof HttpException ? _exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (_exception instanceof NotFoundException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      return response.render('404', { title: '404 - The page you were looking for is not found!' });
    } else if (_exception instanceof HttpException) responseBody = _exception.getResponse();
    else if (_exception instanceof Error) {
      await this.service.create({ name: _exception.message, stack: _exception.stack });
      responseBody = {
        statusCode: statusCode,
        message: _exception.stack,
      };
    }

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
