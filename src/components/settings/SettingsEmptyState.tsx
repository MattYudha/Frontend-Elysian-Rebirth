import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsEmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function SettingsEmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: SettingsEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 min-h-[400px]">
            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <Icon className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {title}
            </h3>

            <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
                {description}
            </p>

            {onAction && actionLabel && (
                <Button
                    onClick={onAction}
                    className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                >
                    <Plus className="h-4 w-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
