'use client';

import { useCrashRecovery } from '@/hooks/useCrashRecovery';


export function CrashRecoveryProvider({ children }: { children: React.ReactNode }) {
    useCrashRecovery();
    return <>{children}</>;
}
