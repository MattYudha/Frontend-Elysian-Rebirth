'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthShellProps {
    children: ReactNode;
    mode: 'login' | 'register';
}

export function AuthShell({ children, mode }: AuthShellProps) {
    const isRegister = mode === 'register';

    return (
        <div className="min-h-screen w-full bg-slate-50 lg:bg-slate-100 flex items-center justify-center p-0 lg:p-0 overflow-hidden">

            {/* MAIN CONTAINER 
        We use Framer Motion 'layout' to animate the flex-direction change
      */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className={`w-full max-w-[1920px] h-screen flex ${isRegister ? 'flex-row-reverse' : 'flex-row'
                    } bg-white shadow-2xl overflow-hidden`}
            >

                {/* --- PANEL 1: FORM SECTION (Dynamic Content) --- */}
                <motion.div
                    layout
                    className="w-full lg:w-[40%] h-full flex flex-col justify-center relative z-20 bg-white"
                >
                    {/* Wrapper to animate content fade-in on mode switch */}
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="h-full w-full overflow-y-auto overflow-x-hidden"
                    >
                        {children}
                    </motion.div>
                </motion.div>

                {/* --- PANEL 2: ARTWORK / BRAND SECTION --- */}
                <motion.div
                    layout
                    className="hidden lg:flex lg:w-[60%] h-full relative bg-slate-900 items-center justify-center text-white overflow-hidden"
                >
                    {/* Background Image with Parallax-like feel */}
                    <div className="absolute inset-0">
                        <Image
                            src="/login_background_blue_waves.png"
                            alt="Background"
                            fill
                            className="object-cover opacity-80"
                            priority
                        />
                        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[2px]" />
                    </div>

                    {/* Text Content in Art Panel */}
                    <motion.div
                        key={mode} // Re-render text animation when mode changes
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative z-10 max-w-lg text-center space-y-6 p-12"
                    >
                        <h2 className="text-5xl font-bold tracking-tight drop-shadow-lg">
                            {isRegister ? "Join the Elite." : "Orchestrate your Digital Workflow."}
                        </h2>
                        <p className="text-lg text-blue-100/90 font-light leading-relaxed max-w-md mx-auto">
                            {isRegister
                                ? "Access the platform that powers the world's most innovative teams. Elegance meets efficiency."
                                : "Seamlessly integrate your tools, automate your tasks, and elevate your productivity to new heights."
                            }
                        </p>
                    </motion.div>

                </motion.div>

            </motion.div>
        </div>
    );
}
