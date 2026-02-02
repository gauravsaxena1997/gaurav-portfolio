import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { ERROR_CODES } from '../errors/constants';

export async function validate<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
    try {
        return await schema.parseAsync(data);
    } catch (error) {
        if (error instanceof ZodError) {
            // Handle Zod error structure (issues vs errors) depending on version
            const issues = (error as any).issues || (error as any).errors || [];

            const formattedErrors = issues.map((issue: any) => ({
                path: issue.path.join('.'),
                message: issue.message
            }));

            throw new AppError({
                message: 'Validation failed',
                code: ERROR_CODES.VALIDATION,
                statusCode: 400,
                isOperational: true,
                context: { errors: formattedErrors }
            });
        }
        throw error;
    }
}
