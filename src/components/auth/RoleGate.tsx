'use client';

import { hasRequiredRole, UserRoleType } from '@/lib/auth/rbac';

interface RoleGateProps {
    requiredRole: UserRoleType;
    currentUserRole: UserRoleType | undefined | null;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * A wrapper component that only renders its children if the `currentUserRole` meets or exceeds
 * the `requiredRole` in the hierarchy.
 */
export function RoleGate({ requiredRole, currentUserRole, children, fallback = null }: RoleGateProps) {
    if (!currentUserRole) return fallback;

    // Convert undefined/null to something that fails gracefully if it happens
    const isAllowed = hasRequiredRole(currentUserRole, requiredRole);

    if (!isAllowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
