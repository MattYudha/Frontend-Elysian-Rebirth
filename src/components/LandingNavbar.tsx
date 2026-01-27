import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Infinity as InfinityIcon, ArrowRight, Sun, Moon, Terminal, Monitor } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LandingNavbarProps {
    showTerminal?: boolean;
    setShowTerminal?: (v: boolean) => void;
    isDark?: boolean;
    toggleTheme?: () => void;
}

export function LandingNavbar({ showTerminal, setShowTerminal, isDark, toggleTheme }: LandingNavbarProps) {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <motion.header
            initial="initial"
            animate={scrolled ? "scrolled" : "initial"}
            variants={{
                initial: {
                    top: 0,
                    width: "100%",
                    borderRadius: "0px",
                    borderBottomColor: "rgba(255,255,255,0)", // Transparent
                    backgroundColor: "rgba(255,255,255,0)", // Transparent
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                },
                scrolled: {
                    top: 16, // 16px = 1rem (top-4)
                    width: "90%", // Mobile width
                    borderRadius: "9999px", // rounded-full
                    borderBottomColor: "rgba(255,255,255,0)", // Transparent bottom border (handled by full border)
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)", // Slate 900 / White with opacity
                    boxShadow: "0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05)", // Shadow blue
                    paddingTop: "12px",
                    paddingBottom: "12px",
                }
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
            className={cn(
                "fixed left-1/2 -translate-x-1/2 z-50 backdrop-blur-lg border border-transparent",
                scrolled && "border-slate-200/50 dark:border-blue-500/30 md:max-w-5xl"
            )}
            style={{ maxWidth: scrolled ? '64rem' : '100%' }} // Manual sync for max-w-5xl/full
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-1.5 rounded-lg shadow-xl shadow-blue-500/20 shine-effect relative overflow-hidden">
                        <InfinityIcon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                        "font-bold text-2xl tracking-tighter transition-colors font-heading",
                        scrolled ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"
                    )}>
                        ELYSIAN
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { name: t.nav.product, href: '/product' },
                        { name: t.nav.solutions, href: '/solutions' },
                        { name: t.nav.enterprise, href: '/enterprise' },
                        { name: t.nav.pricing, href: '/pricing' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Side: Auth & Toggles */}
                <div className="flex items-center gap-3">
                    {/* Visual Toggles - Now visible on mobile too */}
                    <div className="flex items-center gap-1 mr-2 px-2 md:px-3 py-1.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                        <button
                            onClick={() => setShowTerminal && setShowTerminal(!showTerminal)}
                            className={cn(
                                "p-1.5 md:p-2 rounded-full transition-all duration-200",
                                showTerminal
                                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                            title={showTerminal ? "Switch to Visual View" : "Switch to System Console"}
                        >
                            <span className="sr-only">Toggle Terminal</span>
                            {showTerminal ? <Monitor className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Terminal className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </button>

                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5 md:mx-1" />

                        <button
                            onClick={toggleTheme}
                            className="p-1.5 md:p-2 rounded-full text-slate-400 hover:text-amber-500 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200"
                            title="Toggle Theme"
                        >
                            <span className="sr-only">Toggle Theme</span>
                            {mounted && isDark ? (
                                <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            ) : (
                                <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            )}
                        </button>
                    </div>

                    <Link href="/login">
                        <Button
                            variant="ghost"
                            className="hidden sm:inline-flex text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium"
                        >
                            {t.nav.login}
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button
                            className={cn(
                                "rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-blue-500/25 shadow-lg shadow-blue-500/20 border border-transparent transition-all",
                                scrolled ? "h-9 px-4 text-sm" : "h-10 px-6"
                            )}
                        >
                            {t.nav.getStarted}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
