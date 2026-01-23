
import React from 'react';

interface ElysianLogoProps {
    className?: string;
    size?: number;
    variant?: 'default' | 'white';
}

export function ElysianLogo({ className = "", size = 32, variant = 'default' }: ElysianLogoProps) {
    const isWhite = variant === 'white';

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M25 2L48 14V36L25 48L2 36V14L25 2Z"
                className={isWhite ? "fill-white stroke-slate-200" : "fill-blue-600 stroke-blue-700"}
                strokeWidth="2"
            />
            <path
                d="M25 25L2 14"
                className={isWhite ? "stroke-slate-900/20" : "stroke-white/30"}
                strokeWidth="2"
            />
            <path
                d="M25 25L48 14"
                className={isWhite ? "stroke-slate-900/20" : "stroke-white/30"}
                strokeWidth="2"
            />
            <path
                d="M25 25V48"
                className={isWhite ? "stroke-slate-900/10" : "stroke-white/20"}
                strokeWidth="2"
            />
            <circle cx="25" cy="25" r="8" className={isWhite ? "fill-slate-900/10 backdrop-blur-sm" : "fill-white/20 backdrop-blur-sm"} />
        </svg>
    );
}

export function ElysianTextLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <ElysianLogo size={32} />
            <span className="font-bold text-xl tracking-tight text-slate-900">
                Elysian
            </span>
        </div>
    )
}
