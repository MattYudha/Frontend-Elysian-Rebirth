// src/packages/x/rag/KnowledgeHub.tsx

"use client";

import { useState } from "react";
import { FileUploadZone } from "./FileUploadZone";
import { DocumentList, KnowledgeDocument } from "./DocumentList";
import { SourceDrawer } from "./SourceDrawer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function KnowledgeHub() {
    const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section Removed - Handled by Navbar */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload Zone (1/3 width) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle>Upload Sources</CardTitle>
                            <CardDescription>
                                Add PDFs, Docs, or Text files to expand the AI&apos;s knowledge.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileUploadZone onUpload={(files) => console.log("Files uploaded:", files)} />
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

                {/* Right Column: Document List (2/3 width) */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Indexed Documents</CardTitle>
                            <CardDescription>
                                View and manage processed content.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Pass handler to open drawer */}
                            <DocumentList onSelectDocument={(doc) => setSelectedDoc(doc)} />
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
