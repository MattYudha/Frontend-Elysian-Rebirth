import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Activity, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QuickStatsProps {
    docs: number;
    apiCalls: number;
    errorRate: number;
    successRate: number;
}

export function DashboardStats({ docs, apiCalls, errorRate, successRate }: QuickStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-400">
                        Docs Indexed
                    </CardTitle>
                    <FileText className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{docs.toLocaleString()}</div>
                    <p className="text-xs text-blue-400/60 mt-1">
                        +20% from last month
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-400">
                        API Calls
                    </CardTitle>
                    <Activity className="h-4 w-4 text-amber-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{(apiCalls / 1000).toFixed(1)}k</div>
                    <p className="text-xs text-amber-400/60 mt-1">
                        +15% from last week
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-400">
                        Error Rate
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{errorRate}%</div>
                    <p className="text-xs text-red-400/60 mt-1">
                        Within limits
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-400">
                        Success
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{successRate}%</div>
                    <p className="text-xs text-emerald-400/60 mt-1">
                        Solid performance
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

