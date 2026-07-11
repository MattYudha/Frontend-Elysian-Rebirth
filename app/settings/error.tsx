'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Settings Page Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-red-100 dark:border-red-900/30">
            <div className="h-12 w-12 rounded-full bg-red-100/50 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Terjadi Kesalahan!
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Kami mohon maaf, halaman pengaturan gagal dimuat karena ada modul yang tidak ditemukan atau error di dalam UI.
            </p>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                >
                    Kembali ke Dashboard
                </Button>
                <Button
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => reset()}
                >
                    <RefreshCcw className="h-4 w-4" /> Coba Lagi
                </Button>
            </div>
        </div>
    );
}
