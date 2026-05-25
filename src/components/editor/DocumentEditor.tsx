'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Maximize2, Sparkles, ShieldX, Printer, Plus, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorDocument } from '@/lib/sdk/schemas';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { useMemo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { rag } from '@/lib/sdk/modules/rag';
import { extractPlainText } from '@/lib/editor/aiContext';
import { useEditorStore } from '@/store/editorStore';
import { useCrashRecovery } from '@/hooks/use-crash-recovery';
import { SlashCommand, getSuggestionItems, renderItems } from './extensions/slash-command';
import { VersionHistory } from './VersionHistory';
import { useGhostwriter } from '@/hooks/use-ghostwriter';
import { GhostwriterWidget } from './GhostwriterWidget';
import { PIIHighlighter } from './extensions/piiHighlighter';
import { FDSGuardrail } from './extensions/fdsGuardrail';
import { maskPII } from '@/lib/editor/piiUtils';
import { SwarmReviewPanel } from '../swarm/SwarmReviewPanel';
import { Users } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BulkImportModal } from './BulkImportModal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    useDocuments,
    useDocumentRaw,
    useUpdateDocumentText,
    useDeleteDocument,
} from '@/queries/document.queries';

// Helper utility to parse raw database plain text into Tiptap JSON format
function convertRawTextToTiptapJson(text: string | null | undefined): JSONContent {
    if (!text) {
        return {
            type: 'doc',
            content: [{ type: 'paragraph' }]
        };
    }

    const lines = text.split('\n');
    return {
        type: 'doc',
        content: lines.map(line => {
            if (!line.trim()) {
                return { type: 'paragraph' };
            }
            return {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: line
                    }
                ]
            };
        })
    };
}

interface DocumentEditorProps {
    document?: EditorDocument;
    initialContent?: JSONContent | null;
    onChange?: (content: JSONContent) => void;
    onSave?: () => void;
    pdfUrl?: string;
    isMobile?: boolean;
}

export function DocumentEditor({
    document,
    initialContent,
    onChange,
    onSave,
    pdfUrl,
    isMobile = false
}: DocumentEditorProps) {
    // Next.js Navigation Hooks
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlDocumentId = searchParams.get('id');

    // Fetch documents list & queries
    const { data: documentsData, isLoading: isLoadingList, refetch: refetchDocuments } = useDocuments();
    const documents = documentsData || [];

    // Select the current document ID
    const activeDocumentId = document?.id || urlDocumentId || '';

    // Check if the current ID is already saved in the database
    const activeDocInfo = documents.find((d) => d.id === activeDocumentId);
    const isExistingDoc = !!activeDocInfo;

    // Fetch raw content only if the document exists in PostgreSQL
    const { data: rawData, isLoading: isLoadingRaw } = useDocumentRaw(
        isExistingDoc ? activeDocumentId : null
    );

    const [titleInput, setTitleInput] = useState('');

    // Enterprise Store & Persistence
    const { setDocument, updateContent, currentDocument, isDirty, createSnapshot, markSynced } = useEditorStore();
    useCrashRecovery();
    const [fraudAlert, setFraudAlert] = useState<{ reason: string; quote: string } | null>(null);
    const [isSwarmPanelOpen, setIsSwarmPanelOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [swarmItems, setSwarmItems] = useState<Array<{
        item_id: string;
        name: string;
        requested_price: number;
        quantity: number;
        department: string;
    }>>([]);

    // Handle initial routing / redirect if no document is active
    useEffect(() => {
        if (!document?.id && !urlDocumentId && !isLoadingList) {
            if (documents.length > 0) {
                router.replace(`/editor?id=${documents[0].id}`);
            } else {
                // If there are zero documents, auto-generate a new UUID draft
                const newId = crypto.randomUUID();
                router.replace(`/editor?id=${newId}`);
            }
        }
    }, [document?.id, urlDocumentId, documents, isLoadingList, router]);

    // Synchronize active document state to editor store
    useEffect(() => {
        if (!activeDocumentId) return;

        if (isExistingDoc) {
            if (rawData) {
                const docTitle = activeDocInfo.title || 'Draft Dokumen';
                const parsedContent = convertRawTextToTiptapJson(rawData.raw_text);

                // Prevent state loop if it's already matching
                const isDifferentDoc = currentDocument?.id !== activeDocumentId;
                if (isDifferentDoc || (!isDirty && JSON.stringify(currentDocument?.content) !== JSON.stringify(parsedContent))) {
                    setDocument({
                        id: activeDocumentId,
                        title: docTitle,
                        content: parsedContent,
                        version: 1,
                        lastModified: new Date(activeDocInfo.last_updated_at || activeDocInfo.created_at || Date.now()),
                    });
                }
            }
        } else {
            // New Draft
            if (currentDocument?.id !== activeDocumentId) {
                setDocument({
                    id: activeDocumentId,
                    title: 'Draft Dokumen Baru',
                    content: { type: 'doc', content: [{ type: 'paragraph' }] },
                    version: 1,
                    lastModified: new Date(),
                });
            }
        }
    }, [activeDocumentId, isExistingDoc, rawData, activeDocInfo, currentDocument?.id, isDirty, setDocument]);

    // Local title input binding
    useEffect(() => {
        if (currentDocument) {
            setTitleInput(currentDocument.title);
        }
    }, [currentDocument?.id, currentDocument?.title]);

    const updateTextMutation = useUpdateDocumentText();
    const deleteDocumentMutation = useDeleteDocument();

    const handleSave = async () => {
        if (!editor || !activeDocumentId) return;

        const plainText = extractPlainText(editor);
        const titleToSave = titleInput.trim() || 'Untitled Document';

        toast.promise(
            updateTextMutation.mutateAsync({
                id: activeDocumentId,
                text: plainText,
                title: titleToSave,
            }),
            {
                loading: 'Menyimpan dokumen...',
                success: () => {
                    markSynced();
                    createSnapshot('Manual Save');
                    onSave?.();
                    return 'Dokumen berhasil disimpan!';
                },
                error: (err: any) => `Gagal menyimpan dokumen: ${err.message || err}`,
            }
        );
    };

    const handleDeleteActive = () => {
        if (!activeDocumentId) return;

        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?");
        if (!confirmDelete) return;

        toast.promise(
            deleteDocumentMutation.mutateAsync(activeDocumentId),
            {
                loading: 'Menghapus dokumen...',
                success: () => {
                    const remaining = documents.filter((d) => d.id !== activeDocumentId);
                    if (remaining.length > 0) {
                        router.replace(`/editor?id=${remaining[0].id}`);
                    } else {
                        const newId = crypto.randomUUID();
                        router.replace(`/editor?id=${newId}`);
                    }
                    return 'Dokumen berhasil dihapus!';
                },
                error: (err: any) => `Gagal menghapus dokumen: ${err.message || err}`,
            }
        );
    };

    const handleCreateNew = () => {
        const newId = crypto.randomUUID();
        router.replace(`/editor?id=${newId}`);
    };

    // Default schema to prevent crashes
    const defaultContent: JSONContent = {
        type: 'doc',
        content: [{ type: 'paragraph' }]
    };


    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
        }),
        Placeholder.configure({
            placeholder: 'Type "/" for commands...',
            emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0',
        }),
        CharacterCount,
        SlashCommand.configure({
            suggestion: {
                items: getSuggestionItems,
                render: renderItems,
            },
        }),
        PIIHighlighter,
        FDSGuardrail,
    ], []);

    const editor = useEditor({
        extensions,
        // PRIORITY: Use rehydrated draft if available, else initial content
        content: currentDocument?.content || initialContent || defaultContent,
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-base w-full p-10 focus:outline-none min-h-[800px] dark:prose-invert max-w-none bg-white dark:bg-[#0B1120] shadow-sm mx-auto my-4 border border-slate-200 dark:border-blue-900/30',
            },
            handleKeyDown: (_view, _event) => {
                // This handleKeyDown is intentionally left empty or for specific key events.
                // The onUpdate callback below handles content changes for persistence.
                // If specific key events need to trigger content updates, they should be added here.
            },
        },
        onUpdate: ({ editor }) => {
            // Prevent ghost updates on mount/hydration
            if (!editor.isFocused) return;

            updateContent(editor.getJSON());
            onChange?.(editor.getJSON());
        },
        immediatelyRender: false,
    });

    // Enterprise: AI Ghostwriter (Initialized AFTER editor)
    const { suggestion, isLoading: isGhostwriterLoading, acceptSuggestion, discardSuggestion } = useGhostwriter(editor, isMobile);

    // Handle Tab key to accept suggestion, Escape to discard
    useEffect(() => {
        if (!editor) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab' && suggestion) {
                e.preventDefault();
                acceptSuggestion();
            } else if (e.key === 'Escape' && suggestion) {
                e.preventDefault();
                discardSuggestion();
            }
        };

        const view = editor.view;
        view.dom.addEventListener('keydown', handleKeyDown);

        return () => {
            view.dom.removeEventListener('keydown', handleKeyDown);
        };
    }, [editor, suggestion, acceptSuggestion, discardSuggestion]);

    // Sync Editor with Store (Handling Restore)
    useEffect(() => {
        if (editor && currentDocument?.content) {
            // Simple check to prevent infinite loop of updates
            const currentEditorContent = JSON.stringify(editor.getJSON());
            const storeContent = JSON.stringify(currentDocument.content);

            if (currentEditorContent !== storeContent) {
                editor.commands.setContent(currentDocument.content);
            }
        }
    }, [currentDocument, editor]);

    // Feature 7: Debounced Instant Guardrails Precheck
    useEffect(() => {
        if (!editor) return;

        const timer = setTimeout(async () => {
            const text = extractPlainText(editor);
            if (!text) return;

            // Extract item blocks like: "Semen Padang : Rp 120.000" or "Printer : Rp 4.500.000"
            const itemPattern = /([a-zA-Z0-9\s\-\*]+?)\s*:\s*Rp\s*([0-9.,]+)/gi;
            const items: Array<{ item_name: string; price: number }> = [];
            let match;
            while ((match = itemPattern.exec(text)) !== null) {
                const name = match[1].trim();
                const priceStr = match[2].replace(/[.,]/g, '');
                const price = parseFloat(priceStr);
                if (name && !isNaN(price)) {
                    // Clean prefixes like "8 unit ", "150 sak ", etc. to match standard price items
                    const cleanedName = name.replace(/^[-\*\s\d]+\s*(?:unit|sak|pcs|buah|box|kg|lembar|pax|lusin)?\s*/i, "").trim();
                    if (cleanedName) {
                        items.push({ item_name: cleanedName, price });
                    }
                }
            }

            if (items.length === 0) {
                // Clear highlights if no item blocks are present
                editor.setOptions({
                    fdsGuardrail: {
                        violations: []
                    }
                } as any);
                const tr = editor.view.state.tr;
                tr.setMeta('fdsGuardrailViolations', []);
                tr.setMeta('fdsGuardrailForceUpdate', true);
                editor.view.dispatch(tr);
                return;
            }

            try {
                const res = await fetch('/api/proxy/guardrails/precheck', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ items })
                });

                if (res.ok) {
                    const result = await res.json();
                    const newViolations: Array<{ term: string; max_price: number }> = [];
                    if (result.data) {
                        for (const item of result.data) {
                            if (item.is_violation) {
                                newViolations.push({
                                    term: item.item_name,
                                    max_price: item.max_price
                                });
                            }
                        }
                    }
                    editor.setOptions({
                        fdsGuardrail: {
                            violations: newViolations
                        }
                    } as any);
                    // Force ProseMirror plugin state apply to update decorations immediately
                    const tr = editor.view.state.tr;
                    tr.setMeta('fdsGuardrailViolations', newViolations);
                    tr.setMeta('fdsGuardrailForceUpdate', true);
                    editor.view.dispatch(tr);
                }
            } catch (err) {
                console.error("Failed to perform guardrails precheck:", err);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [editor, currentDocument?.content]);

    const handleProcessWithAI = async () => {
        if (!editor) return;

        let text = extractPlainText(editor);
        if (!text) {
            toast.error("Editor kosong. Tulis sesuatu dulu!");
            return;
        }

        // Feature 1: Payload Interceptor for PII Redaction
        const maskedText = maskPII(text);
        if (maskedText !== text) {
            toast.info("PII Redaction Active", { description: "Sensitive data has been masked in the payload." });
            text = maskedText;
        }

        // Feature 2: Guardrail Engine (FDS Analyzer)
        toast.info("Menjalankan AI Agent...", { description: "Mengecek kesesuaian dokumen dengan regulasi POJK..." });
        
        try {
            const assessment = await rag.evaluateGuardrails(text);
            
            if (assessment.isAnomaly) {
                setFraudAlert({
                    reason: assessment.reason!,
                    quote: assessment.quote!
                });
                toast.error("Semantic Guardrail Alert", { description: "Terdeteksi anomali pada dokumen proposal!" });
                return; // Bloc execution path if invalid
            }
            
            setFraudAlert(null);
            
            toast.info("Aman!", { description: "Tidak ada fraud terdeteksi. Menyimpan pengetahuan..." });
            
        } catch {
            toast.error("Guardrail API Error", { description: "Gagal menghubungi mesin FDS Guardrail." });
            return;
        }

        try {
            const result = await rag.processDocument(activeDocumentId, text);
            if (result.success) {
                toast.success("Sukses!", { description: result.message });
            } else {
                toast.warning("Gagal", { description: result.message });
            }
        } catch {
            toast.error("Error", { description: "Gagal menghubungkan ke RAG pipeline." });
        }
    };

    const handleSwarmReview = async () => {
        if (!editor) return;
        
        const text = extractPlainText(editor);
        if (!text) {
            toast.error("Editor kosong. Tulis proposal anggaran terlebih dahulu!");
            return;
        }

        // Save raw text to MongoDB staging first (so it's available for the Document Viewer verify link)
        try {
            await rag.processDocument(activeDocumentId, text);
        } catch (e) {
            console.error("Failed to auto-save staging text:", e);
        }

        // Parse items like: "Laptop IT : Rp 25.000.000" or "Printer : Rp 3.000.000"
        const itemPattern = /([a-zA-Z0-9\s]+?)\s*:\s*Rp\s*([0-9.,]+)/gi;
        const parsedItems: any[] = [];
        let match;
        let index = 1;
        
        // Dynamic region detection
        let region = "Jakarta"; // Default to Jakarta
        const regionMatch = /(?:wilayah|daerah|lokasi|region)\s*:\s*([a-zA-Z\s]+)/i.exec(text);
        if (regionMatch && regionMatch[1]) {
            region = regionMatch[1].trim();
        } else {
            // Check if standard region names appear in the text
            const textLower = text.toLowerCase();
            if (textLower.includes("purbalingga")) {
                region = "Purbalingga";
            } else if (textLower.includes("bandung")) {
                region = "Bandung";
            } else if (textLower.includes("surabaya")) {
                region = "Surabaya";
            }
        }

        while ((match = itemPattern.exec(text)) !== null) {
            const name = match[1].trim();
            const priceStr = match[2].replace(/[.,]/g, '');
            const price = parseFloat(priceStr);
            if (name && !isNaN(price)) {
                // Parse quantity if written like: "5 Laptop IT" or "Laptop IT (5 unit)"
                let qty = 1;
                const qtyMatchBefore = new RegExp(`(\\d+)\\s+${name}`, 'i').exec(text);
                const qtyMatchAfter = new RegExp(`${name}\\s*\\((\\d+)\\s*(?:unit|pcs)?\\)`, 'i').exec(text);
                
                if (qtyMatchBefore && qtyMatchBefore[1]) {
                    qty = parseInt(qtyMatchBefore[1], 10);
                } else if (qtyMatchAfter && qtyMatchAfter[1]) {
                    qty = parseInt(qtyMatchAfter[1], 10);
                }

                // Department detection
                let department = "Umum";
                if (text.toLowerCase().includes("kominfo")) {
                    department = "Kominfo";
                }

                parsedItems.push({
                    item_id: `ITM-00${index}`,
                    name: name,
                    requested_price: price,
                    qty: qty,
                    quantity: qty,
                    department: department,
                    metadata: {
                        region: region
                    }
                });
                index++;
            }
        }

        if (parsedItems.length === 0) {
            toast.error("Format anggaran tidak terdeteksi. Gunakan format 'Nama Barang : Rp Harga'");
            return;
        }
        
        setSwarmItems(parsedItems);
        setIsSwarmPanelOpen(true);
        setFraudAlert(null); // Close regular guardrail if open
    };

    const handleExportPDF = () => {
        const title = currentDocument?.title || 'Untitled Document';
        const contentHtml = editor?.getHTML() || '';
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const auditTrailHtml = fraudAlert 
            ? `<tr><td>${new Date().toLocaleDateString()}</td><td>Guardrail FDS</td><td style="color:red; font-weight:bold;">FRAUD WARNING DETECTED</td></tr>`
            : `<tr><td>${new Date().toLocaleDateString()}</td><td>Guardrail FDS</td><td style="color:green; font-weight:bold;">SAFE - NO ANOMALIES</td></tr>`;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title} - Compliance Report</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px 60px; color: #0f172a; position: relative; }
                        .watermark { position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 80px; color: rgba(34, 197, 94, 0.08); font-weight: 900; border: 12px solid rgba(34, 197, 94, 0.08); padding: 30px; text-transform: uppercase; z-index: -1; white-space: nowrap; pointer-events: none; border-radius: 20px;}
                        .content { max-width: 800px; margin: 0 auto; line-height: 1.6; }
                        h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 30px; font-size: 28px; }
                        .audit-trail { margin-top: 60px; border-top: 3px dashed #cbd5e1; padding-top: 30px; page-break-inside: avoid; }
                        .audit-trail h2 { color: #334155; font-size: 20px; margin-bottom: 15px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                        th, td { border: 1px solid #e2e8f0; padding: 12px 15px; text-align: left; }
                        th { background-color: #f8fafc; font-weight: 600; color: #475569; }
                    </style>
                </head>
                <body>
                    <div class="watermark">Elysian Compliance Verified</div>
                    <div class="content">
                        <h1>${title} Document</h1>
                        <div class="prose">${contentHtml}</div>
                        
                        <div class="audit-trail">
                            <h2>Audit Trail & AI Validation Log</h2>
                            <table>
                                <thead>
                                    <tr><th>Date</th><th>AI Node Executed</th><th>Status / Finding</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>${new Date().toLocaleDateString()}</td><td>PII Redaction Engine</td><td style="color:green; font-weight:bold;">Auto-Redacted (Secure)</td></tr>
                                    ${auditTrailHtml}
                                </tbody>
                            </table>
                            <p style="text-align: right; margin-top: 20px; font-size: 12px; color: #94a3b8;">Generated by Elysian SupTech Engine</p>
                        </div>
                    </div>
                    <script>
                        setTimeout(() => { window.print(); window.close(); }, 800);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className={cn(
            "flex flex-1 gap-4 p-4 h-full",
            isMobile ? "flex-col" : "flex-row"
        )}>
            {/* PDF/Source View */}
            {!isMobile && pdfUrl && (
                <Card className="flex-1 bg-slate-50 dark:bg-[#0B1120]/40 border-slate-200 dark:border-blue-900/30 overflow-hidden flex flex-col glass-obsidian">
                    <div className="p-3 border-b border-slate-200 dark:border-blue-900/30 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium">Source Document</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Maximize2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground">
                        {/* Placeholder for PDF Viewer */}
                        <div className="text-center p-6">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>PDF Viewer Placeholder</p>
                            <p className="text-xs text-muted-foreground mt-1">{pdfUrl}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Editor View */}
            <Card className="flex-1 border-slate-200 dark:border-blue-900/30 flex flex-col bg-white/80 dark:bg-slate-950/95 overflow-hidden shadow-sm backdrop-blur-xl glass-obsidian">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-blue-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-[#0B1120]/60 backdrop-blur-sm">
                    <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                        <Select
                            value={activeDocumentId}
                            onValueChange={(val) => {
                                if (val) router.replace(`/editor?id=${val}`);
                            }}
                        >
                            <SelectTrigger className="w-[140px] sm:w-[180px] h-8 border border-slate-200/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all text-xs font-medium px-2.5 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                <SelectValue placeholder="Pilih Dokumen">
                                    <span className="truncate">{activeDocInfo ? activeDocInfo.title : 'Draft Baru'}</span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200/50 dark:border-blue-900/30 rounded-lg shadow-lg text-xs z-[50]">
                                {documents.length > 0 ? (
                                    documents.map((d) => (
                                        <SelectItem
                                            key={d.id}
                                            value={d.id}
                                            className="focus:bg-blue-50 dark:focus:bg-blue-950/50 cursor-pointer text-slate-700 dark:text-slate-300"
                                        >
                                            <span className="flex items-center justify-between w-full gap-4">
                                                <span className="font-medium truncate max-w-[120px]">{d.title || 'Untitled Document'}</span>
                                            </span>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-[10px] text-slate-500">
                                        Tidak ada dokumen
                                    </div>
                                )}
                            </SelectContent>
                        </Select>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCreateNew}
                            title="Buat Draft Baru"
                            className="h-8 w-8 border border-slate-200/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all flex items-center justify-center"
                        >
                            <Plus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleDeleteActive}
                            disabled={deleteDocumentMutation.isPending}
                            title="Hapus Dokumen"
                            className="h-8 w-8 border border-red-200/30 dark:border-red-900/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg shadow-sm backdrop-blur-md transition-all flex items-center justify-center disabled:opacity-30"
                        >
                            {deleteDocumentMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-blue-900/30 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium shrink-0">Judul:</span>
                            <input
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-blue-900/30 rounded px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-blue-500 w-[120px] sm:w-[180px] font-medium placeholder-slate-400"
                                placeholder="Judul Dokumen..."
                            />
                            <Badge variant="outline" className="text-[10px] font-normal bg-white dark:bg-slate-800 shrink-0 h-6">
                                v{currentDocument?.version || 1}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-end w-full sm:w-auto gap-2">
                        <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">
                            {editor?.storage.characterCount.words() || 0} words
                        </span>
                        <VersionHistory />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleProcessWithAI}
                            className="h-8 gap-1.5 flex-1 sm:flex-none text-purple-600 border-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="truncate">Guardrail Check</span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSwarmReview}
                            className="h-8 gap-1.5 flex-1 sm:flex-none bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 shadow-sm transition-all"
                        >
                            <Users className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline-block">Swarm Review</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsBulkModalOpen(true)}
                            className="h-8 gap-1.5 flex-1 sm:flex-none text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50 transition-all shadow-sm"
                        >
                            <UploadCloud className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline-block">Import Bulk</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExportPDF}
                            className="h-8 gap-1.5 flex-1 sm:flex-none text-emerald-600 border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline-block">Export PDF</span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={updateTextMutation.isPending}
                            className="h-8 gap-1.5 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        >
                            {updateTextMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Save className="h-3.5 w-3.5" />
                            )}
                            <span>Save</span>
                        </Button>
                    </div>
                </div>

                {/* Tiptap Toolbar */}
                <EditorToolbar editor={editor} />

                {/* Floating Menu */}
                <EditorBubbleMenu editor={editor} />

                <div className="flex flex-1 overflow-hidden">
                    {/* Editor Area */}
                    <div
                        className="flex-1 overflow-y-auto bg-white/60 dark:bg-[#0B1120]/80 backdrop-blur-sm group relative cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUwyMyAxNkwxNCAxOEw5IDMwTDEgMVoiIGZpbGw9IiMxMTE4MjciIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4='),_default]"
                        onClick={() => editor?.chain().focus().run()}
                    >
                        <EditorContent editor={editor} className="min-h-full" />
                    </div>

                    {/* Fraud Alert Sidebar */}
                    {fraudAlert && (
                        <div className="w-80 border-l border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4 overflow-y-auto animate-in slide-in-from-right-8">
                            <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
                                <ShieldX className="h-5 w-5" />
                                <h3 className="font-semibold">Guardrail Alert</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reason</h4>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                                        {fraudAlert.reason}
                                    </p>
                                </div>
                                
                                <div className="bg-white/80 dark:bg-slate-900 p-3 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm relative">
                                    <div className="absolute -top-2.5 left-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                        RAG Source Quote
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-2">
                                        {fraudAlert.quote}
                                    </p>
                                </div>
                                
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/30"
                                    onClick={() => setFraudAlert(null)}
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {/* Swarm CI/CD Panel */}
                    {isSwarmPanelOpen && (
                        <SwarmReviewPanel 
                            documentId={activeDocumentId} 
                            items={swarmItems} 
                            onClose={() => setIsSwarmPanelOpen(false)} 
                        />
                    )}
                </div>
            </Card>

            {/* Bulk Ingestion Modal */}
            <BulkImportModal
                open={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onSelectDocument={(docId) => {
                    router.replace(`/editor?id=${docId}`);
                    setIsBulkModalOpen(false);
                }}
                onRefreshDocuments={refetchDocuments}
            />

            {/* AI Ghostwriter Widget — fixed bottom-center, never overlaps editor text */}
            <GhostwriterWidget
                suggestion={suggestion}
                isLoading={isGhostwriterLoading}
                onAccept={acceptSuggestion}
                onDiscard={discardSuggestion}
                isMobile={isMobile}
            />
        </div>
    );
}
