import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Activity, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

interface QuickStatsProps {
    docs: number;
    apiCalls: number;
    errorRate: number;
    successRate: number;
    isLoading?: boolean;
}

export function DashboardStats({ docs, apiCalls, errorRate, successRate, isLoading }: QuickStatsProps) {
    const { t } = useTranslation();

    const StatValue = ({ value, suffix = "" }: { value: string | number, suffix?: string }) => (
        isLoading ? <Skeleton className="h-8 w-24 bg-white/20" /> :
            <div className="text-2xl font-bold text-foreground">{value}{suffix}</div>
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4 md:mb-6 lg:mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-400">
                        {t.dashboard.docsIndexed}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <StatValue value={docs.toLocaleString()} />
                    <p className="text-xs text-blue-400/60 mt-1">
                        +20% {t.dashboard.fromLastMonth}
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-400">
                        {t.dashboard.apiCalls}
                    </CardTitle>
                    <Activity className="h-4 w-4 text-amber-400" />
                </CardHeader>
                <CardContent>
                    <StatValue value={(apiCalls / 1000).toFixed(1)} suffix="k" />
                    <p className="text-xs text-amber-400/60 mt-1">
                        +15% {t.dashboard.fromLastWeek}
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-400">
                        {t.dashboard.errorRate}
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                    <StatValue value={errorRate} suffix="%" />
                    <p className="text-xs text-red-400/60 mt-1">
                        {t.dashboard.withinLimits}
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-400">
                        {t.dashboard.success}
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <StatValue value={successRate} suffix="%" />
                    <p className="text-xs text-emerald-400/60 mt-1">
                        {t.dashboard.solidPerformance}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
