'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CTASection() {
    return (
        <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-sky-50 to-white dark:from-slate-900 dark:to-slate-900 shadow-xl border border-sky-100 dark:border-slate-800 mb-24">
            <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl space-y-6 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-600 dark:from-blue-400 dark:to-sky-300">
                        Langkah Pertama <br />
                        untuk <span className="underline decoration-blue-300 decoration-4 underline-offset-4">Bisnis Maju</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Dari UMKM sampai korporasi, semua bisa nikmati mudahnya berbisnis dengan Elysian Rebirth.
                    </p>
                    <div>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                                Coba Sekarang
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Cloud Background */}
            <div className="absolute bottom-0 right-0 w-full md:w-2/3 h-full pointer-events-none">
                <div className="relative w-full h-full">
                    <Image
                        src="/cloud-wave-bg.png"
                        alt="Background Decoration"
                        fill
                        className="object-cover object-right-bottom opacity-80 mix-blend-multiply dark:mix-blend-screen"
                        quality={90}
                    />
                    {/* Gradient Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-transparent to-transparent dark:from-slate-900 dark:via-transparent"></div>
                </div>
            </div>
        </div>
    );
}
