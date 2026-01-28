'use client';

import { Protected } from '@/components/auth/Protected';
import Image from 'next/image';
import { Button } from '@/components/ui/';
import { Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EditorSkeleton } from '@/components/LoadingSkeletons';
import dynamic from 'next/dynamic';

// Dynamically import DocumentEditor to prevent SSR issues with Tiptap
const DocumentEditor = dynamic(
    () => import('@/components/editor/DocumentEditor').then((mod) => mod.DocumentEditor),
    {
        ssr: false,
        loading: () => <EditorSkeleton />
    }
);

export default function DocumentEditorPage() {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for last active timestamp
        const lastActive = localStorage.getItem('elysian_editor_last_active');
        if (lastActive) {
            const now = Date.now();
            const timeDiff = now - parseInt(lastActive, 10);
            // 24 hours in milliseconds = 24 * 60 * 60 * 1000 = 86400000
            if (timeDiff < 86400000) {
                setIsActive(true);
            }
        }
        // Artificial delay for skeleton demo
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const handleUpload = () => {
        // Set active state and save timestamp
        setIsActive(true);
        localStorage.setItem('elysian_editor_last_active', Date.now().toString());
    };

    if (isLoading) return <EditorSkeleton />;

    return (
        <Protected>
            <div className="flex flex-col h-[calc(100vh-6rem)]">
                {!isActive ? (
                    // Empty State Illustration (Shown only if > 24h since last use)
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                        <div className="relative w-64 h-64 mb-8 animate-float delay-200">
                            <Image
                                src="/assets/payment.png"
                                alt="Document Editor"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10" />
                        </div>

                        <div className="max-w-md space-y-4">
                            <h1 className="text-2xl font-bold text-slate-900">Editor Dokumen Pintar</h1>
                            <p className="text-slate-500">
                                Edit, kolaborasi, dan kelola dokumen Anda dengan bantuan AI. Perbaiki format dan konten secara otomatis.
                            </p>
                            <Button
                                onClick={handleUpload}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 shadow-lg shadow-blue-500/25 group"
                            >
                                <Upload className="mr-2 h-5 w-5" />
                                Upload Dokumen
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Active Editor Interface (Mock UI)
                    <div className="flex-1 flex flex-col items-center p-6 animate-in fade-in duration-500">
                        {/* Actual Document Editor Component */}
                        <DocumentEditor
                            document={{
                                id: 'draft-1',
                                title: 'Draft Dokumen Baru',
                                version: 1,
                                lastModified: new Date(),
                                content: { type: 'doc', content: [] }, // Initial empty content
                            }}
                            initialContent={null} // Will trigger default schema in Editor
                            onChange={(json) => console.log('Editor Content:', json)}
                            onSave={() => alert('Document Saved! (Check console for JSON)')}
                            pdfUrl={undefined}
                            isMobile={false}
                        />
                    </div>
                )}
            </div>
        </Protected>
    );
}
