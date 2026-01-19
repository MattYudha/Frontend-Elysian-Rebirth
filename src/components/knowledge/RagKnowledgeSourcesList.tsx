'use client';

import React from 'react';
import { FileText, CheckCircle2, RefreshCw, AlertTriangle, Database, Globe, File, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Progress } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { cn } from '@/lib/utils';

export interface KnowledgeSource {
    id: string;
    name: string;
    type: 'pdf' | 'faq' | 'web' | 'database' | 'other';
    status: 'syncing' | 'ready' | 'error';
    syncProgress?: number;
    embeddingModel: string;
    chunkCount: number;
    lastSync?: Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
}

export interface RagKnowledgeSourcesListProps {
    sources?: KnowledgeSource[];
    onClickSource?: (source: KnowledgeSource) => void;
    className?: string;
}

export const RagKnowledgeSourcesList: React.FC<RagKnowledgeSourcesListProps> = ({
    sources,
    onClickSource,
    className,
}) => {
    const defaultSources: KnowledgeSource[] = sources || [
        {
            id: 'src_001',
            name: 'Product Documentation',
            type: 'pdf',
            status: 'ready',
            embeddingModel: 'text-embedding-ada-002',
            chunkCount: 1247,
            lastSync: new Date(Date.now() - 3600000),
        },
        {
            id: 'src_002',
            name: 'Customer FAQ Database',
            type: 'database',
            status: 'syncing',
            syncProgress: 67,
            embeddingModel: 'text-embedding-3-small',
            chunkCount: 543,
            lastSync: new Date(Date.now() - 300000),
        },
        {
            id: 'src_003',
            name: 'Company Website Content',
            type: 'web',
            status: 'ready',
            embeddingModel: 'text-embedding-ada-002',
            chunkCount: 892,
            lastSync: new Date(Date.now() - 7200000),
        },
    ];

    const getStatusIcon = (status: KnowledgeSource['status']) => {
        switch (status) {
            case 'ready':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'syncing':
                return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
            case 'error':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
        }
    };

    const getTypeIcon = (type: KnowledgeSource['type']) => {
        switch (type) {
            case 'pdf': return <File className="h-5 w-5 text-red-500" />;
            case 'web': return <Globe className="h-5 w-5 text-blue-500" />;
            case 'database': return <Database className="h-5 w-5 text-purple-500" />;
            case 'faq': return <FileText className="h-5 w-5 text-orange-500" />;
            default: return <FileText className="h-5 w-5 text-slate-500" />;
        }
    };



    const formatTimeAgo = (date: Date): string => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <Card className={cn("shadow-sm", className)}>
            <CardHeader>
                <CardTitle>Knowledge Sources</CardTitle>
                <CardDescription>Manage and monitor your indexed data sources</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {defaultSources.map((source) => (
                        <div
                            key={source.id}
                            className={cn(
                                "flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                                onClickSource && "cursor-pointer"
                            )}
                            onClick={() => onClickSource?.(source)}
                        >
                            {/* Icon & Status */}
                            <div className="flex items-center gap-3 min-w-[40px]">
                                <div className="p-2 bg-muted rounded-full">
                                    {getTypeIcon(source.type)}
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-foreground">{source.name}</span>
                                    <Badge variant="outline" className="text-[10px] uppercase h-5 px-1.5">
                                        {source.type}
                                    </Badge>
                                    <div className="sm:hidden ml-auto">
                                        {getStatusIcon(source.status)}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                                    <span>Model: {source.embeddingModel}</span>
                                    <span>{(source.chunkCount || 0).toLocaleString()} chunks</span>
                                    {source.lastSync && (
                                        <span>Synced: {formatTimeAgo(source.lastSync)}</span>
                                    )}
                                </div>
                                {source.status === 'syncing' && source.syncProgress !== undefined && (
                                    <div className="w-full max-w-[200px] mt-2">
                                        <Progress value={source.syncProgress} className="h-1" />
                                    </div>
                                )}
                            </div>

                            {/* Status Icon (Desktop) */}
                            <div className="hidden sm:flex items-center justify-end w-10">
                                {getStatusIcon(source.status)}
                            </div>

                            {/* Action Placeholder */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

RagKnowledgeSourcesList.displayName = 'RagKnowledgeSourcesList';
