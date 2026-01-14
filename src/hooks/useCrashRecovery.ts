'use client';

import { useCallback, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useRagStore } from '@/store/ragStore';
import { message } from 'antd';

const CRASH_RECOVERY_KEY = 'app_crash_recovery';

interface RecoveryData {
    timestamp: number;
    chat?: {
        unsent: string;
        conversationId: string | null;
    };
    editor?: {
        documentId: string;
        content: string;
        isDirty: boolean;
    };
    rag?: {
        lastQuery: string;
    };
}

export function useCrashRecovery() {
    const editorStore = useEditorStore();
    const ragStore = useRagStore();

    // Save state periodically
    const saveRecoveryData = useCallback(() => {
        const recoveryData: RecoveryData = {
            timestamp: Date.now(),
            editor: editorStore.currentDocument && editorStore.isDirty
                ? {
                    documentId: editorStore.currentDocument.id,
                    content: editorStore.currentDocument.content,
                    isDirty: editorStore.isDirty,
                }
                : undefined,
            rag: {
                lastQuery: ragStore.lastQuery,
            },
        };

        sessionStorage.setItem(CRASH_RECOVERY_KEY, JSON.stringify(recoveryData));
    }, [editorStore, ragStore]);

    // Check for recovery data on mount
    const checkRecovery = useCallback(() => {
        const stored = sessionStorage.getItem(CRASH_RECOVERY_KEY);
        if (!stored) return;

        try {
            const data: RecoveryData = JSON.parse(stored);
            const age = Date.now() - data.timestamp;

            // Only recover if less than 1 hour old
            if (age > 60 * 60 * 1000) {
                sessionStorage.removeItem(CRASH_RECOVERY_KEY);
                return;
            }

            // Show recovery prompt
            message.info({
                content: 'Unsaved changes detected. Would you like to restore them?',
                duration: 10,
                onClick: () => {
                    if (data.editor) {
                        editorStore.setDocument({
                            id: data.editor.documentId,
                            title: 'Recovered Document',
                            content: data.editor.content,
                            version: 0,
                            lastModified: new Date(data.timestamp),
                        });
                        message.success('Editor draft restored');
                    }

                    if (data.rag?.lastQuery) {
                        ragStore.setLastQuery(data.rag.lastQuery);
                    }

                    sessionStorage.removeItem(CRASH_RECOVERY_KEY);
                },
            });
        } catch (error) {
            console.error('Failed to parse recovery data:', error);
            sessionStorage.removeItem(CRASH_RECOVERY_KEY);
        }
    }, [editorStore, ragStore]);

    useEffect(() => {
        checkRecovery();
    }, [checkRecovery]);

    useEffect(() => {
        const interval = setInterval(saveRecoveryData, 30 * 1000); // Save every 30 seconds
        return () => clearInterval(interval);
    }, [saveRecoveryData]);

    return { saveRecoveryData, checkRecovery };
}
