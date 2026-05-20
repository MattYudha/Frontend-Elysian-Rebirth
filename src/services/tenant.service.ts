/**
 * src/services/tenant.service.ts
 *
 * Tenant Service Layer
 * Responsibilities:
 * - Direct API calls for tenant management
 * - Type definitions for API responses
 */

import { http } from '@/lib/http';

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    theme?: {
        primaryColor: string;
        darkMode: boolean;
    };
    features?: string[];
}

/**
 * Fetch all available tenants for the current user
 * Endpoint: GET /api/v1/tenants
 */
export async function fetchTenants(): Promise<Tenant[]> {
    const response = await http.get<{ status: string; data: Tenant[] }>('/api/v1/tenants');
    return response.data || [];
}

/**
 * Fetch a single tenant by ID
 * Endpoint: GET /api/v1/tenants/:id
 */
export async function fetchTenantById(id: string): Promise<Tenant> {
    const response = await http.get<{ status: string; data: Tenant }>(`/api/v1/tenants/${id}`);
    return response.data;
}
