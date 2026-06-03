'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { LandingNavbar } from '@/components/LandingNavbar';
import { DotPattern } from '@/components/ui/dot-pattern';
import DocsHome from '@/components/elysian/docs-widgets/DocsHome';

export default function Documentations() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden w-full transition-colors duration-[600ms] ease-in-out ${
      isDark ? 'bg-[#050507] text-slate-100' : 'bg-white text-slate-900'
    }`}>
      <LandingNavbar />

      <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <DotPattern 
          dotColor={isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(148, 163, 184, 0.12)"} 
          dotSize={1.2} 
          spacing={20} 
          className="opacity-[0.25]"
        />
        <div className="relative z-10">
          <DocsHome />
        </div>
      </main>
    </div>
  );
}
