export type TenantStatus = 'Active' | 'Suspended' | 'Delinquent';
export type TenantTier = 'Free' | 'Pro' | 'Enterprise';

export interface Tenant {
    id: string;
    name: string;
    email: string;
    status: TenantStatus;
    tier: TenantTier;
    createdAt: string;
    tokenUsage: number;
    tokenLimit: number;
    healthScore: number; // 0-100, aggregation of error rates
    region: string;
}

export interface Permission {
    id: string;
    scope: string; // e.g. 'users'
    action: string; // e.g. 'create'
    description: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    isSystem?: boolean; // If true, cannot be deleted (e.g. Super Admin)
}

export interface RolePermissionMatrix {
    permissions: Permission[];
    roles: Role[];
    // Map of roleId -> Set of permissionIds
    matrix: Record<string, string[]>;
}

export interface AuditLogEntry {
    id: string;
    actor: {
        name: string;
        email: string;
        role: string;
        impersonatorName?: string; // If action was done by Admin in Ghost Mode
    };
    action: string;
    resource: string;
    timestamp: string; // ISO UTC
    ipAddress: string;
    location: string;
    status: 'Success' | 'Failure';
    changes?: {
        before: Record<string, unknown>;
        after: Record<string, unknown>;
    };
}

export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    description: string;
    isEnabled: boolean;
    scope: 'Global' | 'Tenant';
    targetTenants?: string[]; // IDs of tenants if scope is Tenant
}
