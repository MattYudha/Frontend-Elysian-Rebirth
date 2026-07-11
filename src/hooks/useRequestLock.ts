import { useState, useCallback, useRef } from 'react';

/**
 * Hook to prevent race conditions and multiple simultaneous requests
 */
export function useRequestLock() {
    const [isLocked, setIsLocked] = useState(false);

    const executeWithLock = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
        if (isLocked) {
            console.warn('Request already in progress');
            return null;
        }

        setIsLocked(true);
        try {
            const result = await fn();
            return result;
        } finally {
            setIsLocked(false);
        }
    }, [isLocked]);

    return { isLocked, executeWithLock };
}

/**
 * Debounce function calls
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}

/**
 * Throttle function calls
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    limit: number
): (...args: Parameters<T>) => void {
    const inThrottle = useRef(false);

    return useCallback(
        (...args: Parameters<T>) => {
            if (!inThrottle.current) {
                callback(...args);
                inThrottle.current = true;
                setTimeout(() => {
                    inThrottle.current = false;
                }, limit);
            }
        },
        [callback, limit]
    );
}
