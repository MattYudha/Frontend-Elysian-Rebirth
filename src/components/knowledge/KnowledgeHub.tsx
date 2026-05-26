"use client";

import { useState } from "react";
import { FileUploadZone } from "./FileUploadZone";
import { DocumentList } from "./DocumentList";
import { SourceDrawer } from "./SourceDrawer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RagSearchPlayground, RetrievedChunk, QAPair } from "./RagSearchPlayground";
import { Loader2 } from "lucide-react";
import * as sdk from "@/lib/sdk";

import type { RagSource } from '@/lib/sdk/schemas';

interface KnowledgeHubProps {
    documents?: RagSource[];
    isLoading?: boolean;
    onUpload?: (file: File) => void;
}

export function KnowledgeHub({ documents = [], isLoading, onUpload }: KnowledgeHubProps) {
    const [selectedDoc, setSelectedDoc] = useState<RagSource | null>(null);

    // Playground Search states
    const [retrievedChunks, setRetrievedChunks] = useState<RetrievedChunk[]>([]);
    const [qaHistory, setQaHistory] = useState<QAPair[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        try {
            const results = await sdk.rag.search(query);
            const mappedChunks: RetrievedChunk[] = results.map(r => ({
                id: r.id,
                content: r.content,
                score: r.score,
                metadata: {
                    source: r.source,
                    page: r.metadata.page || r.metadata.vector_rank || undefined,
                }
            }));
            setRetrievedChunks(mappedChunks);

            // Add to history
            const newQA: QAPair = {
                id: `qa-${Date.now()}`,
                question: query,
                answer: mappedChunks[0]?.content || "No matching chunks found.",
                chunks: mappedChunks,
                timestamp: new Date()
            };
            setQaHistory(prev => [newQA, ...prev]);
        } catch (err) {
            console.error("Search query failed:", err);
        } finally {
            setIsSearching(false);
        }
    };

    // Processing latency indicator logic
    const processingDocs = documents.filter(doc => 
        doc.status === 'processing' || 
        doc.status === 'indexing' || 
        doc.status === 'queued' || 
        doc.status === 'uploading'
    );
    const hasProcessingDocs = processingDocs.length > 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 w-full">
            {/* Header Section Removed - Handled by Navbar */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload Zone (1/3 width) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-200 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm glass-obsidian">
                        <CardHeader>
                            <CardTitle>Upload Sources</CardTitle>
                            <CardDescription>
                                Add PDFs, Docs, or Text files to expand the AI&apos;s knowledge.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileUploadZone tenantId="demo-tenant" authToken="demo-token" />
                        </CardContent>
                    </Card>

                    {/* Quick Tips Card */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-semibold mb-1">💡 Pro Tip</p>
                        <p className="opacity-90">
                            For best results, ensure your documents have clear headings and manageable file sizes (under 5MB).
                        </p>
                    </div>
                </div>

                {/* Right Column: Document Explorer Tabs (2/3 width) */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm h-full glass-obsidian">
                        <CardHeader className="pb-2">
                            <CardTitle>Knowledge Explorer</CardTitle>
                            <CardDescription>
                                View processed content and test real-time RAG retrieval.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="documents" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                    <TabsTrigger value="documents" className="rounded-md">Indexed Documents</TabsTrigger>
                                    <TabsTrigger value="playground" className="rounded-md">Search Playground</TabsTrigger>
                                </TabsList>
                                <TabsContent value="documents">
                                    <DocumentList documents={documents} isLoading={isLoading} onSelectDocument={(doc) => setSelectedDoc(doc)} />
                                </TabsContent>
                                <TabsContent value="playground" className="space-y-4">
                                    {hasProcessingDocs && (
                                        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-xs flex items-center gap-2.5 text-blue-750 dark:text-blue-300 animate-pulse">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-blue-500" />
                                            <span>
                                                <strong>Syncing with Neural Brain:</strong> {processingDocs.length} document(s) are currently being vectorized. Search matching may be incomplete until indexing finishes.
                                            </span>
                                        </div>
                                    )}
                                    <RagSearchPlayground
                                        retrievedChunks={retrievedChunks}
                                        qaHistory={qaHistory}
                                        onSearch={handleSearch}
                                        isSearching={isSearching}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* The Detail Drawer */}
            <SourceDrawer
                document={selectedDoc}
                open={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
            />
        </div>
    );
}
