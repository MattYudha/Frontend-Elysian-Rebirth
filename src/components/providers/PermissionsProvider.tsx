'use client';

import { createContext, useContext, ReactNode } from 'react';

export type Permission = string;
export type Role = string;

export interface PermissionsContextValue {
    /**
     * Current user roles
     */
    roles: Role[];

    /**
     * Current user permissions
     */
    permissions: Permission[];

    /**
     * Check if user has permission
     */
    hasPermission: (permission: Permission) => boolean;

    /**
     * Check if user has role
     */
    hasRole: (role: Role) => boolean;

    /**
     * Check if user has any of the roles
     */
    hasAnyRole: (roles: Role[]) => boolean;

    /**
     * Check if user has all roles
     */
    hasAllRoles: (roles: Role[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export interface PermissionsProviderProps {
    /**
     * User roles
     */
    roles: Role[];

    /**
     * User permissions (optional, derived from roles if not provided)
     */
    permissions?: Permission[];

    /**
     * Children components
     */
    children: ReactNode;
}

/**
 * PermissionsProvider - RBAC provider for role/permission-based access control
 * 
 * @example
 * ```tsx
 * <PermissionsProvider
 *   roles={['admin', 'editor']}
 *   permissions={['chat:write', 'rag:read', 'workflow:execute']}
 * >
 *   <App />
 * </PermissionsProvider>
 * ```
 */
export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
    roles,
    permissions = [],
    children,
}) => {
    const hasPermission = (permission: Permission): boolean => {
        return permissions.includes(permission);
    };

    const hasRole = (role: Role): boolean => {
        return roles.includes(role);
    };

    const hasAnyRole = (checkRoles: Role[]): boolean => {
        return checkRoles.some((role) => roles.includes(role));
    };

    const hasAllRoles = (checkRoles: Role[]): boolean => {
        return checkRoles.every((role) => roles.includes(role));
    };

    const value: PermissionsContextValue = {
        roles,
        permissions,
        hasPermission,
        hasRole,
        hasAnyRole,
        hasAllRoles,
    };

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
};

/**
 * usePermissions - Hook to access permissions context
 * 
 * @example
 * ```tsx
 * const { hasPermission, hasRole } = usePermissions();
 * 
 * if (hasRole('admin')) {
 *   return <AdminPanel />;
 * }
 * 
 * if (hasPermission('rag:write')) {
 *   return <RagConfigPanel />;
 * }
 * ```
 */
export const usePermissions = (): PermissionsContextValue => {
    const context = useContext(PermissionsContext);

    if (!context) {
        // Fallback - no permissions
        return {
            roles: [],
            permissions: [],
            hasPermission: () => false,
            hasRole: () => false,
            hasAnyRole: () => false,
            hasAllRoles: () => false,
        };
    }

    return context;
};

/**
 * Allowed - Component guard for role-based rendering
 * 
 * @example
 * ```tsx
 * <Allowed roles={['admin', 'editor']}>
 *   <RagConfigPanel />
 * </Allowed>
 * 
 * <Allowed permissions={['workflow:execute']}>
 *   <WorkflowCanvas />
 * </Allowed>
 * ```
 */
export interface AllowedProps {
    roles?: Role[];
    permissions?: Permission[];
    requireAll?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
}

export const Allowed: React.FC<AllowedProps> = ({
    roles,
    permissions,
    requireAll = false,
    fallback = null,
    children,
}) => {
    const { hasAnyRole, hasAllRoles, hasPermission } = usePermissions();

    let isAllowed = true;

    if (roles && roles.length > 0) {
        isAllowed = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
    }

    if (permissions && permissions.length > 0 && isAllowed) {
        const permissionCheck = requireAll
            ? permissions.every(hasPermission)
            : permissions.some(hasPermission);
        isAllowed = permissionCheck;
    }

    return isAllowed ? <>{children}</> : <>{fallback}</>;
};

PermissionsProvider.displayName = 'PermissionsProvider';
Allowed.displayName = 'Allowed';
