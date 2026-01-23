import { useState, useEffect } from "react";

/**
 * Hook to check if the component has hydrated (client-side only).
 * Useful for preventing hydration mismatches when using persisted state.
 * @returns boolean - true if hydrated (mounted on client), false otherwise.
 */
export function useHydration() {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return hydrated;
}
