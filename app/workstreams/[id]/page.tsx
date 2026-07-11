'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockWorkstreamDetail } from '@/mocks/workstreamDetail';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimelineGantt } from '@/components/workstreams/TimelineGantt';
import { Separator } from '@/components/ui/separator';
import { Link, CheckCircle2, AlertCircle, Clock, Link2, Download, Search, Calendar, User } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

// We will assume `id` comes from params eventually, but this is a mocked view.
export default function WorkstreamDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Determine initial tab from URL or default to 'overview'
    const defaultTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Sync state to URL without reloading
    const handleTabChange = (val: string) => {
        setActiveTab(val);
        // Push state visually to the URL bar
        const url = new URL(window.location.href);
        url.searchParams.set('tab', val);
        window.history.pushState({}, '', url);
    };

    // Listen to back/forward button clicks to sync state correctly
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams, activeTab]);

    const data = mockWorkstreamDetail;

    return (
        <div className="w-full min-h-full animate-in fade-in duration-700 pb-12">
            {/* 1. Header Block */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {data.title}
                            </h1>
                            <div className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                                {data.status}
                            </div>
                            <div className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5">
                                <Avatar className="h-4 w-4">
                                    <AvatarFallback className="bg-blue-600 text-[8px] text-white">ME</AvatarFallback>
                                </Avatar>
                                {data.assignment}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5 font-mono">
                                <span className="text-slate-500">ID:</span> #{data.id}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1.5 text-amber-500">
                                <AlertCircle className="h-4 w-4" />
                                {data.priority}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" />
                                Sprints: {data.sprints}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-slate-500" />
                                Last sync: {data.lastSync}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800">
                            <Link2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Main Tabs Layout */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-transparent border-b border-slate-200 dark:border-slate-800/60 rounded-none w-full justify-start h-auto p-0 mb-6 space-x-6 overflow-x-auto overflow-y-hidden no-scrollbar">
                    {['overview', 'workstream', 'tasks', 'notes', 'assets'].map((tabValue) => (
                        <TabsTrigger
                            key={tabValue}
                            value={tabValue}
                            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-slate-500 dark:text-slate-400 px-0 pb-3 pt-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-500 capitalize transition-colors whitespace-nowrap"
                        >
                            {tabValue}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* OVERVIEW TAB CONTENT */}
                <TabsContent value="overview" className="focus-visible:outline-none focus-visible:ring-0">
                    <div className="text-slate-400 text-[15px] leading-relaxed max-w-3xl mb-10">
                        {data.overview.description}
                    </div>

                    {/* Mobile Metadata Sidebar (Accordion alternative) */}
                    <div className="block lg:hidden mb-10">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="metadata" className="border-slate-800/60">
                                <AccordionTrigger className="text-white hover:no-underline">View Details & Status</AccordionTrigger>
                                <AccordionContent>
                                    <MetadataSidebar data={data} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Main Left Content */}
                        <div className="flex-1 space-y-12 min-w-0">
                            {/* Scope Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-medium mb-4 flex items-center gap-2">
                                        In scope
                                    </h3>
                                    <ul className="space-y-3">
                                        {data.overview.inScope.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700 dark:text-slate-300 pointer-events-none break-words">
                                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-medium mb-4 flex items-center gap-2">
                                        Out of scope:
                                    </h3>
                                    <ul className="space-y-3">
                                        {data.overview.outOfScope.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[14px] text-slate-500 dark:text-slate-500 line-through break-words">
                                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <Separator className="bg-slate-200 dark:bg-slate-800/60" />

                            {/* Expected Outcomes */}
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-medium mb-4">Expected Outcomes</h3>
                                <ul className="space-y-3">
                                    {data.overview.expectedOutcomes.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700 dark:text-slate-300 break-words">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-sm bg-blue-500 shrink-0" />
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Separator className="bg-slate-200 dark:bg-slate-800/60" />

                            {/* Features Array */}
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-medium mb-6">Key features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.entries(data.overview.keyFeatures).map(([tier, feats]) => (
                                        <div key={tier}>
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{tier}:</div>
                                            <ul className="space-y-2">
                                                {feats.map((f, i) => (
                                                    <li key={i} className="text-[14px] text-slate-600 dark:text-slate-400 flex items-start gap-2 break-words">
                                                        <div className="mt-1.5 h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                                                        <span className="leading-snug">{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-slate-200 dark:bg-slate-800/60" />

                            {/* Embedded Timeline Gantt */}
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-medium mb-6 mt-8">Expected Timeline</h3>
                                <div className="w-full overflow-hidden">
                                    <TimelineGantt tasks={data.timeline} />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Right Sidebar */}
                        <div className="hidden lg:block w-72 shrink-0">
                            <MetadataSidebar data={data} />
                        </div>
                    </div>
                </TabsContent>

                {/* Empty states for other tabs */}
                {['workstream', 'tasks', 'notes', 'assets'].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue} className="focus-visible:outline-none focus-visible:ring-0">
                        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-800 rounded-xl mt-4">
                            <Search className="h-8 w-8 text-slate-600 mb-4" />
                            <h3 className="text-lg font-medium text-white capitalize">{tabValue}</h3>
                            <p className="text-slate-500 text-sm mt-1">This module will be populated by the API in Phase 4.</p>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

// Internal component for the Metadata sidebar to reuse between Desktop and Mobile
function MetadataSidebar({ data }: { data: typeof mockWorkstreamDetail }) {
    return (
        <div className="space-y-8">
            {/* Time Block */}
            <div>
                <h4 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Time</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Clock className="h-4 w-4" /> Estimate</span>
                        <span className="text-slate-900 dark:text-white font-medium">{data.estimate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Calendar className="h-4 w-4" /> Due Date</span>
                        <span className="text-slate-900 dark:text-white font-medium">{data.dueDate}</span>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500 dark:text-slate-400">Days remaining</span>
                            <span className="text-slate-900 dark:text-white">{data.daysRemainingText}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${data.daysRemainingPct}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-800/60" />

            {/* Backlog / Metadata */}
            <div>
                <h4 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Backlog</h4>
                <div className="space-y-4">
                    <MetaRow label={<><CircleDashed className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Status</>} value={<span className="text-blue-600 dark:text-blue-400 font-medium">{data.metadata.status}</span>} />
                    <MetaRow label={<><CheckCircle2 className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Group</>} value={data.metadata.group} />
                    <MetaRow label={<><AlertCircle className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Priority</>} value={data.metadata.priority} />
                    <MetaRow label={<><Link2 className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Label</>} value={<span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs">{data.metadata.label}</span>} />

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><User className="h-4 w-4" /> PIC</span>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-white text-[9px]">{data.metadata.pic.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <MetaRow label={<><User className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Support</>} value={data.metadata.support} />
                </div>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-800/60" />

            {/* Client Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Client</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] uppercase font-bold tracking-wider">Prospect</span>
                </div>
                <h5 className="text-slate-900 dark:text-white font-medium text-sm">{data.metadata.client.name}</h5>
                <p className="text-slate-500 text-xs mt-1 truncate">{data.metadata.client.contact}</p>
            </div>
        </div>
    );
}

function MetaRow({ label, value }: { label: React.ReactNode, value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-slate-900 dark:text-white">{value}</span>
        </div>
    )
}

function CircleDashed(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
}
