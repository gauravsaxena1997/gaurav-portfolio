export const ERROR_CODES = {
    VALIDATION: 'VALIDATION_ERROR',
    NETWORK: 'NETWORK_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    INTERNAL: 'INTERNAL_SERVER_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export const ERROR_MESSAGES = {
    DEFAULT: 'Something went wrong. Please try again later.',
    NETWORK: 'Network error. Please check your connection.',
} as const;
