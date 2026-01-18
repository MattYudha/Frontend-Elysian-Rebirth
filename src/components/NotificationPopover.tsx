'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Button } from '@/ui/primitives/button';
import { Badge } from '@/ui/badge';
import Image from 'next/image';

export function NotificationPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('aktivitas');

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Bell className="h-5 w-5" />
                    {/* Optional: Indicator dot if needed */}
                    {/* <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> */}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 rounded-xl shadow-xl border-blue-100 bg-white" align="end">
                <Tabs defaultValue="aktivitas" className="w-full" onValueChange={setActiveTab}>

                    {/* Header Tabs */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-blue-50">
                        <TabsList className="bg-transparent p-0 gap-6 h-auto">
                            <TabsTrigger
                                value="aktivitas"
                                className="p-0 pb-2 rounded-none bg-transparent text-sm font-semibold text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
                            >
                                Aktivitas
                            </TabsTrigger>
                            <TabsTrigger
                                value="update"
                                className="p-0 pb-2 rounded-none bg-transparent text-sm font-semibold text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
                            >
                                Update
                            </TabsTrigger>
                        </TabsList>

                        {/* Mark as read action (optional, keeping minimal as per design) */}
                    </div>

                    {/* Filter Chips (Visible only on Aktivitas for now as per image) */}
                    {activeTab === 'aktivitas' && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/50">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer rounded-full px-3 font-normal">Semua</Badge>
                            <Badge variant="outline" className="text-slate-500 hover:bg-slate-100 border-slate-200 cursor-pointer rounded-full px-3 font-normal bg-white">Pencairan</Badge>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
                        <TabsContent value="aktivitas" className="mt-0 flex flex-col items-center animate-in fade-in-50 duration-300">
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src="/empty-state-notification.png"
                                    alt="No notifications"
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-contain opacity-90 drop-shadow-sm"
                                />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 mb-2">
                                Belum Ada Notifikasi dari Supplier<br />& Buyer Anda
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                                Yuk Kirimkan Dokumen Anda melalui<br />Email/WhatsApp/SMS sekarang!
                            </p>
                        </TabsContent>

                        <TabsContent value="update" className="mt-0 flex flex-col items-center animate-in fade-in-50 duration-300">
                            <div className="relative w-28 h-28 mb-4 opacity-50 grayscale">
                                <Image
                                    src="/empty-state-notification.png"
                                    alt="No updates"
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 mb-2">
                                Tidak Ada Update Sistem
                            </h3>
                            <p className="text-xs text-slate-500">
                                Sistem Anda sudah yang paling mutakhir.
                            </p>
                        </TabsContent>
                    </div>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
