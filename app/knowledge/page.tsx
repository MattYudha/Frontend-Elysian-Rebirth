'use client';

import { Protected } from '@/components/Protected';
import { ValueDashboard } from '@/components/knowledge/modern/ValueDashboard';
import { KnowledgeLayout } from '@/components/knowledge/modern/KnowledgeLayout';
import { SourceCard } from '@/components/knowledge/modern/SourceCard';
import { WorkloadHub } from '@/components/knowledge/modern/WorkloadHub';
import { LedgerView } from '@/components/knowledge/modern/LedgerView';
import { ReviewQueue } from '@/components/knowledge/modern/ReviewQueue';
import { RagSource, apiClient, PipelineStats } from '@/lib/apiClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function KnowledgeBasePage() {
    const [sources, setSources] = useState<RagSource[]>([]);
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState("pipeline");

    // Load Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sourceData, statsData] = await Promise.all([
                    apiClient.getRagSources(),
                    apiClient.getPipelineStats()
                ]);
                setSources(sourceData);
                setStats(statsData);
            } catch (error) {
                toast.error('Gagal memuat data enterprise');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handlers
    const handleUpload = () => toast.success('Upload disimulasikan!');
    const handleReview = (id: string, action: 'approve' | 'reject') => {
        toast.success(`Dokumen ${action === 'approve' ? 'disetujui' : 'ditolak'}`);
        setSources(prev => prev.map(s => s.id === id ? { ...s, executionStatus: 'executed', confidenceScore: 1 } : s));
    };
    const handleDelete = (id: string) => {
        setSources(prev => prev.filter(s => s.id !== id));
        toast.success('Dokumen dihapus');
    };

    // derived state
    const reviewItems = sources.filter(s => s.executionStatus === 'pending_review' || s.confidenceScore < 0.8);
    const pipelineItems = sources.filter(s => !reviewItems.includes(s));

    return (
        <Protected>
            <div className="light">
                <KnowledgeLayout
                    // Hero Section
                    hero={
                        <div className="flex flex-col gap-6">
                            {/* 1. Value Hero */}
                            {stats && <ValueDashboard stats={stats} onUpload={handleUpload} />}

                            {/* 2. KPI Chips (Directly under Hero) */}
                            {stats && <WorkloadHub stats={stats} />}
                        </div>
                    }
                >
                    {/* 3. Tabs & Content */}
                    <Tabs defaultValue="pipeline" className="w-full space-y-6" onValueChange={setActiveTab}>
                        {/* Clean Tab List - Close to Hero */}
                        <TabsList className="grid w-full grid-cols-3 max-w-[400px] bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="pipeline" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium">Pipeline</TabsTrigger>
                            <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm font-medium">
                                Review
                                {reviewItems.length > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full font-bold">{reviewItems.length}</span>}
                            </TabsTrigger>
                            <TabsTrigger value="ledger" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm font-medium">Buku Besar</TabsTrigger>
                        </TabsList>

                        {/* Tab: Pipeline (Ingest & Process) */}
                        <TabsContent value="pipeline" className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                        Dokumen Aktif
                                    </h3>
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline">Lihat Semua</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {isLoading ? [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-100/80 rounded-2xl animate-pulse" />) :
                                        pipelineItems.map((source) => (
                                            <SourceCard key={source.id} source={source} onDelete={handleDelete} />
                                        ))
                                    }
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab: Review (Human Loop) */}
                        <TabsContent value="review" className="animate-in slide-in-from-bottom-2 duration-300">
                            <ReviewQueue items={reviewItems} onReview={handleReview} />
                            {reviewItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                    <div className="p-4 bg-white rounded-full mb-3 shadow-sm">
                                        <span className="text-2xl">🎉</span>
                                    </div>
                                    <p className="font-medium">Semua beres! Tidak ada dokumen yang perlu direview.</p>
                                    <p className="text-sm text-slate-400 mt-1">Sistem berjalan dengan akurasi 100% hari ini.</p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Tab: Ledger (Results) */}
                        <TabsContent value="ledger" className="animate-in slide-in-from-bottom-2 duration-300">
                            <LedgerView />
                        </TabsContent>
                    </Tabs>
                </KnowledgeLayout>
            </div>
        </Protected>
    );
}
