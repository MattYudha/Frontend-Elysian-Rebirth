import dynamic from 'next/dynamic';
import { Protected } from '@/components/auth/Protected';
import { EditorSkeleton } from '@/components/LoadingSkeletons';

const WorkflowBuilder = dynamic(
    () => import('@/components/workflow/WorkflowBuilder').then((mod) => mod.WorkflowBuilder),
    {
        ssr: false,
        loading: () => <EditorSkeleton />,
    }
);

export default function WorkflowPage() {
    return (
        <Protected>
            <WorkflowBuilder />
        </Protected>
    );
}
