'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname === '/register';

    // Transition configuration for smooth "Glass Citadel" feel
    // Using a softer spring for the layout slide
    const layoutTransition: Transition = {
        type: "spring",
        stiffness: 100,
        damping: 20
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 lg:bg-slate-100 flex items-center justify-center p-0 lg:p-0 overflow-hidden">
            {/* MAIN CONTAINER - Supports Magic Motion Layout */}
            <motion.div
                layout
                transition={layoutTransition}
                className={`w-full max-w-[1920px] h-screen flex ${isRegister ? 'flex-row-reverse' : 'flex-row'} bg-white shadow-2xl overflow-hidden`}
            >
                {/* --- PANEL 1: FORM SECTION (Content) --- */}
                <motion.div
                    layout
                    transition={layoutTransition}
                    className="w-full lg:w-[40%] h-full flex flex-col justify-center relative z-20 bg-white"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRegister ? -20 : 20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="h-full w-full overflow-y-auto overflow-x-hidden"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* --- PANEL 2: ARTWORK / BRAND SECTION --- */}
                <motion.div
                    layout
                    transition={layoutTransition}
                    className="hidden lg:flex lg:w-[60%] h-full relative bg-slate-900 items-center justify-center text-white overflow-hidden"
                >
                    {/* Background Image with Parallax-like feel */}
                    <div className="absolute inset-0">
                        <Image
                            src="/login.png"
                            alt="Background"
                            fill
                            className="object-cover opacity-80"
                            priority
                        />
                        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[2px]" />
                    </div>

                    {/* Content Container (Illustration + Text) */}
                    <div className="relative z-10 flex flex-col items-center justify-center -translate-y-12">
                        {/* Centered Illustration */}
                        <motion.div
                            key={isRegister ? 'register-illust' : 'login-illust'}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="mb-0"
                        >
                            <Image
                                src="/login-illust/20.png"
                                width={500}
                                height={500}
                                alt="Illustration"
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </motion.div>

                        {/* Text Content in Art Panel */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isRegister ? 'register-text' : 'login-text'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="max-w-xl text-center space-y-4 p-8 -mt-10"
                            >
                                <h2 className="text-5xl font-bold tracking-tight drop-shadow-lg">
                                    {isRegister ? "Bawa UMKM Anda Go Digital Sekarang." : "Automasi Cerdas untuk UMKM Indonesia."}
                                </h2>
                                <p className="text-lg text-blue-100/90 font-light leading-relaxed max-w-md mx-auto">
                                    {isRegister
                                        ? "Bergabunglah dengan Elysian untuk membangun ekosistem bisnis yang lebih modern dan profesional demi masa depan pengusaha lokal."
                                        : "Kelola bisnis lebih efisien dengan bantuan AI. Sederhanakan tugas harian dan fokuskan energi Anda untuk membesarkan brand lokal."
                                    }
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
