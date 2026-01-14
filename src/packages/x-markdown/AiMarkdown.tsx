import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from './renderers/CodeBlock';
import { MathBlock } from './renderers/MathBlock';
import { InlineMath } from './renderers/InlineMath';
import { MermaidDiagram } from './renderers/MermaidDiagram';
import { TableRenderer, TableHead, TableBody, TableRow, TableCell } from './renderers/TableRenderer';
import { ListRenderer, ListItem } from './renderers/ListRenderer';

export interface StreamChunk {
    content: string;
    done: boolean;
}

export interface AiMarkdownProps {
    /**
     * Array of content chunks (useful for streaming)
     */
    chunks?: StreamChunk[];

    /**
     * Complete markdown content (alternative to chunks)
     */
    content?: string;

    /**
     * Whether content is currently streaming
     */
    isStreaming?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * AiMarkdown - AI-optimized markdown renderer with streaming support
 * 
 * Features:
 * - Syntax-highlighted code blocks
 * - LaTeX math rendering
 * - Mermaid diagrams
 * -Enhanced tables and lists
 * - Streaming content support
 * 
 * @example
 * ```tsx
 * // With streaming chunks
 * <AiMarkdown chunks={streamChunks} isStreaming={true} />
 * 
 * // With complete content
 * <AiMarkdown content="# Hello\n\nThis is **markdown**" />
 * ```
 */
export const AiMarkdown: React.FC<AiMarkdownProps> = ({
    chunks,
    content,
    isStreaming = false,
    className,
}) => {
    // Combine chunks into full content
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

                        // Handle mermaid diagrams
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

AiMarkdown.displayName = 'AiMarkdown';
