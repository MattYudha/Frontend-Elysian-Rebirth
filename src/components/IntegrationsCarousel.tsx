'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Slack, Figma, Github, Chrome, Trello, Mail, Database, Cloud, ChevronRight, Zap } from 'lucide-react';

export function IntegrationsCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
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
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Ecosystem</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-slate-900 leading-tight mb-4"
                        >
                            Terhubung dengan <br />
                            <span className="text-slate-400">Tools Favorit Anda.</span>
                        </motion.h2>
                        <p className="text-slate-500">
                            Elysian terintegrasi dengan ratusan aplikasi untuk menjaga alur kerja tim Anda tetap lancar.
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
                            <span>Geser untuk melihat lebih banyak</span>
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
                        <CarouselCard key={index} item={item} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

const integrations = [
    {
        title: "Slack Notification",
        desc: "Dapatkan update real-time langsung di channel tim Anda.",
        icon: <Slack className="w-8 h-8 text-[#4A154B]" />,
        color: "group-hover:shadow-[#4A154B]/5"
    },
    {
        title: "Figma Sync",
        desc: "Tarik aset desain dan komentar langsung ke task manager.",
        icon: <Figma className="w-8 h-8 text-[#F24E1E]" />,
        color: "group-hover:shadow-[#F24E1E]/5"
    },
    {
        title: "GitHub Actions",
        desc: "Otomatisasi deployment dan sync status issue.",
        icon: <Github className="w-8 h-8 text-black" />,
        color: "group-hover:shadow-black/5"
    },
    {
        title: "Google Drive",
        desc: "Akses dan lampirkan dokumen cloud tanpa berpindah tab.",
        icon: <Cloud className="w-8 h-8 text-[#4285F4]" />,
        color: "group-hover:shadow-[#4285F4]/5"
    },
    {
        title: "Notion Pages",
        desc: "Embed halaman wiki dan knowledge base internal.",
        icon: <FileTextIcon className="w-8 h-8 text-slate-800" />,
        color: "group-hover:shadow-slate-800/5"
    },
    {
        title: "PostgreSQL",
        desc: "Hubungkan database Anda untuk analytics custom.",
        icon: <Database className="w-8 h-8 text-[#336791]" />,
        color: "group-hover:shadow-[#336791]/5"
    },
    {
        title: "Gmail Add-on",
        desc: "Ubah email menjadi task atau tiket support dalam satu klik.",
        icon: <Mail className="w-8 h-8 text-[#EA4335]" />,
        color: "group-hover:shadow-[#EA4335]/5"
    },
];

function CarouselCard({ item, index }: { item: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`min-w-[300px] md:min-w-[350px] h-[400px] bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col justify-between relative group hover:bg-white hover:border-slate-200 hover:shadow-2xl transition-all duration-500 ${item.color}`}
        >
            {/* Icon Placeholder Background */}
            <div className="absolute top-0 right-0 p-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none scale-150 grayscale group-hover:grayscale-0">
                {item.icon}
            </div>

            <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    {item.desc}
                </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-200/50">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                    Pelajari lebih lanjut <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
