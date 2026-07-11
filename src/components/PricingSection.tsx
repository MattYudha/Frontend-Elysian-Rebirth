'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { useTranslation } from '@/hooks/useTranslation';

export function PricingSection() {
    // const { t } = useTranslation();
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            name: "Starter",
            price: isYearly ? "0" : "0",
            period: isYearly ? "/thn" : "/bln",
            desc: "Untuk individu atau tim kecil yang baru memulai.",
            features: [
                "3 Basic Workflows",
                "100 AI Credits/bln",
                "Community Support",
                "1 Workspace"
            ],
            cta: "Mulai Gratis",
            popular: false,
            gradient: "from-slate-200 to-slate-300"
        },
        {
            name: "Pro",
            price: isYearly ? "Rp 249k" : "Rp 299k",
            period: "/bln",
            desc: "Untuk bisnis berkembang yang butuh efisiensi penuh.",
            features: [
                "Unlimited Workflows",
                "Unlimited AI Credits",
                "Smart Document Editor",
                "Priority Support",
                "5 Workspaces"
            ],
            cta: "Coba Gratis 14 Hari",
            popular: true,
            gradient: "from-blue-600 to-cyan-500"
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            desc: "Solusi kustom untuk organisasi skala besar.",
            features: [
                "Custom AI Models",
                "On-Premise Deployment",
                "Dedicated Success Manager",
                "SLA 99.9%",
                "Unlimited Workspaces"
            ],
            cta: "Hubungi Penjualan",
            popular: false,
            gradient: "from-indigo-600 to-purple-600"
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/20 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                        Investasi Cerdas untuk <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Masa Depan Bisnis</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                        Pilih paket yang sesuai dengan skala bisnis Anda. Transparan, tanpa biaya tersembunyi.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-slate-900 dark:text-white" : "text-slate-500")}>Bulanan</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full p-1 relative transition-colors focus:outline-none"
                        >
                            <div className={cn("w-6 h-6 bg-white rounded-full shadow-sm transition-transform", isYearly ? "translate-x-6" : "translate-x-0")} />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                            Tahunan <span className="text-green-600 dark:text-green-400 text-xs font-bold ml-1">(Hemat 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative rounded-3xl p-8 border bg-white dark:bg-slate-900 flex flex-col",
                                plan.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 scale-105 z-10" : "border-slate-200 dark:border-slate-800 shadow-lg"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-slate-500 text-sm font-medium">{plan.period}</span>}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", plan.popular ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-slate-100 dark:bg-slate-800/50 text-slate-500")}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={cn(
                                    "w-full rounded-xl py-6 font-semibold transition-all",
                                    plan.popular
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/25 border-0 text-white"
                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
