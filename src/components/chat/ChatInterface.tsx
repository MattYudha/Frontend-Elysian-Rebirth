'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image'; // Import Next.js Image
import { Sender } from './Sender';
import { ChatBubble } from './ChatBubble';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MessageSquarePlus, History, Settings2, PanelRightClose, PanelRightOpen, BarChart2, Code, Mail, Sparkles, Bot, Map, Image as LucideImage, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChatSidebarContent } from './ChatSidebarContent';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export function ChatInterface() {
    const { user } = useAuthStore();
    // Fallback name for the mock if user is not logged in, or use "User"
    const displayName = user?.name?.split(' ')[0] || 'User';

    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMode, setSelectedMode] = useState('agent');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const initialPromptHandled = useRef(false);

    // Chat Store for draft messages from Dashboard
    const draftMessage = useChatStore(state => state.draftMessage);
    const setDraftMessage = useChatStore(state => state.setDraftMessage);

    // Auto-scroll to bottom only if there are messages
    useEffect(() => {
        if (scrollRef.current && messages.length > 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const modes = [
        { id: 'agent', label: 'Agent', icon: Bot },
        { id: 'planning', label: 'Planning', icon: Map },
        { id: 'images', label: 'Images', icon: LucideImage },
        { id: 'workflow', label: 'Workflow', icon: Workflow }
    ];

    const handleSend = async (content: string) => {
        if (!content.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
            timestamp: new Date()
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    mode: selectedMode
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch response');
            }

            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, responseMessage]);
        } catch (error: any) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // ── Auto-send from Store (dashboard AiChatWidget) ──
    useEffect(() => {
        if (draftMessage && !initialPromptHandled.current) {
            initialPromptHandled.current = true;

            // Send the draft message
            handleSend(draftMessage);

            // Clear it immediately to prevent double-firing on refresh
            setDraftMessage(null);
        }
    }, [draftMessage, setDraftMessage]);

    return (
        <div className="flex h-full w-full relative overflow-hidden text-slate-800 dark:text-slate-300 bg-transparent">
            {/* Light 'Elysian Ether' Background Layer - Subtle */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-20 hidden md:block">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-400/20 dark:bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-indigo-300/10 dark:bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex h-full w-full bg-transparent overflow-hidden">

                {/* Left Sidebar (Desktop) */}
                <AnimatePresence mode="wait">
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="hidden md:flex flex-col border-r border-white/20 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                        >
                            <ChatSidebarContent />
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col relative min-w-0 bg-white/10 dark:bg-slate-900/10 elysian-grid-settings">
                    {/* Header */}
                    <div className="h-16 border-b border-white/20 dark:border-blue-900/30 flex items-center justify-between px-4 md:px-6 bg-white/30 dark:bg-[#0B1120]/60 backdrop-blur-md z-20">
                        <div className="flex items-center gap-3">

                            {/* Mobile Sidebar Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden text-slate-600 dark:text-slate-300 -ml-2"
                                    >
                                        <History className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 border-r border-white/20 dark:border-blue-900/30 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl w-[280px]">
                                    <div className="flex items-center h-16 px-6 border-b border-slate-100 dark:border-blue-900/30">
                                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-50">Riwayat</h2>
                                    </div>
                                    <div className="h-[calc(100%-64px)]">
                                        <ChatSidebarContent />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                            </Button>
                            <div className="flex items-center gap-3">
                                {/* Desktop Logo */}
                                {/* Mobile Logo (Smaller) */}
                                <div className="md:hidden h-9 w-9 rounded-lg bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border border-white/50 dark:border-blue-900/30 flex items-center justify-center shadow-md">
                                    <NextImage src="/assets/logo.svg" alt="Elysian" width={20} height={20} className="drop-shadow-sm" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-50 tracking-tight">Elysian Assistant</h2>
                                </div>
                            </div>
                        </div>
                        {/* Hide Settings on Mobile to reduce clutter */}
                        <Button variant="ghost" size="icon" className="hidden md:flex text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40">
                            <Settings2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Chat Stream */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
                    >
                        {messages.length === 0 ? (
                            <div className="min-h-full flex flex-col items-center justify-start md:justify-center text-center space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-forwards pb-32 md:pb-20 pt-10 md:pt-0">

                                {/* Hero Greeting */}
                                <div className="space-y-4 md:space-y-6 max-w-3xl px-4 mt-4 md:mt-0 text-center">
                                    <div className="h-16 w-16 md:h-24 md:w-24 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-2xl md:rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6 md:mb-8 transform hover:scale-105 transition-transform duration-500">
                                        <NextImage src="/assets/logo.svg" alt="Elysian" width={56} height={56} className="drop-shadow-sm w-10 h-10 md:w-14 md:h-14" />
                                    </div>

                                    <div className="space-y-2">
                                        <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                                            Selamat datang, <span className="text-slate-700 dark:text-slate-300">{displayName}</span>
                                        </h1>
                                        <p className="text-lg md:text-2xl font-medium text-slate-600 dark:text-slate-400">
                                            Ada yang bisa saya bantu hari ini?
                                        </p>
                                    </div>

                                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-500 max-w-lg mx-auto leading-relaxed pt-2 hidden md:block">
                                        Saya siap membantu Anda dengan analisis data, penulisan kode, atau perencanaan strategis tingkat enterprise.
                                    </p>
                                </div>

                                {/* Prompt Suggestion Cards (Clickable) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full px-4">
                                    {[
                                        {
                                            title: "Analisis Pasar",
                                            desc: "Buatkan laporan tren pasar Q3 2025",
                                            icon: <BarChart2 className="h-5 w-5 text-purple-600" />
                                        },
                                        {
                                            title: "Review Kode",
                                            desc: "Optimasi komponen React untuk performa",
                                            icon: <Code className="h-5 w-5 text-blue-600" />
                                        },
                                        {
                                            title: "Draft Email",
                                            desc: "Tulis email penawaran kerjasama B2B",
                                            icon: <Mail className="h-5 w-5 text-emerald-600" />
                                        },
                                        {
                                            title: "Strategi Konten",
                                            desc: "Ide konten LinkedIn untuk brand tech",
                                            icon: <Sparkles className="h-5 w-5 text-amber-600" />
                                        }
                                    ].map((card, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(card.desc)}
                                            className="group relative flex items-start gap-4 p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 hover:bg-white/90 dark:hover:bg-slate-800/90 border border-white/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 text-left"
                                        >
                                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                {card.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                    {card.desc}
                                                </p>
                                            </div>
                                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                                <div className="text-blue-400 dark:text-blue-500">→</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <ChatBubble
                                    key={msg.id}
                                    role={msg.role}
                                    content={msg.content}
                                    timestamp={msg.timestamp}
                                />
                            ))
                        )}

                        {isTyping && (
                            <div className="flex gap-3 items-center animate-pulse px-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                </div>
                                <span className="text-sm text-slate-400 dark:text-slate-500">Sedang berpikir...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area with Toolbar */}
                    <div className="p-2 pb-4 md:p-6 bg-gradient-to-t from-white/90 via-white/80 to-transparent dark:from-[#0B1120]/90 dark:via-[#0B1120]/80 dark:to-transparent">
                        <div className="max-w-4xl mx-auto space-y-3">
                            {/* Professional Mode Selector Toolbar */}
                            <div className="flex justify-center mb-1 overflow-x-auto no-scrollbar py-1 mask-linear-fade">
                                <div className="inline-flex p-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-white/50 dark:border-slate-800 shadow-sm gap-1 min-w-max">
                                    {modes.map((mode) => {
                                        const Icon = mode.icon;
                                        const isActive = selectedMode === mode.id;
                                        return (
                                            <button
                                                key={mode.id}
                                                onClick={() => setSelectedMode(mode.id)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-medium rounded-full transition-all duration-300 border",
                                                    isActive
                                                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                                                        : "bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200"
                                                )}
                                            >
                                                <Icon className={cn("w-3 h-3 md:w-3.5 md:h-3.5", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                                                {mode.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="shadow-2xl shadow-blue-900/10 rounded-[28px] overflow-hidden border border-white/60 dark:border-blue-900/30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl transition-all duration-300 hover:shadow-blue-900/15 group-focus-within:shadow-blue-500/10 dark:shadow-none dark:hover:shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                                <Sender
                                    onSend={handleSend}
                                    placeholder={`Message ${modes.find(m => m.id === selectedMode)?.label} module...`}
                                    className="border-none shadow-none bg-transparent"
                                />
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 mt-4 tracking-wide">
                            AI-generated content may be inaccurate. Please verify important information.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
