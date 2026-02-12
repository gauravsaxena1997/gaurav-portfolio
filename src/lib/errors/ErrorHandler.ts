import { logger } from '../logger';
import { AppError } from './AppError';
import { ERROR_CODES, ERROR_MESSAGES } from './constants';

class ErrorHandler {
    public handleError(error: unknown, context?: Record<string, unknown>): void {
        const normalizeError = this.normalizeError(error);

        // 1. Log the error
        logger.error(normalizeError.message, {
            code: normalizeError.code,
            statusCode: normalizeError.statusCode,
            stack: normalizeError.stack,
            context: { ...normalizeError.context, ...context },
            isOperational: normalizeError.isOperational
        });

        // 2. Report to external service (Sentry, etc.) - Placeholder
        // if (!normalizeError.isOperational) { Sentry.captureException(error); }
    }

    public normalizeError(error: unknown): AppError {
        if (error instanceof AppError) {
            return error;
        }

        if (error instanceof Error) {
            return new AppError({
                message: error.message,
                code: ERROR_CODES.UNKNOWN,
                statusCode: 500,
                isOperational: false,
                context: { stack: error.stack }
            });
        }

        // Handle strings or unknown objects
        return new AppError({
            message: typeof error === 'string' ? error : ERROR_MESSAGES.DEFAULT,
            code: ERROR_CODES.UNKNOWN,
            statusCode: 500,
            isOperational: false,
            context: { original: error }
        });
    }

    public isTrustedError(error: Error): boolean {
        if (error instanceof AppError) {
            return error.isOperational;
        }
        return false;
    }
}

export const errorHandler = new ErrorHandler();
