'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Shield, Zap, XCircle, Bot, FileText,
    ArrowRight, Sparkles, TrendingUp, Store, Truck, PenTool, Stethoscope, CheckCircle2,
    Layers, Cpu, Database, Network, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from 'next-themes';

// Eager imports (Above the fold components)
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingTerminal } from '@/components/LandingTerminal';
import { CTASection } from '@/components/CTASection';

// Interactive Hackathon Blueprint Component
import { HackathonBlueprint } from '@/components/HackathonBlueprint';

// Dynamic Imports with Loading Skeletons for Heavy Sections
const ProductShowcase = dynamic(() => import('@/components/ProductShowcase').then(mod => mod.ProductShowcase), {
    loading: () => <Skeleton className="w-full h-[600px] rounded-3xl" />,
});
const FeatureDeepDive = dynamic(() => import('@/components/FeatureDeepDive').then(mod => mod.FeatureDeepDive), {
    loading: () => <div className="py-20"><Skeleton className="w-full max-w-7xl mx-auto h-[500px] rounded-3xl" /></div>,
});
const IntegrationsCarousel = dynamic(() => import('@/components/IntegrationsCarousel').then(mod => mod.IntegrationsCarousel), {
    ssr: false,
    loading: () => <div className="py-12"><Skeleton className="w-full h-32 rounded-xl" /></div>,
});
const CollaborationSection = dynamic(() => import('@/components/CollaborationSection').then(mod => mod.CollaborationSection), {
    loading: () => <div className="py-20"><Skeleton className="w-full max-w-5xl mx-auto h-[400px] rounded-3xl" /></div>,
});
const AiAgentsSection = dynamic(() => import('@/components/AiAgentsSection').then(mod => mod.AiAgentsSection), {
    loading: () => <div className="py-20"><Skeleton className="w-full max-w-7xl mx-auto h-[600px] rounded-3xl" /></div>,
});
const FloatingBentoGrid = dynamic(() => import('@/components/FloatingBentoGrid').then(mod => mod.FloatingBentoGrid), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full rounded-3xl min-h-[500px]" />,
});
const ElysianSpace = dynamic(() => import('@/components/backgrounds/ElysianSpace').then(mod => mod.ElysianSpace), {
    ssr: false,
});

export default function ElysianLanding() {
    const { t, locale } = useTranslation();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const [showTerminal, setShowTerminal] = useState(false);
    const [showBackground, setShowBackground] = useState(false);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setShowBackground(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const isLandingDark = mounted ? resolvedTheme === 'dark' : false;
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    const toggleTerminal = (value: boolean) => {
        setShowTerminal(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`min-h-screen font-sans overflow-x-hidden w-full selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-[600ms] ease-in-out ${
                isLandingDark ? 'bg-[#030712] text-slate-100' : 'bg-white text-slate-900'
            }`}
        >
            {/* Floating Navigation */}
            <LandingNavbar
                showTerminal={showTerminal}
                setShowTerminal={toggleTerminal}
            />

            {/* 3D Space Background Overlay (Dark Mode Only) */}
            {showBackground && isLandingDark && <ElysianSpace />}

            {/* HERO SECTION: Anti-Gravity + Dynamic Typography */}
            <section ref={heroRef} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden elysian-grid-light pt-24 sm:pt-28">
                {/* Background Decorators */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    style={{ opacity: heroOpacity, y: heroY, willChange: 'transform, opacity' }}
                    className="container mx-auto px-4 relative z-10"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
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
                                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-8 mx-auto lg:mx-0 shadow-lg shadow-blue-500/5 cursor-default backdrop-blur-md"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
                                    <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase">
                                        Elysian Rebirth v3.0 • Swarm Intelligence
                                    </span>
                                </motion.div>

                                {/* Headline - Enterprise Premium */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.12] tracking-tight font-heading relative">
                                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-100 dark:to-blue-200 block mb-2 font-heading">
                                        Autonomous
                                    </span>
                                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:via-blue-200 dark:to-cyan-200">
                                        Financial Oversight
                                        {/* Organic Brush Underline */}
                                        <div className="absolute -bottom-3 left-0 right-0 flex items-center justify-center opacity-70">
                                            <svg className="w-full max-w-[340px] h-3" viewBox="0 0 300 16" fill="none" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" className="text-blue-500/10 dark:text-blue-400/10" stopColor="currentColor" />
                                                        <stop offset="50%" className="text-blue-500 dark:text-blue-400" stopColor="currentColor" />
                                                        <stop offset="100%" className="text-cyan-500/10 dark:text-cyan-400/10" stopColor="currentColor" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M 10 8 Q 30 6, 60 7.5 T 120 8 Q 180 9, 240 7.5 T 290 8" stroke="url(#brushGrad)" strokeWidth="4" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-350 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                                    Infrastruktur pengawasan anggaran otonom berbasis kecerdasan buatan multi-agent (*Swarm Intelligence*). Otomatis mengevaluasi draf RAPBD daerah terhadap regulasi lokal dan mendeteksi potensi *markup* harga secara akurat dalam hitungan detik.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto px-4 sm:px-0 mb-6">
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        >
                                            Mulai Masuk Dashboard
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleTerminal(!showTerminal)}
                                        className="w-full sm:w-auto h-12 px-8 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-blue-950/45 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
                                    >
                                        {showTerminal ? "Lihat Bento Grid" : "Uji Coba Konsol Swarm"}
                                    </motion.button>
                                </div>
                                
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                    Tipe Transaksi EIP-1559 • Kompatibel dengan BPK, LKPP, & SPBE Nasional
                                </p>
                            </motion.div>
                        </div>

                        {/* Right: Console or Bento Grid */}
                        <div className="hidden lg:flex w-full lg:w-1/2 relative min-h-[500px] items-center justify-center z-20">
                            {showTerminal ? (
                                <LandingTerminal key={locale} />
                            ) : (
                                <FloatingBentoGrid />
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Infinite Marquee */}
            <InfiniteMarquee />

            {/* 🛠️ SECTION: Deep Technical Integration Blueprint */}
            <section className="py-20 lg:py-32 relative z-20 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/40 dark:border-blue-950/30 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/20">
                            <Layers className="w-3.5 h-3.5" />
                            Elysian 6-Tool Architecture
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                            Integrasi Teknologi <br />
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                SupTech Tingkat Korporat
                            </span>
                        </h2>
                        <p className="text-slate-650 dark:text-slate-400 mt-4 leading-relaxed text-base sm:text-lg">
                            Elysian mengintegrasikan enam repositori modular canggih demi menciptakan akurasi deteksi maksimal, integritas audit yang tidak dapat disabotase, dan skalabilitas data terdistribusi.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Swarm Intelligence (MiroFish) */}
                        <div className="p-8 rounded-3xl bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl border border-slate-200/60 dark:border-blue-950/40 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">Cognitive Swarm</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                <strong className="font-extrabold text-blue-600 dark:text-blue-400">MiroFish (Python worker)</strong> mensimulasikan perdebatan kolaboratif multi-agent (Auditor, Compliance, Manager) menggunakan <span className="italic">Caveman Prompt</span> JSON-only yang sangat kaku, disaring dari teks penalaran (thinking block) untuk keputusan audit objektif 100%.
                            </p>
                        </div>

                        {/* 2. EVM Blockchain Trust Layer */}
                        <div className="p-8 rounded-3xl bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl border border-slate-200/60 dark:border-blue-950/40 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                                <Network className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">Solana & Sepolia L2 Batching</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                Hash keputusan audit didepositkan secara permanen (Provenance Check) ke <strong className="font-extrabold text-purple-600 dark:text-purple-450">EVM Sepolia/Amoy Testnet</strong> (AuditTrail.sol). Go Backend bertindak sebagai Committer otomatis dengan batching L2 dan transaksi dinamis tipe <strong className="font-extrabold">EIP-1559</strong> yang tahan macet.
                            </p>
                        </div>

                        {/* 3. MongoDB Staging & QA Gate */}
                        <div className="p-8 rounded-3xl bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl border border-slate-200/60 dark:border-blue-950/40 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">MongoDB QA Gate</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                Berkas draf anggaran mentah diekstrak oleh parser Rust <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">OpenViking</strong> dan diparkir di <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">MongoDB Staging</strong>. Melalui sistem Human-in-the-Loop QA Gate, data divalidasi oleh auditor manusia sebelum di-vektorisasi ke basis data produksi.
                            </p>
                        </div>

                        {/* 4. Split PostgreSQL Architecture */}
                        <div className="p-8 rounded-3xl bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl border border-slate-200/60 dark:border-blue-950/40 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">Split DB: PG1 & PG2 Nemesis</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                Memisahkan database transaksi utama (<strong className="font-extrabold text-cyan-600 dark:text-cyan-400">PostgreSQL 1</strong>) dengan <strong className="font-extrabold text-cyan-600 dark:text-cyan-400">PostgreSQL 2 (Nemesis Ground Truth)</strong> read-only setebal <strong className="font-extrabold">4GB+ data SIRUP nasional</strong> berisi 1 juta barang pengadaan riil Indonesia sebagai patokan harga wajar audit.
                            </p>
                        </div>

                        {/* 5. Qdrant Vector & OpenViking Librarian */}
                        <div className="p-8 rounded-3xl bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl border border-slate-200/60 dark:border-blue-950/40 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">Qdrant DB Regulation RAG</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                PDF regulasi daerah (Perda) setebal ratusan halaman di-vektorisasi ke <strong className="font-extrabold text-orange-600 dark:text-orange-450">Qdrant Vector DB</strong> oleh OpenViking. AI Swarm memanggil semantic search RAG ini untuk mencocokkan setiap pos draf APBD dengan regulasi hukum yang berlaku daerah tersebut.
                            </p>
                        </div>

                        {/* 6. React Flow & SSE Live Workflow */}
                        <div className="p-8 rounded-3xl bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl border border-slate-200/60 dark:border-blue-950/40 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">React Flow & SSE Streaming</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                Visualisasi perdebatan Swarm Agents ditampilkan sebagai diagram alir interaktif (<strong className="font-extrabold text-rose-600 dark:text-rose-400">React Flow</strong>) di frontend, disiarkan langsung secara asinkron dari server backend Go menggunakan <strong className="font-extrabold text-rose-600 dark:text-rose-400">Server-Sent Events (SSE)</strong> yang hemat bandwidth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <div id="product" className="relative z-20">
                <ProductShowcase />
            </div>

            {/* Deep Feature Dive */}
            <div id="solutions" className="relative z-20">
                <FeatureDeepDive />
            </div>

            {/* AI Agents Section */}
            <div className="relative z-20">
                <AiAgentsSection />
            </div>

            {/* Collaboration Section */}
            <div className="relative z-20">
                <CollaborationSection />
            </div>

            {/* Integrations Carousel */}
            <div className="relative z-20">
                <IntegrationsCarousel />
            </div>

            {/* Problem & Solution Showcase Section */}
            <ProblemSection />
            <SolutionSection />

            {/* Use Cases Section */}
            <div id="use-cases" className="relative z-20">
                <UseCasesSection />
            </div>

            {/* 💎 SECTION: 25 Hackathon Blueprint Portal Gate */}
            <div id="hackathon-blueprint" className="relative z-20 border-t border-slate-200/40 dark:border-blue-950/30 bg-white dark:bg-[#030712]">
                <HackathonBlueprint />
            </div>

            {/* Call to Action */}
            <CTASection />

            {/* FAQ Section */}
            <div id="faq" className="relative z-20">
                <FAQSection />
            </div>
        </motion.div>
    );
}

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
                        <span key={i} className="text-2xl font-bold text-slate-350 dark:text-slate-700">
                            {industry}
                        </span>
                    ))}
                </motion.div>
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/90 dark:from-[#030712]/90 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/90 dark:from-[#030712]/90 to-transparent pointer-events-none" />
        </div>
    );
}

// Problem Section
function ProblemSection() {
    const { t } = useTranslation();
    return (
        <section className="py-16 lg:py-32 relative z-20 overflow-hidden bg-slate-50/30 dark:bg-slate-950/20">
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-50/50 dark:via-slate-900/20 to-white/0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
                            Modus Operandi Anggaran
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 dark:text-white leading-tight font-heading">
                            Kebocoran APBD Akibat <br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                                Manipulasi Anggaran Manual
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 2 150 2 198 10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-350 mb-8 leading-relaxed font-medium">
                            Setiap tahun daerah kehilangan triliunan rupiah APBD akibat ketidaksesuaian harga satuan draf anggaran dengan Standar Harga Regional (SHR) yang dimanipulasi secara sistemik karena minimnya pengawasan.
                        </p>

                        <div className="space-y-3">
                            {[
                                "Beban ribuan baris item RAPBD yang harus divalidasi manual satu demi satu.",
                                "Asimetri data pengadaan pembanding daerah terdekat yang tertutup.",
                                "Audit trail reviu anggaran yang tidak aman dan rentan intervensi eksternal.",
                                "Lamanya proses audit birokrasi manual yang memakan waktu berminggu-minggu."
                            ].map((problem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-blue-950/30 hover:border-red-200 dark:hover:border-red-950/40 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">{problem}</span>
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
                        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-200/60 dark:border-blue-950/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-tr-[2.5rem]" />

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Elysian Oversight</h3>
                            </div>

                            <div className="space-y-6 mb-8">
                                {[
                                    { title: "Deteksi Markup Instan", desc: "Cognitive Swarm mengidentifikasi harga di luar batas Nemesis DB secara otonom." },
                                    { title: "Kepatuhan Regulasi Cerdas", desc: "RAG OpenViking mencocokkan draf APBD dengan klausul hukum Perda regional." },
                                    { title: "Audit Trail On-Chain Immutable", desc: "Hash keputusan dibekukan di blockchain Sepolia EVM sebagai bukti autentik." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">{item.title}</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <Link href="/dashboard" className="block w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg transition-all cursor-pointer"
                                >
                                    Uji Coba Keandalan Audit
                                </motion.button>
                            </Link>
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
        { icon: Bot, title: "Cognitive Swarm AI", desc: "Simulasi debat otonom multi-agent (Auditor & Compliance) untuk kesepakatan verifikasi yang sangat objektif.", color: 'from-blue-500 to-cyan-400', bg: 'bg-white/70 dark:bg-[#070e1c]/80 border-slate-200/50 dark:border-blue-950/40' },
        { icon: FileText, title: "Librarian Perda RAG", desc: "Ekstraksi PDF regulasi daerah menggunakan OpenViking Rust & kueri semantik Qdrant DB secara dinamis.", color: 'from-sky-500 to-blue-400', bg: 'bg-white/70 dark:bg-[#070e1c]/80 border-slate-200/50 dark:border-blue-950/40' },
        { icon: Shield, title: "Blockchain Trust Layer", desc: "Pencatatan hash keputusan audit di Sepolia EVM Testnet (`AuditTrail.sol`) demi kepatuhan BPK.", color: 'from-emerald-500 to-teal-400', bg: 'bg-white/70 dark:bg-[#070e1c]/80 border-slate-200/50 dark:border-blue-950/40' },
        { icon: Zap, title: "Instant Guardrails", desc: "Pendeteksian anomali harga anggaran secara real-time di editor dokumen dengan debounced (800ms) API check.", color: 'from-cyan-500 to-blue-400', bg: 'bg-white/70 dark:bg-[#070e1c]/80 border-slate-200/50 dark:border-blue-950/40' }
    ];

    return (
        <section className="py-16 lg:py-32 relative z-20 bg-white dark:bg-[#030712]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading text-slate-900 dark:text-white leading-tight">
                        Mengangkat Kualitas Pengawasan Anggaran dengan
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"> Kecerdasan Swarm </span>
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Kami merancang teknologi pengawasan anggaran (*SupTech*) tercanggih untuk mewujudkan tata kelola pemerintahan yang bersih (*Good Governance*).
                    </p>
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
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">{feature.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">{feature.desc}</p>
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
        { icon: Store, title: "Reviu Dinas Kominfo", items: ["Evaluasi lisensi perangkat lunak", "Pencegahan markup pengadaan server", "Kepatuhan regulasi SPBE nasional"], color: 'from-cyan-500 to-blue-400', bg: 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 dark:border-blue-950/40' },
        { icon: Truck, title: "Reviu Dinas Perhubungan", items: ["Kesesuaian harga pengadaan rambu", "Analisis aspal jalan regional", "Validasi pembanding Nemesis DB"], color: 'from-blue-500 to-cyan-400', bg: 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 dark:border-blue-950/40' },
        { icon: PenTool, title: "Reviu Dinas Pendidikan", items: ["Markup buku paket sekolah", "Kepatuhan anggaran dana BOS", "Validasi audit trail tak terubah"], color: 'from-sky-500 to-blue-400', bg: 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 dark:border-blue-950/40' },
        { icon: Stethoscope, title: "Reviu Dinas Kesehatan", items: ["Audit harga alat kesehatan RSUD", "Validasi SHR regional obat-obatan", "Penyaringan data PII sensitif"], color: 'from-emerald-500 to-teal-400', bg: 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 dark:border-blue-950/40' }
    ];

    return (
        <section className="py-16 lg:py-32 relative z-20 bg-white dark:bg-[#030712] border-t border-slate-200/30 dark:border-blue-950/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading text-slate-900 dark:text-white">Kasus Penggunaan Pengawasan Dinas</h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Elysian dapat diadaptasikan secara modular untuk mengawasi dan menyaring draf anggaran pengadaan di berbagai satuan kerja perangkat daerah (OPD).
                    </p>
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
                            className={`group ${useCase.bg} rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all cursor-default`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${useCase.color}`}>
                                <useCase.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white font-heading">{useCase.title}</h3>
                            <ul className="space-y-3">
                                {useCase.items.map((item, idx) => (
                                    <li key={idx} className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 font-semibold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700 shrink-0" />
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

// FAQ Section
function FAQSection() {
    const faqs = [
        { q: "Bagaimana Swarm Agents (MiroFish) menjamin objektivitas audit anggaran?", a: "Swarm AI mensimulasikan perdebatan asinkron kaku antara tiga agen berdedikasi: Auditor Agent mengevaluasi aspek harga pasar riil (Nemesis DB), Compliance Agent memvalidasi aspek legalitas hukum regulasi (OpenViking RAG), dan Manager Agent mengambil konsensus penengah. Keduanya saling berdebat layaknya rapat komisi auditor profesional untuk mencegah bias model tunggal." },
        { q: "Dari mana asal data kebenaran dasar (Ground Truth) Nemesis DB?", a: "Nemesis DB berukuran 4GB+ berisi lebih dari 1 juta baris data riil Sistem Informasi Rencana Umum Pengadaan (SIRUP) nasional Indonesia. Data ini adalah catatan riil transaksi barang/jasa pemerintah Indonesia yang dijadikan patokan harga wajar daerah setempat secara presisi, meminimalisir kesalahan deteksi markup." },
        { q: "Bagaimana Elysian menangani kerahasiaan berkas draf APBD daerah?", a: "Sebelum dokumen diproses oleh LLM (MiniMax AI), Elysian menjalankan modul Payload Interceptor (Auto-Redaction PII). Modul ini secara otomatis memindai dan menyensor data pribadi sensitif (seperti nama dinas internal, nomor HP, NIP, alamat pribadi) dan menyajikannya sebagai teks bertopeng (masked text) demi menjaga privasi data daerah." },
        { q: "Mengapa Elysian memilih blockchain EVM Sepolia/Amoy untuk audit trail?", a: "Integrasi Sepolia EVM (`AuditTrail.sol`) menjamin integritas audit transparan yang tidak dapat disabotase (*Provenance Check*). Setiap konsensus draf APBD yang dihasilkan di-hash secara kriptografis dan dibekukan on-chain, sehingga juri hackathon, BPK, BPKP, maupun masyarakat dapat melacak orisinalitas laporan audit tanpa celah manipulasi." }
    ];

    return (
        <section className="py-20 lg:py-32 bg-slate-50 dark:bg-[#070e1c]/40 relative overflow-hidden border-t border-slate-200/40 dark:border-blue-950/20">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200/30 to-transparent" />

            <div className="container mx-auto px-4 max-w-3xl relative z-20">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                        Pertanyaan Umum Teknis
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white font-heading">FAQ Hackathon & Juri</h2>
                    <p className="text-slate-500 dark:text-slate-450 text-base font-semibold">Tanya jawab teknis seputar arsitektur modular, blockchain, dan kepatuhan audit Elysian.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-[#070e1c]/80 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-blue-950/30 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                        >
                            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2.5 font-heading flex items-start gap-2.5">
                                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                {item.q}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium pl-7">{item.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
