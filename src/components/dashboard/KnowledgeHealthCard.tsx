import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KnowledgeHealthData {
    synced: number;
    total: number;
    percentage: number;
    status: 'healthy' | 'warning' | 'error';
}

export interface KnowledgeHealthCardProps {
    data?: KnowledgeHealthData;
    className?: string;
}

export const KnowledgeHealthCard: React.FC<KnowledgeHealthCardProps> = ({
    data,
    className,
}) => {
    const healthData: KnowledgeHealthData = data || {
        synced: 934,
        total: 1000,
        percentage: 93.4,
        status: 'healthy',
    };

    const getStatusColor = (status: KnowledgeHealthData['status']) => {
        switch (status) {
            case 'healthy': return 'text-green-500 stroke-green-500';
            case 'warning': return 'text-yellow-500 stroke-yellow-500';
            case 'error': return 'text-red-500 stroke-red-500';
            default: return 'text-blue-500 stroke-blue-500';
        }
    };

    const getStatusTextColor = (status: KnowledgeHealthData['status']) => {
        switch (status) {
            case 'healthy': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'error': return 'text-red-600';
            default: return 'text-blue-600';
        }
    };

    // Circular Progress Params
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (healthData.percentage / 100) * circumference;

    return (
        <Card className={cn("shadow-sm", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Database className="h-5 w-5 text-blue-500" />
                    Knowledge Base Health
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Background Circle */}
                        <svg
                            height={radius * 2}
                            width={radius * 2}
                            className="transform -rotate-90"
                        >
                            <circle
                                stroke="#e2e8f0"
                                strokeWidth={stroke}
                                fill="transparent"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />
                            <circle
                                className={cn("transition-all duration-1000 ease-out", getStatusColor(healthData.status))}
                                strokeWidth={stroke}
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset }}
                                strokeLinecap="round"
                                fill="transparent"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />
                        </svg>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={cn("text-3xl font-bold", getStatusTextColor(healthData.status))}>
                                {healthData.percentage}%
                            </span>
                            <span className="text-sm text-muted-foreground mt-1">Synced</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{healthData.synced.toLocaleString()}</span> of {healthData.total.toLocaleString()} documents indexed
                        </p>
                        <p className={cn("text-sm font-semibold uppercase tracking-wide", getStatusTextColor(healthData.status))}>
                            {healthData.status}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

KnowledgeHealthCard.displayName = 'KnowledgeHealthCard';
