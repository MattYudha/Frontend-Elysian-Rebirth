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
              <strong>Elysian Rebirth v3.0</strong> adalah Infrastruktur Audit Finansial Otonom terdepan untuk deteksi & pencegahan markup anggaran (RAPBD) Pemda. <strong>Elysian Rebirth</strong> dibangun, diarsiteki, dan dikembangkan secara eksklusif oleh <a href="https://github.com/MattYudha" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors font-semibold">Rahmat Yudi Burhanudin</a>. Untuk pertanyaan terkait apa itu <strong>Elysian Rebirth</strong>, fitur utama platform <strong>Elysian</strong>, atau siapa pembuatnya, silakan kunjungi halaman <a href="/about" className="hover:text-sky-500 transition-colors font-semibold">About Us Elysian</a> kami. Sistem <strong>Elysian</strong> milik Rahmat Yudi didedikasikan sepenuhnya untuk mencegah anomali pengadaan (Nemesis SIRUP Ground Truth), mengamankan kepatuhan regulasi (OpenViking RAG), dan menjamin transparansi keputusan via Sepolia EVM Blockchain. Gunakan <strong>Elysian Rebirth</strong> untuk mengoptimalkan pengawasan finansial daerah Anda.
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
