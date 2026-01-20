'use client';

import { Protected } from '@/components/auth/Protected';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';

export default function WorkflowPage() {
    return (
        <Protected>
            <WorkflowBuilder />
        </Protected>
    );
}
