'use client';

import React, { useState } from 'react';
import { Search, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { ScrollArea } from '@/components/ui/';
import { cn } from '@/lib/utils';

export interface RetrievedChunk {
    id: string;
    content: string;
    score: number;
    metadata: {
        source: string;
        page?: number;
        section?: string;
        chunkIndex?: number;
    };
}

export interface QAPair {
    id: string;
    question: string;
    answer: string;
    chunks: RetrievedChunk[];
    timestamp: Date;
}

export interface RagSearchPlaygroundProps {
    query?: string;
    retrievedChunks?: RetrievedChunk[];
    qaHistory?: QAPair[];
    onSearch?: (query: string) => void;
    isSearching?: boolean;
    className?: string;
}

export const RagSearchPlayground: React.FC<RagSearchPlaygroundProps> = ({
    query: initialQuery = '',
    retrievedChunks = [],
    qaHistory = [],
    onSearch,
    isSearching = false,
    className,
}) => {
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = () => {
        if (query.trim()) {
            onSearch?.(query.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <Card className={cn("flex flex-col h-full", className)}>
            <CardHeader>
                <CardTitle>RAG Search Playground</CardTitle>
                <CardDescription>
                    Test retrieval and answer generation in real-time
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Search Input */}
                <div className="flex gap-2">
                    <Textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter your search query..."
                        className="min-h-[80px] flex-1 resize-none"
                        disabled={isSearching}
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={isSearching || !query.trim()}
                        className="h-auto px-6"
                    >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Retrieved Context Preview */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center justify-between">
                        Retrieved Context
                        {retrievedChunks.length > 0 && <Badge variant="secondary">{retrievedChunks.length} chunks</Badge>}
                    </h3>

                    {isSearching ? (
                        <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border rounded-lg bg-muted/20">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <span className="text-sm">Retrieving knowledge...</span>
                        </div>
                    ) : retrievedChunks.length > 0 ? (
                        <ScrollArea className="h-[280px] w-full rounded-md border p-4">
                            <div className="space-y-4">
                                {retrievedChunks.map((chunk) => (
                                    <div key={chunk.id} className="p-4 rounded-lg bg-muted/50 border hover:bg-muted transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-3 w-3 text-blue-500" />
                                                <span className="text-xs font-medium">{chunk.metadata.source}</span>
                                                {chunk.metadata.page && (
                                                    <Badge variant="outline" className="text-[10px] h-5">P.{chunk.metadata.page}</Badge>
                                                )}
                                            </div>
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                {(chunk.score * 100).toFixed(1)}% match
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed font-mono text-[13px]">
                                            {chunk.content}
                                        </p>
                                        <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                                            <span>Chunk #{chunk.metadata.chunkIndex || 0}</span>
                                            <span className="font-mono">{chunk.id}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                            <Search className="h-8 w-8 mb-2 opacity-50" />
                            <span className="text-sm">Enter a query to see results</span>
                        </div>
                    )}
                </div>

                {/* History (Simplified List) */}
                {qaHistory.length > 0 && (
                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-semibold mb-3">Recent Queries</h3>
                        <div className="space-y-2">
                            {qaHistory.slice(0, 3).map((qa) => (
                                <div key={qa.id} className="text-xs p-2 rounded bg-muted/30 border">
                                    <p className="font-medium mb-1">Q: {qa.question}</p>
                                    <p className="text-muted-foreground line-clamp-1">A: {qa.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

RagSearchPlayground.displayName = 'RagSearchPlayground';
