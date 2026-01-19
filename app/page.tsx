'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
    Rocket, Code, Shield, Users, Zap, Search, Globe, ChevronRight, Play, XCircle, Bot, FileText,
    ArrowRight, Sparkles, TrendingUp, Menu, X, Store, Truck, PenTool, Stethoscope, CheckCircle2
} from 'lucide-react';
import { ProductShowcase } from '@/components/ProductShowcase';
import { FeatureDeepDive } from '@/components/FeatureDeepDive';
import { IntegrationsCarousel } from '@/components/IntegrationsCarousel';
import { CollaborationSection } from '@/components/CollaborationSection';
import { AiAgentsSection } from '@/components/AiAgentsSection';
import { FloatingBentoGrid } from '@/components/FloatingBentoGrid';

export default function ElysianLanding() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900"
        >
            {/* Floating Navigation */}
            <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* Hero Section - Anti-Gravity + Floating Bento (Combined) */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Animated Background Blobs (Restored) */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-[100px] rounded-full pointer-events-none"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-tl from-indigo-400/15 to-purple-400/15 blur-[120px] rounded-full pointer-events-none"
                />

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                    className="container mx-auto px-4 py-8 sm:py-12 lg:py-20 relative z-10"
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
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center gap-2 px-2.5 py-1.5 sm:px-3 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-sm mb-4 sm:mb-6 lg:mb-8 cursor-default"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    <span className="text-[10px] sm:text-xs font-semibold text-blue-900 tracking-wide uppercase">Elysian v2.0 Public Beta</span>
                                </motion.div>

                                {/* Headline */}
                                <motion.h1
                                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] tracking-tight text-slate-900"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    Standar Baru <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500">
                                        Manajemen Produk.
                                    </span>
                                </motion.h1>

                                <motion.p
                                    className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium px-4 sm:px-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    Sistem operasi cerdas untuk tim modern. Gabungkan roadmap, dokumen, dan AI dalam satu harmoni.
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div
                                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                >
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full sm:w-auto h-12 px-8 rounded-full bg-slate-900 text-white font-semibold shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
                                        >
                                            Mulai Sekarang
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto h-12 px-8 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                        Lihat Demo
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right: The Floating Bento Grid (Restored & Enhanced) */}
                        <div className="hidden lg:flex w-full lg:w-1/2 relative min-h-[500px] items-center justify-center">
                            <FloatingBentoGrid />
                        </div>
                    </div>
                </motion.div>
            </section>


            {/* Infinite Marquee */}
            < InfiniteMarquee />

            {/* Product Showcase - Linear Style */}
            <ProductShowcase />

            {/* Feature Deep Dive - Cycles/Triage/Insights */}
            <FeatureDeepDive />

            {/* AI Agents Showcase (New) */}
            <AiAgentsSection />

            {/* Collaboration Section (New) */}
            <CollaborationSection />

            {/* Integrations Carousel */}
            <IntegrationsCarousel />

            {/* Problem Section */}
            < ProblemSection />

            {/* Solution Grid */}
            < SolutionSection />

            {/* Use Cases */}
            < UseCasesSection />

            {/* CTA */}
            < CTASection />

            {/* FAQ */}
            < FAQSection />

            {/* Global footer is handled by Providers/SiteFooter, avoiding double footer here */}
        </motion.div>
    );
}

// Navbar Component
function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className={`flex items-center justify-between rounded-full transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 px-6 py-3 border border-slate-200/50'
                    : 'bg-white/40 backdrop-blur-md px-6 py-3 border border-white/30'
                    }`}>
                    <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Elysian
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Fitur', 'Solusi', 'Harga', 'Blog'].map((item) => (
                            <button key={item} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <button className="hidden md:block text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                Masuk
                            </button>
                        </Link>
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/30"
                            >
                                Daftar
                            </motion.button>
                        </Link>

                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}


// Infinite Marquee
function InfiniteMarquee() {
    const industries = ['Retail', 'Logistik', 'Agency', 'Klinik', 'F&B', 'Manufaktur', 'Konsultan', 'Properti'];

    return (
        <div className="relative py-12 overflow-hidden bg-white/50 backdrop-blur-sm border-y border-slate-100">
            <div className="flex gap-16">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex gap-16 whitespace-nowrap"
                >
                    {[...industries, ...industries].map((industry, i) => (
                        <span key={i} className="text-2xl font-bold text-slate-300">
                            {industry}
                        </span>
                    ))}
                </motion.div>
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/50 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />
        </div>
    );
}

// Problem Section
function ProblemSection() {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-50/50 to-white/0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 leading-tight">
                            Mengapa Bisnis <br />
                            <span className="relative inline-block">
                                Sering Stuck?
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 2 150 2 198 10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Banyak pemilik bisnis terjebak menjadi "karyawan" di bisnisnya sendiri. Waktu habis untuk hal teknis, bukan strategis.
                        </p>

                        <div className="space-y-3">
                            {[
                                'Dokumen penting berantakan di WhatsApp & Email',
                                'Keputusan lambat karena data tidak rapi',
                                'SOP cuma jadi pajangan dinding',
                                'Burnout mengurus operasional harian'
                            ].map((problem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100 hover:border-red-200 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{problem}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-tr-[2.5rem]" />

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Solusi Elysian</h3>
                            </div>

                            <div className="space-y-6 mb-8">
                                {[
                                    { title: 'Otomatisasi 80% Pekerjaan Admin', desc: 'Hemat 20+ jam per minggu' },
                                    { title: 'Pustaka Pengetahuan Terpusat', desc: 'SOP & Dokumen dalam satu akses' },
                                    { title: 'AI Konteks Lokal', desc: 'Mengerti bahasa bisnis Indonesia' }
                                ].map((item, i) => (
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
                                            <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                            <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg"
                            >
                                Transformasi Bisnis Sekarang
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// Solution Section
function SolutionSection() {
    const features = [
        { icon: Bot, title: 'AI Assistant 24/7', desc: 'Jawab pertanyaan tim kapan saja', color: 'from-blue-500 to-cyan-500' },
        { icon: FileText, title: 'Document Hub', desc: 'Semua file dalam satu tempat', color: 'from-indigo-500 to-purple-500' },
        { icon: Shield, title: 'Enterprise Security', desc: 'Standar keamanan perbankan', color: 'from-emerald-500 to-teal-500' },
        { icon: Zap, title: 'Workflow Automation', desc: 'Otomasi tugas berulang', color: 'from-orange-500 to-amber-500' }
    ];

    return (
        <section className="py-32 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Fitur yang <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Mengangkat</span> Bisnis
                    </h2>
                    <p className="text-xl text-slate-600">Platform all-in-one untuk operasional bisnis modern</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)" }}
                            className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Use Cases Section
function UseCasesSection() {
    const cases = [
        { icon: Store, title: 'Retail & Toko', items: ['Cek stok otomatis', 'Balas chat pelanggan', 'Deskripsi produk'], color: 'from-orange-500 to-red-500' },
        { icon: Truck, title: 'Logistik', items: ['Tracking kiriman', 'Rekap surat jalan', 'Optimasi rute'], color: 'from-blue-500 to-cyan-500' },
        { icon: PenTool, title: 'Agency', items: ['Ide konten instan', 'Draft proposal', 'Analisis brief'], color: 'from-pink-500 to-purple-500' },
        { icon: Stethoscope, title: 'Klinik', items: ['Rekap medis', 'Jadwal dokter', 'Reminder pasien'], color: 'from-emerald-500 to-teal-500' }
    ];

    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">Siapa yang Butuh Elysian?</h2>
                    <p className="text-xl text-slate-600">Platform fleksibel yang beradaptasi dengan model bisnis Anda</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-100 transition-all cursor-default"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${useCase.color}`}>
                                <useCase.icon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">{useCase.title}</h3>
                            <ul className="space-y-3">
                                {useCase.items.map((item, idx) => (
                                    <li key={idx} className="text-sm text-slate-500 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
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


// CTA Section - Elysian Rebirth Style
function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white pointer-events-none" />

            {/* Animated Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-400/20 blur-[100px] rounded-full -translate-y-1/2"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-cyan-400/20 blur-[100px] rounded-full -translate-y-1/2"
            />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="relative isolate rounded-[3rem] overflow-hidden">
                        {/* Glass Container */}
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl border border-white/60" />

                        {/* Inner Gradient Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-blue-300/20 opacity-50" />

                        <div className="relative p-12 md:p-24 text-center">
                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-blue-200 shadow-sm mb-10 mx-auto"
                            >
                                <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" />
                                <span className="text-sm font-semibold text-blue-900 tracking-wide uppercase">Bergabung dengan Revolusi AI</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-slate-900"
                            >
                                Siap Membuat Bisnis Anda <br />
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                                    Lebih Ringan?
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                            >
                                Bergabunglah dengan <span className="font-bold text-slate-900">500+ pebisnis</span> yang telah beralih ke cara kerja masa depan. Hemat waktu, kurangi stres.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                            >
                                <Link href="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.25)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="h-16 px-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-xl shadow-blue-500/30 flex items-center gap-3 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span>Mulai Uji Coba Gratis</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>

                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-16 px-10 rounded-full bg-white/70 backdrop-blur-xl border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-blue-200 hover:text-blue-700 transition-all shadow-lg flex items-center gap-3"
                                >
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Konsultasi Tim
                                </motion.button>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-8 text-sm text-slate-400 font-medium"
                            >
                                Tanpa kartu kredit. Batalkan kapan saja.
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// FAQ Section
function FAQSection() {
    const faqs = [
        { q: "Apakah data bisnis saya aman?", a: "Sangat aman. Kami menggunakan enkripsi standar perbankan (AES-256) dan server yang terisolasi untuk setiap klien." },
        { q: "Bisa integrasi dengan WhatsApp?", a: "Ya! Elysian memiliki fitur integrasi WhatsApp Business API resmi untuk auto-reply dan manajemen order." },
        { q: "Apakah ada training penggunaan?", a: "Kami menyediakan video tutorial lengkap dan sesi onboarding 1-on-1 untuk paket Enterprise." },
        { q: "Bagaimana jika saya ingin berhenti?", a: "Anda bisa berhenti berlangganan kapan saja. Data Anda bisa diekspor sepenuhnya." }
    ];

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-slate-900">Pertanyaan Umum</h2>
                    <p className="text-lg text-slate-600">Jawaban untuk keraguan Anda</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                        >
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{item.q}</h3>
                            <p className="text-slate-600 leading-relaxed">{item.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
