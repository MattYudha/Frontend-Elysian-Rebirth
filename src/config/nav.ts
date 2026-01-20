export interface NavItem {
    key: string;
    label: string;
    href: string;
    icon: string;
    roles?: string[];
    section?: string;
}

export const mainNav: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard', section: 'Main' },
    { key: 'chat', label: 'Chat', href: '/chat', icon: 'chat', section: 'Main' },
    { key: 'knowledge', label: 'Knowledge Base', href: '/knowledge', icon: 'Book', roles: ['admin', 'editor'], section: 'Main' },
    { key: 'editor', label: 'Document Editor', href: '/editor', icon: 'FileText', section: 'Main' },
    { key: 'workflow', label: 'Workflow', href: '/workflow', icon: 'Workflow', section: 'Main' },
    { key: 'settings', label: 'Settings', href: '/settings', icon: 'Settings', section: 'System' },
];

export const userNav: NavItem[] = [
    { key: 'profile', label: 'Profile', href: '/profile', icon: 'person' },
    { key: 'logout', label: 'Logout', href: '/login', icon: 'logout' },
];
