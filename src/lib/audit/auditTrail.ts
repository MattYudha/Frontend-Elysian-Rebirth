/**
 * Standard minimal schema for Audit Logging in Enterprise Settings.
 */

export type AuditActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'FAILED_LOGIN';

export interface AuditLogEntry {
    id: string; // UUID
    actorId: string; // User ID performing the action
    actorEmail: string; // For display
    action: AuditActionType;
    targetResource: string; // e.g., 'User', 'WorkspaceConfig', 'ApiKey'
    targetId?: string; // ID of the resource affected
    timestamp: string; // ISO String
    ipAddress?: string;
    userAgent?: string;
    diffMetadata?: Record<string, any>; // Flexible payload for what changed (e.g. { previous: { role: 'MEMBER' }, new: { role: 'ADMIN'} })
}

/**
 * Utility to format audit log entries for display.
 */
export function formatAuditAction(entry: AuditLogEntry): string {
    const actionMap: Record<AuditActionType, string> = {
        'CREATE': 'Created',
        'UPDATE': 'Updated',
        'DELETE': 'Deleted',
        'LOGIN': 'Logged in to',
        'FAILED_LOGIN': 'Failed to log in to',
    };

    const actionText = actionMap[entry.action] || 'Modified';
    return `${entry.actorEmail} ${actionText.toLowerCase()} ${entry.targetResource} ${entry.targetId ? `(${entry.targetId})` : ''}`;
}
