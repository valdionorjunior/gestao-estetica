import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

const HTTP_STATUS_LABELS: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};

/**
 * Filtro global de exceções.
 * Garante resposta JSON padronizada para todos os erros da API.
 * Formato: { timestamp, status, error, message, path }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = HTTP_STATUS_LABELS[status] ?? 'Error';
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = Array.isArray(resObj.message)
          ? (resObj.message as string[]).join('; ')
          : (resObj.message as string) ?? message;
        error = (resObj.error as string) ?? error;
      }
    } else if (exception instanceof Error) {
      // Nunca vazar stack traces em produção
      if (process.env.NODE_ENV !== 'production') {
        this.logger.error(exception.message, exception.stack);
      } else {
        this.logger.error('Erro não tratado', exception.message);
      }
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      status,
      error,
      message,
      path: request.url,
    });
  }
}
