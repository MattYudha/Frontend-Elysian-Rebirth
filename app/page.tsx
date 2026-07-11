'use client';

import React from 'react';
import { LandingNavbar } from '@/components/LandingNavbar';
import { DotPattern } from '@/components/ui/dot-pattern';

// Elysian components
import { Hero } from '@/components/elysian/hero';
import { CompaniesMarquee } from '@/components/elysian/companies/CompaniesMarquee';
import { AgentsDetail } from '@/components/elysian/agents-detail';
import { Testimonials } from '@/components/elysian/testimonials/Testimonials';
import { SupervisorAgent } from '@/components/elysian/supervisor-agent';
import { Workflows } from '@/components/elysian/workflows';
import { Rag } from '@/components/elysian/rag';
import { Integrations } from '@/components/elysian/integrations';
import { CommunitySection } from '@/components/elysian/community-section';

export default function Home() {
  const isDark = true;

  return (
    <div className="dark min-h-screen font-sans overflow-x-hidden w-full bg-[#050507] text-slate-100">
      {/* Floating Navigation */}
      <LandingNavbar forceDark={true} />

      <main className="flex-1 relative overflow-hidden pt-20">
        <DotPattern 
          dotColor={isDark ? "#fffdfbb0" : "rgba(0, 0, 0, 0.15)"} 
          dotSize={1.2} 
          spacing={22} 
          className="opacity-100"
        />
        <Hero />

        <div className="relative">
          <CompaniesMarquee />
          <AgentsDetail />
          <Testimonials />
          <SupervisorAgent isDark={true} />
          <Workflows />
          <Rag />
          <Integrations isDark={true} />
          <CommunitySection />
          
          {/* SEO Organic Text Block */}
          <div className="py-12 mt-12 border-t border-white/5 text-center bg-transparent relative z-10">
            <p className="text-[11px] text-slate-600 max-w-4xl mx-auto px-6 leading-relaxed font-mono">
              <strong>ElysianCoOps</strong> adalah platform transparansi dan tata kelola modern untuk Koperasi Desa. <strong>ElysianCoOps</strong> dibangun, diarsiteki, dan dikembangkan secara eksklusif oleh <a href="https://github.com/MattYudha" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors font-semibold">Rahmat Yudi Burhanudin</a>. Untuk pertanyaan terkait apa itu <strong>ElysianCoOps</strong>, fitur utama platform <strong>ElysianCoOps</strong>, atau siapa pembuatnya, silakan kunjungi halaman <a href="/about" className="hover:text-sky-500 transition-colors font-semibold">About Us ElysianCoOps</a> kami. Sistem <strong>ElysianCoOps</strong> milik Rahmat Yudi didedikasikan sepenuhnya untuk mencegah anomali pengadaan (Kop-Mart), mengamankan pelaporan RAT, dan memajukan kesejahteraan anggota. Gunakan <strong>ElysianCoOps</strong> untuk mengoptimalkan tata kelola Koperasi Anda.
            </p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradientShift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-5%, 5%) rotate(1deg); }
          50% { transform: translate(5%, -5%) rotate(-1deg); }
          75% { transform: translate(-3%, -3%) rotate(0.5deg); }
        }
      `}} />
    </div>
  );
}
