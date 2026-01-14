'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * Debounce a function call
 * 
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce((query: string) => {
 *   performSearch(query);
 * }, 500);
 * 
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }) as T,
        [callback, delay]
    );
}

/**
 * Throttle a function call
 * 
 * @example
 * ```tsx
 * const throttledScroll = useThrottle((event: Event) => {
 *   handleScroll(event);
 * }, 100);
 * 
 * <div onScroll={throttledScroll}>...</div>
 * ```
 */
export function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): T {
    const lastRun = useRef(Date.now());

    return useCallback(
        ((...args) => {
            const now = Date.now();

            if (now - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = now;
            }
        }) as T,
        [callback, delay]
    );
}

/**
 * Memoize expensive computations
 * 
 * @example
 * ```tsx
 * const processedMessages = useMemoized(
 *   () => messages.map(processMessage),
 *   [messages]
 * );
 * ```
 */
export function useMemoized<T>(
    factory: () => T,
    deps: React.DependencyList
): T {
    return useMemo(factory, deps);
}

/**
 * Get previous value of a prop/state
 * 
 * @example
 * ```tsx
 * const prevCount = usePrevious(count);
 * console.log(`Count changed from ${prevCount} to ${count}`);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

/**
 * Stable callback reference (persists across renders)
 * 
 * @example
 * ```tsx
 * const handleClick = useStableCallback(() => {
 *   console.log('Clicked!', someValue);
 * });
 * ```
 */
export function useStableCallback<T extends (...args: any[]) => any>(
    callback: T
): T {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    return useCallback(((...args) => {
        return callbackRef.current(...args);
    }) as T, []);
}
