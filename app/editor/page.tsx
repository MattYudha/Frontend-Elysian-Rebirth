'use client';

import { Protected } from '@/components/auth/Protected';
import Image from 'next/image';
import { Button } from '@/components/ui/';
import { Upload } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { EditorSkeleton } from '@/components/LoadingSkeletons';
import dynamic from 'next/dynamic';
import { useDocuments, useUpdateDocumentText } from '@/queries/document.queries';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FilePlus } from 'lucide-react';

// Dynamically import DocumentEditor to prevent SSR issues with Tiptap
const DocumentEditor = dynamic(
    () => import('@/components/editor/DocumentEditor').then((mod) => mod.DocumentEditor),
    {
        ssr: false,
        loading: () => <EditorSkeleton />
    }
);

function DocumentEditorContent() {
    const [isActive, setIsActive] = useState(false);
    const [isLoadingDelay, setIsLoadingDelay] = useState(true);
    const { data: documents, isLoading: isLoadingDocuments } = useDocuments();
    const searchParams = useSearchParams();
    const urlDocumentId = searchParams.get('id');
    const updateTextMutation = useUpdateDocumentText();
    const router = useRouter();

    useEffect(() => {
        // Auto-activate editor if tenant already has saved documents
        if (documents && documents.length > 0) {
            setIsActive(true);
        }
    }, [documents]);

    useEffect(() => {
        // Auto-activate if there is an active ID in URL or active session in local storage
        const lastActive = localStorage.getItem('elysian_editor_last_active');
        if (lastActive || urlDocumentId) {
            setIsActive(true);
        }
        
        // Artificial delay for smooth skeleton loading transitions
        const timer = setTimeout(() => setIsLoadingDelay(false), 500);
        return () => clearTimeout(timer);
    }, [urlDocumentId]);

    const handleUpload = () => {
        setIsActive(true);
        localStorage.setItem('elysian_editor_last_active', Date.now().toString());
    };

    const handleLoadSample = async () => {
        const sampleId = crypto.randomUUID();
        const title = "Draf Anggaran Hardware Dinas Kominfo 2026";
        const text = `DRAFT ANGGARAN DINAS KOMUNIKASI & INFORMATIKA
Wilayah : Purbalingga
--------------------------------------------
Berikut adalah rencana anggaran pengadaan hardware tahun 2026:

1. Laptop IT Lenovo ThinkPad : Rp 25.000.000 (5 unit)
2. Printer HP LaserJet : Rp 4.500.000 (3 unit)
3. AC Split Daikin 1.5 PK : Rp 8.500.000 (2 unit)
4. Semen Padang : Rp 120.000 (150 sak)
5. Printer Canon Pixma : Rp 1.500.000 (2 unit)`;

        try {
            toast.loading("Membuat dokumen contoh...", { id: "sample-loader" });
            await updateTextMutation.mutateAsync({
                id: sampleId,
                text,
                title
            });
            localStorage.setItem('elysian_editor_last_active', Date.now().toString());
            toast.success("Draf anggaran contoh berhasil dimuat! AI Guardrails telah mendeteksi anomali secara instan.", { id: "sample-loader" });
            router.replace(`/editor?id=${sampleId}`);
            setIsActive(true);
        } catch (e: any) {
            toast.error("Gagal memuat template: " + (e.message || e), { id: "sample-loader" });
        }
    };

    // Keep displaying skeleton loader during initial database fetch or smooth skeleton delay transitions
    const showLoading = isLoadingDelay || isLoadingDocuments;

    if (showLoading) return <EditorSkeleton />;

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            {!isActive ? (
                // Empty State Illustration (Shown only if > 24h since last use and no saved documents exist)
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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-55">Editor Dokumen Pintar</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Edit, kolaborasi, dan kelola dokumen draf anggaran Anda secara cerdas. Dilengkapi dengan audit otonom, deteksi markup, dan compliance check.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Button
                                onClick={handleUpload}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5 shadow-lg shadow-blue-500/20 group font-bold text-xs"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Buat Dokumen Baru
                            </Button>
                            <Button
                                onClick={handleLoadSample}
                                variant="outline"
                                className="w-full sm:w-auto border-blue-200 text-blue-600 dark:border-blue-900/40 dark:text-blue-400 rounded-xl px-6 py-5 hover:bg-blue-50 dark:hover:bg-blue-950/20 font-bold text-xs"
                            >
                                <FilePlus className="mr-2 h-4 w-4" />
                                Muat Template Contoh
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                // Active Editor Interface
                <div className="flex-1 flex flex-col p-4 md:p-6 animate-in fade-in duration-500 w-full max-w-[1600px] mx-auto">
                    {/* Actual Document Editor Component */}
                    <DocumentEditor />
                </div>
            )}
        </div>
    );
}

export default function DocumentEditorPage() {
    return (
        <Protected>
            <Suspense fallback={<EditorSkeleton />}>
                <DocumentEditorContent />
            </Suspense>
        </Protected>
    );
}
