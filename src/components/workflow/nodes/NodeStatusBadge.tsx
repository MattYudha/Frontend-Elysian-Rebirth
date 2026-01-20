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
                <div className="bg-blue-100 p-1 rounded-full shadow-sm border border-blue-200">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                </div>
            )}
            {status === 'success' && (
                <div className="bg-green-100 p-1 rounded-full shadow-sm border border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 p-1 rounded-full shadow-sm border border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                </div>
            )}
        </div>
    );
}
