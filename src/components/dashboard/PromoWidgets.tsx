"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export function TryElysianWidget() {
    return (
        <div className="relative group overflow-hidden rounded-2xl border border-sky-100 bg-white p-6 h-full shadow-sm">

            {/* 1. Subtle Cloud/Wave Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-2xl -ml-12 -mb-12 opacity-50" />

            {/* 2. Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex gap-4">
                    {/* Icon Area */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100 overflow-hidden">
                            {/* Using the requested image */}
                            <Image src="/elysian_empty_doc.png" alt="Elysian" width={32} height={32} className="w-8 h-8 object-contain" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            Coba Fitur Elysian Sekarang!
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-1">
                            Gratis akses fitur premium selama 1 bulan untuk biaya operasional lebih murah dengan mencoba langsung fitur dibawah ini. <span className="text-blue-600 font-medium cursor-pointer hover:underline">Lihat keuntungan.</span>
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    {/* Progress Bar */}
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[25%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                    </div>
                    <span className="text-sm font-bold text-emerald-600">25%</span>

                    {/* CTA Button */}
                    <Button className="bg-sky-50 text-blue-600 hover:bg-sky-100 hover:text-blue-700 border-none font-semibold shadow-none">
                        Klaim Hadiah Sekarang
                    </Button>
                </div>
            </div>
        </div>
    );
}
