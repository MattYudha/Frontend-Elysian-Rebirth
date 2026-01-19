import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Progress } from '@/components/ui/';
import { Database, RefreshCw } from 'lucide-react';

interface KnowledgeHealthProps {
    health: number;
    totalVectors: string;
    lastSync: string;
}

export function KnowledgeHealth({ health, totalVectors, lastSync }: KnowledgeHealthProps) {
    return (
        <Card className="col-span-1 bg-card/50 border-border">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-400" />
                    Knowledge Base Health
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">System Health</span>
                            <span className="text-foreground font-medium">{health}%</span>
                        </div>
                        <Progress value={health} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Total Vectors</div>
                            <div className="text-xl font-bold text-foreground">{totalVectors}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Last Sync</div>
                            <div className="text-xl font-bold text-foreground flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-green-400" />
                                {lastSync}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
