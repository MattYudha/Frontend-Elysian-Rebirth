'use client';

import { Protected } from '@/components/auth/Protected';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Progress } from '@/components/ui/';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/';
import { RotateCcw, Trash2, PlayCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Job {
    id: string;
    type: 'rag_index' | 'workflow' | 'document_parse';
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    startedAt: string;
    completedAt?: string;
    error?: string;
}

export default function JobsPage() {
    const [jobs] = useState<Job[]>([
        {
            id: 'job-1',
            type: 'rag_index',
            status: 'running',
            progress: 67,
            startedAt: new Date(Date.now() - 120000).toISOString(),
        },
        {
            id: 'job-2',
            type: 'workflow',
            status: 'completed',
            progress: 100,
            startedAt: new Date(Date.now() - 300000).toISOString(),
            completedAt: new Date(Date.now() - 180000).toISOString(),
        },
        {
            id: 'job-3',
            type: 'document_parse',
            status: 'failed',
            progress: 45,
            startedAt: new Date(Date.now() - 600000).toISOString(),
            error: 'PDF parsing failed: unsupported format',
        },
    ]);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'rag_index': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'workflow': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'document_parse': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'running': return <RotateCcw className="h-4 w-4 animate-spin text-blue-500" />;
            case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <PlayCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Protected>
            <div className="space-y-6">
                <PageHeader
                    title="Background Jobs"
                    subtitle="Monitor async tasks and workflows."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Job Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[200px]">Progress</TableHead>
                                    <TableHead>Started</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">{job.id}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getTypeColor(job.type)}>
                                                {job.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(job.status)}
                                                <span className="capitalize text-sm">{job.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <Progress value={job.progress} className="h-2" />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>{job.progress}%</span>
                                                    {job.status === 'failed' && <span className="text-red-500">Failed</span>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(job.startedAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {job.status === 'failed' && (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Protected>
    );
}
