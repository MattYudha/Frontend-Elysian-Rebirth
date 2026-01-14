'use client';

import { Skeleton } from '@/ui/primitives/skeleton';
import { Card, CardContent, CardHeader } from '@/ui/primitives/card';

// Helper for consistent shimmering effect
function ShimmerBlock({ className }: { className?: string }) {
    return (
        <Skeleton className={`bg-slate-200/60 animate-pulse ${className}`} />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <ShimmerBlock className="h-8 w-64 rounded-lg" />
                    <ShimmerBlock className="h-4 w-48 rounded-md" />
                </div>
                <div className="flex gap-2">
                    <ShimmerBlock className="h-10 w-10 rounded-full" />
                    <ShimmerBlock className="h-10 w-10 rounded-full" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <ShimmerBlock className="h-10 w-10 rounded-xl" />
                                <ShimmerBlock className="h-6 w-16 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <ShimmerBlock className="h-8 w-24 rounded-lg" />
                                <ShimmerBlock className="h-4 w-32 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Area */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                    <CardHeader className="p-6 border-b border-slate-50">
                        <ShimmerBlock className="h-6 w-48 rounded-lg" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-end gap-2 h-64 w-full">
                            {[...Array(12)].map((_, i) => (
                                <ShimmerBlock
                                    key={i}
                                    className="flex-1 rounded-t-lg"
                                    style={{ height: `${Math.random() * 60 + 20}%` }} // Random heights for chart look
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Side List */}
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="p-6 border-b border-slate-50">
                        <ShimmerBlock className="h-6 w-32 rounded-lg" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <ShimmerBlock className="h-10 w-10 rounded-full shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <ShimmerBlock className="h-4 w-full rounded-md" />
                                    <ShimmerBlock className="h-3 w-2/3 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function ChatSkeleton() {
    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
            {/* Messages Area */}
            <div className="flex-1 p-6 space-y-8 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-8">
                        {/* Left Message (AI) */}
                        <div className="flex gap-4 max-w-[80%]">
                            <ShimmerBlock className="h-10 w-10 rounded-full shrink-0" />
                            <div className="space-y-2 flex-1">
                                <ShimmerBlock className="h-4 w-24 rounded-md" /> {/* Name */}
                                <div className="p-4 rounded-2xl rounded-tl-none border border-slate-100 bg-white shadow-sm space-y-2">
                                    <ShimmerBlock className="h-4 w-full rounded-md" />
                                    <ShimmerBlock className="h-4 w-5/6 rounded-md" />
                                    <ShimmerBlock className="h-4 w-4/6 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Right Message (User) */}
                        <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto">
                            <ShimmerBlock className="h-10 w-10 rounded-full shrink-0" />
                            <div className="space-y-2 flex-1 flex flex-col items-end">
                                <div className="p-4 rounded-2xl rounded-tr-none bg-blue-50 shadow-sm w-full space-y-2">
                                    <ShimmerBlock className="h-4 w-full rounded-md bg-blue-200/50" />
                                    <ShimmerBlock className="h-4 w-2/3 rounded-md bg-blue-200/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 max-w-4xl mx-auto w-full">
                <div className="relative">
                    <ShimmerBlock className="h-16 w-full rounded-full" />
                    <ShimmerBlock className="absolute right-2 top-2 h-12 w-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function EditorSkeleton() {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 bg-slate-50/50">
            {/* Toolbar Skeleton */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center px-4 gap-4 sticky top-0 z-10">
                <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                        <ShimmerBlock key={i} className="h-8 w-8 rounded-md" />
                    ))}
                </div>
                <div className="h-8 w-px bg-slate-200 mx-2" />
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <ShimmerBlock key={i} className="h-8 w-8 rounded-md" />
                    ))}
                </div>
                <div className="flex-1" />
                <ShimmerBlock className="h-9 w-24 rounded-md" /> {/* Save Button */}
            </div>

            {/* Editor Canvas Area */}
            <div className="flex-1 p-8 overflow-hidden flex justify-center">
                <div className="w-full max-w-3xl bg-white shadow-sm border border-slate-200 rounded-lg h-full p-12 space-y-6">
                    {/* Document Title */}
                    <ShimmerBlock className="h-10 w-3/4 rounded-lg mb-8" />

                    {/* Paragraphs */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-3 mb-6">
                            <ShimmerBlock className="h-4 w-full rounded-md" />
                            <ShimmerBlock className="h-4 w-full rounded-md" />
                            <ShimmerBlock className="h-4 w-full rounded-md" />
                            <ShimmerBlock className="h-4 w-2/3 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function KnowledgeSkeleton() {
    return (
        <div className="container max-w-6xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
            {/* Header & Search */}
            <div className="flex flex-col items-center space-y-6 py-8">
                <ShimmerBlock className="h-10 w-96 rounded-lg max-w-full" />
                <ShimmerBlock className="h-16 w-full max-w-2xl rounded-full" />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm min-h-[160px] flex flex-col items-center justify-center p-6 space-y-4">
                        <ShimmerBlock className="h-14 w-14 rounded-full" />
                        <div className="space-y-2 w-full flex flex-col items-center">
                            <ShimmerBlock className="h-5 w-32 rounded-md" />
                            <ShimmerBlock className="h-3 w-16 rounded-md" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <ShimmerBlock className="h-8 w-48 rounded-lg" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between bg-white">
                                <div className="flex items-center gap-4 flex-1">
                                    <ShimmerBlock className="h-8 w-8 rounded-lg shrink-0" />
                                    <ShimmerBlock className="h-5 w-3/4 rounded-md" />
                                </div>
                                <ShimmerBlock className="h-4 w-4 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <ShimmerBlock className="h-64 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4 mb-8">
                <ShimmerBlock className="h-10 w-64 rounded-lg" />
                <ShimmerBlock className="h-5 w-96 rounded-md" />
            </div>

            <div className="space-y-8">
                {/* Profile Section */}
                <div className="flex items-center gap-6 p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
                    <ShimmerBlock className="h-24 w-24 rounded-full border-4 border-slate-50" />
                    <div className="space-y-3 flex-1">
                        <ShimmerBlock className="h-8 w-48 rounded-lg" />
                        <ShimmerBlock className="h-4 w-64 rounded-md" />
                    </div>
                    <ShimmerBlock className="h-10 w-32 rounded-lg" />
                </div>

                {/* Form Fields Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <ShimmerBlock className="h-4 w-32 rounded-md" />
                            <ShimmerBlock className="h-12 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
