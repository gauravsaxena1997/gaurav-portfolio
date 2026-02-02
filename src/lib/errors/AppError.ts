export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly context?: Record<string, unknown>;

    constructor(args: {
        message: string;
        code: string;
        statusCode?: number;
        isOperational?: boolean;
        context?: Record<string, unknown>;
    }) {
        super(args.message);

        this.code = args.code;
        this.statusCode = args.statusCode || 500;
        this.isOperational = args.isOperational ?? true;
        this.context = args.context;

        // Maintain prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
