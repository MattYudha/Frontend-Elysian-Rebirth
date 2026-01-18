'use client';

import { Protected } from '@/components/Protected';
import { DashboardShell } from '@/packages/x/dashboard/DashboardShell';

export default function DashboardPage() {
    return (
        <Protected pure>
            <DashboardShell />
        </Protected>
    );
}
