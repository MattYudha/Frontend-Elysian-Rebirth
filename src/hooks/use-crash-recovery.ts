'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { toast } from 'sonner';

/**
 * Enterprise "Tough Love" Crash Recovery.
 * Detects if there's a stale draft in IndexedDB that wasn't synced.
 */
export function useCrashRecovery() {
    const { isDirty, lastSynced, currentDocument, setDirty, markSynced } = useEditorStore();
    const hasChecked = useRef(false);

    useEffect(() => {
        // Prevent double-firing in strict mode
        if (hasChecked.current) return;

        // Check if we have an unsaved draft
        if (isDirty && currentDocument) {
            hasChecked.current = true;

            // Non-intrusive notification (Auto-dismiss in 4s)
            toast.info('Draft Dipulihkan', {
                description: 'Kami mengembalikan perubahan terakhir Anda.',
                duration: 4000,
                action: {
                    label: 'Batalkan',
                    onClick: () => {
                        setDirty(false);
                        // Optional: Reload page to fetch server state if needed
                        // window.location.reload();
                        toast.dismiss();
                    }
                }
            });
        }
    }, [isDirty, currentDocument, lastSynced, setDirty, markSynced]);
}
