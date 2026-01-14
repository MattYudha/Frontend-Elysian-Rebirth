'use client';

import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import {
    Rocket,
    Zap,
    Shield,
    Store,
    Truck,
    PenTool,
    Stethoscope,
    Utensils,
    Factory,
    GraduationCap,
    FileText,
    Bot,
    Workflow,
    Database,
    Users,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/config';
import { LandingNavbar } from '@/components/LandingNavbar';
import { FeaturesSection } from '@/components/FeaturesSection';
import { CTASection } from '@/components/CTASection';
import { FAQSection } from '@/components/FAQSection';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            <LandingNavbar />
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[url('/dashboard-bg.png')] bg-cover bg-center bg-no-repeat pt-32 pb-80">
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="hidden md:block text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                        {APP_NAME}
                    </h1>
                    <p className="text-3xl md:text-3xl font-bold mb-6 drop-shadow-sm bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent md:text-slate-800 w-full mx-auto px-4 leading-tight">
                        Platform AI Enterprise untuk UMKM Indonesia
                    </p>
                    <p className="hidden md:block text-xl text-slate-700 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
                        Elysian Rebirth adalah platform AI terpadu yang membantu UMKM dan organisasi bisnis di Indonesia mengubah dokumen, proses, dan operasi sehari-hari menjadi alur kerja otomatis yang cerdas dan efisien.
                        <br /><span className="text-slate-900 font-bold block mt-2">Tidak perlu tim IT besar—cukup unggah data, atur alur kerja, dan AI akan bekerja untuk Anda.</span>
                    </p>
                    <Link href="/dashboard">
                        <Button
                            size="lg"
                            className="h-14 px-12 text-lg rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:-translate-y-1"
                        >
                            <Rocket className="mr-2 h-5 w-5" />
                            Mulai Sekarang
                        </Button>
                    </Link>
                </div>
                {/* Background Grid/Effect */}
                {/* <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div> */}
            </section>

            {/* Trusted By Section (Infinite Slider) */}
            <section className="py-10 bg-white/80 border-b border-border backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm font-medium text-muted-foreground mb-8">
                        DIPERCAYA OLEH BERBAGAI UMKM INDONESIA
                    </p>
                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row w-full max-w-5xl">
                            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-scroll flex-row min-w-full">
                                <LogoItem name="Paper.id" />
                                <LogoItem name="Kopi Kenangan" />
                                <LogoItem name="J&T Cargo" />
                                <LogoItem name="Hijra Bank" />
                                <LogoItem name="eFishery" />
                                <LogoItem name="Halodoc" />
                                <LogoItem name="Sayurbox" />
                                <LogoItem name="Fore Coffee" />
                            </div>
                            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-scroll flex-row min-w-full" aria-hidden="true">
                                <LogoItem name="Paper.id" />
                                <LogoItem name="Kopi Kenangan" />
                                <LogoItem name="J&T Cargo" />
                                <LogoItem name="Hijra Bank" />
                                <LogoItem name="eFishery" />
                                <LogoItem name="Halodoc" />
                                <LogoItem name="Sayurbox" />
                                <LogoItem name="Fore Coffee" />
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Problem Solving Section */}
            <section className="py-20 bg-secondary/10 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Masalah UMKM yang Diselesaikan</h2>
                            <div className="space-y-4">
                                <ProblemItem text="Dokumen penting tercecer & hilang" />
                                <ProblemItem text="Pengambilan keputusan lambat karena data tidak siap" />
                                <ProblemItem text="Tidak ada standar operasional (SOP) yang jelas" />
                                <ProblemItem text="Ketergantungan tinggi pada tenaga manual" />
                                <ProblemItem text="Pengetahuan bisnis hilang saat karyawan keluar" />
                                <ProblemItem text="Owner terjebak mengerjakan hal teknis sendirian" />
                            </div>
                        </div>

                        <div className="bg-card p-8 rounded-2xl border border-border shadow-2xl">
                            <h3 className="text-2xl font-bold mb-6 text-primary">Nilai Utama Elysian Rebirth</h3>
                            <ul className="space-y-4">
                                <ValueItem text="Lebih Cepat Operasional" />
                                <ValueItem text="Hemat Waktu & Tenaga Kerja" />
                                <ValueItem text="Meningkatkan Akurasi Kerja" />
                                <ValueItem text="Scale Tanpa Tambah Orang" />
                                <ValueItem text="Informasi Selalu Siap Sedia" />
                            </ul>
                            <div className="mt-8 pt-6 border-t border-border">
                                <Link href="/dashboard">
                                    <Button className="w-full text-lg h-12 bg-blue-600 hover:bg-blue-700 text-white">
                                        Coba Gratis Sekarang
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section (Langkah Pertama) */}
            <div className="container mx-auto px-4 mt-20">
                <CTASection />
            </div>

            {/* Use Cases Section (Siapa yang Cocok) - MOVED BELOW CTA */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white">Siapa yang Cocok Menggunakan Ini?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <UseCaseCard
                            icon={Store}
                            color="text-orange-400"
                            title="Produk & Retail"
                            items={['Analisis transaksi harian', 'Manajemen stok otomatis', 'AI Copywriting untuk produk']}
                        />
                        <UseCaseCard
                            icon={Truck}
                            color="text-blue-400"
                            title="Logistik & Ekspor"
                            items={['Dokumen pengiriman', 'Manajemen bea cukai', 'Tracking info barang']}
                        />
                        <UseCaseCard
                            icon={PenTool}
                            color="text-pink-400"
                            title="Creative Agency"
                            items={['Copywriting otomatis', 'Pembuat pitch & proposal', 'Analisis insight customer']}
                        />
                        <UseCaseCard
                            icon={Stethoscope}
                            color="text-red-400"
                            title="Kesehatan"
                            items={['SOP Otomatis', 'Ringkasan operasional', 'Kepatuhan regulasi']}
                        />
                        <UseCaseCard
                            icon={Utensils}
                            color="text-yellow-400"
                            title="F&B (Kuliner)"
                            items={['SOP Dapur', 'Checklist harian', 'Hitung HPP & Resep']}
                        />
                        <UseCaseCard
                            icon={Factory}
                            color="text-slate-400"
                            title="Manufaktur Kecil"
                            items={['Manual mesin & alat', 'Quality Assurance (QA) AI', 'Tracking produksi']}
                        />
                        <UseCaseCard
                            icon={GraduationCap}
                            color="text-indigo-400"
                            title="Pendidikan"
                            items={['Pembuatan kurikulum', 'Otomatisasi laporan', 'Asisten siswa/anggota']}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <div className="container mx-auto px-4">
                <FAQSection />
            </div>
        </div>
    );
}

function UseCaseCard({ icon: Icon, title, items, color }: { icon: any, title: string, items: string[], color: string }) {
    return (
        <Card className="hover:shadow-lg transition-shadow border-border/60">
            <CardHeader className="pb-2">
                <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                    {items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

function ProblemItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-lg text-muted-foreground">
            <XCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
            <span>{text}</span>
        </div>
    )
}

function ValueItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 font-medium">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span>{text}</span>
        </div>
    )
}

function LogoItem({ name }: { name: string }) {
    return (
        <div className="flex items-center justify-center px-4 py-2 bg-secondary/20 rounded-lg text-muted-foreground font-semibold text-lg whitespace-nowrap hover:text-foreground hover:bg-secondary/40 transition-colors cursor-default">
            {name}
        </div>
    )
}

function FeatureCheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-foreground/80 font-medium">{text}</span>
        </div>
    )
}
