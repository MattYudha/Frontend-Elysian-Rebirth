'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { LandingNavbar } from '@/components/LandingNavbar';
import { DotPattern } from '@/components/ui/dot-pattern';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface ProductPageTemplateProps {
  title: string;
  heroBadgeText: string;
  heroBadgeIcon: React.ComponentType<{ className?: string }>;
  heroH1: React.ReactNode;
  heroDescription: string;
  heroImage: string;
  features: Feature[];
  demoUrl?: string;
  docsUrl?: string;
}

export default function ProductPageTemplate({
  title,
  heroBadgeText,
  heroBadgeIcon: BadgeIcon,
  heroH1,
  heroDescription,
  heroImage,
  features,
  demoUrl = 'https://console.voltagent.dev/demo',
  docsUrl = '/docs/',
}: ProductPageTemplateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Preload feature images
    features.forEach((feature) => {
      const img = new Image();
      img.src = feature.image;
    });
    const heroImg = new Image();
    heroImg.src = heroImage;
  }, [features, heroImage]);

  return (
    <main className="min-h-screen bg-[#050507] text-white flex flex-col relative overflow-hidden font-sans">
      <LandingNavbar forceDark={true} />

      {/* Global Background Glows - Signature Elysian Blue */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/3 via-transparent to-blue-500/3" />
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[20%] left-[25%] w-[450px] h-[450px] bg-sky-400/8 rounded-full blur-[110px] animate-pulse"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <DotPattern dotColor="rgba(56, 189, 248, 0.1)" dotSize={1.2} spacing={20} className="z-0 opacity-40" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Content */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col text-left"
              >
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 backdrop-blur-md">
                    <BadgeIcon className="w-4 h-4" />
                    {heroBadgeText}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-0.03em] font-bold text-white mb-6 leading-tight">
                  {heroH1}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-8 leading-relaxed max-w-xl">
                  {heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={demoUrl}
                    target="_blank"
                    className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-95 no-underline"
                  >
                    Try Live Demo
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    href={docsUrl}
                    className="inline-flex items-center justify-center px-6 py-3 font-semibold text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white rounded-lg transition-all duration-300 bg-slate-950/40 hover:bg-slate-900/50 backdrop-blur-sm no-underline"
                  >
                    View Documentation
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Right side - Image */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative group"
              >
                {/* Image Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl blur-[15px] opacity-20 group-hover:opacity-30 transition-all duration-500 pointer-events-none" />
                <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-zinc-950/60 backdrop-blur-md">
                  <img
                    src={heroImage}
                    alt={`${title} Dashboard`}
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 z-10 !border-t border-slate-900/80 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20 lg:space-y-32">
            {features.map((feature, index) => (
              <div key={feature.title} className="group">
                {mounted && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 70 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                  >
                    
                    {/* Feature Image */}
                    <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-xl blur-[10px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                      <div className="relative border border-slate-900 rounded-xl overflow-hidden bg-zinc-950/50 backdrop-blur-md">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-auto object-cover opacity-85 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Feature Content */}
                    <div className={`flex flex-col text-left ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 group-hover:text-sky-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                  </motion.div>
                )}

                {/* Divider between features */}
                {index < features.length - 1 && (
                  <div className="mt-20 lg:mt-32 border-t border-solid border-slate-900" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
