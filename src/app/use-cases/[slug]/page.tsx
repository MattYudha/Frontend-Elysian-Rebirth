import { notFound } from 'next/navigation';
import { LandingNavbar } from '@/components/LandingNavbar';
import usecasesData from '@/data/usecases.json';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UseCasePage({ params }: { params: { slug: string } }) {
    const useCase = usecasesData.find((uc: any) => uc.slug === params.slug);

    if (!useCase) {
        return (
            <div className="p-20 text-white mt-20">
                <h2>Not Found Debug:</h2>
                <p>Params slug: {params.slug}</p>
                <p>Type of usecasesData: {typeof usecasesData}</p>
                <p>Is Array: {Array.isArray(usecasesData) ? 'Yes' : 'No'}</p>
                <p>Length: {Array.isArray(usecasesData) ? usecasesData.length : 'N/A'}</p>
                <p>First slug: {Array.isArray(usecasesData) && usecasesData.length > 0 ? usecasesData[0].slug : 'N/A'}</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#050507]">
            <LandingNavbar forceDark={true} />
            
            <div className="pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-24 max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400 text-sm font-medium mb-6">
                            {useCase.hero.heroTag}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                            {useCase.hero.headline}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {useCase.hero.subtext}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8">
                                <Link href={useCase.hero.primaryCTALink}>{useCase.hero.primaryCTA}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5">
                                <Link href={useCase.hero.secondaryCTALink}>{useCase.hero.secondaryCTA}</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Key Features</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Everything you need to build powerful agents for {useCase.category}.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {useCase.features.map((feature: any, idx: number) => {
                                // Default fallback to a Check icon if the name doesn't match perfectly
                                // Because the JSON uses Heroicons names (e.g., CodeBracketIcon), we need a basic mapping or fallback.
                                // For now, we'll just render a nice Lucide check circle.
                                const Icon = Icons.CheckCircle2;
                                return (
                                    <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-sky-500/30 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6">
                                            <Icon className="w-6 h-6 text-sky-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Pain points & Solutions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <Icons.XCircle className="w-6 h-6 text-red-500" />
                                The Problem
                            </h3>
                            <ul className="space-y-4">
                                {useCase.painPoints.map((point: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                        <Icons.X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 rounded-3xl bg-sky-500/5 border border-sky-500/10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <Icons.CheckCircle className="w-6 h-6 text-sky-500" />
                                The Solution
                            </h3>
                            <ul className="space-y-4">
                                {useCase.solutions.map((solution: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                        <Icons.Check className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                                        <span>{solution}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {useCase.howItWorks.map((step: any, idx: number) => (
                                <div key={idx} className="relative p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <div className="text-4xl font-black text-sky-500/20 absolute top-4 right-6">0{step.step}</div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">{step.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 relative z-10">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
