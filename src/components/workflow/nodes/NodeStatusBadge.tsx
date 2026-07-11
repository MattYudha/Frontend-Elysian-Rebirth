'use client';

import React from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { NodeStatus } from '../types';

interface NodeStatusBadgeProps {
    status?: NodeStatus;
}

export function NodeStatusBadge({ status }: NodeStatusBadgeProps) {
    if (!status || status === 'idle') return null;

    return (
        <div className="absolute -top-2 -right-2 z-10">
            {status === 'running' && (
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full shadow-sm border border-blue-200 dark:border-blue-800">
                    <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
            )}
            {status === 'success' && (
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full shadow-sm border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded-full shadow-sm border border-red-200 dark:border-red-800">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
            )}
        </div>
    );
}
