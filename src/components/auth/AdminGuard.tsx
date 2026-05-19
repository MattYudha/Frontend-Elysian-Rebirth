'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role !== 'admin' && user?.role !== 'super_admin') {
            // Redirect unauthorized users to regular dashboard
            router.push('/dashboard');
        }
    }, [isAuthenticated, user, router]);

    // Show loading or nothing while checking
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-slate-500 text-sm">Verifying Access...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
