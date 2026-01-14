'use client';

import { Protected } from '@/components/Protected';
import Image from 'next/image';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/primitives/input';
import { BookOpen, Search, FileText, ChevronRight, Zap, Code, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { KnowledgeSkeleton } from '@/components/LoadingSkeletons';

export default function KnowledgeBasePage() {
    const [isExploring, setIsExploring] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        { title: 'Memulai', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', count: '5 Artikel' },
        { title: 'Dokumentasi Teknis', icon: Code, color: 'text-blue-500', bg: 'bg-blue-50', count: '12 Artikel' },
        { title: 'Billing & Akun', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50', count: '8 Artikel' },
        { title: 'Panduan Ekspor', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', count: '4 Artikel' },
    ];

    const recentArticles = [
        'Cara mengupload dokumen pertama Anda',
        'Mengintegrasikan API Elysian dengan NodeJS',
        'Memahami format data hasil ekspor Excel',
        'Cara upgrade paket enterprise',
    ];

    useEffect(() => {
        const lastActive = localStorage.getItem('elysian_knowledge_last_active');
        if (lastActive) {
            const timeDiff = Date.now() - parseInt(lastActive, 10);
            if (timeDiff < 86400000) { // 24 hours
                setIsExploring(true);
            }
        }
        // Artificial delay for skeleton demo
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const handleExplore = () => {
        setIsExploring(true);
        localStorage.setItem('elysian_knowledge_last_active', Date.now().toString());
    };

    if (isLoading) return <KnowledgeSkeleton />;

    return (
        <Protected>
            <div className="flex flex-col h-[calc(100vh-6rem)]">
                {!isExploring ? (
                    // Landing / Empty State
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                        <div className="relative w-64 h-64 mb-8 animate-float delay-100">
                            <Image
                                src="/elysian_empty_knowledge.png"
                                alt="Knowledge Base"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10" />
                        </div>

                        <div className="max-w-md space-y-4">
                            <h1 className="text-2xl font-bold text-slate-900">Pusat Pengetahuan</h1>
                            <p className="text-slate-500">
                                Akses ribuan artikel, panduan, dan dokumentasi teknis untuk memaksimalkan penggunaan platform Elysian.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={handleExplore}
                                    variant="outline"
                                    className="rounded-full px-6 py-6 border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari Panduan
                                </Button>
                                <Button
                                    onClick={handleExplore}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-6 shadow-lg shadow-blue-500/25"
                                >
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Jelajahi Topik
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Functional Knowledge Base Dashboard
                    <div className="container max-w-6xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                        {/* Header & Search */}
                        <div className="text-center space-y-4 py-8">
                            <h1 className="text-3xl font-bold text-slate-900">Bagaimana kami bisa membantu?</h1>
                            <div className="max-w-2xl mx-auto relative">
                                <Input
                                    placeholder="Cari artikel, topik, atau kata kunci..."
                                    className="pl-12 py-6 rounded-full shadow-sm text-lg"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Categories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat, idx) => (
                                <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
                                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                        <div className={`p-4 rounded-full ${cat.bg}`}>
                                            <cat.icon className={`h-8 w-8 ${cat.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{cat.title}</h3>
                                            <p className="text-xs text-slate-500">{cat.count}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Articles & Help Box */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Artikel Populer</h2>
                                <div className="space-y-3">
                                    {recentArticles.map((article, idx) => (
                                        <div key={idx} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white text-slate-400 group-hover:text-blue-500">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <span className="text-slate-700 font-medium group-hover:text-blue-700">{article}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Butuh Bantuan Lebih?</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-blue-100 text-sm">
                                            Tim support kami siap membantu Anda 24/7 jika Anda tidak menemukan jawaban yang Anda cari.
                                        </p>
                                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                                            Hubungi Support
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Protected>
    );
}
