import React from 'react';
import { NotificationPopover } from '@/components/NotificationPopover';

interface KnowledgeLayoutProps {
    children: React.ReactNode;
    hero?: React.ReactNode;
}

export const KnowledgeLayout: React.FC<KnowledgeLayoutProps> = ({
    children,
    hero,
}) => {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
            {/* Visual Identity: Elysian Sky & Clouds */}

            {/* 1. Base Layer: Gradient Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-transparent opacity-80" />
            </div>

            {/* 2. Texture Layer: Generated Cloud/Wave Art */}
            <div className="fixed top-0 left-0 w-full h-[400px] pointer-events-none -z-10 opacity-30 mix-blend-multiply mask-image-gradient">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/assets/images/elysian_clouds.png)',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                    }}
                />
            </div>

            {/* 3. SVG Overlay Layer: Subtle Vector Waves */}
            <div className="fixed top-0 inset-x-0 h-[500px] pointer-events-none -z-10 opacity-20 text-blue-400">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,112C1120,96,1280,96,1360,96L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" fill="url(#grad1)"></path>
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'rgb(200, 230, 255)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(240, 249, 255)', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>
            </div>


            {/* Top Navigation / Actions */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-50 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-full border border-white/50 shadow-sm">
                    <NotificationPopover />
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
                {/* Hero Section */}
                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    {hero}
                </div>

                {/* Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    {children}
                </div>
            </div>
        </div>
    );
};
