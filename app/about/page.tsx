'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { RefreshCcw, CheckCircle2, XCircle, Activity, Server, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { APP_NAME } from '@/lib/config';

export default function AboutPage() {
    const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

    useEffect(() => {
        checkApiHealth();
    }, []);

    const checkApiHealth = async () => {
        setApiStatus('checking');
        try {
            const response = await fetch('/api/health');
            setApiStatus(response.ok ? 'online' : 'offline');
        } catch {
            setApiStatus('offline');
        }
    };

    const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
    const buildDate = new Date().toISOString();
    const nodeEnv = process.env.NODE_ENV || 'development';

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader
                title={`About ${APP_NAME}`}
                subtitle="System information and health status."
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Application Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow label="Version" value={version} />
                        <InfoRow label="Environment">
                            <Badge variant={nodeEnv === 'production' ? 'default' : 'secondary'}>
                                {nodeEnv}
                            </Badge>
                        </InfoRow>
                        <InfoRow label="Build Date" value={new Date(buildDate).toLocaleDateString()} />
                        <InfoRow label="API Status">
                            {apiStatus === 'checking' && <Badge variant="outline">Checking...</Badge>}
                            {apiStatus === 'online' && (
                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Online
                                </Badge>
                            )}
                            {apiStatus === 'offline' && (
                                <Badge variant="destructive">
                                    <XCircle className="mr-1 h-3 w-3" /> Offline
                                </Badge>
                            )}
                        </InfoRow>

                        <div className="pt-4">
                            <Button variant="outline" size="sm" onClick={checkApiHealth} className="gap-2">
                                <RefreshCcw className={`h-4 w-4 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
                                Refresh Status
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Workspace Versions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow label="@enterprise-ai/x" value="1.0.0" />
                        <InfoRow label="@enterprise-ai/x-sdk" value="1.0.0" />
                        <InfoRow label="@enterprise-ai/x-markdown" value="1.0.0" />
                        <InfoRow label="Next.js" value="14.2.0" />
                        <InfoRow label="React" value="18.2.0" />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricBox title="Uptime" value="99.9%" color="text-green-500" />
                            <MetricBox title="Active Sessions" value="1" />
                            <MetricBox title="API Latency" value="45ms" color="text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({ label, value, children }: { label: string, value?: string, children?: React.ReactNode }) {
    return (
        <div className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className="text-sm">{children || value}</div>
        </div>
    );
}

function MetricBox({ title, value, color }: { title: string, value: string | number, color?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground mb-1">{title}</span>
            <span className={`text-3xl font-bold ${color || ''}`}>{value}</span>
        </div>
    );
}
