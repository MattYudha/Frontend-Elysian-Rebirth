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
    plan_tier?: string;
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

/**
 * Update tenant details
 * Endpoint: PUT /api/v1/tenants/:id
 */
export async function updateTenant(id: string, data: { name?: string; plan_tier?: string }): Promise<Tenant> {
    const response = await http.put<{ status: string; data: Tenant }>(`/api/v1/tenants/${id}`, data);
    return response.data;
}

/**
 * Fetch members of a tenant
 * Endpoint: GET /api/v1/tenants/:id/members
 */
export async function fetchTenantMembers(id: string): Promise<any[]> {
    const response = await http.get<{ status: string; data: any[] }>(`/api/v1/tenants/${id}/members`);
    return response.data || [];
}

/**
 * Update a member's role in a tenant
 * Endpoint: PUT /api/v1/tenants/:id/members/:userId
 */
export async function updateMemberRole(tenantId: string, userId: string, role: string): Promise<void> {
    await http.put(`/api/v1/tenants/${tenantId}/members/${userId}`, { role });
}
