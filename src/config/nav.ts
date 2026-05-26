export interface NavItem {
    key: string;
    label: string;
    href: string;
    icon: string;
    roles?: string[];
    section?: string;
}

export const mainNav: NavItem[] = [
    // OPERATIONS
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard', section: 'OPERATIONS' },
    { key: 'workstreams', label: 'Mission Control', href: '/workstreams', icon: 'Activity', section: 'OPERATIONS' },
    { key: 'action-center', label: 'Action Center', href: '/action-center', icon: 'ShieldAlert', section: 'OPERATIONS' },
    { key: 'swarm-review', label: 'Swarm Review', href: '/swarm', icon: 'Shield', section: 'OPERATIONS' },

    // WORKSPACE
    { key: 'knowledge', label: 'Knowledge Base', href: '/knowledge', icon: 'Book', roles: ['admin', 'editor'], section: 'WORKSPACE' },
    { key: 'editor', label: 'Document Editor', href: '/editor', icon: 'FileText', section: 'WORKSPACE' },
    { key: 'chat', label: 'Chat', href: '/chat', icon: 'chat', section: 'WORKSPACE' },
    { key: 'qa-gate', label: 'QA Gate', href: '/dashboard/documents/qa-gate', icon: 'CheckSquare', section: 'WORKSPACE' },

    // AUTOMATION
    { key: 'workflow', label: 'Workflow Builder', href: '/workflow', icon: 'Workflow', section: 'AUTOMATION' },

    // SYSTEM
    { key: 'blockchain-verify', label: 'Blockchain Verify', href: '/blockchain/verify', icon: 'Link2', section: 'SYSTEM' },
    { key: 'settings', label: 'Settings', href: '/settings', icon: 'Settings', section: 'SYSTEM' },
];

export const userNav: NavItem[] = [
    { key: 'profile', label: 'Profile', href: '/profile', icon: 'person' },
    { key: 'logout', label: 'Logout', href: '/login', icon: 'logout' },
];
