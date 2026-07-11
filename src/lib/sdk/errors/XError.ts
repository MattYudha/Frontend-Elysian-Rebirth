/**
 * Typed error classes for enterprise error handling
 */

export type XErrorType = 'network' | 'rag' | 'workflow' | 'auth' | 'validation' | 'unknown';

export interface XErrorOptions {
    type: XErrorType;
    message: string;
    status?: number;
    retryable?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?: Record<string, any>;
    cause?: Error;
}

/**
 * XError - Typed error class for enterprise applications
 * 
 * Provides error classification, retry strategies, and context.
 * 
 * @example
 * ```tsx
 * throw new XError({
 *   type: 'network',
 *   message: 'Failed to connect to AI service',
 *   status: 503,
 *   retryable: true,
 *   context: { endpoint: '/api/chat' }
 * });
 * ```
 */
export class XError extends Error {
    public readonly type: XErrorType;
    public readonly status?: number;
    public readonly retryable: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly context?: Record<string, any>;
    public readonly cause?: Error;

    constructor(options: XErrorOptions) {
        super(options.message);
        this.name = 'XError';
        this.type = options.type;
        this.status = options.status;
        this.retryable = options.retryable ?? this.isRetryableByDefault(options.type);
        this.context = options.context;
        this.cause = options.cause;

        // Maintains proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, XError);
        }
    }

    private isRetryableByDefault(type: XErrorType): boolean {
        switch (type) {
            case 'network':
                return true;
            case 'rag':
            case 'workflow':
                return false;
            case 'auth':
            case 'validation':
                return false;
            default:
                return false;
        }
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage(): string {
        switch (this.type) {
            case 'network':
                return 'Network connection error. Please check your internet connection.';
            case 'rag':
                return 'Knowledge base error. Please try again later.';
            case 'workflow':
                return 'Workflow execution failed. Please check your configuration.';
            case 'auth':
                return 'Authentication failed. Please log in again.';
            case 'validation':
                return 'Invalid input. Please check your data.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }

    /**
     * Convert to JSON for logging/telemetry
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON(): Record<string, any> {
        return {
            name: this.name,
            type: this.type,
            message: this.message,
            status: this.status,
            retryable: this.retryable,
            context: this.context,
            stack: this.stack,
        };
    }
}

/**
 * Error factory functions for common scenarios
 */
export const createNetworkError = (message: string, status?: number): XError => {
    return new XError({
        type: 'network',
        message,
        status,
        retryable: true,
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRagError = (message: string, context?: Record<string, any>): XError => {
    return new XError({
        type: 'rag',
        message,
        retryable: false,
        context,
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createWorkflowError = (message: string, context?: Record<string, any>): XError => {
    return new XError({
        type: 'workflow',
        message,
        retryable: false,
        context,
    });
};

export const createAuthError = (message: string): XError => {
    return new XError({
        type: 'auth',
        message,
        status: 401,
        retryable: false,
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createValidationError = (message: string, context?: Record<string, any>): XError => {
    return new XError({
        type: 'validation',
        message,
        retryable: false,
        context,
    });
};
