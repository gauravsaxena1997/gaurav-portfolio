/* eslint-disable no-console */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private isDevelopment: boolean;

    constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production';
    }

    private formatMessage(level: LogLevel, message: string, meta?: unknown) {
        const timestamp = new Date().toISOString();
        return JSON.stringify({
            timestamp,
            level,
            message,
            meta,
        });
    }

    public info(message: string, meta?: unknown): void {
        console.log(this.formatMessage('info', message, meta));
    }

    public warn(message: string, meta?: unknown): void {
        console.warn(this.formatMessage('warn', message, meta));
    }

    public error(message: string, meta?: unknown): void {
        console.error(this.formatMessage('error', message, meta));
    }

    public debug(message: string, meta?: unknown): void {
        if (this.isDevelopment) {
            console.debug(this.formatMessage('debug', message, meta));
        }
    }
}

export const logger = new Logger();
