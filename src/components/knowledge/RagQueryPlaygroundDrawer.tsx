'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import { Card, CardContent } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Separator } from '@/components/ui/';
import { cn } from '@/lib/utils';

export interface RagQueryResponse {
    query: string;
    answer: string;
    sources: string[];
    chunks: Array<{
        content: string;
        score: number;
        source: string;
    }>;
    timestamp: Date;
}

export interface RagQueryPlaygroundDrawerProps {
    open: boolean;
    onClose: () => void;
    lastResponse?: RagQueryResponse;
    onSubmitQuery?: (query: string) => void;
    isProcessing?: boolean;
    className?: string;
}

export const RagQueryPlaygroundDrawer: React.FC<RagQueryPlaygroundDrawerProps> = ({
    open,
    onClose,
    lastResponse,
    onSubmitQuery,
    isProcessing = false,
    className,
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = () => {
        if (query.trim() && !isProcessing) {
            onSubmitQuery?.(query.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent side="bottom" className={cn("h-[85vh] p-0 flex flex-col", className)}>
                <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle>RAG Query Playground</SheetTitle>
                        {/* SheetClose is handled by default close button, but we can add custom if needed */}
                    </div>
                    <SheetDescription>Test your RAG pipeline with real-time queries</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Query Input */}
                        <Card className="shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex gap-2">
                                    <Textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Ask a question to test RAG retrieval and generation..."
                                        className="min-h-[80px] flex-1 resize-none bg-background"
                                        disabled={isProcessing}
                                    />
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!query.trim() || isProcessing}
                                        className="h-auto px-6"
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Processing Indicator */}
                        {isProcessing && (
                            <div className="text-center py-12">
                                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground">Retrieving context and generating answer...</p>
                            </div>
                        )}

                        {/* Response Display */}
                        {lastResponse && !isProcessing && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Query & Answer */}
                                <Card className="shadow-sm border-blue-100 bg-blue-50/30">
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Your Question:</h4>
                                            <p className="text-lg font-medium text-foreground">{lastResponse.query}</p>
                                        </div>
                                        <Separator className="bg-blue-100" />
                                        <div>
                                            <h4 className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Generated Answer:
                                            </h4>
                                            <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                                                {lastResponse.answer}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-semibold">Sources:</span> {lastResponse.sources.join(', ')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Retrieved Chunks */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 px-1">Retrieved Context Chunks</h3>
                                    <div className="grid gap-3">
                                        {lastResponse.chunks.map((chunk, index) => (
                                            <Card key={index} className="bg-card/50 hover:bg-card transition-colors">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                            {chunk.source}
                                                        </span>
                                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100">
                                                            {(chunk.score * 100).toFixed(1)}% relevance
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-foreground/80 line-clamp-3 hover:line-clamp-none transition-all duration-200">
                                                        {chunk.content}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center pb-8">
                                    <p className="text-[10px] text-muted-foreground">
                                        Response generated at {lastResponse.timestamp.toLocaleTimeString()} • {lastResponse.chunks.length} chunks retrieved
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

RagQueryPlaygroundDrawer.displayName = 'RagQueryPlaygroundDrawer';
