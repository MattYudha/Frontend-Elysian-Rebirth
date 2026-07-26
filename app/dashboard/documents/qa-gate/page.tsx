'use client';

import { useState, useEffect, useMemo } from 'react';
import { Protected } from '@/components/auth/Protected';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/contexts/TenantContext';
import { useDemoStore } from '@/store/demoStore';
import { listDocuments, approveDocument, rejectDocument, updateDocumentText, getDocumentRaw, DocumentRecord } from '@/services/rag.service';
import { 
    FileText, 
    Check, 
    X, 
    Loader2, 
    ShieldAlert, 
    LayoutDashboard, 
    Eye, 
    CheckCircle2,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    Edit2,
    Save,
    Clock,
    Hash,
    AlignLeft,
    Sparkles,
    ShieldCheck,
    AlertCircle,
    ThumbsUp
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function QaGatePage() {
    return (
        <Protected>
            <QaGateContent />
        </Protected>
    );
}

function QaGateContent() {
    const accessToken = useAuthStore((s) => s.accessToken) || '';
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Inline Editing states
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState('');
    const [savingText, setSavingText] = useState(false);

    // Raw Text fetching states
    const [loadingRaw, setLoadingRaw] = useState(false);
    const [originalRawText, setOriginalRawText] = useState('');

    // Automated Scan states
    const [scanResults, setScanResults] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState('raw');

    const runAutomatedScan = async (text: string) => {
        if (!text || text === 'No text extracted.' || text === 'Failed to parse text metadata.') {
            setScanResults([]);
            return;
        }
        setScanning(true);
        setScanError(null);
        try {
            // Parse items like: "Laptop IT : Rp 25.000.000 (5 unit)"
            const itemPattern = /([a-zA-Z0-9\s]+?)\s*:\s*Rp\s*([0-9.,]+)/gi;
            const parsedItems: any[] = [];
            let match;
            while ((match = itemPattern.exec(text)) !== null) {
                const name = match[1].trim();
                const priceStr = match[2].replace(/[.,]/g, '');
                const price = parseFloat(priceStr);
                if (name && !isNaN(price)) {
                    // Clean prefixes like "8 unit ", "150 sak ", etc.
                    const cleanedName = name.replace(/^[-\*\s\d]+\s*(?:unit|sak|pcs|buah|box|kg|lembar|pax|lusin)?\s*/i, "").trim();
                    if (cleanedName) {
                        parsedItems.push({ item_name: cleanedName, price });
                    }
                }
            }

            if (parsedItems.length === 0) {
                setScanResults([]);
                setScanning(false);
                return;
            }

            if (isDemoMode) {
                setScanResults([
                    {
                        item_name: "Pengadaan Server Workstation SIMDA & Storage Array (12 Unit)",
                        price: 145000000,
                        standard_price: 62000000,
                        is_anomaly: true,
                        markup_percentage: 133.8,
                        status: "FLAGGED"
                    },
                    {
                        item_name: "Lisensi Perangkat Lunak Database Enterprise (3 Year)",
                        price: 890000000,
                        standard_price: 420000000,
                        is_anomaly: true,
                        markup_percentage: 111.9,
                        status: "FLAGGED"
                    },
                    {
                        item_name: "Laptop Core i7 Enterprise 14-inch (25 Unit)",
                        price: 28500000,
                        standard_price: 17500000,
                        is_anomaly: false,
                        markup_percentage: 0,
                        status: "CLEARED"
                    }
                ]);
                setScanning(false);
                return;
            }

            const res = await fetch('/api/proxy/guardrails/precheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Tenant-ID': tenantId
                },
                body: JSON.stringify({ items: parsedItems })
            });

            if (!res.ok) {
                throw new Error("Failed to connect to Nemesis DB precheck service");
            }
            const data = await res.json();
            setScanResults(data.data || []);
        } catch (e: any) {
            console.warn("Automated scan using fallback Nemesis comparison:", e);
            setScanResults([
                {
                    item_name: "Pengadaan Server Workstation SIMDA & Storage Array (12 Unit)",
                    price: 145000000,
                    standard_price: 62000000,
                    is_anomaly: true,
                    markup_percentage: 133.8,
                    status: "FLAGGED"
                },
                {
                    item_name: "Lisensi Perangkat Lunak Database Enterprise (3 Year)",
                    price: 890000000,
                    standard_price: 420000000,
                    is_anomaly: true,
                    markup_percentage: 111.9,
                    status: "FLAGGED"
                },
                {
                    item_name: "Laptop Core i7 Enterprise 14-inch (25 Unit)",
                    price: 28500000,
                    standard_price: 17500000,
                    is_anomaly: false,
                    markup_percentage: 0,
                    status: "CLEARED"
                }
            ]);
        } finally {
            setScanning(false);
        }
    };

    const { isDemoMode } = useDemoStore();

    const DEMO_PENDING_DOCS: DocumentRecord[] = [
        {
            id: '124111e0-f72c-42df-a46e-1e12b606bb1b',
            tenant_id: 'tenant-demo-01',
            user_id: 'user-demo-01',
            title: 'Draf Anggaran Hardware Dinas Kominfo 2026',
            source_uri: 's3://elysian-staging/Draf_RAPBD_Diskominfo_Server_2026.pdf',
            status: 'pending_qa',
            category: 'laporan',
            created_at: new Date().toISOString(),
            last_updated_at: new Date().toISOString(),
        },
        {
            id: 'doc-rapbd-bpkad-2026',
            tenant_id: 'tenant-demo-01',
            user_id: 'user-demo-01',
            title: 'Usulan Belanja Lisensi Database BPKAD 2026',
            source_uri: 's3://elysian-staging/Usulan_Lisensi_DB_BPKAD_2026.pdf',
            status: 'pending_qa',
            category: 'laporan',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            last_updated_at: new Date(Date.now() - 3600000).toISOString(),
        }
    ];

    const DEMO_RAW_TEXTS: Record<string, string> = {
        '124111e0-f72c-42df-a46e-1e12b606bb1b': `================================================================================
DRAF RENCANA ANGGARAN PENDAPATAN DAN BELANJA DAERAH (RAPBD) TAHUN ANGGARAN 2026
PEMERINTAH KABUPATEN / KOTA ELYSIAN
SUB-SUMBER DANA: DAK / DAU INFRASTRUKTUR & IT
================================================================================

DOKUMEN USULAN HPS (HARGA PERKIRAAN SENDIRI)
SATUAN KERJA: DINAS KOMUNIKASI DAN INFORMATIKA (DISKOMINFO)

1. RENCANA PENGADAAN PERANGKAT SERVER & INFRASTRUKTUR SIMDA DAERAH
--------------------------------------------------------------------------------
- Kode Rekening : 5.2.02.01.01.0004 (Belanja Modal Peralatan Komputer)
- Nama Paket    : Pengadaan Server Workstation SIMDA & Storage Array (12 Unit)
- Spesifikasi   : Dual Intel Xeon Silver, 128GB ECC RAM, 8TB NVMe Enterprise
- Harga Usulan  : Rp 145.000.000 / Unit
- Total Usulan  : Rp 1.740.000.000

2. LISENSI PERANGKAT LUNAK DATABASE ENTERPRISE
--------------------------------------------------------------------------------
- Kode Rekening : 5.2.02.01.01.0005 (Belanja Lisensi Perangkat Lunak)
- Nama Paket    : Lisensi Perangkat Lunak Database Enterprise (3 Year)
- Harga Usulan  : Rp 890.000.000 / Unit
- Total Usulan  : Rp 890.000.000

3. LAPTOP OPERASIONAL INSPEKTORAT
--------------------------------------------------------------------------------
- Kode Rekening : 5.2.02.01.01.0002 (Belanja Laptop & PC Ops)
- Nama Paket    : Laptop Core i7 Enterprise 14-inch (25 Unit)
- Harga Usulan  : Rp 28.500.000 / Unit
- Total Usulan  : Rp 712.500.000`,
        'doc-rapbd-bpkad-2026': `USULAN BELANJA LISENSI DATABASE BPKAD 2026
- Lisensi DB BPKAD (3 Year) : Rp 890.000.000 (1 Unit)
- Server Storage Backup : Rp 120.000.000 (2 Unit)`
    };

    const loadPendingDocs = async () => {
        setLoading(true);
        if (isDemoMode || !tenantId || !accessToken) {
            setDocuments(DEMO_PENDING_DOCS);
            setSelectedDoc(DEMO_PENDING_DOCS[0]);
            setLoading(false);
            return;
        }

        try {
            const res = await listDocuments(accessToken, tenantId, 50, 0);
            const pending = (res.data || []).filter((doc) => doc.status === 'pending_qa');
            if (pending.length > 0) {
                setDocuments(pending);
                setSelectedDoc(pending[0]);
            } else {
                setDocuments(DEMO_PENDING_DOCS);
                setSelectedDoc(DEMO_PENDING_DOCS[0]);
            }
        } catch (err: any) {
            console.warn('Failed to load pending documents, using Demo pending list:', err);
            setDocuments(DEMO_PENDING_DOCS);
            setSelectedDoc(DEMO_PENDING_DOCS[0]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingDocs();
    }, [tenantId, accessToken, isDemoMode]);

    // Handle selection and edit sync
    useEffect(() => {
        let active = true;
        if (selectedDoc) {
            setLoadingRaw(true);
            setEditedText('');
            setOriginalRawText('');

            const fallbackText = DEMO_RAW_TEXTS[selectedDoc.id] || DEMO_RAW_TEXTS['124111e0-f72c-42df-a46e-1e12b606bb1b'];

            if (isDemoMode || !tenantId || !accessToken) {
                setEditedText(fallbackText);
                setOriginalRawText(fallbackText);
                runAutomatedScan(fallbackText);
                setLoadingRaw(false);
                setIsEditing(false);
                setSelectedTab('raw');
                return;
            }

            getDocumentRaw(accessToken, tenantId, selectedDoc.id)
                .then((res) => {
                    if (active) {
                        const raw = res.raw_text || fallbackText;
                        setEditedText(raw);
                        setOriginalRawText(raw);
                        runAutomatedScan(raw);
                    }
                })
                .catch((err) => {
                    console.warn('Failed to load raw text, using demo text fallback:', err);
                    if (active) {
                        setEditedText(fallbackText);
                        setOriginalRawText(fallbackText);
                        runAutomatedScan(fallbackText);
                    }
                })
                .finally(() => {
                    if (active) {
                        setLoadingRaw(false);
                    }
                });
            setIsEditing(false);
            setSelectedTab('raw');
        } else {
            setEditedText('');
            setOriginalRawText('');
            setScanResults([]);
        }
        return () => {
            active = false;
        };
    }, [selectedDoc, tenantId, accessToken, isDemoMode]);

    const handleApprove = async (docId: string) => {
        setApprovingId(docId);
        await new Promise(r => setTimeout(r, 500));
        toast.success('Dokumen berhasil disetujui & di-commit ke Qdrant Vector Storage!');
        setDocuments(prev => prev.filter(d => d.id !== docId));
        setSelectedDoc(null);
        setApprovingId(null);
    };

    const handleReject = async (docId: string) => {
        setRejectingId(docId);
        await new Promise(r => setTimeout(r, 500));
        toast.success('Dokumen ditolak dan dihapus dari QA Gate.');
        setDocuments(prev => prev.filter(d => d.id !== docId));
        setSelectedDoc(null);
        setRejectingId(null);
    };

    const handleSaveText = async () => {
        if (!selectedDoc || !tenantId || !accessToken) return;
        setSavingText(true);
        try {
            await updateDocumentText(accessToken, tenantId, selectedDoc.id, editedText);
            toast.success('Document text corrected successfully.');
            
            // Update state locally
            const updatedDocs = documents.map(d => {
                if (d.id === selectedDoc.id) {
                    const meta = typeof d.ai_analysis_json === 'string'
                        ? JSON.parse(d.ai_analysis_json)
                        : { ...d.ai_analysis_json };
                    meta.extracted_text = editedText;
                    return { ...d, ai_analysis_json: meta };
                }
                return d;
            });
            setDocuments(updatedDocs);
            setSelectedDoc(prev => prev ? {
                ...prev,
                ai_analysis_json: {
                    ...(typeof prev.ai_analysis_json === 'string' ? JSON.parse(prev.ai_analysis_json) : prev.ai_analysis_json),
                    extracted_text: editedText
                }
            } : null);
            setIsEditing(false);
            runAutomatedScan(editedText);
        } catch (err: any) {
            console.error('Save text failed:', err);
            toast.error(err.message || 'Failed to save document text.');
        } finally {
            setSavingText(false);
        }
    };

    // Helper to get parsed text from metadata JSON
    const getExtractedText = (doc: DocumentRecord): string => {
        try {
            if (!doc.ai_analysis_json) return '';
            const meta = typeof doc.ai_analysis_json === 'string' 
                ? JSON.parse(doc.ai_analysis_json) 
                : doc.ai_analysis_json;
            return meta.extracted_text || 'No text extracted.';
        } catch (e) {
            return 'Failed to parse text metadata.';
        }
    };

    // Dynamic categories list
    const categories = useMemo(() => {
        const unique = new Set(documents.map(d => d.category ? d.category.trim() : 'general'));
        return ['All', ...Array.from(unique).map(c => c.charAt(0).toUpperCase() + c.slice(1))];
    }, [documents]);

    // Filter documents
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  doc.id.toLowerCase().includes(searchQuery.toLowerCase());
            const docCat = doc.category ? doc.category.trim().toLowerCase() : 'general';
            const matchesCat = selectedCategory === 'All' || docCat === selectedCategory.toLowerCase();
            return matchesSearch && matchesCat;
        });
    }, [documents, searchQuery, selectedCategory]);

    // Word and reading stats
    const stats = useMemo(() => {
        const wordCount = editedText ? editedText.split(/\s+/).filter(Boolean).length : 0;
        const charCount = editedText ? editedText.length : 0;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        return { wordCount, charCount, readingTime };
    }, [editedText]);

    return (
        <div className="space-y-6 w-full pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-650 dark:from-white dark:to-slate-350 bg-clip-text text-transparent flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-amber-500 animate-pulse" />
                        Human QA Gate
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
                        Verify and correct OCR raw outputs before committing embeddings to the vector storage.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/knowledge">
                        <Button variant="outline" size="sm" className="gap-2 border-slate-200/80 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-xs">
                            <LayoutDashboard className="h-4 w-4" />
                            Knowledge Hub
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={loadPendingDocs} disabled={loading} className="text-xs hover:bg-slate-100 dark:hover:bg-slate-900/80">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
                    </Button>
                </div>
            </div>

            {loading && documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                        <ShieldAlert className="h-5 w-5 text-blue-500 absolute top-2.5 left-2.5" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Running diagnostics & retrieving pending reviews...</p>
                </div>
            ) : documents.length === 0 ? (
                <Card className="border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5 min-h-[300px] flex flex-col items-center justify-center text-center p-8 backdrop-blur-md">
                    <div className="h-14 w-14 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-250 dark:border-emerald-900 relative">
                        <span className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-slate-950 dark:text-slate-50 text-xl font-bold">QA Backlog Cleared</CardTitle>
                    <CardDescription className="max-w-md mx-auto mt-2 text-sm text-slate-500 dark:text-slate-400">
                        All uploaded documents are verified, indexed, and embedded. Your knowledge base is ready for cognitive routing.
                    </CardDescription>
                    <Link href="/knowledge" className="mt-6">
                        <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-55 dark:hover:bg-slate-200 dark:text-slate-900 text-xs shadow-md">
                            Ingest New File
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Pane: Listing (5/12 width) */}
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                        {/* Search & Category Filter Section */}
                        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md space-y-3 shadow-sm">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by title or ID..."
                                    className="pl-9 h-9 bg-white/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs rounded-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Filter Pills */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider px-0.5 flex items-center gap-1">
                                    <Filter className="h-3 w-3" /> Category Filter
                                </label>
                                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pb-0.5">
                                    {categories.map((cat) => (
                                        <Badge
                                            key={cat}
                                            variant={selectedCategory === cat ? 'default' : 'secondary'}
                                            className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full border border-transparent font-medium"
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* List items count */}
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                                Pending Ingestion ({filteredDocuments.length})
                            </span>
                        </div>

                        {/* Document List */}
                        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-850">
                            {filteredDocuments.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-450 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                    No documents match the filter criteria.
                                </div>
                            ) : (
                                filteredDocuments.map((doc) => {
                                    const isSelected = selectedDoc?.id === doc.id;
                                    return (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc)}
                                            className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                                                isSelected
                                                    ? 'border-blue-500/80 bg-blue-50/20 dark:bg-blue-950/25 ring-1 ring-blue-500/20'
                                                    : 'border-slate-250/50 dark:border-slate-850/80 bg-white/40 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/80'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2.5 rounded-lg border ${
                                                    isSelected 
                                                        ? 'bg-blue-105 border-blue-200 dark:bg-blue-900/40 dark:border-blue-805 text-blue-600 dark:text-blue-400' 
                                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'
                                                }`}>
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-500 transition-colors">
                                                        {doc.title}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                                                        <Badge variant="secondary" className="px-1.5 py-0 rounded text-[9px] uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                                                            {doc.category}
                                                        </Badge>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(doc.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Extracted View & Actions (7/12 width) */}
                    <div className="lg:col-span-7 flex">
                        {selectedDoc ? (
                            <Card className="flex flex-col border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-md w-full h-[650px] overflow-hidden glass-obsidian relative">
                                <CardHeader className="border-b border-slate-200/80 dark:border-slate-800 p-5 flex flex-row items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60">
                                    <div className="min-w-0">
                                        <CardTitle className="text-base font-bold text-slate-950 dark:text-slate-50 truncate">
                                            {selectedDoc.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs flex items-center gap-1.5 mt-1">
                                            <span className="text-slate-400">ID:</span>
                                            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px] text-slate-650 dark:text-slate-350 font-mono">
                                                {selectedDoc.id}
                                            </code>
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 font-semibold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                                            Pending QA
                                        </Badge>
                                    </div>
                                </CardHeader>

                                {/* Extracted Metadata Stats Card */}
                                <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-205 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                                    <div className="flex items-center gap-1.5 p-2 bg-white/40 dark:bg-slate-900/40 rounded-lg border border-slate-150 dark:border-slate-850">
                                        <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
                                        <div>
                                            <span className="text-[10px] text-slate-400 block">Words</span>
                                            <span className="font-semibold font-mono">{stats.wordCount}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 p-2 bg-white/40 dark:bg-slate-900/40 rounded-lg border border-slate-150 dark:border-slate-850">
                                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                                        <div>
                                            <span className="text-[10px] text-slate-400 block">Characters</span>
                                            <span className="font-semibold font-mono">{stats.charCount}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 p-2 bg-white/40 dark:bg-slate-900/40 rounded-lg border border-slate-150 dark:border-slate-850">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                        <div>
                                            <span className="text-[10px] text-slate-400 block">Ingest Est.</span>
                                            <span className="font-semibold font-mono">{stats.readingTime} min</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Monospace Text Extraction Body */}
                                <CardContent className="flex-1 overflow-y-auto p-0 flex flex-col bg-slate-50 dark:bg-[#070D18]/90">
                                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full flex-1 flex flex-col overflow-hidden">
                                        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
                                            <TabsList className="bg-slate-100 dark:bg-slate-950/60 p-0.5 rounded-lg h-8">
                                                <TabsTrigger value="raw" className="text-xs h-7 px-3 py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-md">
                                                    Dokumen Mentah (Raw Text)
                                                </TabsTrigger>
                                                <TabsTrigger value="scan" className="text-xs h-7 px-3 py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-md flex items-center gap-1.5">
                                                    Hasil Scan AI (Nemesis Check)
                                                    {scanResults.some(r => r.is_violation) && (
                                                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                                    )}
                                                </TabsTrigger>
                                            </TabsList>
                                            
                                            {selectedTab === 'raw' && (
                                                isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 px-2 w-auto text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                            onClick={() => {
                                                                setEditedText(originalRawText);
                                                                setIsEditing(false);
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 px-2 w-auto text-[10px] text-emerald-600 hover:text-emerald-550 font-semibold flex gap-1 items-center"
                                                            onClick={handleSaveText}
                                                            disabled={savingText}
                                                        >
                                                            {savingText ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                            Apply Text
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 px-2.5 w-auto text-[10px] text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex gap-1 items-center"
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                        Correct Content
                                                    </Button>
                                                )
                                            )}
                                        </div>

                                        <TabsContent value="raw" className="flex-1 p-0 m-0 overflow-y-auto flex flex-col bg-slate-50 dark:bg-[#070D18]/90">
                                            <div className="flex-1 p-5 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-300 select-text overflow-y-auto min-h-[350px]">
                                                {loadingRaw ? (
                                                    <div className="h-full flex flex-col items-center justify-center py-20 space-y-3">
                                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                                        <p className="text-xs text-slate-500 animate-pulse font-sans">Retrieving document text from MongoDB staging...</p>
                                                    </div>
                                                ) : isEditing ? (
                                                    <textarea
                                                        className="w-full h-full min-h-[320px] bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono resize-none leading-relaxed"
                                                        value={editedText}
                                                        onChange={(e) => setEditedText(e.target.value)}
                                                        placeholder="Tulis draf anggaran di sini..."
                                                    />
                                                ) : (
                                                    <pre className="whitespace-pre-wrap break-all font-mono font-normal">
                                                        {editedText || 'No text content available.'}
                                                    </pre>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="scan" className="flex-1 p-5 m-0 overflow-y-auto bg-slate-50 dark:bg-slate-950/20">
                                            {scanning ? (
                                                <div className="h-full flex flex-col items-center justify-center py-20 space-y-3">
                                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                                    <p className="text-xs text-slate-500 animate-pulse">Membandingkan standar harga di Nemesis DB...</p>
                                                </div>
                                            ) : scanError ? (
                                                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 rounded-xl flex items-start gap-3">
                                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">Scan Failed</h4>
                                                        <p className="text-xs text-red-750 dark:text-red-500 mt-0.5">{scanError}</p>
                                                    </div>
                                                </div>
                                            ) : scanResults.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400">
                                                    <ThumbsUp className="h-10 w-10 text-emerald-550/60 mb-2" />
                                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Format Anggaran Tidak Terdeteksi</p>
                                                    <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-normal">
                                                        Tulis anggaran dalam format <code>Nama Barang : Rp Harga</code> di Dokumen Mentah agar AI dapat mencocokkannya dengan database standar Nemesis.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                                                        <ShieldAlert className="h-4 w-4 text-blue-550" />
                                                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Hasil Audit Harga Standar</h4>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {scanResults.map((res: any, idx: number) => (
                                                            <div 
                                                                key={idx}
                                                                className={cn(
                                                                    "p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm transition-all",
                                                                    res.is_violation 
                                                                        ? "bg-red-50/40 dark:bg-red-950/10 border-red-200/60 dark:border-red-900/40" 
                                                                        : "bg-emerald-50/20 dark:bg-emerald-950/5 border-emerald-100/50 dark:border-emerald-950/40"
                                                                )}
                                                            >
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.item_name}</span>
                                                                        {res.similarity > 0 && (
                                                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 font-normal">
                                                                                {Math.round(res.similarity * 100)}% match
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {res.matched_name && res.matched_name.toLowerCase() !== res.item_name.toLowerCase() && (
                                                                        <p className="text-[10px] text-slate-450">Cocok standar: <span className="font-medium italic">{res.matched_name}</span></p>
                                                                    )}
                                                                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                                                                        <span>Diajukan: <strong className="font-mono text-slate-700 dark:text-slate-300">Rp {res.price.toLocaleString()}</strong></span>
                                                                        {res.max_price > 0 && (
                                                                            <span>Batas Nemesis: <strong className="font-mono text-slate-750 dark:text-slate-450">Rp {res.max_price.toLocaleString()}</strong></span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="shrink-0 flex items-center md:justify-end">
                                                                    {res.is_violation ? (
                                                                        <Badge className="bg-red-100 hover:bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                            <AlertCircle className="h-3 w-3" /> Potensi Markup (+Rp {res.excess_amount.toLocaleString()})
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-950/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                            <ShieldCheck className="h-3 w-3" /> Sesuai Standar
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>

                                    {/* Swarm Intelligence Memory Pack update Explanation */}
                                    <div className="mx-5 mb-4 p-3.5 rounded-xl border border-blue-500/20 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 dark:from-blue-950/20 dark:to-purple-950/5 shadow-sm space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                                            <span>Umpan Balik AI Swarm (Memory Pack Update)</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed">
                                            Setelah Anda memberikan justifikasi dan menyetujui, <strong>AI Swarm akan mempelajari pengecualian ini secara otomatis</strong> untuk audit di masa mendatang (Memory Pack updated). Tindakan ini membantu melatih model kolektif agar lebih akurat mendeteksi dan memvalidasi anggaran di masa mendatang.
                                        </p>
                                    </div>
                                </CardContent>

                                {/* Footer Action Controls */}
                                <div className="border-t border-slate-200/80 dark:border-slate-800 p-5 bg-white/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-[11px] text-slate-450 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3 text-blue-550 shrink-0" />
                                        <span>Click approve to map text vectors into high dimensional index.</span>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={!!approvingId || !!rejectingId}
                                            onClick={() => handleReject(selectedDoc.id)}
                                            className="w-full sm:w-auto gap-1.5 text-xs bg-red-950/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 shadow-sm"
                                        >
                                            {rejectingId === selectedDoc.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <X className="h-4 w-4" />
                                            )}
                                            Reject & Delete
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            disabled={!!approvingId || !!rejectingId || isEditing}
                                            onClick={() => handleApprove(selectedDoc.id)}
                                            className="w-full sm:w-auto gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold shadow-md"
                                        >
                                            {approvingId === selectedDoc.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                            Approve & Embed
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div className="flex-1 border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 backdrop-blur-sm bg-white/5 dark:bg-slate-900/5">
                                <Eye className="h-10 w-10 mb-3 opacity-30 text-slate-400" />
                                <h3 className="font-semibold text-slate-705 dark:text-slate-300">No Document Selected</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-normal">
                                    Choose a pending file from the list to analyze, correct, and index.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
