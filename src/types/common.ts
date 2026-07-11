export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    message?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginatedResponse<T = unknown> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
