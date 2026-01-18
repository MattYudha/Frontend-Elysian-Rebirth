'use client';

import { Protected } from '@/components/Protected';
import Image from 'next/image';
import { Button } from '@/ui/primitives/button';
import { GitMerge, Plus, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/ui/card';

export default function WorkflowPage() {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const lastActive = localStorage.getItem('elysian_workflow_last_active');
        if (lastActive) {
            const timeDiff = Date.now() - parseInt(lastActive, 10);
            if (timeDiff < 86400000) { // 24 hours
                setIsActive(true);
            }
        }
        setIsLoading(false);
    }, []);

    const handleCreateWorkflow = () => {
        setIsActive(true);
        localStorage.setItem('elysian_workflow_last_active', Date.now().toString());
    };

    if (isLoading) return null;

    return (
        <Protected pure>
            <div className="flex flex-col h-[calc(100vh-6rem)]">
                {!isActive ? (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                        <div className="relative w-64 h-64 mb-8 animate-float delay-300">
                            <Image
                                src="/elysian_empty_workflow.png"
                                alt="Workflow Automation"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10" />
                        </div>

                        <div className="max-w-md space-y-4">
                            <h1 className="text-2xl font-bold text-slate-900">Otomatisasi Workflow</h1>
                            <p className="text-slate-500">
                                Buat alur kerja otomatis untuk persetujuan dokumen, notifikasi, dan integrasi antar sistem tanpa coding.
                            </p>
                            <Button
                                onClick={handleCreateWorkflow}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 shadow-lg shadow-blue-500/25 group"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Buat Workflow Baru
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Active Workflow List (Mock)
                    <div className="container max-w-6xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Workflow Aktif</h1>
                                <p className="text-slate-500">Kelola dan pantau otomatisasi Anda.</p>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Workflow Baru
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <GitMerge className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">Approval Dokumen Invoice {i}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Berjalan setiap hari</span>
                                                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> 120 Eksekusi sukses</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-sm font-medium text-green-600">Aktif</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Protected>
    );
}
