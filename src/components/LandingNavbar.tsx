"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
    ArrowRight, Search, Terminal, Monitor, Menu, X, Languages, ChevronDown,
    Users, MessageSquare, Briefcase, DollarSign, Settings, Megaphone,
    Scale, ShieldCheck, Wrench, GraduationCap, FileText, BookOpen, Code,
    PenTool, Info, Rocket, RefreshCw, BarChart2, CloudUpload, Database,
    Zap, ShoppingCart, Puzzle, Star 
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useTheme } from 'next-themes';

interface LandingNavbarProps {
    showTerminal?: boolean;
    setShowTerminal?: (v: boolean) => void;
    forceDark?: boolean;
}

const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
    <div className="relative w-6 h-[18px] flex flex-col justify-between items-center overflow-hidden">
        <span className={cn("bg-sky-500 transition-all duration-300 absolute rounded-full", isOpen ? "w-[2px] h-full left-[4px] top-0" : "w-full h-[2px] left-0 top-[0px]")} />
        <span className={cn("bg-sky-500 transition-all duration-300 absolute rounded-full", isOpen ? "w-[2px] h-full left-1/2 -translate-x-1/2 top-0" : "w-full h-[2px] left-0 top-1/2 -translate-y-1/2")} />
        <span className={cn("bg-sky-500 transition-all duration-300 absolute rounded-full", isOpen ? "w-[2px] h-full right-[4px] top-0" : "w-full h-[2px] left-0 bottom-[0px]")} />
    </div>
);

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

const useCasesData = [
    { title: "HR Agent", slug: "hr-agent", icon: Users },
    { title: "Customer Support Agent", slug: "customer-support-agent", icon: MessageSquare },
    { title: "Sales Teams", slug: "sales-teams", icon: Briefcase },
    { title: "Finance Agent", slug: "finance-agent", icon: DollarSign },
    { title: "Development Agent", slug: "development-agent", icon: Settings },
    { title: "Marketing Agent", slug: "marketing-agent", icon: Megaphone },
    { title: "Legal Agent", slug: "legal-agent", icon: Scale },
    { title: "Insurance Agent", slug: "insurance-agent", icon: ShieldCheck },
    { title: "Industrial Agent", slug: "industrial-agent", icon: Wrench },
    { title: "Education Agent", slug: "education-agent", icon: GraduationCap },
    { title: "Government Agent", slug: "government-agent", icon: FileText },
    { title: "Documentation Agent", slug: "documentation-agent", icon: BookOpen },
];

const UseCasesMegaMenu = ({ title, active, href, onClick }: any) => {
    return (
        <div className="group relative">
            <div className={cn(
                "flex items-center cursor-pointer px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200",
                active ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
            )}>
                {title}
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-inherit group-hover:text-slate-400 transition-transform group-hover:rotate-180" />
            </div>
            
            {/* Dropdown Container */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white/95 dark:bg-[#050507]/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl w-[500px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-50 before:content-[''] before:absolute before:top-[-10px] before:left-0 before:w-full before:h-[10px] before:bg-transparent">
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {useCasesData.map((useCase) => {
                            const Icon = useCase.icon;
                            return (
                                <Link
                                    key={useCase.slug}
                                    href={`/use-cases/${useCase.slug}`}
                                    className="group/item flex items-center p-2 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/item:text-sky-500 transition-colors mr-3" />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover/item:text-sky-500 transition-colors">
                                        {useCase.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResourcesMegaMenu = ({ title, active, href, onClick }: any) => {
    return (
        <div className="group relative">
            <div className={cn(
                "flex items-center cursor-pointer px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200",
                active ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
            )}>
                {title}
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-inherit group-hover:text-slate-400 transition-transform group-hover:rotate-180" />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white/95 dark:bg-[#050507]/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-50 before:content-[''] before:absolute before:top-[-10px] before:left-0 before:w-full before:h-[10px] before:bg-transparent overflow-hidden">
                <div className="grid grid-cols-2">
                    {/* Learn Column */}
                    <div className="p-6 border-r border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
                            Learn
                        </h3>
                        <div className="space-y-1">
                            <Link href="/tutorial/introduction" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <BookOpen className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        5 Steps Tutorial
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Learn AI agent development in 5 steps
                                    </span>
                                </div>
                            </Link>
                            <Link href="/examples" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <Terminal className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Examples
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Explore sample projects and code
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Connect Column */}
                    <div className="p-6">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
                            Connect
                        </h3>
                        <div className="space-y-1">
                            <Link href="/blog" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                                <PenTool className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Blog
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Read the technical blog
                                    </span>
                                </div>
                            </Link>
                            <Link href="/about" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                                <Info className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        About Us
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Learn more about Elysian
                                    </span>
                                </div>
                            </Link>
                            <Link href="/launch-week" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                                <Rocket className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Launch Week #2
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Explore our product launch updates
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductsMegaMenu = ({ title, active, href, onClick }: any) => {
    return (
        <div className="group relative">
            <div className={cn(
                "flex items-center cursor-pointer px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200",
                active ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
            )}>
                {title}
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-inherit group-hover:text-slate-400 transition-transform group-hover:rotate-180" />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white/95 dark:bg-[#050507]/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-50 before:content-[''] before:absolute before:top-[-10px] before:left-0 before:w-full before:h-[10px] before:bg-transparent overflow-hidden">
                <div className="grid grid-cols-2">
                    {/* Left Column - Core Products */}
                    <div className="p-6 border-r border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
                            Elysian Core
                        </h3>
                        <div className="space-y-1">
                            <Link href="/observability" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <Monitor className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Observability
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Monitor LLM calls and agent behavior
                                    </span>
                                </div>
                            </Link>
                            <Link href="/actions-triggers" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <RefreshCw className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Actions & Triggers
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Triggers and actions for workflows
                                    </span>
                                </div>
                            </Link>
                            <Link href="/evals" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <BarChart2 className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Evals
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Evaluate and improve your agents
                                    </span>
                                </div>
                            </Link>
                            <Link href="/prompt-management" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <MessageSquare className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Prompt Management
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Manage and version your prompts
                                    </span>
                                </div>
                            </Link>
                            <Link href="/deployment" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <CloudUpload className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Deployment
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Deploy AI agents to production
                                    </span>
                                </div>
                            </Link>
                            <Link href="/rag" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-white/5">
                                <Database className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        RAG
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Retrieval Augmented Generation
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Open Source Framework */}
                    <div className="p-6">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
                            Open Source Framework
                        </h3>
                        <div className="space-y-1">
                            <Link href="/docs" className="group/item flex items-start p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                                <Zap className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                <div>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                        Elysian Framework
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Build AI agents with TypeScript
                                    </span>
                                </div>
                            </Link>
                            <div className="group/item flex items-center justify-between p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
                                <div className="flex items-start">
                                    <ShoppingCart className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                    <div>
                                        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                            Marketplace
                                        </span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Discover and share AI agents
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-xs bg-sky-500/10 text-sky-500 rounded-full font-medium shrink-0">Soon</span>
                            </div>
                            <div className="group/item flex items-center justify-between p-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
                                <div className="flex items-start">
                                    <Puzzle className="w-5 h-5 mt-0.5 text-slate-400 group-hover/item:text-sky-500 transition-colors mr-3 shrink-0" />
                                    <div>
                                        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-sky-500 transition-colors">
                                            Agent Builder
                                        </span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Build no-code agents
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-xs bg-sky-500/10 text-sky-500 rounded-full font-medium shrink-0">Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function LandingNavbar({ showTerminal, setShowTerminal, forceDark = false }: LandingNavbarProps) {
    const { t, locale, setLocale } = useTranslation();
    const { resolvedTheme } = useTheme();
    const isDark = forceDark || resolvedTheme === 'dark';
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Mobile accordion states
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
    const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const isScrolled = latest > 20;
        if (scrolled !== isScrolled) {
            setScrolled(isScrolled);
        }
    });

    // 2. ACTIVE SECTION (Off-Main-Thread Calculation)
    const activeSection = useScrollSpy(['product', 'solutions', 'use-cases', 'faq'], 100);

    const toggleLanguage = () => {
        setLocale(locale === 'id' ? 'en' : 'id');
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
        if (href === '#') {
            setMobileMenuOpen(false);
            return;
        }
        if (typeof window !== 'undefined' && window.location.pathname !== href && href.startsWith('/')) {
            setMobileMenuOpen(false);
            return;
        }
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setMobileMenuOpen(false);
        } else if (href === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const openGlobalCommand = () => {
        document.dispatchEvent(new CustomEvent('open-command-dialog'));
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { name: t.landingNav.products.title, id: 'product', href: '/' },
        { name: t.landingNav.documentations.title, id: 'documentations', href: '/documentations' },
        { name: t.landingNav.pricing.title, id: 'pricing', href: '/pricing' },
        { name: t.landingNav.usecases.title, id: 'usecases', href: '/usecases' },
        { name: t.landingNav.resources.title, id: 'resources', href: '/resources' },
    ];

    return (
        <>
            <motion.header
                animate={{
                    backgroundColor: scrolled 
                        ? (isDark ? "rgba(5, 5, 7, 0.85)" : "rgba(255, 255, 255, 0.9)")
                        : (isDark ? "rgba(5, 5, 7, 0)" : "rgba(255, 255, 255, 0)"),
                    backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
                    boxShadow: scrolled ? "0 10px 30px -10px rgba(0, 0, 0, 0.1)" : "none",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn(
                    "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:max-w-6xl rounded-full border border-transparent",
                    scrolled ? "border-slate-200/50 dark:border-white/10" : ""
                )}
            >
                <div className="w-full h-full px-4 lg:px-6 flex justify-between lg:grid lg:grid-cols-3 items-center">
                    {/* Logo Area - Left */}
                    <div className="flex justify-start">
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
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden lg:flex justify-center">
                        <motion.nav
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex items-center gap-0.5 bg-slate-100/50 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/10"
                        >
                            {navLinks.map((item) => {
                                if (item.id === 'product') {
                                    return <ProductsMegaMenu key={item.id} title={item.name} active={activeSection === item.id} href={item.href} onClick={(e: any) => scrollToSection(e, item.id, item.href)} />
                                }
                                if (item.id === 'usecases') {
                                    return <UseCasesMegaMenu key={item.id} title={item.name} active={activeSection === item.id} href={item.href} onClick={(e: any) => scrollToSection(e, item.id, item.href)} />
                                }
                                if (item.id === 'resources') {
                                    return <ResourcesMegaMenu key={item.id} title={item.name} active={activeSection === item.id} href={item.href} onClick={(e: any) => scrollToSection(e, item.id, item.href)} />
                                }
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.id, item.href)}
                                        className={cn(
                                            "px-2 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200",
                                            activeSection === item.id
                                                ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-300 shadow-sm"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </motion.nav>
                    </div>

                    {/* Right Side Actions - Right */}
                    <div className="flex justify-end items-center">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="flex items-center gap-1 xl:gap-1.5"
                        >
                            {/* Quick Search - Desktop (Hidden on medium screens) */}
                            <button
                                onClick={openGlobalCommand}
                                className="hidden xl:flex p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium text-xs uppercase"
                                title="Search (Cmd+K)"
                            >
                                <Search className="w-4 h-4" />
                            </button>

                            {/* Language Toggle - Desktop (Hidden on medium screens) */}
                            <button
                                onClick={toggleLanguage}
                                className="hidden xl:flex p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-all gap-1 items-center font-medium text-xs uppercase"
                                title="Switch Language"
                            >
                                <Languages className="w-4 h-4" />
                                <span className="text-[10px] sm:text-xs">{locale}</span>
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-sky-500 transition-all focus:outline-none"
                            >
                                <HamburgerIcon isOpen={mobileMenuOpen} />
                            </button>

                            <div className="hidden lg:block">
                                <Button
                                    asChild
                                    className={cn(
                                        "rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 transition-all shadow-lg shadow-blue-500/20",
                                        scrolled ? "h-8 px-3 xl:px-4 text-xs" : "h-9 px-4 xl:px-5 text-sm"
                                    )}
                                >
                                    <Link href="/register">
                                        <span className="font-semibold">{t.landingNav.actions.startFree || "Mulai Gratis"}</span>
                                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                    </Link>
                                </Button>
                            </div>

                        </motion.div>
                    </div>
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
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Sidebar Container - Elysian Fullscreen Style */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 lg:hidden flex flex-col overflow-hidden bg-black"
                        >
                            {/* Header */}
                            <div className="px-4 h-[72px] flex items-center justify-between border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <Image src="/assets/logo.svg" alt="Elysian Logo" width={32} height={32} />
                                    <span className="font-bold text-xl font-heading text-white tracking-wide">
                                        Elysian
                                    </span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-sky-500 focus:outline-none"
                                >
                                    <HamburgerIcon isOpen={true} />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-10 flex flex-col gap-4">
                                {/* Products Accordion */}
                                <div className="border-b border-white/10 pb-2">
                                    <button
                                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                                        className="flex items-center justify-between w-full text-[19px] font-medium text-slate-300 hover:text-white transition-colors py-2"
                                    >
                                        Products
                                        <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", mobileProductsOpen && "rotate-180")} />
                                    </button>
                                    <div className={cn("overflow-hidden transition-all duration-300", mobileProductsOpen ? "max-h-[800px] mt-4 mb-4" : "max-h-0")}>
                                        <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Elysian Core</h4>
                                            <Link href="/observability" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <Monitor className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Observability</span>
                                            </Link>
                                            <Link href="/actions-triggers" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <RefreshCw className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Actions & Triggers</span>
                                            </Link>
                                            <Link href="/evals" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <BarChart2 className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Evals</span>
                                            </Link>
                                            <Link href="/prompt-management" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <MessageSquare className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Prompt Management</span>
                                            </Link>
                                            <Link href="/deployment" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <CloudUpload className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Deployment</span>
                                            </Link>
                                            <Link href="/rag" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <Database className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">RAG</span>
                                            </Link>
                                            
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">Open Source Framework</h4>
                                            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <Zap className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Elysian Framework</span>
                                            </Link>
                                            <div className="flex items-center justify-between py-1 text-slate-400">
                                                <div className="flex items-center gap-3">
                                                    <ShoppingCart className="w-5 h-5 text-sky-500/40" />
                                                    <span className="text-base">Marketplace</span>
                                                </div>
                                                <span className="px-2 py-0.5 text-xs bg-sky-500/10 text-sky-500 rounded-full">Soon</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1 text-slate-400">
                                                <div className="flex items-center gap-3">
                                                    <Puzzle className="w-5 h-5 text-sky-500/40" />
                                                    <span className="text-base">Agent Builder</span>
                                                </div>
                                                <span className="px-2 py-0.5 text-xs bg-sky-500/10 text-sky-500 rounded-full">Soon</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/documentations" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-[19px] font-medium text-slate-300 hover:text-white transition-colors border-b border-white/10 pb-4 pt-2">
                                    Documentation
                                </Link>

                                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-[19px] font-medium text-slate-300 hover:text-white transition-colors border-b border-white/10 pb-4 pt-2">
                                    Pricing
                                </Link>

                                {/* Use Cases Accordion */}
                                <div className="border-b border-white/10 pb-2 pt-2">
                                    <button
                                        onClick={() => setMobileUseCasesOpen(!mobileUseCasesOpen)}
                                        className="flex items-center justify-between w-full text-[19px] font-medium text-slate-300 hover:text-white transition-colors py-2"
                                    >
                                        Use Cases
                                        <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", mobileUseCasesOpen && "rotate-180")} />
                                    </button>
                                    <div className={cn("overflow-hidden transition-all duration-300", mobileUseCasesOpen ? "max-h-[800px] mt-4 mb-4" : "max-h-0")}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l border-white/10">
                                            {useCasesData.map((useCase) => {
                                                const Icon = useCase.icon;
                                                return (
                                                    <Link key={useCase.slug} href={`/use-cases/${useCase.slug}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                        <Icon className="w-5 h-5 text-sky-500/70" />
                                                        <span className="text-base">{useCase.title}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Resources Accordion */}
                                <div className="border-b border-white/10 pb-2 pt-2">
                                    <button
                                        onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                                        className="flex items-center justify-between w-full text-[19px] font-medium text-slate-300 hover:text-white transition-colors py-2"
                                    >
                                        Resources
                                        <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", mobileResourcesOpen && "rotate-180")} />
                                    </button>
                                    <div className={cn("overflow-hidden transition-all duration-300", mobileResourcesOpen ? "max-h-[800px] mt-4 mb-4" : "max-h-0")}>
                                        <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Learn</h4>
                                            <Link href="/tutorial/introduction" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <BookOpen className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">5 Steps Tutorial</span>
                                            </Link>
                                            <Link href="/examples" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <Terminal className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Examples</span>
                                            </Link>

                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">Connect</h4>
                                            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <PenTool className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Blog</span>
                                            </Link>
                                            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <Info className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">About Us</span>
                                            </Link>
                                            <Link href="/launch-week" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-sky-500 transition-colors py-1">
                                                <Rocket className="w-5 h-5 text-sky-500/70" />
                                                <span className="text-base">Launch Week #2</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Settings & Actions inside Menu */}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button
                                        onClick={toggleLanguage}
                                        className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all"
                                    >
                                        <Languages className="w-5 h-5 text-sky-500" />
                                        <span className="text-sm font-semibold">{locale.toUpperCase()}</span>
                                    </button>
                                    <button
                                        onClick={openGlobalCommand}
                                        className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all"
                                    >
                                        <Search className="w-5 h-5 text-sky-500" />
                                        <span className="text-sm font-semibold">Cari</span>
                                    </button>
                                </div>

                                {/* Bottom Action */}
                                <div className="mt-auto pt-8">
                                    <Button asChild className="w-full h-14 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-semibold text-lg transition-all active:scale-[0.98]">
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            {t.landingNav.actions.startFree || "Mulai Gratis"}
                                        </Link>
                                    </Button>
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

