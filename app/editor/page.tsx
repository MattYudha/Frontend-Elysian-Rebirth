'use client';

import { Protected } from '@/components/Protected';
import Image from 'next/image';
import { Button } from '@/ui/primitives/button';
import { FileText, Upload, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EditorSkeleton } from '@/components/LoadingSkeletons';

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
                                src="/elysian_empty_doc.png"
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
                        <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                            {/* Toolbar */}
                            <div className="border-b border-slate-100 p-3 flex items-center gap-2 bg-slate-50/50">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Bold className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Italic className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Underline className="h-4 w-4" /></Button>
                                <div className="h-4 w-px bg-slate-200 mx-2" />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><AlignLeft className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><AlignCenter className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><AlignRight className="h-4 w-4" /></Button>
                                <div className="flex-1" />
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs">
                                    <Save className="mr-2 h-3 w-3" /> Simpan
                                </Button>
                            </div>

                            {/* Canvas / Editor Area */}
                            <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
                                <div className="bg-white shadow-sm border border-slate-200 min-h-[800px] w-full max-w-3xl mx-auto p-10 outline-none" contentEditable suppressContentEditableWarning>
                                    <h1 className="text-3xl font-bold mb-4">Draft Dokumen Baru</h1>
                                    <p className="text-slate-600 mb-4">Mulai mengetik atau paste konten Anda di sini...</p>
                                    <p className="text-slate-400 italic text-sm">[Area ini dapat diedit]</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Protected>
    );
}
