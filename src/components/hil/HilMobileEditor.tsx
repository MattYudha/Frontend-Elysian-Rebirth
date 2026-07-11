'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/';
import { Card } from '@/components/ui/';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { FileText, Edit, History, CheckCircle2, Wand2, Globe, FileOutput } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HilMobileEditorProps {
    title: string;
    project: {
        name: string;
        type: string;
    };
    sourceMeta: {
        filename: string;
        snippet?: string;
    };
    initialContent: string;
    versions?: Array<{
        id: string;
        type: 'ai' | 'human';
        title: string;
        timestamp: Date;
    }>;
    onChangeContent: (value: string) => void;
    onAiRewrite?: () => void;
    onAiSummarize?: () => void;
    onAiTranslate?: () => void;
    className?: string;
}

export const HilMobileEditor: React.FC<HilMobileEditorProps> = ({
    title,
    project,
    sourceMeta,
    initialContent,
    versions = [],
    onChangeContent,
    onAiRewrite,
    onAiSummarize,
    onAiTranslate,
    className,
}) => {
    const [content, setContent] = useState(initialContent);
    const [viewMode, setViewMode] = useState<'original' | 'draft'>('draft');

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChangeContent(newContent);
    };

    return (
        <div className={cn("h-screen flex flex-col bg-slate-50", className)}>
            {/* Header */}
            <div className="bg-background border-b p-4 shadow-sm z-10">
                <div className="mb-3">
                    <h5 className="font-semibold text-base mb-0.5 leading-tight">{title}</h5>
                    <p className="text-xs text-muted-foreground">{project.name} • {project.type}</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex rounded-md bg-muted p-1">
                    <button
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded transition-all",
                            viewMode === 'original' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-background/50"
                        )}
                        onClick={() => setViewMode('original')}
                    >
                        <FileText className="h-4 w-4" />
                        Original PDF
                    </button>
                    <button
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded transition-all",
                            viewMode === 'draft' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-background/50"
                        )}
                        onClick={() => setViewMode('draft')}
                    >
                        <Edit className="h-4 w-4" />
                        AI Draft
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="editor" className="h-full flex flex-col">
                    <div className="bg-background border-b px-4">
                        <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-6">
                            <TabsTrigger
                                value="editor"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 text-muted-foreground data-[state=active]:text-foreground"
                            >
                                <Edit className="h-4 w-4 mr-2" /> Editor
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 text-muted-foreground data-[state=active]:text-foreground"
                            >
                                <History className="h-4 w-4 mr-2" /> History
                                {versions.length > 0 && <Badge variant="secondary" className="ml-2 h-5 text-[10px] px-1">{versions.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="files"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 text-muted-foreground data-[state=active]:text-foreground"
                            >
                                <FileText className="h-4 w-4 mr-2" /> Files
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-auto bg-slate-50">
                        {/* Editor Tab */}
                        <TabsContent value="editor" className="m-0 h-full p-4 space-y-4">
                            {/* Source Mapping Snippet */}
                            {viewMode === 'draft' && (
                                <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                                    <div className="p-3">
                                        <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1">
                                            <FileText className="h-3 w-3" /> Source Context:
                                        </p>
                                        <p className="text-xs text-blue-700/80 line-clamp-2 italic">
                                            &quot;{sourceMeta.snippet || 'No snippet available'}&quot;
                                        </p>
                                    </div>
                                </Card>
                            )}

                            {viewMode === 'draft' ? (
                                <Card className="flex flex-col shadow-sm h-[calc(100%-80px)] border-slate-200">
                                    <textarea
                                        value={content}
                                        onChange={handleContentChange}
                                        placeholder="Edit AI-generated draft..."
                                        className="flex-1 w-full p-4 text-base leading-relaxed resize-none focus:outline-none bg-transparent rounded-t-lg"
                                    />
                                    {/* AI Actions */}
                                    <div className="p-2 border-t bg-slate-50/80 flex gap-2 overflow-x-auto rounded-b-lg">
                                        {onAiRewrite && (
                                            <Button variant="outline" size="sm" onClick={onAiRewrite} className="gap-1.5 h-8 text-xs whitespace-nowrap">
                                                <Wand2 className="h-3 w-3" /> Rewrite
                                            </Button>
                                        )}
                                        {onAiSummarize && (
                                            <Button variant="outline" size="sm" onClick={onAiSummarize} className="gap-1.5 h-8 text-xs whitespace-nowrap">
                                                <FileOutput className="h-3 w-3" /> Summarize
                                            </Button>
                                        )}
                                        {onAiTranslate && (
                                            <Button variant="outline" size="sm" onClick={onAiTranslate} className="gap-1.5 h-8 text-xs whitespace-nowrap">
                                                <Globe className="h-3 w-3" /> Translate
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                    <FileText className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-sm">PDF Preview Mode</p>
                                    <p className="text-xs opacity-60 mt-1">{sourceMeta.filename}</p>
                                </div>
                            )}
                        </TabsContent>

                        {/* History Tab */}
                        <TabsContent value="history" className="m-0 p-4 space-y-3">
                            {versions.length > 0 ? (
                                versions.map((version) => (
                                    <Card key={version.id} className="shadow-sm">
                                        <div className="p-3 flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-sm flex items-center gap-1.5">
                                                    {version.type === 'ai' ? '🤖' : '👤'} {version.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {version.timestamp.toLocaleString()}
                                                </div>
                                            </div>
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No history available
                                </div>
                            )}
                        </TabsContent>

                        {/* Files Tab */}
                        <TabsContent value="files" className="m-0 p-4">
                            <Card className="shadow-sm">
                                <div className="p-3 flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="font-medium text-sm truncate flex-1">
                                        {sourceMeta.filename}
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 bg-background border-t shadow-lg z-20">
                <Button className="w-full text-base font-semibold shadow-blue-200 shadow-md" size="lg">
                    Save & Continue
                </Button>
            </div>
        </div>
    );
};

HilMobileEditor.displayName = 'HilMobileEditor';
