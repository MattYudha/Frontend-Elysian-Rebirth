import { Metadata } from 'next';
import { LandingNavbar } from '@/components/LandingNavbar';

export const metadata: Metadata = {
    title: 'Blog - Elysian',
    description: 'Latest articles and insights about AI workflow intelligence and blockchain auditing.',
    alternates: {
        canonical: 'https://elysianlabs.web.id/blog',
    },
};

export default function Page() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#050507]">
            <LandingNavbar forceDark={true} />
            <div className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400 text-sm font-medium mb-6">Coming Soon</div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 capitalize">{"blog".replace('-', ' ')}</h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">This page is currently under construction. Please check back later.</p>
            </div>
        </main>
    );
}
