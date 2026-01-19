import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
});

export interface MermaidDiagramProps {
    chart: string;
    id?: string;
}

/**
 * MermaidDiagram - Mermaid diagram renderer
 * 
 * @example
 * ```tsx
 * <MermaidDiagram chart="graph TD; A-->B; B-->C;" />
 * ```
 */
export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
    const diagramRef = useRef<HTMLDivElement>(null);
    const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        const renderDiagram = async () => {
            if (diagramRef.current && chart) {
                try {
                    const { svg } = await mermaid.render(diagramId, chart);
                    if (diagramRef.current) {
                        diagramRef.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                    if (diagramRef.current) {
                        diagramRef.current.innerHTML = `<pre>${chart}</pre>`;
                    }
                }
            }
        };

        renderDiagram();
    }, [chart, diagramId]);

    return (
        <div
            ref={diagramRef}
            style={{
                padding: '16px 0',
                textAlign: 'center',
                overflow: 'auto',
            }}
        />
    );
};

MermaidDiagram.displayName = 'MermaidDiagram';
