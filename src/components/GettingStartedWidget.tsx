import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Progress } from '@/ui/progress';

export function GettingStartedWidget() {
    return (
        <div className="pb-2">
            <Link href="/getting-started" className="block relative group">
                {/* Light Elysian Glass Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-md rounded-xl shadow-sm border border-blue-100/50 group-hover:shadow-md transition-all duration-300" />

                {/* Content */}
                <div className="relative p-3.5 rounded-xl transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1 rounded bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 ring-1 ring-blue-200/50 shadow-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-bold text-slate-700 text-sm tracking-tight group-hover:text-blue-700 transition-colors">Panduan Memulai</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>

                    <div className="space-y-2">
                        <Progress
                            value={20}
                            className="h-1.5 bg-slate-100 shadow-inner ring-1 ring-slate-100"
                            indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        />
                        <div className="flex justify-between items-center text-[10px] font-medium">
                            <span className="text-slate-500">Progress Anda</span>
                            <span className="text-blue-600 font-bold">1/5 Selesai</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
