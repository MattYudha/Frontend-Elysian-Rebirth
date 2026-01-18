'use client';

import { Protected } from '@/components/Protected';
import { KnowledgeHub } from '@/packages/x/rag/KnowledgeHub';

export default function KnowledgePage() {
    return (
        <Protected pure>
            <KnowledgeHub />
        </Protected>
    );
}
