import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from '@/ui/primitives/table';
import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button'; // Assuming button primitive exists
import { Download, ExternalLink, Filter, TrendingUp } from 'lucide-react';

interface LedgerEntry {
    id: string;
    date: string;
    description: string;
    amount: string;
    amountVal: number;
    category: string;
    status: 'posted' | 'pending' | 'flagged';
    sourceDocId: string;
}

const SAMPLE_ENTRIES: LedgerEntry[] = [
    {
        id: 'LDG-2024-891',
        date: '14 Jan 2024',
        description: 'Infrastruktur Server (AWS)',
        amount: '- Rp 4.500.000',
        amountVal: -4500000,
        category: 'Teknologi',
        status: 'posted',
        sourceDocId: 'src-101'
    },
    {
        id: 'LDG-2024-892',
        date: '14 Jan 2024',
        description: 'Pembayaran Klien - Project Beta',
        amount: '+ Rp 25.000.000',
        amountVal: 25000000,
        category: 'Pendapatan',
        status: 'pending',
        sourceDocId: 'src-103'
    },
    {
        id: 'LDG-2024-893',
        date: '13 Jan 2024',
        description: 'ATK Kantor (Bulk)',
        amount: '- Rp 1.250.000',
        amountVal: -1250000,
        category: 'Operasional',
        status: 'flagged',
        sourceDocId: 'src-99'
    },
    {
        id: 'LDG-2024-894',
        date: '12 Jan 2024',
        description: 'Lisensi Software Tahunan',
        amount: '- Rp 12.000.000',
        amountVal: -12000000,
        category: 'Teknologi',
        status: 'posted',
        sourceDocId: 'src-98'
    }
];

export const LedgerView = () => {
    const totalBalance = SAMPLE_ENTRIES.reduce((acc, curr) => acc + curr.amountVal, 0);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Sticky Header with Controls */}
            <div className="sticky top-0 z-20 p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-sm">Buku Besar Umum</h2>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Januari 2024</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                        <Download className="w-3.5 h-3.5" />
                        Ekspor
                    </Button>
                </div>
            </div>

            <div className="relative overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                            <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sumber</TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Jumlah</TableHead>
                            <TableHead className="text-right w-[100px] text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SAMPLE_ENTRIES.map((entry) => (
                            <TableRow key={entry.id} className="hover:bg-blue-50/30 transition-colors border-slate-50 group cursor-pointer">
                                <TableCell className="text-sm text-slate-500 font-mono py-3">{entry.date}</TableCell>
                                <TableCell className="font-medium text-slate-700 py-3">{entry.description}</TableCell>
                                <TableCell py-3>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {entry.category}
                                    </span>
                                </TableCell>
                                <TableCell py-3>
                                    <div className="text-xs text-blue-600 hover:underline cursor-pointer font-mono">
                                        {entry.sourceDocId}
                                    </div>
                                </TableCell>

                                <TableCell className={`text-right font-mono font-bold py-3 ${entry.amount.startsWith('+') ? 'text-emerald-700' : 'text-slate-900'}`}>
                                    {entry.amount}
                                </TableCell>
                                <TableCell className="text-right py-3">
                                    <div className="flex justify-end">
                                        <Badge
                                            variant="outline"
                                            className={`
                                                font-normal text-[10px] uppercase border-0
                                                ${entry.status === 'posted' ? 'bg-emerald-100 text-emerald-700' :
                                                    entry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'}
                                            `}
                                        >
                                            {entry.status}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell py-3>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 group-hover:text-blue-600 transition-colors">
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className="bg-slate-50 border-t border-slate-200">
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-medium text-slate-500">Total Periode Ini</TableCell>
                            <TableCell className="text-right font-mono font-bold text-slate-900 text-base">
                                + Rp {(totalBalance).toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell colSpan={2} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};
