import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Workflow, Play, Clock, CheckCircle2 } from 'lucide-react';

interface Pipeline {
    id: string;
    name: string;
    status: 'running' | 'completed' | 'failed' | 'idle';
    lastRun: string;
}

interface PipelineListProps {
    pipelines: Pipeline[];
}

export function PipelineList({ pipelines }: PipelineListProps) {
    return (
        <Card className="col-span-1 lg:col-span-2 bg-card/50 border-border">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-violet-400" />
                    Active Pipelines
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pipelines.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No active pipelines
                        </div>
                    ) : (
                        pipelines.map((pipeline) => (
                            <div
                                key={pipeline.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border hover:bg-secondary/40 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                                        <Play className="h-5 w-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground">{pipeline.name}</div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {pipeline.lastRun}
                                        </div>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`${pipeline.status === 'running'
                                        ? 'text-blue-400 border-blue-400/30'
                                        : pipeline.status === 'completed'
                                            ? 'text-green-400 border-green-400/30'
                                            : pipeline.status === 'failed'
                                                ? 'text-red-400 border-red-400/30'
                                                : 'text-slate-400 border-slate-400/30'
                                        }`}
                                >
                                    {pipeline.status === 'completed' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                    {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
