import { Button } from '@/components/ui/';
import { UploadCloud } from 'lucide-react';
import React from 'react';
import type { PipelineStats } from '@/lib/sdk/schemas';

interface ValueDashboardProps {
    stats: PipelineStats;
    onUpload?: () => void;
}

export const ValueDashboard: React.FC<ValueDashboardProps> = ({ stats, onUpload }) => {
    return (
        <div className="relative overflow-hidden rounded-[24px] shadow-xl shadow-blue-200/40 group">
            {/* Background with Cloud Image & Light Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-50 z-0" />
            <div
                className="absolute inset-0 opacity-40 mix-blend-overlay z-0 bg-center bg-cover"
                style={{ backgroundImage: 'url(/assets/images/elysian_clouds.png)' }}
            />
            {/* White Glass Overlay for Readability */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0" />

            {/* Decorative Shine */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white blur-[80px] rounded-full opacity-60 z-0 mix-blend-soft-light" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8">
                <div className="space-y-4 max-w-2xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-xs font-bold tracking-wide text-blue-600 uppercase shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Minggu Ini
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-slate-800">
                        Hemat <span className="text-blue-600">Rp {(stats.moneySavedTotal / 1000000).toFixed(1)}jt</span> & <span className="text-blue-600">{stats.timeSavedTotalHrs} jam</span>
                    </h1>

                    <p className="text-slate-600 text-lg font-medium max-w-xl mx-auto md:mx-0">
                        Pipeline otomatis bekerja 24/7. Anda hanya perlu me-review 2% dokumen.
                    </p>
                </div>

                {/* Primary Action - High Contrast Button */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                    <Button
                        onClick={onUpload}
                        className="h-14 px-8 rounded-full bg-[#176BFF] text-white hover:bg-blue-700 font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 group ring-4 ring-white/50"
                    >
                        <UploadCloud className="mr-2.5 w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        Upload Dokumen
                    </Button>
                    <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                        Drag & drop supported
                    </div>
                </div>
            </div>
        </div>
    );
};
