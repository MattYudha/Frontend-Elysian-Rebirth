import { WorkstreamGridView } from '@/components/workstreams/WorkstreamGridView';

export default function CompletedWorkstreamsPage() {
    return (
        <WorkstreamGridView
            title="Completed Workstreams"
            description="Historical log of successfully finished AI pipelines and initiatives."
            filterStatus="completed"
        />
    );
}
