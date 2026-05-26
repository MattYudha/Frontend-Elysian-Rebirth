import { RagSourceSchema, RagSearchResultSchema, EditorDocumentSchema, type RagSource, type RagSearchResult, type EditorDocument } from '../schemas';
import { z } from 'zod';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const rag = {
    getSources: async (): Promise<RagSource[]> => {
        try {
            const res = await fetch('/api/proxy/documents?limit=100');
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = await res.json();
            const mapped = (json.data || []).map((doc: any) => {
                const ext = doc.title ? doc.title.split('.').pop()?.toLowerCase() : 'pdf';
                const type = ['pdf', 'docx', 'txt', 'csv', 'scanned_img', 'url', 'md'].includes(ext) ? ext : 'pdf';
                return {
                    id: doc.id,
                    name: doc.title,
                    type: type,
                    size: 10240, // 10KB static
                    uploadedAt: new Date(doc.created_at || Date.now()),
                    channel: 'web_upload',
                    stage: doc.status === 'pending_qa' ? 'verify' : 'archive',
                    status: doc.status === 'pending_qa' ? 'pending_qa' :
                             doc.status === 'draft' ? 'draft' :
                             (doc.status === 'pending' || doc.status === 'processing') ? 'processing' :
                             (doc.status === 'ready' || doc.status === 'approved') ? 'ready' :
                             doc.status === 'failed' ? 'failed' : 'processing',
                    confidenceScore: 1.0,
                    suggestedActions: [],
                    executionStatus: 'none',
                    entities: [],
                    insights: [],
                    auditLog: [],
                };
            });
            return z.array(RagSourceSchema).parse(mapped);
        } catch (err) {
            console.error("Failed to fetch real RAG sources, returning fallback mock:", err);
            const mockData = [
                {
                    id: 'src-101',
                    name: 'INV-2024-001_Acme.pdf',
                    type: 'pdf' as const,
                    size: 245678,
                    uploadedAt: new Date(Date.now() - 1000 * 60 * 5),
                    channel: 'email' as const,
                    stage: 'verify' as const,
                    status: 'ready' as const,
                    confidenceScore: 0.85,
                    metadata: {
                        documentType: 'Faktur' as const,
                        period: 'Jan 2024',
                        summary: 'Biaya server bulanan berulang',
                        keyMetrics: [{ label: 'Total', value: 'Rp 4.500.000' }]
                    },
                    suggestedActions: [
                        { label: 'Post ke Buku Besar', actionId: 'post_ledger', style: 'primary' as const },
                        { label: 'Ingatkan Approval', actionId: 'remind_mgr', style: 'ghost' as const }
                    ],
                    executionStatus: 'pending_review' as const,
                    entities: [{ type: 'supplier' as const, name: 'Acme Cloud Services' }],
                    insights: [{ type: 'risk' as const, text: 'Jumlah 10% lebih tinggi dari rata-rata' }],
                    auditLog: [{ action: 'Masuk via Email', user: 'System', timestamp: new Date() }],
                },
            ];
            return z.array(RagSourceSchema).parse(mockData);
        }
    },

    search: async (query: string): Promise<RagSearchResult[]> => {
        try {
            const res = await fetch('/api/proxy/documents/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, top_k: 10 }),
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            const mapped = (data.results || []).map((r: any) => ({
                id: r.chunk_id || `chunk_${Math.random()}`,
                content: r.content,
                source: r.document_title || 'Unknown Document',
                score: r.rrf_score || 0,
                metadata: {
                    vector_rank: r.vector_rank || 0,
                    fts_rank: r.fts_rank || 0,
                    document_id: r.document_id || '',
                },
            }));
            return z.array(RagSearchResultSchema).parse(mapped);
        } catch (err) {
            console.error("Failed to query real RAG search, returning fallback mock:", err);
            await delay(800);
            const mockData = [
                {
                    id: 'chunk-1',
                    content: `Revenue for the third quarter increased by 15% year-over-year. Matches: "${query}"`,
                    source: 'Q3_Financials.pdf',
                    score: 0.94,
                    metadata: { page: 12, section: '4.1' },
                }
            ];
            return z.array(RagSearchResultSchema).parse(mockData);
        }
    },

    getEditorDocument: async (id: string): Promise<EditorDocument> => {
        await delay(600);
        const mockData = {
            id,
            title: 'Safety Protocol v4.2',
            content: `# 3.1 Emergency Shutdown Procedures\n\nIn the event of a critical system failure...`,
            version: 4,
            pdfUrl: '/mock/sop.pdf',
            lastModified: new Date(),
        };
        return EditorDocumentSchema.parse(mockData);
    },

    /**
     * Frontend-only mock for processing document text.
     * In the real backend, this would:
     * 1. Receive text
     * 2. Generate Embeddings (OpenAI/Cohere)
     * 3. Store in Vector DB (Pinecone/Milvus)
     */
    processDocument: async (documentId: string, text: string): Promise<{ success: boolean; message: string }> => {
        if (text.length < 50) {
            return {
                success: false,
                message: "Teks terlalu pendek untuk dianalisis. Mohon tulis lebih banyak."
            };
        }

        try {
            const res = await fetch(`/api/proxy/documents/${documentId}/text`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ extracted_text: text })
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
            }

            return {
                success: true,
                message: "Dokumen berhasil disimpan ke database."
            };
        } catch (err: any) {
            console.error("Failed to save staging document text:", err);
            return {
                success: false,
                message: `Gagal menyimpan dokumen: ${err.message}`
            };
        }
    },

    /**
     * Enterprise Asynchronous Upload Flow (Step 1)
     */
    uploadDocument: async (file: File, category: string, tenantId: string): Promise<{ success: boolean; documentId?: string; message: string }> => {
        // Build FormData for multipart upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('category', category);

        // Simulate sending to backend and getting an HTTP 202 Accepted
        await delay(800); 
        
        return {
            success: true,
            documentId: `doc-${Date.now()}`,
            message: "HTTP 202 Accepted: Document queued for processing."
        };
    },

    /**
     * Enterprise Polling mechanism (Step 2)
     */
    pollDocumentStatus: async (documentId: string, elapsedMs: number): Promise<{ status: 'PENDING' | 'PARSING' | 'VECTORIZING' | 'COMPLETED' | 'FAILED', progress: number }> => {
        // Simulate a real backend processing pipeline based on time elapsed instead of random jumps
        await delay(200);

        if (elapsedMs < 3000) {
            return { status: 'PENDING', progress: 15 };
        } else if (elapsedMs < 7000) {
            return { status: 'PARSING', progress: 45 };
        } else if (elapsedMs < 12000) {
            return { status: 'VECTORIZING', progress: 80 };
        } else {
            return { status: 'COMPLETED', progress: 100 };
        }
    },

    /**
     * Enterprise RAG Evaluator (Phase 3)
     */
    evaluateGuardrails: async (text: string) => {
        // Parse items from the text editor
        const itemPattern = /([a-zA-Z0-9\s\-\*]+?)\s*:\s*Rp\s*([0-9.,]+)/gi;
        const items: Array<{ item_name: string; price: number }> = [];
        let match;
        while ((match = itemPattern.exec(text)) !== null) {
            const name = match[1].trim();
            const priceStr = match[2].replace(/[.,]/g, '');
            const price = parseFloat(priceStr);
            if (name && !isNaN(price)) {
                const cleanedName = name.replace(/^[-\*\s\d]+\s*(?:unit|sak|pcs|buah|box|kg|lembar|pax|lusin)?\s*/i, "").trim();
                if (cleanedName) {
                    items.push({ item_name: cleanedName, price });
                }
            }
        }

        if (items.length === 0) {
            return { isAnomaly: false };
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
                if (result.data) {
                    const violation = result.data.find((item: any) => item.is_violation);
                    if (violation) {
                        return {
                            isAnomaly: true,
                            reason: `Terindikasi Mark-up Anggaran pada item '${violation.item_name}'. Harga pengajuan Rp ${violation.price.toLocaleString('id-ID')} melebihi batas regulasi daerah.`,
                            quote: `Ref: "Nemesis Ground Truth Database (standard_price)"\n\n"Batas Maksimum Harga Satuan resmi untuk '${violation.item_name}' (${violation.standard_category || 'Kategori Umum'}) adalah Rp ${violation.max_price.toLocaleString('id-ID')}. Kelebihan anggaran sebesar Rp ${violation.excess_amount.toLocaleString('id-ID')} per unit."`
                        };
                    }
                }
            }
        } catch (err) {
            console.error("Failed to perform real guardrails check:", err);
        }

        return { isAnomaly: false };
    }
};
