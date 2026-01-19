
"use client";


import { Separator } from '@/components/ui/separator';
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Send,
} from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="relative w-full overflow-hidden bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
            {/* Elegant Top Separator (Subtle Shadow/Glow) */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto pt-16 pb-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column - Wider */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Elysian Rebirth
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                                Asisten Operasional Cerdas terdepan di Indonesia yang didedikasikan untuk membantu UMKM. Kami menggabungkan kecerdasan buatan canggih untuk mengotomatiskan proses, memberikan wawasan mendalam, dan memacu pertumbuhan bisnis Anda.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm transition-all border border-slate-200">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white text-slate-500 hover:text-sky-500 hover:bg-sky-50 shadow-sm transition-all border border-slate-200">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white text-slate-500 hover:text-pink-600 hover:bg-pink-50 shadow-sm transition-all border border-slate-200">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-700 hover:bg-blue-50 shadow-sm transition-all border border-slate-200">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Solusi Bisnis</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-400" />Otomatisasi Dokumen</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-400" />Analisis Keuangan AI</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-400" />Manajemen Inventaris</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-400" />Prediksi Tren Pasar</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-400" />Integrasi ERP</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Dukungan</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/help" className="hover:text-blue-600 transition-colors">Pusat Bantuan</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Dokumentasi API</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Status Server</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Komunitas Pengguna</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Hubungi Sales</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Hubungi Kami</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600"><Send className="h-3 w-3" /></div>
                                <span>Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan SCBD, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-blue-100 p-1 rounded text-blue-600"><Twitter className="h-3 w-3" /></div>
                                <span>hello@elysian.ai</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-blue-100 p-1 rounded text-blue-600"><Facebook className="h-3 w-3" /></div>
                                <span>+62 21 5555 8888</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-slate-200" />

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2024 Elysian Rebirth Intelligence. Terdaftar di PSE Kominfo.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Pernyataan Aksesibilitas</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
