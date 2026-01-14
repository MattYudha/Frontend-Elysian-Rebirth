'use client';

import { Protected } from '@/components/Protected';
import { UploadCloud, FileOutput } from 'lucide-react';
import {
    TotalBalanceCard,
    FinancialSummaryCard,
    OnboardingCard,
    FeatureHighlightCard,
    PromoCard,
    UserGuideCard
} from '@/components/dashboard/DashboardWidgets';

export default function DashboardPage() {
    return (
        <Protected>
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Main Content Column (Left - 75% width on large screens) */}
                    <div className="xl:col-span-9 space-y-8">
                        {/* 1. Header Cards Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Total Balance (Gradient) */}
                            <TotalBalanceCard />

                            {/* Right: Summary Cards (Piutang/Utang) */}
                            <div className="grid grid-cols-2 gap-4">
                                <FinancialSummaryCard
                                    title="Piutang Usaha"
                                    value="Rp 0,00"
                                    actionText="Buat Invoice"
                                    stats={[
                                        { label: 'Unpaid', value: 0, color: 'text-orange-500' },
                                        { label: 'Partially', value: 0, color: 'text-blue-500' },
                                        { label: 'Overdue', value: 0, color: 'text-red-500' },
                                    ]}
                                />
                                <FinancialSummaryCard
                                    title="Utang Usaha"
                                    value="Rp 0,00"
                                    actionText="Bayar Tagihan"
                                    stats={[
                                        { label: 'Unpaid', value: 0, color: 'text-orange-500' },
                                        { label: 'Partially', value: 0, color: 'text-blue-500' },
                                        { label: 'Overdue', value: 0, color: 'text-red-500' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* 2. Onboarding / Progress Section */}
                        <OnboardingCard />

                        {/* 3. Main Action / Business Needs Section */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Kebutuhan Bisnis Anda</h2>
                            <p className="text-slate-500 text-sm mb-6 -mt-3">Akses fitur ekstraksi dan manajemen dokumen bisnis Anda dengan mudah</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FeatureHighlightCard
                                    title="Elysian Iner"
                                    subtitle="Riwayat Upload Dokumen Masuk"
                                    icon={UploadCloud}
                                    colorClass="text-green-600"
                                    items={[]}
                                />
                                <FeatureHighlightCard
                                    title="Elysian Outer"
                                    subtitle="Riwayat Export Dokumen Keluar"
                                    icon={FileOutput}
                                    colorClass="text-blue-600"
                                    items={[]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Column (Right - 25% width on large screens) */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Promo Widget */}
                        <div className="xl:sticky xl:top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800">Promo Terbaru</h3>
                                <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">Lihat Semua</a>
                            </div>

                            <PromoCard />

                            <div className="mt-8">
                                <UserGuideCard />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Protected>
    );
}
