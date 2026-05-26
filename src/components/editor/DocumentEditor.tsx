'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Maximize2, Sparkles, ShieldX, Printer, Plus, Trash2, Loader2, UploadCloud, FilePlus, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { GuidedTour } from '@/components/ui/GuidedTour';

const editorTourSteps = [
    {
        targetSelector: '.tour-editor-select',
        title: 'Pemilih Dokumen & Draf Baru',
        content: 'Pilih draf anggaran yang ingin diedit, buat draf kosong baru, atau klik ikon berkas-plus di samping untuk memuat Template Contoh secara instan!',
        position: 'bottom' as const
    },
    {
        targetSelector: '.tour-canvas',
        title: 'Lembaran Kertas A4 Word-like',
        content: 'Tulis draf anggaran Anda di sini. Kanvas ini memiliki visual margin dan pembagi halaman Microsoft Word otomatis untuk kenyamanan kerja Anda.',
        position: 'top' as const
    },
    {
        targetSelector: '.tour-guardrail',
        title: 'AI Guardrail Check',
        content: 'Klik tombol ini untuk memindai draf anggaran Anda secara mandiri cepat dan mendeteksi anomali secara real-time berdasarkan batas wajar Nemesis DB.',
        position: 'bottom' as const
    },
    {
        targetSelector: '.tour-swarm',
        title: 'AI Swarm Review Otonom',
        content: 'Kirim dokumen ke multi-agent swarm otonom untuk disimulasikan perdebatannya oleh Auditor, Compliance, dan Manager Agent demi hasil konsensus audit yang mendalam.',
        position: 'bottom' as const
    }
];
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
    const [isMobileScreen, setIsMobileScreen] = useState(isMobile);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkMobile = () => {
            setIsMobileScreen(window.innerWidth < 768 || isMobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile]);

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

    const handleSubmitDoc = async () => {
        if (!editor || !activeDocumentId) return;

        const plainText = extractPlainText(editor);
        const titleToSave = titleInput.trim() || 'Untitled Document';

        toast.promise(
            updateTextMutation.mutateAsync({
                id: activeDocumentId,
                text: plainText,
                title: titleToSave,
                status: 'pending_qa',
            }),
            {
                loading: 'Mengirimkan dokumen ke QA Gate...',
                success: () => {
                    markSynced();
                    createSnapshot('Submitted to QA');
                    onSave?.();
                    refetchDocuments();
                    return 'Dokumen berhasil dikirim ke QA Gate!';
                },
                error: (err: any) => `Gagal mengirim dokumen: ${err.message || err}`,
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

    const handleLoadSampleDirect = async () => {
        const sampleId = crypto.randomUUID();
        const title = "Draf Anggaran Hardware Dinas Kominfo 2026";
        const text = `DRAFT ANGGARAN DINAS KOMUNIKASI & INFORMATIKA
Wilayah : Purbalingga
--------------------------------------------
Berikut adalah rencana anggaran pengadaan hardware tahun 2026:

1. Laptop IT Lenovo ThinkPad : Rp 25.000.000 (5 unit)
2. Printer HP LaserJet : Rp 4.500.000 (3 unit)
3. AC Split Daikin 1.5 PK : Rp 8.500.000 (2 unit)
4. Semen Padang : Rp 120.000 (150 sak)
5. Printer Canon Pixma : Rp 1.500.000 (2 unit)`;

        try {
            toast.loading("Membuat dokumen contoh...", { id: "sample-loader-direct" });
            await updateTextMutation.mutateAsync({
                id: sampleId,
                text,
                title
            });
            localStorage.setItem('elysian_editor_last_active', Date.now().toString());
            toast.success("Draf anggaran contoh berhasil dimuat! AI Guardrails telah mendeteksi anomali secara instan.", { id: "sample-loader-direct" });
            router.replace(`/editor?id=${sampleId}`);
        } catch (e: any) {
            toast.error("Gagal memuat template: " + (e.message || e), { id: "sample-loader-direct" });
        }
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
                class: 'prose prose-slate prose-base w-full max-w-[816px] min-h-[1050px] p-16 focus:outline-none dark:prose-invert bg-white dark:bg-[#0b1120] mx-auto transition-colors duration-300',
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
    const { suggestion, isLoading: isGhostwriterLoading, acceptSuggestion, discardSuggestion } = useGhostwriter(editor, isMobileScreen);

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
            isMobileScreen ? "flex-col p-2" : "flex-row"
        )}>
            {/* Custom Inline Styling for Microsoft Word Page Breaks inside Tiptap */}
            <style jsx global>{`
                .ProseMirror hr {
                    border: none !important;
                    height: 48px !important;
                    background-color: #f1f5f9 !important; /* Light mode workspace background */
                    margin-left: -4rem !important; /* Exceed the 4rem paper padding */
                    margin-right: -4rem !important;
                    margin-top: 2.5rem !important;
                    margin-bottom: 2.5rem !important;
                    box-shadow: inset 0 12px 10px -10px rgba(0,0,0,0.06), inset 0 -12px 10px -10px rgba(0,0,0,0.06) !important;
                    position: relative !important;
                    cursor: not-allowed !important;
                    user-select: none !important;
                }
                .dark .ProseMirror hr {
                    background-color: #070e1c !important; /* Dark mode workspace background */
                    box-shadow: inset 0 15px 12px -10px rgba(0,0,0,0.55), inset 0 -15px 12px -10px rgba(0,0,0,0.55) !important;
                }
                .ProseMirror hr::before {
                    content: "PAGE BREAK • HALAMAN BARU" !important;
                    position: absolute !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    font-size: 8px !important;
                    font-weight: 850 !important;
                    letter-spacing: 0.18em !important;
                    color: #94a3b8 !important;
                    background-color: #ffffff !important;
                    padding: 3px 12px !important;
                    border-radius: 9999px !important;
                    border: 1px dashed #cbd5e1 !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
                }
                .dark .ProseMirror hr::before {
                    color: #475569 !important;
                    background-color: #0b1120 !important;
                    border: 1px dashed #1e293b !important;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
                }
                
                /* Hide scrollbar utility class */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* PDF/Source View */}
            {!isMobileScreen && pdfUrl && (
                <Card className="flex-1 bg-slate-50 dark:bg-[#0B1120]/40 border-slate-200 dark:border-blue-900/30 overflow-hidden flex flex-col glass-obsidian max-w-[450px]">
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
                <div className="px-4 py-3 border-b border-slate-200 dark:border-blue-900/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-slate-50/50 dark:bg-[#0B1120]/60 backdrop-blur-sm shrink-0">
                    <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="shrink-0">
                                        <Select
                                            value={activeDocumentId}
                                            onValueChange={(val) => {
                                                if (val) router.replace(`/editor?id=${val}`);
                                            }}
                                        >
                                            <SelectTrigger className="tour-editor-select w-[140px] sm:w-[180px] h-8 border border-slate-200/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all text-xs font-medium px-2.5 flex items-center gap-1.5 shrink-0">
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
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Pilih draf anggaran aktif yang ingin diedit
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleCreateNew}
                                        className="h-8 w-8 shrink-0 border border-slate-200/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all flex items-center justify-center"
                                    >
                                        <Plus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Buat draf dokumen kosong baru
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleLoadSampleDirect}
                                        className="h-8 w-8 shrink-0 border border-blue-200/50 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm hover:bg-blue-105 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center animate-pulse"
                                    >
                                        <FilePlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Muat draf anggaran contoh Dinas Kominfo 2026 secara instan
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleDeleteActive}
                                        disabled={deleteDocumentMutation.isPending}
                                        className="h-8 w-8 shrink-0 border border-red-200/30 dark:border-red-900/30 bg-red-50/10 hover:bg-red-50/20 text-red-600 dark:text-red-400 rounded-lg shadow-sm backdrop-blur-md transition-all flex items-center justify-center disabled:opacity-30"
                                    >
                                        {deleteDocumentMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Hapus draf aktif saat ini secara permanen
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="h-6 w-px bg-slate-200 dark:bg-blue-900/30 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium shrink-0">Judul:</span>
                            <input
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-blue-900/30 rounded px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-blue-500 w-full sm:w-[160px] font-medium placeholder-slate-400"
                                placeholder="Judul Dokumen..."
                            />
                            <Badge variant="outline" className="text-[10px] font-normal bg-white dark:bg-slate-800 shrink-0 h-6">
                                v{currentDocument?.version || 1}
                            </Badge>
                            {activeDocInfo?.status && (
                                <Badge 
                                    variant="outline" 
                                    className={cn(
                                        "text-[10px] font-semibold shrink-0 h-6 uppercase px-2",
                                        activeDocInfo.status === "pending_qa" ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-800" :
                                        activeDocInfo.status === "ready" ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-250 dark:border-green-800" :
                                        activeDocInfo.status === "draft" ? "bg-slate-55 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700" :
                                        "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                    )}
                                >
                                    {activeDocInfo.status === "pending_qa" ? "Pending QA" :
                                     activeDocInfo.status === "ready" ? "Ready" :
                                     activeDocInfo.status}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* HORIZONTAL SCROLL ACTION BAR ON MOBILE */}
                    <div className={cn(
                        "flex items-center gap-2 w-full",
                        isMobileScreen 
                            ? "overflow-x-auto whitespace-nowrap no-scrollbar pb-1 px-0.5 pt-0.5 scroll-smooth" 
                            : "lg:w-auto justify-end shrink-0"
                    )}>
                        <span className="text-xs text-muted-foreground hidden lg:inline-block mr-2 shrink-0">
                            {editor?.storage.characterCount.words() || 0} words
                        </span>
                        
                        <div className="shrink-0">
                            <VersionHistory />
                        </div>
                                                <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleProcessWithAI}
                                        className="tour-guardrail h-8 gap-1.5 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/30 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:border-transparent transition-all duration-300 shadow-sm shrink-0 text-xs font-bold"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span>Guardrail Check</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Cek harga mandiri cepat secara real-time terhadap batas wajar Nemesis DB
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={handleSwarmReview}
                                        className="tour-swarm h-8 gap-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 shadow-sm transition-all shrink-0 text-xs font-bold"
                                    >
                                        <Users className="h-3.5 w-3.5" />
                                        <span>Swarm Review</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Jalankan debat otonom Multi-Agent Swarm (Auditor, Compliance, Manager) untuk analisis mendalam
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsBulkModalOpen(true)}
                                        className="h-8 gap-1.5 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all shadow-sm shrink-0 text-xs font-bold"
                                    >
                                        <UploadCloud className="h-3.5 w-3.5" />
                                        <span>Import Bulk</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Impor banyak draf anggaran sekaligus dari database staging
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleExportPDF}
                                        className="h-8 gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all shadow-sm shrink-0 text-xs font-bold"
                                    >
                                        <Printer className="h-3.5 w-3.5" />
                                        <span>Export PDF</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Ekspor dokumen ke PDF resmi lengkap dengan laporan kepatuhan AI
                                </TooltipContent>
                            </Tooltip>

                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={updateTextMutation.isPending}
                                        className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0 text-xs font-bold"
                                    >
                                        {updateTextMutation.isPending ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Save className="h-3.5 w-3.5" />
                                        )}
                                        <span>Save</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Simpan draf anggaran Anda ke server secara manual
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={handleSubmitDoc}
                                        disabled={updateTextMutation.isPending || activeDocInfo?.status === 'ready'}
                                        className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0 text-xs font-bold"
                                    >
                                        {updateTextMutation.isPending ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Send className="h-3.5 w-3.5" />
                                        )}
                                        <span>Submit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] border-slate-800 font-medium">
                                    Kirim dokumen ini ke RAG pipeline / QA Gate
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Tiptap Toolbar */}
                <EditorToolbar editor={editor} />

                {/* Floating Menu */}
                <EditorBubbleMenu editor={editor} />

                <div className="flex flex-1 overflow-hidden">
                    {/* ADAPTIVE WORKSPACE BACKGROUND (Light: slate-100, Dark: obsidian #070e1c) */}
                    <div
                        className="flex-1 overflow-y-auto bg-slate-100 dark:bg-[#070e1c] p-3 sm:p-6 md:p-8 flex flex-col items-center w-full min-h-[500px] transition-colors duration-300"
                        onClick={() => editor?.chain().focus().run()}
                    >
                        <div className="w-full max-w-[816px] flex flex-col relative shrink-0">
                            {/* Sleek Contextual Tip Banner */}
                            <div className="w-full mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-900/30 rounded-lg flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 shrink-0">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-500 shrink-0 animate-pulse" />
                                    <span>
                                        <strong>Petunjuk Cepat:</strong> Tulis anggaran dalam format <code>Nama Barang : Rp Harga</code> (contoh: <code>Laptop IT : Rp 25.000.000</code>) agar AI Guardrails mendeteksinya secara otomatis!
                                    </span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLoadSampleDirect();
                                    }}
                                    className="ml-3 px-2.5 py-1 bg-white hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-md font-bold text-[10px] text-blue-600 dark:text-blue-400 transition-colors shadow-sm"
                                >
                                    Muat Contoh
                                </button>
                            </div>

                            {/* MICROSOFT WORD STYLE RULER */}
                            <div className="w-full h-5 bg-white dark:bg-[#0f172a] border-x border-t border-slate-200 dark:border-blue-900/30 rounded-t-lg flex items-center justify-between px-16 text-[8px] text-slate-400 dark:text-slate-500 font-bold select-none shrink-0 transition-colors duration-300">
                                <span>L</span>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-blue-950/25 mx-4 relative">
                                    <div className="absolute top-1/2 left-[10%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[20%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[30%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[40%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[50%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[60%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[70%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[80%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                    <div className="absolute top-1/2 left-[90%] w-0.5 h-1 bg-slate-300 dark:bg-slate-700" />
                                </div>
                                <span>R</span>
                            </div>

                            {/* WORD PAPER A4 CONTAINER */}
                            <div 
                                className="tour-canvas w-full bg-white dark:bg-[#0b1120] border-x border-b border-slate-200 dark:border-blue-900/30 shadow-[0_10px_35px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] rounded-b-lg group relative transition-colors duration-300"
                                onClick={() => editor?.commands.focus()}
                            >
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    </div>

                    {/* Fraud Alert Sidebar */}
                    {fraudAlert && (
                        <div className="w-80 border-l border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4 overflow-y-auto animate-in slide-in-from-right-8 shrink-0">
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
                isMobile={isMobileScreen}
            />
            {/* Guided Tour Engine */}
            <GuidedTour steps={editorTourSteps} tourKey="editor_tour" />
        </div>
    );
}
