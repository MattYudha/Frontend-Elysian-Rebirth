import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface MathBlockProps {
    math: string;
    displayMode?: boolean;
}

/**
 * MathBlock - LaTeX math block renderer using KaTeX
 * 
 * @example
 * ```tsx
 * <MathBlock math="E = mc^2" displayMode />
 * ```
 */
export const MathBlock: React.FC<MathBlockProps> = ({ math, displayMode = true }) => {
    const mathRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mathRef.current) {
            try {
                katex.render(math, mathRef.current, {
                    displayMode,
                    throwOnError: false,
                    output: 'html',
                });
            } catch (error) {
                console.error('KaTeX rendering error:', error);
                if (mathRef.current) {
                    mathRef.current.textContent = math;
                }
            }
        }
    }, [math, displayMode]);

    return (
        <div
            ref={mathRef}
            style={{
                padding: displayMode ? '12px 0' : '0 4px',
                textAlign: displayMode ? 'center' : 'left',
            }}
        />
    );
};

MathBlock.displayName = 'MathBlock';
