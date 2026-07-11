
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    Bot,
    Workflow,
    Database,
    Users,
    CheckCircle2,
    ArrowDown,
    ArrowUp,
    type LucideIcon
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export function FeaturesSection() {
    return (
        <section className="py-20 bg-secondary/20 relative">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white font-heading">
                        Apa yang Bisa Dilakukan Elysian?
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
                        Solusi lengkap untuk modernisasi bisnis Anda
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    <FeatureCard
                        icon={FileText}
                        color="text-blue-500"
                        bgColor="bg-blue-500/10"
                        title="Otomatisasi Dokumen"
                        items={[
                            "Membaca dan merangkum kontrak & invoice",
                            "Ekstraksi data dari PDF & nota",
                            "Susun SOP, proposal, & laporan otomatis"
                        ]}
                    />
                    <FeatureCard
                        icon={Bot}
                        color="text-teal-500"
                        bgColor="bg-teal-500/10"
                        title="Asisten AI Internal"
                        items={[
                            "Chatbot untuk tanya jawab staf",
                            "Cari data di seluruh dokumen perusahaan",
                            "FAQ otomatis untuk training karyawan"
                        ]}
                    />
                    <FeatureCard
                        icon={Workflow}
                        color="text-amber-500"
                        bgColor="bg-amber-500/10"
                        title="Workflow Tanpa Koding"
                        items={[
                            "Proses approval otomatis",
                            "Notifikasi follow-up pelanggan",
                            "Order → Stok → Invoice otomatis"
                        ]}
                    />
                    <FeatureCard
                        icon={Database}
                        color="text-blue-400"
                        bgColor="bg-blue-400/10"
                        title="Manajemen Pengetahuan"
                        items={[
                            "Sentralisasi dokumen penting",
                            "Ubah file lama jadi knowledge base",
                            "Pencarian cerdas dalam hitungan detik"
                        ]}
                    />
                    <div className="lg:col-span-2 lg:w-2/3 lg:mx-auto">
                        <FeatureCard
                            icon={Users}
                            color="text-cyan-400"
                            bgColor="bg-cyan-400/10"
                            title="Human-In-The-Loop (HIL)"
                            items={[
                                "AI bekerja cepat, manusia tetap pegang kendali.",
                                "Ideal untuk Keuangan, Legal, Kesehatan, & Konsultan."
                            ]}
                        />
                    </div>
                </div>

                {/* Dashed Line Separator with Wider Gaps */}
                <div className="relative w-full py-16 flex items-center justify-center">
                    <svg className="w-full h-2" aria-hidden="true">
                        <line
                            x1="0"
                            y1="1"
                            x2="100%"
                            y2="1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="12 12"
                            className="text-blue-300 dark:text-blue-700"
                        />
                    </svg>
                    <div className="absolute left-1/2 -translate-x-1/2 bg-background px-4">
                        <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30"></div>
                    </div>
                </div>

                {/* Spotlight Section: Praktis, Cepat, Akurasi Tinggi */}
                <div className="flex flex-col lg:flex-row items-center gap-16 pt-8">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 text-blue-600 font-semibold bg-blue-100 dark:bg-blue-900/30 px-5 py-2 rounded-full text-sm">
                            <FileText className="h-5 w-5" />
                            <span>Otomatisasi Dokumen</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                            Praktis, Cepat, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
                                Akurasi Tinggi
                            </span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                            Upload invoice, kontrak, atau laporan keuangan Anda, dan biarkan AI kami mengekstrak data penting dalam hitungan detik. Dokumen digital Anda kini siap diolah tanpa input manual yang melelahkan.
                        </p>

                        <ul className="space-y-5">
                            <FeatureCheckItem text="Ekstraksi data otomatis dari PDF & Gambar" />
                            <FeatureCheckItem text="Export langsung ke Excel atau Database" />
                            <FeatureCheckItem text="Validasi data cerdas untuk meminimalkan error" />
                        </ul>

                        <div className="pt-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="rounded-full px-10 h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
                                    Lihat Demo
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative">
                        {/* Abstract Background Blobs */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob animation-delay-4000"></div>

                        {/* Interactive Card Mockup */}
                        <div className="relative rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 md:p-10 aspect-square md:aspect-video flex flex-col items-center justify-center group overflow-hidden hover:shadow-blue-500/10 transition-shadow duration-500">

                            <div className="relative z-10 text-center w-full scale-90 md:scale-100 transition-transform">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-lg mx-auto mb-6 md:mb-8 flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500 ring-1 ring-black/5">
                                    <FileText className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                                </div>

                                <div className="space-y-3 md:space-y-4 max-w-[200px] md:max-w-xs mx-auto">
                                    <div className="w-full h-2.5 md:h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-3/4 animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
                                    </div>
                                    <div className="w-2/3 h-2.5 md:h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mx-auto">
                                        <div className="h-full bg-teal-500 w-1/2 animate-[shimmer_2s_infinite] delay-75 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
                                    </div>
                                </div>

                                <div className="mt-6 md:mt-8 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 text-xs md:text-sm font-medium">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    AI Scanning in Progress...
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute top-4 left-4 md:top-8 md:left-8 p-2 md:p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-black/5 animate-bounce [animation-duration:3s]">
                                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                            </div>
                            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 px-3 py-1.5 md:px-4 md:py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-black/5 animate-bounce [animation-duration:4s] delay-700">
                                <span className="text-[10px] md:text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                                    100% Digital
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Komitmen Nyata Stats Section */}
                <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-white dark:from-white dark:via-blue-100 dark:to-blue-200 font-heading drop-shadow-sm mb-4">
                            Komitmen Nyata Kami Bantu Bisnis Lebih Maju
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative">
                        {/* Stat 1 */}
                        <div className="flex flex-col items-center justify-center p-6 md:border-r border-slate-200 dark:border-slate-800">
                            <div className="flex items-start">
                                <span className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
                                    <Counter end={10} duration={2} />
                                </span>
                                <span className="text-2xl font-bold text-slate-500 dark:text-slate-400 mt-2 ml-1">T</span>
                                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-2 ml-1 uppercase">IDR</span>
                            </div>
                            <p className="text-center text-slate-600 dark:text-slate-400 mt-4 max-w-[200px] font-medium">
                                Jumlah transaksi invoice tercatat
                            </p>
                        </div>

                        {/* Stat 2 */}
                        <div className="flex flex-col items-center justify-center p-6 md:border-r border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="flex items-start">
                                    <span className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
                                        <Counter end={80} duration={2.5} />
                                    </span>
                                    <span className="text-4xl font-bold text-slate-500 dark:text-slate-400 mt-1">%</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                                    <ArrowDown className="text-lime-600 dark:text-lime-400 w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-center text-slate-600 dark:text-slate-400 mt-4 max-w-[200px] font-medium">
                                Efektif menurunkan biaya operasional
                            </p>
                        </div>

                        {/* Stat 3 */}
                        <div className="flex flex-col items-center justify-center p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-start">
                                    <span className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
                                        <Counter end={3} duration={1.5} />
                                    </span>
                                    <span className="text-4xl font-bold text-slate-500 dark:text-slate-400 mt-1">x</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                                    <ArrowUp className="text-lime-600 dark:text-lime-400 w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-center text-slate-600 dark:text-slate-400 mt-4 max-w-[200px] font-medium">
                                Lebih efektif bantu kelola keuangan bisnis
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Counter({ end, duration }: { end: number, duration: number }) {
    const [count, setCount] = React.useState(0);
    const nodeRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const increment = end / (duration * 60); // 60fps
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 1000 / 60);

                // Stop observing once started
                observer.disconnect();
                return () => clearInterval(timer);
            }
        }, { threshold: 0.1 });

        observer.observe(node);

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={nodeRef}>{count}</span>;
}

interface FeatureCardProps {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    title: string;
    items: string[];
}

function FeatureCard({ icon: Icon, color, bgColor, title, items }: FeatureCardProps) {
    return (
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <CardHeader>
                <div className={`${bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')} flex-shrink-0`}></span>
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

function FeatureCheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg text-slate-700 dark:text-slate-200 font-medium">{text}</span>
        </div>
    );
}
