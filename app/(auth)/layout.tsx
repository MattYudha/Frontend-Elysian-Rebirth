'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';
import { LoginSlider } from '@/components/auth/login-slider';

export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname === '/register';

    // Transition configuration for smooth "Glass Citadel" feel
    // Using a softer spring for the layout slide
    const layoutTransition: Transition = {
        type: "spring",
        stiffness: 80,
        damping: 25,
        mass: 1.2
    };

    return (
        <div className="dark min-h-screen w-full bg-slate-100 dark:bg-black flex items-center justify-center p-0 lg:p-0 overflow-hidden">
            {/* MAIN CONTAINER - Supports Magic Motion Layout */}
            <motion.div
                layout
                transition={layoutTransition}
                className={`w-full max-w-[1920px] h-screen flex ${isRegister ? 'flex-row-reverse' : 'flex-row'} bg-slate-50 dark:bg-[#111111] shadow-2xl overflow-hidden`}
            >
                {/* --- PANEL 1: FORM SECTION (Content) --- */}
                <motion.div
                    layout
                    transition={layoutTransition}
                    className="w-full lg:w-[40%] h-full flex flex-col justify-center relative z-20 bg-slate-50 dark:bg-transparent"
                >
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/15 rounded-full blur-[140px]" />
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                    <LoginSlider />
                </motion.div>

            </motion.div>
        </div>
    );
}
