'use client';

import React, { useState } from 'react';
import { MapPin, ShieldAlert, Loader2, Database, CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

interface HeatmapItem {
    region: string;
    flagged_count: number;
    total_markup: number;
}

interface RegionalHeatmapProps {
    data?: HeatmapItem[];
    isLoading?: boolean;
}

interface RegionDetailItem {
    task_id: string;
    document_title: string;
    item_name: string;
    requested_price: number;
    max_price: number;
    qty: number;
    region: string;
    nemesis_max_price: number;
    nemesis_category: string;
    nemesis_specs: string;
    waste_potential: number;
}

export function RegionalHeatmap({ data = [], isLoading }: RegionalHeatmapProps) {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [details, setDetails] = useState<RegionDetailItem[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    if (isLoading) {
        return <Skeleton className="h-[280px] w-full rounded-2xl" />;
    }

    const isEmpty = !data || data.length === 0;

    // Find the max total markup for relative width scaling
    const maxMarkup = isEmpty ? 0 : Math.max(...data.map(item => item.total_markup));

    const handleRegionClick = async (regionName: string) => {
        setSelectedRegion(regionName);
        setIsModalOpen(true);
        setLoadingDetails(true);
        setDetails([]);
        try {
            const res = await fetch(`/api/proxy/dashboard/regions/details?region=${encodeURIComponent(regionName)}`);
            if (res.ok) {
                const json = await res.json();
                setDetails(json.data || []);
            } else {
                console.error("Failed to fetch region details");
            }
        } catch (err) {
            console.error("Error fetching region details:", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="rounded-2xl p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-blue-100/50 dark:border-blue-900/30 shadow-sm glass-obsidian">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50 tracking-tight">Regional Anomali Harga Kop-Mart</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Wilayah dengan anggaran melebihi Indeks Harga Wajar Kop-Mart — data real dari audit AI
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!isLoading && !isEmpty && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            LIVE DB
                        </span>
                    )}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
                        <MapPin className="h-4 w-4" />
                    </div>
                </div>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-[180px] gap-3 text-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <ShieldAlert className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak Ada Pelanggaran Anggaran</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[260px] leading-relaxed">
                            Belum ada item dengan status FLAGGED di database. Jalankan Swarm Review pada dokumen untuk menghasilkan data audit.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                    {data.map((item, index) => {
                        const relativePercentage = maxMarkup > 0 ? (item.total_markup / maxMarkup) * 100 : 0;
                        return (
                            <div 
                                key={index} 
                                onClick={() => handleRegionClick(item.region)}
                                className="group relative h-12 w-full rounded-xl overflow-hidden border border-slate-750 dark:border-blue-950 bg-slate-800/90 dark:bg-[#0c1322] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-900/50"
                            >
                                {/* Horizontal Bar (Soft Blue) */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-[#5c82d6] dark:bg-[#4a6bba] transition-all duration-1000" 
                                    style={{ width: `${relativePercentage}%` }}
                                />

                                {/* Overlaid Content */}
                                <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white/60 dark:text-white/40 w-5">#{index + 1}</span>
                                        <p className="text-sm font-semibold text-white drop-shadow-sm truncate max-w-[280px]">
                                            {item.region}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <p className="text-sm font-bold text-white drop-shadow-sm font-mono">
                                            Rp {item.total_markup.toLocaleString('id-ID')}
                                        </p>
                                        <Badge 
                                            variant="outline" 
                                            className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-white/20 dark:bg-slate-950/40 text-white border-white/30 whitespace-nowrap"
                                        >
                                            {item.flagged_count} markups
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Region Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl bg-white dark:bg-[#0B1224] text-slate-900 dark:text-slate-50 border-slate-200/80 dark:border-blue-950/60 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] backdrop-blur-2xl no-scrollbar transition-all duration-300">
                    <DialogHeader className="pb-4 border-b border-slate-100 dark:border-blue-950/40">
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400 tracking-tight">
                            <MapPin className="h-5 w-5 text-blue-500 animate-pulse" />
                            Detail Anomali Harga: {selectedRegion}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-xs font-medium mt-1">
                            <Database className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                            Cross-referenced with Kop-Mart Ground Truth Database
                        </DialogDescription>
                    </DialogHeader>

                    {loadingDetails ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Querying Kop-Mart price database...</p>
                        </div>
                    ) : details.length === 0 ? (
                        <div className="text-center py-16 text-slate-400 text-sm font-medium">
                            No active anomalies flagged in this region.
                        </div>
                    ) : (
                        <div className="mt-6 space-y-8">
                            {/* Summary Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-blue-950/30 flex items-center justify-between shadow-sm">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Items Flagged</span>
                                        <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
                                            {details.reduce((acc, curr) => acc + curr.qty, 0)} Units
                                        </p>
                                    </div>
                                    <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Package className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-blue-950/30 flex items-center justify-between shadow-sm">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kop-Mart Compliance</span>
                                        <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                                            Active Audit
                                        </p>
                                    </div>
                                    <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="bg-rose-500/5 dark:bg-rose-950/10 p-4 rounded-xl border border-rose-500/10 dark:border-rose-950/20 flex items-center justify-between shadow-sm">
                                    <div>
                                        <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider block">Total Potensi Kerugian</span>
                                        <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono">
                                            Rp {details.reduce((acc, curr) => acc + curr.waste_potential, 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="p-2.5 bg-rose-500/10 dark:bg-rose-950/20 rounded-xl text-rose-600 dark:text-rose-400">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="rounded-2xl border border-slate-100 dark:border-blue-950/30 bg-slate-50/30 dark:bg-slate-900/20 p-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Database className="h-4 w-4 text-blue-500" />
                                        Requested vs Kop-Mart standard limit comparison
                                    </h4>
                                    
                                    {/* Custom Soft Elysian Legend */}
                                    <div className="flex items-center gap-4 text-xs font-semibold">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-indigo-400 dark:bg-indigo-500 shadow-sm" />
                                            <span className="text-slate-600 dark:text-slate-300">Requested Price</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-[#5c82d6] shadow-sm" />
                                            <span className="text-slate-600 dark:text-slate-300">Kop-Mart Price Limit</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-[260px] min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={details.map((item) => {
                                                const cleanDoc = item.document_title
                                                    .replace(/\.(pdf|xlsx|csv)$/i, '')
                                                    .replace(/^(draft|test|swarm)-/i, '');
                                                const docSuffix = cleanDoc.length > 10 ? `${cleanDoc.substring(0, 8)}...` : cleanDoc;
                                                const displayName = item.item_name.length > 15 ? `${item.item_name.substring(0, 12)}...` : item.item_name;
                                                return {
                                                    name: `${displayName} (${docSuffix})`,
                                                    fullName: item.item_name,
                                                    'Requested Price': item.requested_price,
                                                    'Nemesis Max Price': item.nemesis_max_price,
                                                    'Waste Potential': item.waste_potential,
                                                    qty: item.qty,
                                                    doc: item.document_title,
                                                };
                                            })} 
                                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                            barGap={6}
                                        >
                                            <defs>
                                                <linearGradient id="requestedGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.9} />
                                                </linearGradient>
                                                <linearGradient id="nemesisGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#5c82d6" stopOpacity={0.9} />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.1} />
                                            <XAxis 
                                                dataKey="name" 
                                                tickLine={false} 
                                                axisLine={false} 
                                                fontSize={10} 
                                                tick={{ fill: '#94a3b8', fontWeight: 600 }} 
                                            />
                                            <YAxis 
                                                tickLine={false} 
                                                axisLine={false} 
                                                fontSize={10} 
                                                tick={{ fill: '#94a3b8', fontWeight: 600 }}
                                                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(148, 163, 184, 0.05)', radius: 4 }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-2.5 backdrop-blur-md max-w-sm">
                                                                <p className="font-bold tracking-tight text-white border-b border-white/10 pb-1.5">{data.fullName}</p>
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center justify-between gap-6 text-slate-300">
                                                                        <span>Quantity:</span>
                                                                        <span className="font-bold text-white font-mono">{data.qty} Units</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between gap-6 text-indigo-300">
                                                                        <span>Requested:</span>
                                                                        <span className="font-bold font-mono">Rp {data['Requested Price'].toLocaleString('id-ID')}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between gap-6 text-blue-300">
                                                                        <span>Kop-Mart Limit:</span>
                                                                        <span className="font-bold font-mono">Rp {data['Nemesis Max Price'].toLocaleString('id-ID')}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between gap-6 text-rose-400 font-bold border-t border-white/10 pt-1.5 mt-1.5">
                                                                        <span>Potensi Kerugian:</span>
                                                                        <span className="font-mono text-rose-400">Rp {data['Waste Potential'].toLocaleString('id-ID')}</span>
                                                                    </div>
                                                                </div>
                                                                {data.doc && (
                                                                    <p className="text-[10px] text-slate-400 italic pt-1 border-t border-white/5 truncate max-w-[240px]">Doc: {data.doc}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="Requested Price" fill="url(#requestedGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                                            <Bar dataKey="Nemesis Max Price" fill="url(#nemesisGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Itemized Ledger Table */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-500" />
                                    Anomalous Itemized Ledger
                                </h4>
                                <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-blue-950/40 shadow-sm bg-white dark:bg-[#0c1322]">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead>
                                                <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-blue-950/40 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                                    <th className="p-3">Item Details</th>
                                                    <th className="p-3 text-center">Qty</th>
                                                    <th className="p-3 text-right">Requested (Unit)</th>
                                                    <th className="p-3 text-right">Kop-Mart Limit (Unit)</th>
                                                    <th className="p-3 text-right">Potensi Kerugian</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-blue-950/20">
                                                {details.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-700 dark:text-slate-300 transition-colors">
                                                        <td className="p-3 max-w-[280px]">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.item_name}</div>
                                                            <div className="text-[10px] text-slate-400 mt-0.5 truncate" title={item.document_title}>
                                                                {item.document_title}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                                                            {item.qty}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-300">
                                                            Rp {item.requested_price.toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">
                                                            Rp {item.nemesis_max_price.toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-rose-600 dark:text-rose-400 font-extrabold">
                                                            Rp {item.waste_potential.toLocaleString('id-ID')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
