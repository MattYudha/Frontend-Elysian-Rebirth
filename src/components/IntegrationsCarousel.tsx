'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Slack, Figma, Github, Mail, Database, Cloud, ChevronRight, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function IntegrationsCarousel() {
    const { t } = useTranslation();
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    const integrations = [
        {
            title: t.landing.integration.items.slack.title,
            desc: t.landing.integration.items.slack.desc,
            icon: <Slack className="w-8 h-8 text-[#4A154B]" />,
            color: "group-hover:shadow-[#4A154B]/5"
        },
        {
            title: t.landing.integration.items.figma.title,
            desc: t.landing.integration.items.figma.desc,
            icon: <Figma className="w-8 h-8 text-[#F24E1E]" />,
            color: "group-hover:shadow-[#F24E1E]/5"
        },
        {
            title: t.landing.integration.items.github.title,
            desc: t.landing.integration.items.github.desc,
            icon: <Github className="w-8 h-8 text-black dark:text-white" />,
            color: "group-hover:shadow-black/5 dark:group-hover:shadow-white/5"
        },
        {
            title: t.landing.integration.items.drive.title,
            desc: t.landing.integration.items.drive.desc,
            icon: <Cloud className="w-8 h-8 text-[#4285F4]" />,
            color: "group-hover:shadow-[#4285F4]/5"
        },
        {
            title: t.landing.integration.items.notion.title,
            desc: t.landing.integration.items.notion.desc,
            icon: <FileTextIcon className="w-8 h-8 text-slate-800 dark:text-slate-200" />,
            color: "group-hover:shadow-slate-800/5 dark:group-hover:shadow-slate-200/5"
        },
        {
            title: t.landing.integration.items.postgres.title,
            desc: t.landing.integration.items.postgres.desc,
            icon: <Database className="w-8 h-8 text-[#336791]" />,
            color: "group-hover:shadow-[#336791]/5"
        },
        {
            title: t.landing.integration.items.gmail.title,
            desc: t.landing.integration.items.gmail.desc,
            icon: <Mail className="w-8 h-8 text-[#EA4335]" />,
            color: "group-hover:shadow-[#EA4335]/5"
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
            {/* Section Header */}
            <div className="container mx-auto px-4 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="h-px w-8 bg-blue-400" />
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">{t.landing.integration.badge}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4"
                        >
                            {t.landing.integration.title1} <br />
                            <span className="text-slate-400">{t.landing.integration.title2}</span>
                        </motion.h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {t.landing.integration.description}
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex gap-2"
                    >
                        {/* Navigation hints could go here, but drag is intuitive enough */}
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>{t.landing.integration.hint}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Carousel */}
            <div className="pl-4 md:pl-[max(1rem,calc((100vw-1280px)/2+1rem))] overflow-hidden cursor-grab active:cursor-grabbing">
                <motion.div
                    ref={carouselRef}
                    className="flex gap-6 pr-4 md:pr-[max(1rem,calc((100vw-1280px)/2+1rem))]"
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    whileTap={{ cursor: "grabbing" }}
                >
                    {integrations.map((item, index) => (
                        <CarouselCard key={index} item={item} index={index} cta={t.landing.integration.items.cta} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// interfaces removed or moved local if needed
interface IntegrationItem {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
}

function CarouselCard({ item, index, cta }: { item: IntegrationItem, index: number, cta: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            style={{ translateZ: 0 }}
            className={`min-w-[300px] md:min-w-[350px] h-[400px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 flex flex-col justify-between relative group hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-2xl transition-all duration-300 ${item.color}`}
        >
            {/* Icon Placeholder Background */}
            <div className="absolute top-0 right-0 p-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none scale-150 grayscale group-hover:grayscale-0">
                {item.icon}
            </div>

            <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                    {item.desc}
                </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                    {cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}

function FileTextIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
