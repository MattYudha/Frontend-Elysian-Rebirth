import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Search, Terminal, Monitor, Menu, X, Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from 'next-themes';

interface LandingNavbarProps {
    showTerminal?: boolean;
    setShowTerminal?: (v: boolean) => void;
}

const navContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const navItemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 30
        }
    }
};

export function LandingNavbar({ showTerminal, setShowTerminal }: LandingNavbarProps) {
    const { t, locale, setLocale } = useTranslation();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // 1. SCROLL DETECTION (No Reflow)
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const isScrolled = latest > 20;
        if (scrolled !== isScrolled) {
            setScrolled(isScrolled);
        }
    });

    // 2. ACTIVE SECTION (Off-Main-Thread Calculation)
    const activeSection = useScrollSpy(['product', 'solutions', 'use-cases', 'faq'], 100);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        setLocale(locale === 'id' ? 'en' : 'id');
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Active section will be updated by observer
            setMobileMenuOpen(false);
        }
    };

    const openGlobalCommand = () => {
        document.dispatchEvent(new CustomEvent('open-command-dialog'));
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { name: t.landingNav.products.title, id: 'product' },
        { name: t.landingNav.solutions.title, id: 'solutions' },
        { name: t.landingNav.useCases.title, id: 'use-cases' },
        { name: t.landingNav.faq.title, id: 'faq' },
    ];

    return (
        <>
            <motion.header
                initial="initial"
                animate={scrolled ? "scrolled" : "initial"}
                variants={{
                    initial: {
                        backgroundColor: isDark ? "rgba(15, 23, 42, 0)" : "rgba(255, 255, 255, 0)",
                        backdropFilter: "blur(0px)",
                        boxShadow: "none",
                        paddingTop: "12px", // Fixed padding
                        paddingBottom: "12px", // Fixed padding
                    },
                    scrolled: {
                        backgroundColor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                        paddingTop: "12px", // Keep padding constant
                        paddingBottom: "12px", // Keep padding constant
                    }
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn(
                    "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:max-w-6xl rounded-full border border-transparent transition-all",
                    scrolled ? "border-slate-200/50 dark:border-slate-700/50" : ""
                )}
            >
                <div className="relative w-full h-full px-4 md:px-6 flex items-center justify-between">
                    {/* Logo Area - Left */}
                    <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group cursor-pointer focus:outline-none">
                        <Image
                            src="/assets/logo.svg"
                            alt="Elysian Logo"
                            width={40}
                            height={40}
                            priority
                            className="relative z-10 scale-100 transform transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                        />
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-[#338DB0] to-[#479BBA] dark:from-blue-100 dark:via-blue-200 dark:to-white bg-clip-text text-transparent font-heading drop-shadow-sm transition-all hover:brightness-110">
                            Elysian
                        </span>
                    </Link>

                    {/* Desktop Navigation - Absolute Center */}
                    <motion.nav
                        variants={navContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50"
                    >
                        {navLinks.map((item) => (
                            <motion.a
                                key={item.name}
                                variants={navItemVariants}
                                href={`#${item.id}`}
                                onClick={(e) => scrollToSection(e, item.id)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                                    activeSection === item.id
                                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                                )}
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </motion.nav>

                    {/* Right Side Actions - Right */}
                    <motion.div
                        variants={navContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center gap-1.5"
                    >
                        {/* Quick Search - Desktop */}
                        <motion.button
                            variants={navItemVariants}
                            onClick={openGlobalCommand}
                            className="hidden md:flex p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium text-xs uppercase"
                            title="Search (Cmd+K)"
                        >
                            <Search className="w-4 h-4" />
                        </motion.button>

                        {/* Language Toggle - Desktop */}
                        <motion.button
                            variants={navItemVariants}
                            onClick={toggleLanguage}
                            className="hidden md:flex p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all gap-1 items-center font-medium text-xs uppercase"
                            title="Switch Language"
                        >
                            <Languages className="w-4 h-4" />
                            <span className="text-[10px] sm:text-xs">{locale}</span>
                        </motion.button>

                        {/* Terminal Toggle - Hidden on mobile */}
                        <motion.button
                            variants={navItemVariants}
                            onClick={() => setShowTerminal && setShowTerminal(!showTerminal)}
                            className={cn(
                                "hidden md:flex p-2 rounded-full transition-all duration-200",
                                showTerminal
                                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                            title={showTerminal ? "Switch to Visual View" : "Switch to System Console"}
                        >
                            <span className="sr-only">Toggle Terminal</span>
                            {showTerminal ? <Monitor className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                        </motion.button>

                        {/* Theme Toggle - Hidden on Mobile (moved to sidebar) */}
                        <div className="hidden md:flex">
                            <ThemeToggle />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            variants={navItemVariants}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none ml-auto"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>

                        {/* Start Free Button - Hidden on mobile */}
                        <motion.div variants={navItemVariants} className="hidden md:block">
                            <Link href="/register">
                                <Button
                                    className={cn(
                                        "rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 transition-all shadow-lg shadow-blue-500/20",
                                        scrolled ? "h-8 px-4 text-xs" : "h-9 px-5 text-sm"
                                    )}
                                >
                                    <span className="font-semibold">{t.landingNav.actions.startFree || "Mulai Gratis"}</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.header>
            {/* Mobile Navigation Sidebar - Liquid Glass Design */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Sidebar Container */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-50 md:hidden flex flex-col overflow-hidden border-l border-white/20 dark:border-slate-700/30 shadow-2xl"
                        >
                            {/* Liquid Glass Background Layer - Optimized Blur */}
                            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-0" />

                            {/* Animated Ambient Gradients */}
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse z-0 pointer-events-none" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000 z-0 pointer-events-none" />

                            {/* Noise Texture for 'Premium' feel */}
                            <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            {/* Content Layer */}
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Header */}
                                <div className="p-6 flex items-center justify-between border-b border-slate-100/50 dark:border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <Image src="/assets/logo.svg" alt="Elysian Logo" width={32} height={32} />
                                        <span className="font-bold text-xl font-heading text-slate-900 dark:text-white tracking-wide">
                                            Menu
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors focus:outline-none border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <motion.div
                                    variants={navContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="flex-1 overflow-y-auto p-6 flex flex-col gap-2"
                                >
                                    {navLinks.map((item) => (
                                        <motion.a
                                            variants={navItemVariants}
                                            key={item.name}
                                            href={`#${item.id}`}
                                            onClick={(e) => scrollToSection(e, item.id)}
                                            className={cn(
                                                "block px-5 py-4 rounded-2xl text-lg font-medium transition-all group relative overflow-hidden",
                                                activeSection === item.id
                                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 shadow-sm"
                                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                            )}
                                        >
                                            {/* Hover Gloss Effect */}
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
                                            )} />
                                            {item.name}
                                        </motion.a>
                                    ))}

                                    <motion.div variants={navContainerVariants} className="mt-6 space-y-4">
                                        <motion.div variants={navItemVariants} className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                                        {/* Settings Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Language */}
                                            <motion.button
                                                variants={navItemVariants}
                                                onClick={toggleLanguage}
                                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all group"
                                            >
                                                <Languages className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                                    <span className={locale === 'id' ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>ID</span>
                                                    <span className="text-slate-300">/</span>
                                                    <span className={locale === 'en' ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>EN</span>
                                                </div>
                                            </motion.button>

                                            {/* Theme */}
                                            <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all group">
                                                <ThemeToggle />
                                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                    Mode
                                                </span>
                                            </div>
                                        </div>

                                        {/* Search */}
                                        <motion.button
                                            variants={navItemVariants}
                                            onClick={openGlobalCommand}
                                            className="flex items-center gap-3 w-full px-5 py-4 text-slate-600 dark:text-slate-400 font-medium bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-2xl transition-all group"
                                        >
                                            <Search className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                                            {t.landingNav.actions.search || "Cari..."}
                                        </motion.button>
                                    </motion.div>
                                </motion.div>

                                {/* Footer Action */}
                                <div className="p-6 border-t border-slate-100/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 text-lg font-semibold hover:shadow-blue-500/50 transition-all active:scale-[0.98]">
                                            {t.landingNav.actions.startFree || "Mulai Gratis"}
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                                        {t.landingNav.actions.microCopy || "Hanya butuh 30 detik."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// Helper removed as Mega Menu is gone

