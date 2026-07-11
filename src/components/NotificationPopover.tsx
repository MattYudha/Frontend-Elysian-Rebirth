'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function NotificationPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('aktivitas');
    const { actions, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
    const unread = unreadCount();

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Bell className="h-5 w-5" />
                    {unread > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 rounded-xl shadow-xl border-blue-100 dark:border-slate-800 bg-white dark:bg-[#0B1120]" align="end">
                <Tabs defaultValue="aktivitas" className="w-full" onValueChange={setActiveTab}>

                    {/* Header Tabs */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-blue-50 dark:border-slate-800/50">
                        <TabsList className="bg-transparent p-0 gap-6 h-auto">
                            <TabsTrigger
                                value="aktivitas"
                                className="p-0 pb-2 rounded-none bg-transparent text-sm font-semibold text-slate-500 dark:text-slate-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 transition-all"
                            >
                                Aktivitas
                                {unread > 0 && <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 h-5 px-1.5">{unread}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="update"
                                className="p-0 pb-2 rounded-none bg-transparent text-sm font-semibold text-slate-500 dark:text-slate-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 transition-all"
                            >
                                Update
                            </TabsTrigger>
                        </TabsList>

                        {unread > 0 && activeTab === 'aktivitas' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2"
                                onClick={() => markAllAsRead()}
                            >
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Tandai Baca
                            </Button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[300px] bg-slate-50/30 dark:bg-slate-950/30">
                        <TabsContent value="aktivitas" className="mt-0 focus-visible:ring-0">
                            {actions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="relative w-32 h-32 mb-4">
                                        <Image
                                            src="/empty-state-notification.png"
                                            alt="No notifications"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-contain opacity-90 drop-shadow-sm dark:opacity-70"
                                        />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                        Belum Ada Notifikasi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 px-8">
                                        Aktivitas terbaru Anda akan muncul di sini.
                                    </p>
                                </div>
                            ) : (
                                <ScrollArea className="h-[350px]">
                                    <div className="flex flex-col">
                                        {actions.filter(a => a.status === 'pending').map((item) => (
                                            <div
                                                key={item.id}
                                                className={`flex gap-3 p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer ${!item.isRead ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
                                                onClick={() => markAsRead(item.id)}
                                            >
                                                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!item.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-sm ${!item.isRead ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                                        {item.summary}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </TabsContent>

                        <TabsContent value="update" className="mt-0 flex flex-col items-center py-12 text-center">
                            <div className="relative w-28 h-28 mb-4 opacity-50 grayscale dark:opacity-30">
                                <Image
                                    src="/empty-state-notification.png"
                                    alt="No updates"
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                Tidak Ada Update Sistem
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Sistem Anda sudah yang paling mutakhir.
                            </p>
                        </TabsContent>
                    </div>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
