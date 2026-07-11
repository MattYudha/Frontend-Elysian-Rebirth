import { PermissionMatrix } from "@/components/admin/rbac/PermissionMatrix";
import { RolePermissionMatrix } from "@/types/admin";

// Mock Data for Initial State
const MOCK_MATRIX: RolePermissionMatrix = {
    roles: [
        { id: 'role_admin', name: 'Super Admin', description: 'Dashboard', isSystem: true },
        { id: 'role_manager', name: 'Manager', description: 'Can manage subset of resources', isSystem: false },
        { id: 'role_editor', name: 'Editor', description: 'Content creator', isSystem: false },
        { id: 'role_viewer', name: 'Viewer', description: 'Read only access', isSystem: false },
    ],
    permissions: [
        // User Module
        { id: 'user.view', scope: 'Users', action: 'View Users', description: 'Full list visibility' },
        { id: 'user.create', scope: 'Users', action: 'Create User', description: 'Invite new members' },
        { id: 'user.delete', scope: 'Users', action: 'Delete User', description: 'Remove members permanently' },

        // Billing Module
        { id: 'billing.view', scope: 'Billing', action: 'View Invoices', description: 'Access financial records' },
        { id: 'billing.manage', scope: 'Billing', action: 'Manage Subscriptions', description: 'Upgrade/Downgrade plans' },

        // AI Module
        { id: 'ai.generate', scope: 'AI Features', action: 'Generate Content', description: 'Use LLM tokens' },
        { id: 'ai.config', scope: 'AI Features', action: 'Configure Models', description: 'Switch base models (GPT-4/Claude)' },
    ],
    // Initial assigned permissions
    matrix: {
        'role_admin': ['user.view', 'user.create', 'user.delete', 'billing.view', 'billing.manage', 'ai.generate', 'ai.config'],
        'role_manager': ['user.view', 'user.create', 'billing.view', 'ai.generate'],
        'role_editor': ['user.view', 'ai.generate'],
        'role_viewer': ['user.view'],
    }
};

export default function RbacPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Access Control (RBAC)</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage permissions for each role. Changes affect users immediately.</p>
            </div>

            <PermissionMatrix initialData={MOCK_MATRIX} />
        </div>
    );
}
