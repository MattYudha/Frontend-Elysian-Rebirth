
import { RagSource } from '@/lib/apiClient';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent } from '@/ui/primitives/card';
import { Badge } from '@/ui/primitives/badge';
import { Check, X, Eye, FileText, ArrowLeftRight } from 'lucide-react';
import React from 'react';

interface ReviewQueueProps {
    items: RagSource[];
    onReview: (id: string, action: 'approve' | 'reject') => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({ items, onReview }) => {
    if (items.length === 0) return null;

    return (
        <div className="mb-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header with Urgency */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-bold ring-4 ring-amber-50">
                        {items.length}
                    </span>
                    Butuh Review
                </h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">High Priority</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="group border border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
                        <CardContent className="p-0 flex flex-col h-full">
                            {/* Card Header */}
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm text-amber-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 truncate max-w-[200px]" title={item.name}>
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] bg-white border-amber-200 text-amber-700 h-5 px-1.5">
                                                {(item.confidenceScore * 100).toFixed(0)}% Match
                                            </Badge>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(item.uploadedAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-blue-600">
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Split Comparison View */}
                            <div className="flex-1 grid grid-cols-2 divide-x divide-slate-100">
                                {/* Extracted (Raw) */}
                                <div className="p-4 bg-slate-50/30">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Ditemukan (OCR)</span>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-slate-500 block">Total</span>
                                            <span className="text-sm font-mono text-slate-700 decoration-wavy underline decoration-amber-300">Rp 100.000</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 block">Tanggal</span>
                                            <span className="text-sm text-slate-700">14/01/24</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Predicted (Corrector) */}
                                <div className="p-4 bg-white relative">
                                    <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10 text-slate-400">
                                        <ArrowLeftRight className="w-3 h-3" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-2 block">Prediksi AI</span>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-blue-400 block">Total</span>
                                            <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-1 rounded">Rp 1.000.000</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-blue-400 block">Tanggal</span>
                                            <span className="text-sm text-blue-700 font-medium">14 Jan 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-3 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 font-medium transition-colors"
                                    onClick={() => onReview(item.id, 'reject')}
                                >
                                    <X className="w-3.5 h-3.5 mr-2" />
                                    Tolak
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-slate-900 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg transition-all duration-300"
                                    onClick={() => onReview(item.id, 'approve')}
                                >
                                    <Check className="w-3.5 h-3.5 mr-2" />
                                    Setuju
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
