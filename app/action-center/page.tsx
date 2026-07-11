import { ActionCenterClient } from '@/components/action-center/ActionCenterClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Action Center | Elysian Rebirth',
    description: 'Human-in-the-Loop AI Action Queue and Approvals',
};

export default function ActionCenterPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center p-8 text-slate-500">Loading Action Center...</div>}>
            <ActionCenterClient />
        </Suspense>
    );
}
