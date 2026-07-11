'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SplashScreenProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
    title = 'Enterprise AI Platform',
    subtitle = 'Loading...',
    className,
}) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a]",
                className
            )}
        >
            {/* Animated background glow */}
            <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/30 blur-[60px] animate-pulse"
                style={{ animationDuration: '3s' }}
            />

            {/* Logo/Icon placeholder */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/50 animate-[spin_4s_linear_infinite]">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-4 text-center tracking-tight">
                {title}
            </h1>

            {/* Subtitle with animated dots */}
            <p className="text-lg text-white/70 mb-8 font-light tracking-wide min-w-[120px] text-center">
                {subtitle}{dots}
            </p>

            {/* Loading spinner */}
            <Loader2 className="h-10 w-10 text-white/80 animate-spin" />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white/40"
                    style={{
                        width: 6,
                        height: 6,
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                        animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(-20px); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

SplashScreen.displayName = 'SplashScreen';
