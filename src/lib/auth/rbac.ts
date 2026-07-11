export const UserRole = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const RoleHierarchy: Record<UserRoleType, number> = {
    [UserRole.OWNER]: 40,
    [UserRole.ADMIN]: 30,
    [UserRole.MEMBER]: 20,
    [UserRole.VIEWER]: 10,
};

/**
 * Validates if the user's role meets or exceeds the required role.
 */
export function hasRequiredRole(userRole: UserRoleType, requiredRole: UserRoleType): boolean {
    return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}
