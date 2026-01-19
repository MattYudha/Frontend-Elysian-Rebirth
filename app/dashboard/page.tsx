'use client';

import { Protected } from '@/components/auth/Protected';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useDashboard } from '@/hooks/api/useDashboard';

export default function DashboardPage() {
    const { stats, isLoading } = useDashboard();

    return (
        <Protected>
            {isLoading ? <DashboardSkeleton /> : <DashboardShell stats={stats} />}
        </Protected>
    );
}
