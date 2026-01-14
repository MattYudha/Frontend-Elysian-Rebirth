import React from 'react';
import { MathBlock } from './MathBlock';

export interface InlineMathProps {
    math: string;
}

/**
 * InlineMath - Inline LaTeX math renderer
 * 
 * @example
 * ```tsx
 * <InlineMath math="x^2 + y^2 = z^2" />
 * ```
 */
export const InlineMath: React.FC<InlineMathProps> = ({ math }) => {
    return <MathBlock math={math} displayMode={false} />;
};

InlineMath.displayName = 'InlineMath';
