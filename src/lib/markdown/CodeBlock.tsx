import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export interface CodeBlockProps {
    language?: string;
    code: string;
    inline?: boolean;
}

/**
 * CodeBlock - Syntax-highlighted code block renderer
 * 
 * @example
 * ```tsx
 * <CodeBlock language="typescript" code={codeString} />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, inline = false }) => {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current && !inline) {
            hljs.highlightElement(codeRef.current);
        }
    }, [code, inline]);

    if (inline) {
        return (
            <code
                style={{
                    backgroundColor: '#f6f8fa',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                }}
            >
                {code}
            </code>
        );
    }

    return (
        <pre
            style={{
                backgroundColor: '#0d1117',
                padding: 16,
                borderRadius: 8,
                overflow: 'auto',
                margin: '12px 0',
            }}
        >
            <code
                ref={codeRef}
                className={language ? `language-${language}` : ''}
                style={{
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                }}
            >
                {code}
            </code>
        </pre>
    );
};

CodeBlock.displayName = 'CodeBlock';
