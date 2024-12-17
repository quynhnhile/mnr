import { ApiErrorResponse } from '@libs/api/api-error.response';
import { RequestContextService } from '@libs/application/context/AppRequestContext';
import { ExceptionBase } from '@libs/exceptions';
import { LOGGER_PORT, LoggerPort } from '@libs/ports/logger.port';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ExceptionInterceptor implements NestInterceptor {
  constructor(@Inject(LOGGER_PORT) private readonly logger: LoggerPort) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        console.log('err', err);

        // Logging for debugging purposes
        if (err.status >= 400 && err.status < 500) {
          this.logger.debug(
            `[${RequestContextService.getRequestId()}] ${err.message}`,
          );

          const isClassValidatorError =
            Array.isArray(err?.response?.message) &&
            typeof err?.response?.error === 'string' &&
            err.status === 400;
          // Transforming class-validator errors to a different format
          if (isClassValidatorError) {
            err = new UnprocessableEntityException(
              new ApiErrorResponse({
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'Validation error',
                error: err?.response?.error,
                subErrors: err?.response?.message,
                correlationId: RequestContextService.getRequestId(),
              }),
            );
          }
        }

        // Adding request ID to error message
        if (!err.correlationId) {
          err.correlationId = RequestContextService.getRequestId();
        }

        if (err.response) {
          err.response.correlationId = err.correlationId;
        }

        return throwError(() => this._errorHandler(err, _context));
      }),
    );
  }

  private _errorHandler(exception: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const res: Response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).send({
      statusCode: status,
      message: exception?.response?.message ?? exception?.message,
      error: exception.error,
      errorCode: exception?.response?.errorCode ?? exception?.errorCode,
      correlationId:
        exception?.response?.correlationId ?? exception?.correlationId,
      subErrors: exception?.response?.subErrors ?? [],
    });
  }
}
