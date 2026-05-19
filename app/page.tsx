'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Dynamic import
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Shield, Zap, XCircle, Bot, FileText,
    ArrowRight, Sparkles, TrendingUp, Store, Truck, PenTool, Stethoscope, CheckCircle2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'; // Skeleton for lazy loading
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from 'next-themes';

// Dynamic Imports with Loading Skeletons for Heavy Sections
const ProductShowcase = dynamic(() => import('@/components/ProductShowcase').then(mod => mod.ProductShowcase), {
    loading: () => <Skeleton className="w-full h-[600px] rounded-3xl" />,
});
const FeatureDeepDive = dynamic(() => import('@/components/FeatureDeepDive').then(mod => mod.FeatureDeepDive), {
    loading: () => <div className="py-20"><Skeleton className="w-full max-w-7xl mx-auto h-[500px] rounded-3xl" /></div>,
});
const IntegrationsCarousel = dynamic(() => import('@/components/IntegrationsCarousel').then(mod => mod.IntegrationsCarousel), {
    ssr: false, // Carousel often has hydration issues, safe to disable SSR if below fold
    loading: () => <div className="py-12"><Skeleton className="w-full h-32 rounded-xl" /></div>,
});
const CollaborationSection = dynamic(() => import('@/components/CollaborationSection').then(mod => mod.CollaborationSection), {
    loading: () => <div className="py-20"><Skeleton className="w-full max-w-5xl mx-auto h-[400px] rounded-3xl" /></div>,
});
const AiAgentsSection = dynamic(() => import('@/components/AiAgentsSection').then(mod => mod.AiAgentsSection), {
    loading: () => <div className="py-20"><Skeleton className="w-full max-w-7xl mx-auto h-[600px] rounded-3xl" /></div>,
});
const FloatingBentoGrid = dynamic(() => import('@/components/FloatingBentoGrid').then(mod => mod.FloatingBentoGrid), {
    ssr: false, // Client interaction heavy
    loading: () => <Skeleton className="w-full h-full rounded-3xl min-h-[500px]" />,
});
const ElysianSpace = dynamic(() => import('@/components/backgrounds/ElysianSpace').then(mod => mod.ElysianSpace), {
    ssr: false,
});
import { CTASection } from '@/components/CTASection';


// Eager imports (Above the fold components)
// import { ProductShowcase } from '@/components/ProductShowcase'; // Converted to dynamic
// import { FeatureDeepDive } from '@/components/FeatureDeepDive'; // Converted to dynamic
// import { IntegrationsCarousel } from '@/components/IntegrationsCarousel'; // Converted to dynamic
// import { CollaborationSection } from '@/components/CollaborationSection'; // Converted to dynamic
// import { AiAgentsSection } from '@/components/AiAgentsSection'; // Converted to dynamic
// import { FloatingBentoGrid } from '@/components/FloatingBentoGrid'; // Converted to dynamic
// Eager imports (Above the fold components)
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingTerminal } from '@/components/LandingTerminal';
// import { PricingSection } from '@/components/PricingSection';

export default function ElysianLanding() {
    const { t, locale } = useTranslation();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // Terminal View State
    const [showTerminal, setShowTerminal] = useState(false);

    const toggleTerminal = (value: boolean) => {
        setShowTerminal(value);
    };

    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        // Delayed load of heavy background to prioritize TTI
        const timer = setTimeout(() => setShowBackground(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Provide safe defaults during SSR and before hydration
    const isLandingDark = mounted ? resolvedTheme === 'dark' : false;

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`min-h-screen font-sans overflow-x-hidden w-full selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-[600ms] ease-in-out ${isLandingDark ? 'bg-transparent' : 'bg-white'
                }`}
        >
            {/* Floating Navigation - Custom SaaS Style */}
            <LandingNavbar
                showTerminal={showTerminal}
                setShowTerminal={toggleTerminal}
            />

            {/* 3D Space Background - Fixed Global Overlay (Dark Mode Only) - Lazy Loaded */}
            {showBackground && isLandingDark && <ElysianSpace />}

            {/* Hero Section - Anti-Gravity + Floating Bento (Combined) */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden elysian-grid-light">

                <motion.div
                    style={{ opacity: heroOpacity, y: heroY, willChange: 'transform, opacity' }}
                    className="container mx-auto px-4 pt-20 pb-8 sm:py-12 lg:py-20 relative z-10"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
                        {/* Left Content (Typography) */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {/* Badge */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/60 dark:border-blue-500/20 mb-10 mx-auto lg:mx-0 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20 cursor-default backdrop-blur-sm"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
                                    <span className="text-xs font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent tracking-wide uppercase">{t.landing.hero.badge}</span>
                                </motion.div>

                                {/* Headline - Enterprise Premium */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-7 leading-[1.15] tracking-tight font-heading relative">
                                    {/* Subtle Spotlight Glow */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{
                                            background: 'radial-gradient(ellipse 500px 250px at 50% 30%, rgba(59, 130, 246, 0.15), transparent 60%)'
                                        }}
                                    />
                                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-white dark:via-blue-100 dark:to-blue-200 block mb-2 font-heading tracking-tight drop-shadow-sm">
                                        {t.landing.hero.title1}
                                    </span>
                                    <span className="relative inline-block">
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-300 dark:via-blue-200 dark:to-cyan-100">
                                            {t.landing.hero.title2}
                                        </span>
                                        {/* Organic Brush Stroke Underline */}
                                        <div className="absolute -bottom-4 left-0 right-0 flex items-center justify-center opacity-70">
                                            <svg
                                                className="w-full max-w-[300px] h-4"
                                                viewBox="0 0 300 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                preserveAspectRatio="none"
                                            >
                                                <defs>
                                                    <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" className="text-blue-500/10 dark:text-blue-400/10" stopColor="currentColor" />
                                                        <stop offset="20%" className="text-blue-600/80 dark:text-blue-400/80" stopColor="currentColor" />
                                                        <stop offset="50%" className="text-blue-500 dark:text-blue-400" stopColor="currentColor" />
                                                        <stop offset="80%" className="text-cyan-500/80 dark:text-cyan-400/80" stopColor="currentColor" />
                                                        <stop offset="100%" className="text-cyan-500/10 dark:text-cyan-400/10" stopColor="currentColor" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Main thick stroke */}
                                                <path
                                                    d="M 10 8 Q 30 6, 60 7.5 T 120 8 Q 180 9, 240 7.5 T 290 8"
                                                    stroke="url(#brushGradient)"
                                                    strokeWidth="4.5"
                                                    strokeLinecap="round"
                                                    opacity="0.9"
                                                />

                                                {/* Upper texture stroke */}
                                                <path
                                                    d="M 15 6.5 Q 35 5, 65 6.5 T 125 7 Q 185 7.5, 245 6.5 T 285 7"
                                                    stroke="url(#brushGradient)"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    opacity="0.45"
                                                />

                                                {/* Lower depth stroke */}
                                                <path
                                                    d="M 12 9.5 Q 32 8.5, 62 9.5 T 122 10 Q 182 10.5, 242 9.5 T 288 10"
                                                    stroke="url(#brushGradient)"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    opacity="0.3"
                                                />
                                            </svg>
                                        </div>
                                    </span>
                                </h1>

                                <motion.p
                                    className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    {t.landing.hero.description}
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div
                                    className="flex flex-col items-center lg:items-start gap-4 w-full sm:w-auto px-4 sm:px-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                >
                                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                                        <Link href="/dashboard" className="w-full sm:w-auto">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-400/25 hover:shadow-blue-400/40 flex items-center justify-center gap-2 transition-all"
                                            >
                                                {t.landing.hero.ctaStart}
                                            </motion.button>
                                        </Link>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full sm:w-auto h-12 px-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                        >
                                            {t.landing.hero.ctaDemo}
                                        </motion.button>
                                    </div>
                                    {/* Proof Point */}
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        {t.landing.hero.proof}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right: The Elysian System Console OR Bento Grid */}
                        <div className="hidden lg:flex w-full lg:w-1/2 relative min-h-[500px] items-center justify-center">
                            {showTerminal ? (
                                <LandingTerminal key={locale} />
                            ) : (
                                <FloatingBentoGrid />
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>


            {/* Infinite Marquee - Key visual, keep eager or high margin */}
            <InfiniteMarquee />

            <div id="product">
                <ProductShowcase />
            </div>

            <div id="solutions">
                <FeatureDeepDive />
            </div>

            <AiAgentsSection />

            <CollaborationSection />

            <IntegrationsCarousel />

            <ProblemSection />

            <SolutionSection />

            <div id="use-cases">
                <UseCasesSection />
            </div>

            {/* Pricing Section removed for MVP */}
            {/* <PricingSection /> */}

            <CTASection />

            <div id="faq">
                <FAQSection />
            </div>

            {/* Global footer is handled by Providers/SiteFooter, avoiding double footer here */}
        </motion.div>
    );
}

// Old Navbar Component Removed

// Infinite Marquee
function InfiniteMarquee() {
    const { t } = useTranslation();
    const industries = t.landing.marquee || ['Retail', 'Logistik', 'Agency', 'Klinik', 'F&B', 'Manufaktur', 'Konsultan', 'Properti'];

    return (
        <div className="relative py-12 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-100 dark:border-slate-800">
            <div className="flex gap-16">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-16 whitespace-nowrap will-change-transform"
                >
                    {[...industries, ...industries].map((industry, i) => (
                        <span key={i} className="text-2xl font-bold text-slate-300 dark:text-slate-700">
                            {industry}
                        </span>
                    ))}
                </motion.div>
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/90 dark:from-slate-900/90 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/90 dark:from-slate-900/90 to-transparent pointer-events-none" />
        </div>
    );
}

// Problem Section
function ProblemSection() {
    const { t } = useTranslation();
    return (
        <section className="py-16 lg:py-32 relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-50/50 dark:via-slate-900/20 to-white/0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-slate-900 dark:text-white leading-tight font-heading">
                            {t.landing.problem.title1} <br />
                            <span className="relative inline-block">
                                {t.landing.problem.title2}
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 2 150 2 198 10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            {t.landing.problem.description}
                        </p>

                        <div className="space-y-3">
                            {t.landing.problem.items.map((problem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-500/50 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium">{problem}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/50 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-tr-[2.5rem]" />

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">{t.landing.problem.solutionTitle}</h3>
                            </div>

                            <div className="space-y-6 mb-8">
                                {t.landing.problem.solutionItems.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{item.title}</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg"
                            >
                                {t.landing.problem.cta}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// SolutionSection
function SolutionSection() {
    const { t } = useTranslation();
    const features = [
        { icon: Bot, title: t.landing.features.items.ai.title, desc: t.landing.features.items.ai.desc, color: 'from-blue-400 to-cyan-300', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' },
        { icon: FileText, title: t.landing.features.items.docs.title, desc: t.landing.features.items.docs.desc, color: 'from-sky-400 to-blue-300', bg: 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800' },
        { icon: Shield, title: t.landing.features.items.security.title, desc: t.landing.features.items.security.desc, color: 'from-emerald-400 to-teal-300', bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' },
        { icon: Zap, title: t.landing.features.items.automation.title, desc: t.landing.features.items.automation.desc, color: 'from-cyan-400 to-blue-300', bg: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800' }
    ];

    return (
        <section className="py-16 lg:py-32 relative z-10 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading text-slate-900 dark:text-white">
                        {t.landing.features.title.split(' ').map((word, i) => word === 'Mengangkat' || word === 'Elevate' ? (
                            <span key={i} className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent"> {word} </span>
                        ) : ' ' + word)}
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">{t.landing.features.subtitle}</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={`group ${feature.bg} backdrop-blur-xl rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all cursor-pointer`}
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Use Cases Section
function UseCasesSection() {
    const { t } = useTranslation();
    const cases = [
        { icon: Store, title: t.landing.useCases.items.retail.title, items: t.landing.useCases.items.retail.items, color: 'from-cyan-400 to-blue-300', bg: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800' },
        { icon: Truck, title: t.landing.useCases.items.logistics.title, items: t.landing.useCases.items.logistics.items, color: 'from-blue-400 to-cyan-300', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' },
        { icon: PenTool, title: t.landing.useCases.items.agency.title, items: t.landing.useCases.items.agency.items, color: 'from-sky-400 to-blue-400', bg: 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800' },
        { icon: Stethoscope, title: t.landing.useCases.items.clinic.title, items: t.landing.useCases.items.clinic.items, color: 'from-emerald-400 to-teal-300', bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' }
    ];

    return (
        <section className="py-16 lg:py-32 relative z-10 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading text-slate-900 dark:text-white">{t.landing.useCases.title}</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">{t.landing.useCases.subtitle}</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={`group ${useCase.bg} rounded-3xl p-8 shadow-sm hover:shadow-xl border transition-all cursor-default`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${useCase.color}`}>
                                <useCase.icon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white font-heading">{useCase.title}</h3>
                            <ul className="space-y-3">
                                {useCase.items.map((item, idx) => (
                                    <li key={idx} className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// CTASection moved to dedicated component


// FAQ Section
function FAQSection() {
    const { t } = useTranslation();
    const faqs = [
        { q: t.landing.faq.q1, a: t.landing.faq.a1 },
        { q: t.landing.faq.q2, a: t.landing.faq.a2 },
        { q: t.landing.faq.q3, a: t.landing.faq.a3 },
        { q: t.landing.faq.q4, a: t.landing.faq.a4 }
    ];

    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white font-heading">{t.landing.faq.title}</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">{t.landing.faq.subtitle}</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                        >
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 font-heading">{item.q}</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
