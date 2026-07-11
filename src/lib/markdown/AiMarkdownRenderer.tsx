/**
 * AiMarkdownRenderer.tsx — Heavy markdown rendering engine
 *
 * This module contains all the heavy library imports:
 * - react-markdown (~30kb)
 * - remark-gfm, remark-math
 * - CodeBlock → highlight.js (~100kb+ with all languages)
 * - MermaidDiagram → mermaid (~150kb)
 *
 * Loaded on demand via next/dynamic from AiMarkdown.tsx.
 * SSR is preserved — this renders on the server for chat history.
 * Code-splitting reduces the initial JS bundle for non-chat pages.
 */
'use client';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from './CodeBlock';
import { MathBlock } from './MathBlock';
import { InlineMath } from './InlineMath';
import { MermaidDiagram } from './MermaidDiagram';
import { TableRenderer, TableHead, TableBody, TableRow, TableCell } from './TableRenderer';
import { ListRenderer, ListItem } from './ListRenderer';

export interface StreamChunk {
    content: string;
    done: boolean;
}

export interface AiMarkdownRendererProps {
    chunks?: StreamChunk[];
    content?: string;
    isStreaming?: boolean;
    className?: string;
}

const AiMarkdownRenderer: React.FC<AiMarkdownRendererProps> = ({
    chunks,
    content,
    isStreaming = false,
    className,
}) => {
    const fullContent = useMemo(() => {
        if (content) return content;
        if (chunks) {
            return chunks.map((chunk) => chunk.content).join('');
        }
        return '';
    }, [chunks, content]);

    return (
        <div className={className} style={{ lineHeight: 1.6 }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                    // Code blocks
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    code({ inline, className, children, ..._props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');

                        if (match && match[1] === 'mermaid') {
                            return <MermaidDiagram chart={codeString} />;
                        }

                        return !inline && match ? (
                            <CodeBlock language={match[1]} code={codeString} />
                        ) : (
                            <CodeBlock code={codeString} inline={true} />
                        );
                    },

                    // Math blocks
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    div({ className, children }: any) {
                        if (className === 'math math-display') {
                            return <MathBlock math={String(children)} displayMode={true} />;
                        }
                        return <div className={className}>{children}</div>;
                    },

                    // Inline math
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    span({ className, children }: any) {
                        if (className === 'math math-inline') {
                            return <InlineMath math={String(children)} />;
                        }
                        return <span className={className}>{children}</span>;
                    },

                    // Tables
                    table: ({ children }) => <TableRenderer>{children}</TableRenderer>,
                    thead: ({ children }) => <TableHead>{children}</TableHead>,
                    tbody: ({ children }) => <TableBody>{children}</TableBody>,
                    tr: ({ children }) => <TableRow>{children}</TableRow>,
                    th: ({ children }) => <TableCell isHeader>{children}</TableCell>,
                    td: ({ children }) => <TableCell>{children}</TableCell>,

                    // Lists
                    ul: ({ children }) => <ListRenderer>{children}</ListRenderer>,
                    ol: ({ children }) => <ListRenderer ordered>{children}</ListRenderer>,
                    li: ({ children }) => <ListItem>{children}</ListItem>,
                }}
            >
                {fullContent}
            </ReactMarkdown>

            {isStreaming && (
                <span
                    style={{
                        display: 'inline-block',
                        width: 8,
                        height: 16,
                        backgroundColor: '#1677ff',
                        marginLeft: 4,
                        animation: 'blink 1s infinite',
                    }}
                />
            )}

            <style>
                {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
            </style>
        </div>
    );
};

AiMarkdownRenderer.displayName = 'AiMarkdownRenderer';

export default AiMarkdownRenderer;
