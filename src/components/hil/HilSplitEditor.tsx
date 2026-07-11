'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/';
import { Card } from '@/components/ui/';
import { FileText, Edit, Eye, ArrowLeftRight, Check, Wand2, Globe, FileOutput } from 'lucide-react';
import { cn } from '@/lib/utils';


export interface HilEditorProps {
    title: string;
    sourceMeta: {
        filename: string;
        page?: number;
        section?: string;
    };
    initialContent: string;
    onChangeContent: (value: string) => void;
    onApprove?: () => void;
    onAiRewrite?: () => void;
    onAiTranslate?: () => void;
    onAiSummarize?: () => void;
    className?: string;
}

export type ViewMode = 'pdf' | 'split' | 'editor';

export const HilSplitEditor: React.FC<HilEditorProps> = ({
    title,
    sourceMeta,
    initialContent,
    onChangeContent,
    onApprove,
    onAiRewrite,
    onAiTranslate,
    onAiSummarize,
    className,
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [content, setContent] = useState(initialContent);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChangeContent(newContent);
    };

    const showPdf = viewMode === 'pdf' || viewMode === 'split';
    const showEditor = viewMode === 'editor' || viewMode === 'split';

    return (
        <div className={cn("h-screen flex flex-col bg-background", className)}>
            {/* Header */}
            <div className="px-6 py-4 border-b bg-card flex justify-between items-center shadow-sm z-10">
                <div>
                    <h4 className="text-lg font-semibold tracking-tight m-0">{title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Source: {sourceMeta?.filename || 'Unknown'}
                        {sourceMeta?.page && ` • Page ${sourceMeta.page}`}
                        {sourceMeta?.section && ` • ${sourceMeta.section}`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle via ToggleGroup or just Buttons */}
                    <div className="flex bg-muted/50 p-1 rounded-lg border">
                        <Button
                            variant={viewMode === 'pdf' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('pdf')}
                            className="h-8 gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">PDF</span>
                        </Button>
                        <Button
                            variant={viewMode === 'split' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('split')}
                            className="h-8 gap-2"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                            <span className="hidden sm:inline">Split</span>
                        </Button>
                        <Button
                            variant={viewMode === 'editor' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('editor')}
                            className="h-8 gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Editor</span>
                        </Button>
                    </div>

                    {onApprove && (
                        <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            <Check className="h-4 w-4" />
                            Approve
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* PDF Preview Pane */}
                {showPdf && (
                    <div
                        className={cn(
                            "bg-slate-100 flex items-center justify-center p-6 overflow-auto border-r border-border",
                            viewMode === 'split' ? "w-1/2" : "w-full"
                        )}
                    >
                        <Card className="max-w-[800px] w-full min-h-[500px] flex flex-col items-center justify-center p-10 text-center shadow-sm">
                            <FileText className="h-16 w-16 text-slate-300 mb-4" />
                            <h4 className="text-sm font-medium text-slate-600">PDF Preview: {sourceMeta?.filename || 'Unknown'}</h4>
                            <p className="text-xs text-slate-400 mt-2 max-w-sm">
                                (PDF viewer integration would be implemented here using libraries like react-pdf or pdfjs)
                            </p>
                        </Card>
                    </div>
                )}

                {/* Editor Pane */}
                {showEditor && (
                    <div
                        className={cn(
                            "bg-background overflow-auto flex flex-col",
                            viewMode === 'split' ? "w-1/2" : "w-full"
                        )}
                    >
                        <div className="flex-1 p-6 flex flex-col max-w-4xl mx-auto w-full h-full">
                            <Card className="flex-1 flex flex-col shadow-sm border-slate-200">
                                <textarea
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Start editing..."
                                    className="flex-1 w-full p-6 text-sm leading-7 resize-none focus:outline-none bg-transparent"
                                />

                                {/* Floating AI Actions Toolbar inside editor bottom */}
                                <div className="p-3 border-t bg-slate-50 flex gap-2 flex-wrap">
                                    {onAiRewrite && (
                                        <Button variant="outline" size="sm" onClick={onAiRewrite} className="gap-2 text-violet-600 border-violet-100 hover:bg-violet-50">
                                            <Wand2 className="h-3 w-3" /> AI Rewrite
                                        </Button>
                                    )}
                                    {onAiTranslate && (
                                        <Button variant="outline" size="sm" onClick={onAiTranslate} className="gap-2 text-blue-600 border-blue-100 hover:bg-blue-50">
                                            <Globe className="h-3 w-3" /> Translate
                                        </Button>
                                    )}
                                    {onAiSummarize && (
                                        <Button variant="outline" size="sm" onClick={onAiSummarize} className="gap-2 text-orange-600 border-orange-100 hover:bg-orange-50">
                                            <FileOutput className="h-3 w-3" /> Summarize
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

HilSplitEditor.displayName = 'HilSplitEditor';
