import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export interface MermaidDiagramProps {
    chart: string;
    id?: string;
}

// Dynamically import the heavy inner component
// ssr: false is CRITICAL to prevent server-side rendering of Mermaid
const MermaidDiagramInner = dynamic(
    () => import('./MermaidDiagramInner'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full flex justify-center py-8">
                <Skeleton className="h-48 w-full max-w-md rounded-xl bg-slate-100/50" />
            </div>
        ),
    }
);

/**
 * MermaidDiagram - Wrapper for async Mermaid rendering
 * 
 * This component ensures 'mermaid' library is NOT included in the main bundle.
 */
export const MermaidDiagram: React.FC<MermaidDiagramProps> = (props) => {
    return <MermaidDiagramInner {...props} />;
};

MermaidDiagram.displayName = 'MermaidDiagram';
