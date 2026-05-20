'use client';

import { useState, useEffect } from 'react';
import { Protected } from '@/components/auth/Protected';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/contexts/TenantContext';
import { listDocuments, approveDocument, DocumentRecord } from '@/services/rag.service';
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
    ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

    const loadPendingDocs = async () => {
        if (!tenantId || !accessToken) return;
        setLoading(true);
        try {
            const res = await listDocuments(accessToken, tenantId, 50, 0);
            // Filter only pending_qa status
            const pending = res.data.filter((doc) => doc.status === 'pending_qa');
            setDocuments(pending);
            
            // Auto-select first doc if none selected or if selected doc is no longer in pending list
            if (pending.length > 0) {
                if (!selectedDoc || !pending.find(d => d.id === selectedDoc.id)) {
                    setSelectedDoc(pending[0]);
                }
            } else {
                setSelectedDoc(null);
            }
        } catch (err: any) {
            console.error('Failed to load pending documents:', err);
            toast.error(err.message || 'Failed to retrieve documents for approval.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingDocs();
    }, [tenantId, accessToken]);

    const handleApprove = async (docId: string) => {
        if (!tenantId || !accessToken) return;
        setApprovingId(docId);
        try {
            await approveDocument(accessToken, tenantId, docId);
            toast.success('Document approved successfully! Ingestion & embedding task enqueued.');
            await loadPendingDocs();
        } catch (err: any) {
            console.error('Approval failed:', err);
            toast.error(err.message || 'Failed to approve document.');
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async (docId: string) => {
        if (!tenantId || !accessToken) return;
        setRejectingId(docId);
        try {
            // Send DELETE request to backend to reject and delete the document
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/v1/documents/${docId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Tenant-ID': tenantId,
                },
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.error || `Rejection failed: HTTP ${res.status}`);
            }
            toast.success('Document rejected and deleted successfully.');
            await loadPendingDocs();
        } catch (err: any) {
            console.error('Rejection failed:', err);
            toast.error(err.message || 'Failed to reject document.');
        } finally {
            setRejectingId(null);
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

    return (
        <div className="space-y-6 w-full pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-amber-500" />
                        Human QA Gate
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
                        Review raw parsed text before vector indexing and grounding it in AI Swarm context.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/knowledge">
                        <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800 text-xs">
                            <LayoutDashboard className="h-4 w-4" />
                            Knowledge Hub
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={loadPendingDocs} disabled={loading} className="text-xs">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
                    </Button>
                </div>
            </div>

            {loading && documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Loading pending reviews...</p>
                </div>
            ) : documents.length === 0 ? (
                <Card className="border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/5 min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-200 dark:border-emerald-900 animate-bounce">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-slate-950 dark:text-slate-50">No Pending Approvals</CardTitle>
                    <CardDescription className="max-w-md mx-auto mt-2">
                        All uploaded documents have been successfully parsed, reviewed, and vectorized. You&apos;re completely caught up!
                    </CardDescription>
                    <Link href="/knowledge" className="mt-6">
                        <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 text-xs">
                            Upload More Documents
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Pane: Listing (5/12 width) */}
                    <div className="lg:col-span-5 space-y-4 flex flex-col">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Pending Verification ({documents.length})
                            </span>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                            {documents.map((doc) => {
                                const isSelected = selectedDoc?.id === doc.id;
                                return (
                                    <div
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                                            isSelected
                                                ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-blue-500/30'
                                                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2.5 rounded-lg border ${
                                                isSelected 
                                                    ? 'bg-blue-100 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800 text-blue-600 dark:text-blue-400' 
                                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'
                                            }`}>
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-500 transition-colors">
                                                    {doc.title}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                                                    <Badge variant="secondary" className="px-1.5 py-0 rounded text-[9px] uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
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
                            })}
                        </div>
                    </div>

                    {/* Right Pane: Extracted View & Actions (7/12 width) */}
                    <div className="lg:col-span-7 flex">
                        {selectedDoc ? (
                            <Card className="flex flex-col border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm w-full h-[650px] overflow-hidden glass-obsidian">
                                <CardHeader className="border-b border-slate-200 dark:border-slate-800 p-5 flex flex-row items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <CardTitle className="text-base font-bold text-slate-950 dark:text-slate-50 truncate">
                                            {selectedDoc.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs flex items-center gap-1.5 mt-1">
                                            <span>Document ID:</span>
                                            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300">
                                                {selectedDoc.id}
                                            </code>
                                        </CardDescription>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900 font-medium text-xs px-2.5 py-0.5">
                                        Pending QA
                                    </Badge>
                                </CardHeader>

                                {/* Monospace Text Extraction Body */}
                                <CardContent className="flex-1 overflow-y-auto p-5 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-[10px] text-slate-500 uppercase tracking-wider">
                                        <Eye className="h-3.5 w-3.5" />
                                        Extracted Plain Text Preview
                                    </div>
                                    <pre className="whitespace-pre-wrap break-all select-text font-mono">
                                        {getExtractedText(selectedDoc)}
                                    </pre>
                                </CardContent>

                                {/* Footer Action Controls */}
                                <div className="border-t border-slate-200 dark:border-slate-800 p-5 bg-white/50 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-[11px] text-slate-500">
                                        Please ensure content contains no parsing anomalies before approving.
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={!!approvingId || !!rejectingId}
                                            onClick={() => handleReject(selectedDoc.id)}
                                            className="w-full sm:w-auto gap-1.5 text-xs bg-red-950/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20"
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
                                            disabled={!!approvingId || !!rejectingId}
                                            onClick={() => handleApprove(selectedDoc.id)}
                                            className="w-full sm:w-auto gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium"
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
                            <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
                                <Eye className="h-10 w-10 mb-3 opacity-35" />
                                <h3 className="font-semibold text-sm">No Document Selected</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                    Select one of the pending documents from the list on the left to preview its extracted text.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
