import { WorkstreamGridView } from '@/components/workstreams/WorkstreamGridView';
import { notFound } from 'next/navigation';

export default function TenantWorkstreamPage({ params }: { params: { tenantSlug: string } }) {
    if (!params.tenantSlug) return notFound();

    // Format slug (e.g., fintech-mobile-app -> Fintech Mobile App) for the title
    const formattedTitle = params.tenantSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="w-full">
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <span>Tenants</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-slate-300 font-medium">{formattedTitle}</span>
            </div>

            <WorkstreamGridView
                title={`${formattedTitle} Workstreams`}
                description={`Viewing all active and historical AI pipelines assigned specifically to the ${formattedTitle} department.`}
                filterTenantSlug={params.tenantSlug}
            />
        </div>
    );
}
