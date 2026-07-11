import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function SettingsErrorState({
    title = "Terjadi Kesalahan",
    message = "Gagal memuat pengaturan. Silakan periksa koneksi Anda atau muat ulang halaman.",
    onRetry,
}: SettingsErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 h-full min-h-[300px]">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                {message}
            </p>
            {onRetry && (
                <Button
                    variant="outline"
                    onClick={onRetry}
                    className="gap-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                    <RefreshCw className="h-4 w-4" />
                    Coba Lagi
                </Button>
            )}
        </div>
    );
}
