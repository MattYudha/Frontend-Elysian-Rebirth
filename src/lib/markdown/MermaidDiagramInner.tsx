'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export interface MermaidDiagramInnerProps {
    chart: string;
    id?: string;
}

const MermaidDiagramInner: React.FC<MermaidDiagramInnerProps> = ({ chart, id }) => {
    const diagramRef = useRef<HTMLDivElement>(null);
    const [isRendered, setIsRendered] = useState(false);
    // Unique ID to prevent conflicts if multiple diagrams exist
    const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        // Initialize mermaid only once
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'var(--font-sans)',
        });

        const renderDiagram = async () => {
            if (diagramRef.current && chart) {
                try {
                    // Reset content slightly to force re-render if needed
                    diagramRef.current.innerHTML = '';
                    const { svg } = await mermaid.render(diagramId, chart);
                    if (diagramRef.current) {
                        diagramRef.current.innerHTML = svg;
                        setIsRendered(true);
                    }
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                    if (diagramRef.current) {
                        diagramRef.current.innerHTML = `<pre class="text-red-500 text-xs p-2 bg-red-50 rounded">${chart}</pre>`;
                    }
                }
            }
        };

        renderDiagram();
    }, [chart, diagramId]);

    return (
        <div
            ref={diagramRef}
            className={`transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
            style={{
                padding: '16px 0',
                textAlign: 'center',
                overflow: 'auto',
            }}
        />
    );
};

export default MermaidDiagramInner;
