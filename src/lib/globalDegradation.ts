/**
 * globalDegradation.ts — Network-truth service degradation detection
 *
 * Detects degraded services from ORGANIC API call failures (503, 504, 429).
 * NO health polling. NO timers. NO artificial probes.
 *
 * Architecture:
 * - Axios interceptor calls markDegraded() on error status codes
 * - Axios interceptor calls clearFor() on successful responses
 * - DegradationBanner retry triggers queryClient.invalidateQueries()
 *   which makes real GET/POST requests — if they succeed, clearFor() fires
 *
 * Degradation clears ONLY via network truth (organic 200 OK),
 * NEVER via timers or artificial probes.
 */

type DegradationListener = (isDegraded: boolean, degradedServices: string[]) => void;

/**
 * Extract a "service name" from a URL path.
 * e.g. "/api/v1/workflows/123" → "workflows"
 */
function extractServiceName(url: string | undefined): string {
    if (!url) return 'unknown';
    const match = url.match(/\/api\/v\d+\/(\w+)/);
    return match ? match[1] : 'api';
}

/**
 * Map service names to React Query key prefixes for invalidation.
 */
const SERVICE_QUERY_KEY_MAP: Record<string, readonly string[]> = {
    workflows: ['workflows'],
    tenants: ['tenants'],
    conversations: ['conversations'],
    messages: ['messages'],
    activity: ['activity'],
    knowledge: ['knowledge'],
    api: ['api'], // fallback
};

class GlobalDegradation {
    private degradedServices = new Map<string, number>();
    private listeners = new Set<DegradationListener>();

    /**
     * Mark a service as degraded (called from Axios interceptor on 503/504/429).
     * No timer. Stays degraded until clearFor() is called by a successful response.
     */
    markDegraded(url: string | undefined, _status: number) {
        const service = extractServiceName(url);
        this.degradedServices.set(service, Date.now());
        this.notify();
    }

    /**
     * Clear degradation for a service (called from Axios interceptor on successful response).
     * This is the ONLY way degradation clears — via real network truth.
     */
    clearFor(url: string | undefined) {
        const service = extractServiceName(url);
        if (this.degradedServices.has(service)) {
            this.degradedServices.delete(service);
            this.notify();
        }
    }

    /**
     * Get React Query key prefixes for all currently degraded services.
     * Used by DegradationBanner to call queryClient.invalidateQueries().
     */
    getDegradedQueryKeys(): readonly string[][] {
        return this.services.map(
            service => [...(SERVICE_QUERY_KEY_MAP[service] ?? ['api'])]
        );
    }

    /**
     * Subscribe to degradation state changes.
     * Returns unsubscribe function.
     */
    subscribe(listener: DegradationListener): () => void {
        this.listeners.add(listener);
        listener(this.isDegraded, this.services);
        return () => {
            this.listeners.delete(listener);
        };
    }

    get isDegraded(): boolean {
        return this.degradedServices.size > 0;
    }

    get services(): string[] {
        return Array.from(this.degradedServices.keys());
    }

    private notify() {
        const isDegraded = this.isDegraded;
        const services = this.services;
        this.listeners.forEach(listener => listener(isDegraded, services));
    }
}

export const globalDegradation = new GlobalDegradation();
