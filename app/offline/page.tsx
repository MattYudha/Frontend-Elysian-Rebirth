import React from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="h-10 w-10 text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-3">You are Offline</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    It seems you have lost your internet connection.
                    Please check your network settings and try again.
                </p>
                <div className="space-y-3">
                    <Button
                        asChild
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12"
                    >
                        <Link href="/dashboard">Retry Connection</Link>
                    </Button>
                    <p className="text-xs text-slate-400 mt-4">
                        Last synced: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
