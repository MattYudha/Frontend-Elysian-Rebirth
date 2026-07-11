import Image from 'next/image';

interface ElysianLogoProps {
    className?: string;
    size?: number;
    variant?: 'default' | 'white';
}

export function ElysianLogo({ className = "", size = 54 }: ElysianLogoProps) {
    return (
        <Image
            src="/assets/logo.svg"
            alt="Elysian Logo"
            width={size}
            height={size}
            priority
            unoptimized
            className={`relative z-10 object-contain drop-shadow-sm ${className}`}
        />
    );
}

export function ElysianTextLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <ElysianLogo size={40} />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-[#338DB0] to-[#479BBA] bg-clip-text text-transparent font-heading drop-shadow-sm transition-all hover:brightness-110">
                Elysian
            </span>
        </div>
    )
}
