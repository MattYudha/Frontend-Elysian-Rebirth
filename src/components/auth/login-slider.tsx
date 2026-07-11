'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const slides = [
    {
        title: "Real-time Monitoring",
        description: "Monitor key metrics and alerts in real-time to keep your AI agents running smoothly.",
        image: "/login-slider/flow-detail-2.png"
    },
    {
        title: "Visual Workflow Builder",
        description: "Design complex agent workflows visually with an intuitive drag-and-drop interface.",
        image: "/login-slider/flow-1.png"
    },
    {
        title: "Agent Chat Interface",
        description: "Interact with your deployed agents directly from the dashboard and monitor responses.",
        image: "/login-slider/agent-chat.png"
    },
    {
        title: "Comprehensive Agent List",
        description: "Manage and monitor all your deployed agents, their status, and configurations in one place.",
        image: "/login-slider/agent-list.png"
    }
];

export function LoginSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    return (
        <div className="h-full w-full bg-[#111111] flex flex-col justify-center items-center text-white p-8 relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-2xl flex flex-col z-10 relative">
                {/* Dots Pagination - placed at the top like Elysian */}
                <div className="flex space-x-2 mb-8">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            className={clsx(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                index === selectedIndex ? "bg-blue-500 w-6" : "bg-white/20 hover:bg-white/40"
                            )}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="overflow-hidden w-full" ref={emblaRef}>
                    <div className="flex">
                        {slides.map((slide, index) => (
                            <div className="flex-[0_0_100%] min-w-0" key={index}>
                                {/* Text Content */}
                                <div className="mb-10">
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: index === selectedIndex ? 1 : 0, y: index === selectedIndex ? 0 : 10 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-4xl font-bold tracking-tight mb-4 text-white"
                                    >
                                        {slide.title}
                                    </motion.h2>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: index === selectedIndex ? 1 : 0, y: index === selectedIndex ? 0 : 10 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="text-lg text-gray-400 font-light leading-relaxed max-w-md"
                                    >
                                        {slide.description}
                                    </motion.p>
                                </div>

                                {/* Image Content */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: index === selectedIndex ? 1 : 0.5, scale: index === selectedIndex ? 1 : 0.95 }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={index === 0}
                                    />
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
