"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KnowledgeDocument } from "./DocumentList";
import { FileText, Database, Info, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceDrawerProps {
    document: KnowledgeDocument | null;
    open: boolean;
    onClose: () => void;
}

export function SourceDrawer({ document, open, onClose }: SourceDrawerProps) {
    if (!document) return null;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[600px] sm:max-w-[700px] p-0 flex flex-col h-full bg-slate-50/50">
                <SheetHeader className="px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <SheetTitle className="text-lg font-bold text-slate-800">{document.name}</SheetTitle>
                            <SheetDescription className="text-xs">
                                {document.tokens.toLocaleString()} tokens • {document.status}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 bg-white border-b border-slate-100">
                        <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-6">
                            <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-0 font-semibold text-slate-500 data-[state=active]:text-blue-600">
                                <FileText className="w-4 h-4 mr-2" /> Text Preview
                            </TabsTrigger>
                            <TabsTrigger value="chunks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-0 font-semibold text-slate-500 data-[state=active]:text-blue-600">
                                <Database className="w-4 h-4 mr-2" /> Chunks ({Math.floor(document.tokens / 500)})
                            </TabsTrigger>
                            <TabsTrigger value="metadata" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-0 font-semibold text-slate-500 data-[state=active]:text-blue-600">
                                <Info className="w-4 h-4 mr-2" /> Metadata
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        {/* Tab: Text Preview */}
                        <TabsContent value="preview" className="mt-0">
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[400px]">
                                <div className="prose prose-sm max-w-none text-slate-600">
                                    <h3 className="text-slate-900">Executive Summary</h3>
                                    <p>
                                        This document outlines the strategic roadmap for Project Phoenix. The primary objective is to leverage generative AI to automate customer support workflows, reducing response times by 40% within Q3 2024.
                                    </p>
                                    <h4>Key Deliverables</h4>
                                    <ul>
                                        <li>Integration with vector database (Pinecone/Weaviate).</li>
                                        <li>Fine-tuning of LLaMA-3 adapter for domain-specific knowledge.</li>
                                        <li>Deployment of RAG pipeline on edge nodes.</li>
                                    </ul>
                                    <p>
                                        The team will consist of 3 AI engineers, 2 Full-stack developers, and 1 Product Manager. Initial budget allocation is set at $150,000 for infrastructure and compute credits.
                                    </p>
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 my-4 text-yellow-800 text-xs font-mono">
                                        [AI NOTE: This is a simulated preview of the parsed text content from {document.name}.]
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab: Chunks */}
                        <TabsContent value="chunks" className="mt-0 space-y-4">
                            {[1, 2, 3].map((chunk) => (
                                <div key={chunk} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-blue-500 bg-blue-50 px-2 py-1 rounded">Chunk #{chunk}</span>
                                        <span className="text-xs text-slate-400">Score: 0.8{9 - chunk}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-3 group-hover:line-clamp-none transition-all">
                                        ...vector database integration is crucial for the RAG pipeline. We will evaluate Pinecone vs Weaviate based on latency and cost at scale. The embedding model chosen is text-embedding-3-small due to its balance of performance and cost...
                                    </p>
                                </div>
                            ))}
                        </TabsContent>

                        {/* Tab: Metadata */}
                        <TabsContent value="metadata" className="mt-0">
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">File ID</dt>
                                        <dd className="mt-1 flex items-center text-sm text-slate-900">
                                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{document.id}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2"><Copy className="w-3 h-3" /></Button>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">MIME Type</dt>
                                        <dd className="mt-1 text-sm text-slate-900 uppercase">{document.type}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">File Size</dt>
                                        <dd className="mt-1 text-sm text-slate-900">2.4 MB</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Uploaded By</dt>
                                        <dd className="mt-1 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">A</div>
                                            <span className="text-sm text-slate-900">Admin User</span>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
