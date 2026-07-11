/**
 * MarkdownSkeleton.tsx — Loading placeholder while AiMarkdownRenderer loads
 * 
 * Used as Suspense fallback for the lazy-loaded markdown rendering engine.
 */
export function MarkdownSkeleton() {
    return (
        <div className="space-y-3 animate-pulse" role="status" aria-label="Loading content...">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        </div>
    );
}
