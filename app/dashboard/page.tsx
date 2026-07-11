import { Protected } from '@/components/auth/Protected';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function DashboardPage({
    searchParams,
}: {
    searchParams: { status?: string };
}) {
    // Read params on server side
    const statusFilter = searchParams.status ?? 'all';

    return (
        <Protected>
            <DashboardShell initialStatusFilter={statusFilter} />
            {/* Force HMR Rebuild: Final Blueprint Applied */}
        </Protected>
    );
}
