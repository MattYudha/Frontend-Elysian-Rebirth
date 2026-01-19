import { Button } from '@/components/ui/';
import { Sparkles, ArrowRight } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export const InsightHero = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white/40 backdrop-blur-xl shadow-lg p-6 sm:p-8 group">
            {/* Abstract Background Shapes (Liquid Glass Effect) */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-700" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl group-hover:bg-indigo-400/30 transition-all duration-700" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-200">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                            Recent Insight
                        </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-tight">
                        The <span className="text-blue-600">Revenue Analysis</span> document
                        highlights a 15% increase in Q3, primarily driven by the enterprise
                        sector.
                    </h2>

                    <p className="text-sm text-slate-500">
                        Generated from <strong>financial_report_q3.pdf</strong> • 2 mins ago
                    </p>
                </div>

                <Button
                    className={cn(
                        'bg-blue-600/90 hover:bg-blue-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-blue-500/20',
                        'transition-all duration-300 hover:scale-105 active:scale-95'
                    )}
                >
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
