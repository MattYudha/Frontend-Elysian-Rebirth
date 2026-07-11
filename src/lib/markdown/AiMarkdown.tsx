/**
 * AiMarkdown.tsx — SSR-safe markdown shell using next/dynamic
 *
 * Uses next/dynamic (NOT React.lazy) for Next.js App Router compatibility.
 * ssr defaults to true — the heavy renderer renders on the server for chat history.
 * The `loading` prop shows MarkdownSkeleton only during client JS chunk download.
 *
 * This avoids hydration mismatch while still code-splitting the heavy engine
 * (react-markdown, highlight.js, mermaid) into a separate chunk.
 */
import dynamic from 'next/dynamic';
import { MarkdownSkeleton } from './MarkdownSkeleton';

// Re-export types for consumers
export type { StreamChunk, AiMarkdownRendererProps as AiMarkdownProps } from './AiMarkdownRenderer';

// next/dynamic with ssr: true (default) — renders on server for history,
// shows skeleton only during client JS chunk download
const AiMarkdownRenderer = dynamic(
    () => import('./AiMarkdownRenderer'),
    { loading: () => <MarkdownSkeleton /> }
);

interface AiMarkdownShellProps {
    chunks?: Array<{ content: string; done: boolean }>;
    content?: string;
    isStreaming?: boolean;
    className?: string;
}

export function AiMarkdown(props: AiMarkdownShellProps) {
    return <AiMarkdownRenderer {...props} />;
}

AiMarkdown.displayName = 'AiMarkdown';
