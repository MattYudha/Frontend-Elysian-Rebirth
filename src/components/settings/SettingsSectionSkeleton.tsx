import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSectionSkeleton() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800/50" />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-slate-800/50" />
                        <Skeleton className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-slate-800/50" />
                        <Skeleton className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-24 bg-slate-100 dark:bg-slate-800/50" />
                    <Skeleton className="h-24 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="flex justify-end pt-4">
                    <Skeleton className="h-10 w-32 rounded-lg bg-blue-100 dark:bg-blue-900/40" />
                </div>
            </div>
        </div>
    );
}
