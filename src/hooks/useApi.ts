'use client';

import { useState, useCallback } from 'react';
import type { LoadingState } from '@/types/common';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<T = any, P = any>(
    apiFunction: (params: P) => Promise<T>,
    options?: UseApiOptions<T>
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [state, setState] = useState<LoadingState>('idle');

    const execute = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (params: any) => { // Changed P to any based on the instruction's intent for 'any'
            setState('loading');
            setError(null);

            try {
                const result = await apiFunction(params);
                setData(result);
                setState('success');
                options?.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('An unknown error occurred');
                setError(error);
                setState('error');
                options?.onError?.(error);
                throw error;
            }
        },
        [apiFunction, options]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setState('idle');
    }, []);

    return {
        data,
        error,
        state,
        isLoading: state === 'loading',
        isSuccess: state === 'success',
        isError: state === 'error',
        execute,
        reset,
    };
}
