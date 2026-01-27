"use client";

import React from "react";
import { CloudUpload, FileOutput, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BusinessNeedsSection() {
    return (
        <div className="pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-8">
            <div className="mb-4 md:mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Kebutuhan Bisnis Anda
                </h2>
                <p className="text-zinc-500 text-sm">
                    Akses fitur ekstraksi dan manajemen dokumen bisnis Anda dengan mudah
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Elysian Iner Card */}
                <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4 md:mb-6 lg:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CloudUpload className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Elysian Iner</h3>
                                <p className="text-sm text-zinc-500">Riwayat Upload Dokumen Masuk</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center my-4 md:my-6 lg:my-8">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <CloudUpload className="w-10 h-10 text-emerald-600" />
                        </div>
                    </div>

                    <div className="text-center mt-4 md:mt-6 lg:mt-8">
                        <p className="text-sm text-zinc-400 mb-4 md:mb-6">
                            Kelola dokumen Anda dengan mudah dan cepat.
                        </p>
                        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold group-hover:translate-x-1 transition-all p-0 h-auto">
                            Mulai Sekarang <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Elysian Outer Card */}
                <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4 md:mb-6 lg:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FileOutput className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Elysian Outer</h3>
                                <p className="text-sm text-zinc-500">Riwayat Export Dokumen Keluar</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center my-4 md:my-6 lg:my-8">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <FileOutput className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>

                    <div className="text-center mt-4 md:mt-6 lg:mt-8">
                        <p className="text-sm text-zinc-400 mb-4 md:mb-6">
                            Kelola dokumen Anda dengan mudah dan cepat.
                        </p>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold group-hover:translate-x-1 transition-all p-0 h-auto">
                            Mulai Sekarang <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
