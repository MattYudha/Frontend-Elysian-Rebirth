'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { Input } from '@/components/ui/';
import { Search, MessageCircle, Phone, Mail, MapPin, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0B1120]">
            {/* Sticky Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen flex-none z-30">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen relative w-full min-w-0">
                {/* Sticky Navbar Wrapper - No bg on this one to let blue header show through? 
                    Wait, if I want consistent navbar, it should have a bg if scrolled, 
                    but here we have a giant blue header.
                    
                    Option A: Navbar is sticky and transparent initially.
                    Option B: Navbar is fixed (like DashboardNavbar default) but handled within this flex column? No.
                    
                    Let's use sticky but transparent, assuming the blue header is the visual "top".
                    BUT if we scroll, we want the glass effect over the *white* content?
                    DashboardNavbar handles scrolling logic! But only if !staticMode.
                    
                    If I use staticMode=true, no scroll logic.
                    
                    Design choice: Help page usually has a different header.
                    I will use staticMode={true} providing a simple transparent navbar at the top of the blue section.
                    It will become white/glass as user scrolls PAST the blue section?
                    No, staticMode doesn't change on scroll.
                    
                    To keep it simple and consistent with user request:
                    Sticky wrapper with glass effect always?
                    Or just Transparent over blue?
                    
                    I'll use Sticky wrapper with a slight gradient or just transparent, allowing blue to be seen.
                 */}
                {/* Floating Navbar */}
                <DashboardNavbar />

                <div id="main-scroll-container" className="flex-1 overflow-y-auto">
                    {/* Header Section with Rocket & Search */}
                    {/* Floating navbar sits over this now, so we add pt-24 to content to clear it */}
                    <div className="bg-[#1ca0e3] dark:bg-blue-900/80 relative overflow-hidden pt-24 pb-16 border-b border-transparent dark:border-blue-800/50">

                        {/* Background Elements (Clouds/Rocket) */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-[15%] top-[20%] opacity-20 transform -rotate-12">
                                <Rocket className="h-48 w-48 text-white" />
                            </div>
                            <div className="absolute right-[10%] bottom-[10%] opacity-10">
                                <div className="h-32 w-32 rounded-full bg-white blur-3xl" />
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">

                            {/* Links Top Right */}
                            <div className="flex justify-between items-center absolute top-[-2rem] right-6 text-white/90 text-sm font-medium z-50">
                                <Link href="#" className="hover:text-white hover:underline">Kirim permintaan</Link>
                            </div>

                            <div className="mb-8 flex justify-center mt-8">
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                        <MessageCircle className="h-6 w-6" />
                                    </span>
                                    Elysian Support
                                </h1>
                            </div>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-20" />
                                <Input
                                    placeholder="Cari artikel bantuan, topik, atau panduan..."
                                    className="w-full pl-12 h-14 rounded-full border-0 shadow-lg shadow-blue-900/10 dark:shadow-black/20 dark:bg-slate-900/80 dark:text-slate-100 focus-visible:ring-0 text-base py-3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto w-full px-6 py-12">

                        {/* Promoted Articles Section */}
                        <div className="mb-12">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Artikel yang dipromosikan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    "Pembayaran Internasional PaperXB Melalui Website",
                                    "FAQ Paper XB - Layanan Pembayaran Transaksi ke Luar Negeri",
                                    "Jadwal Disbursement/Pencairan Dana Pembayaran Digital PaperPay In & PaperPay Out",
                                    "Apa itu Pembayaran Digital (Digital Payment)?",
                                    "Bagaimana Cara Menggunakan BuyerConnect sebagai Pengirim Invoice Penjualan?",
                                    "Optimalkan Budget and Procurement dengan Paper Horizon Card",
                                    "Paper Pioneer Card, Kartu Kredit Bisnis Untuk Pemula",
                                    "Bayar Makin Nagih dengan PAPERCARD",
                                    "Syarat Mengajukan UniverseCard",
                                    "Panduan Foto Verifikasi Dokumen Usaha",
                                    "Mengundang Partner Bisnis ke Ekosistem Paper Id (Paper Network)",
                                    "FAQ Integrasi Paper.id dan Accurate",
                                    "Panduan lengkap program promo di Paper.id",
                                    "Paket Berlangganan Paper.id",
                                    "Langkah awal untuk menggunakan Paper.id"
                                ].map((item, idx) => (
                                    <Link href="#" key={idx} className="block group">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors line-clamp-2">
                                            {item}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Aktivitas terbaru</h2>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {[
                                    { cat: "Pembayaran ke Cina", title: "Tujuan Pembayaran ke Alipay China Melalui PaperXB", time: "1 bulan yang lalu" },
                                    { cat: "Panduan Web", title: "Cara Memasukkan Produk Baru (Fifo v.2)", time: "1 bulan yang lalu" },
                                    { cat: "Panduan Web", title: "Cara Menambah Unit Ukuran Produk (Fifo v.2)", time: "1 bulan yang lalu" },
                                    { cat: "Panduan Web", title: "Cara Menambah Kategori Unit Produk (Fifo v.2)", time: "1 bulan yang lalu" },
                                    { cat: "Panduan", title: "Pembayaran Internasional PaperXB Melalui Aplikasi Mobile", time: "2 bulan yang lalu" },
                                ].map((activity, idx) => (
                                    <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{activity.cat}</p>
                                        <div className="flex justify-between items-start gap-4">
                                            <Link href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                                {activity.title}
                                            </Link>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                <span>Artikel dibuat {activity.time}</span>
                                                <MessageCircle className="h-3 w-3 ml-1" />
                                                <span>0</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-2">
                                    <Link href="#" className="text-sm text-blue-500 dark:text-blue-400 hover:underline">Lihat lebih banyak</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section - Matches Reference */}
                    <footer className="bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-blue-900/30 py-12 px-6">
                        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 text-sm text-slate-500 dark:text-slate-400">
                            <div className="md:w-1/3">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-base">Elysian Support & Help</h3>
                                <p className="text-xs leading-relaxed">
                                    Platform intelligence bisnis terpadu untuk efisiensi operasional Anda.
                                </p>
                            </div>
                            <div className="flex-1 space-y-3">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-base mb-2">Contact Info</h3>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p>+62 852 1952 6186 (WhatsApp Only)</p>
                                        <p>+62 855 7467 7916 (Call Only)</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <a href="mailto:support@elysian.id" className="hover:text-blue-600">support@elysian.id</a>
                                </div>

                                <div className="flex items-start gap-3 mt-4">
                                    <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium dark:text-slate-300">Headquarter</p>
                                        <p className="text-xs max-w-sm mb-2">Jl. Perjuangan No.22, RT.11/RW.10, Kb. Jeruk, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11530</p>

                                        <p className="font-medium dark:text-slate-300">Branch Office</p>
                                        <p className="text-xs max-w-sm">Jl. Sunter Garden Raya No.5D, RT.06/RW.12, Sunter Agung, Kec. Tj. Priok, Kota Jakarta Utara, Daerah Khusus Ibukota Jakarta 14350</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
