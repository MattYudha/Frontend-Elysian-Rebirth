'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sender } from './Sender';
import { ChatBubble } from './ChatBubble';
import { PromptSuggestions } from './PromptSuggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, MessageSquarePlus, History, Settings2, PanelRightClose, PanelRightOpen, BarChart2, Code, Mail, Sparkles, Bot, Map, Image, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

const INITIAL_SUGGESTIONS = [
    "Explain quantum computing in simple terms",
    "Write a python script to parse CSV files",
    "Draft a professional email for a project update",
    "Design a modern landing page structure"
];

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMode, setSelectedMode] = useState('agent');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const modes = [
        { id: 'agent', label: 'Agent', icon: Bot },
        { id: 'planning', label: 'Planning', icon: Map },
        { id: 'images', label: 'Images', icon: Image },
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

        // Optimistic update
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(true);

        // Simulate backend delay and response
        setTimeout(() => {
            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "This is a simulated response demonstrating the optimistic UI and glassmorphism design. In a real implementation, this would connect to your backend inference API.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, responseMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex h-full w-full relative overflow-hidden text-slate-800 bg-slate-50">
            {/* Light 'Elysian Ether' Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-indigo-300/10 rounded-full blur-[100px]" />
            </div>

            {/* Main Content Container with Glass Effect */}
            <div className="relative z-10 flex h-full w-full bg-white/30 backdrop-blur-xl shadow-2xl overflow-hidden md:m-4 md:rounded-3xl md:border md:border-white/50">

                {/* Left Sidebar (History) */}
                <AnimatePresence mode="wait">
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="hidden md:flex flex-col border-r border-white/20 bg-white/40 backdrop-blur-md"
                        >
                            <div className="p-4 border-b border-white/20 flex items-center justify-between">
                                <span className="font-semibold text-sm tracking-wide text-slate-700">Riwayat Percakapan</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/40 text-slate-600">
                                    <MessageSquarePlus className="h-4 w-4" />
                                </Button>
                            </div>
                            <ScrollArea className="flex-1 p-3">
                                <div className="space-y-2">
                                    {['Perencanaan Proyek Elysian', 'Bantuan Komponen React', 'Desain Skema Database'].map((chat, i) => (
                                        <button key={i} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/40 transition-colors truncate text-slate-600 hover:text-slate-900 font-medium">
                                            {chat}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="p-4 border-t border-white/20">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Online</span>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col relative min-w-0 bg-white/10">
                    {/* Header */}
                    <div className="h-16 border-b border-white/20 flex items-center justify-between px-6 bg-white/30 backdrop-blur-md z-20">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-slate-600"
                            >
                                <History className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex text-slate-600 hover:bg-white/40"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 tracking-tight">Elysian Assistant</h2>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-white/40">
                            <Settings2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Chat Stream */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-forwards pb-20">

                                {/* Hero Greeting */}
                                <div className="space-y-4 max-w-2xl px-4">
                                    <div className="h-16 w-16 bg-white rounded-2xl shadow-xl shadow-blue-500/10 flex items-center justify-center mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
                                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <MessageSquarePlus className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                        Apa yang bisa saya bantu hari ini?
                                    </h1>
                                    <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                                        Saya siap membantu Anda dengan analisis data, penulisan kode, atau perencanaan strategis.
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
                                            className="group relative flex items-start gap-4 p-5 rounded-2xl bg-white/60 hover:bg-white/90 border border-white/50 hover:border-blue-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 text-left"
                                        >
                                            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                {card.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                    {card.desc}
                                                </p>
                                            </div>
                                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                                <div className="text-blue-400">→</div>
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
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                </div>
                                <span className="text-sm text-slate-400">Sedang berpikir...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area with Toolbar */}
                    <div className="p-4 md:p-6 bg-gradient-to-t from-white/90 via-white/80 to-transparent">
                        <div className="max-w-4xl mx-auto space-y-3">
                            {/* Professional Mode Selector Toolbar */}
                            <div className="flex justify-center mb-1">
                                <div className="inline-flex p-1 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm gap-1">
                                    {modes.map((mode) => {
                                        const Icon = mode.icon;
                                        const isActive = selectedMode === mode.id;
                                        return (
                                            <button
                                                key={mode.id}
                                                onClick={() => setSelectedMode(mode.id)}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 border",
                                                    isActive
                                                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                                                        : "bg-transparent text-slate-500 border-transparent hover:bg-white/50 hover:text-slate-700"
                                                )}
                                            >
                                                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-slate-400")} />
                                                {mode.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="shadow-2xl shadow-blue-900/10 rounded-[28px] overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:shadow-blue-900/15 group-focus-within:shadow-blue-500/10">
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
