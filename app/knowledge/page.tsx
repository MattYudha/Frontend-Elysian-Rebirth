'use client';

import { Protected } from '@/components/auth/Protected';
import { KnowledgeHub } from '@/components/knowledge/KnowledgeHub';

import { useRagSources } from '@/hooks/api/useRagSources';

export default function KnowledgePage() {
    const { sources, isLoading, upload } = useRagSources();

    const handleUpload = (file: File) => {
        upload(file);
    };

    return (
        <Protected>
            <KnowledgeHub
                documents={sources}
                isLoading={isLoading}
                onUpload={handleUpload}
            />
        </Protected>
    );
}
