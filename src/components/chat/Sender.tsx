'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Attachment } from '../../types/x';
import { Button } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, Paperclip, Mic, Plus, Image as ImageIcon, Globe, Bot, MoreHorizontal, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SenderProps {
    onSend: (message: string, attachments?: Attachment[]) => void;
    onAttach?: (files: Attachment[]) => void;
    onVoice?: () => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const Sender: React.FC<SenderProps> = ({
    onSend,
    onAttach,
    onVoice,
    disabled = false,
    placeholder = 'Type your message...',
    className,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [fileList, setFileList] = useState<File[]>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    const handleSend = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue && fileList.length === 0) {
            return;
        }

        const attachments: Attachment[] = fileList.map((file) => ({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
        }));

        onSend(trimmedValue, attachments.length > 0 ? attachments : undefined);
        setInputValue('');
        setFileList([]);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).slice(0, 5);
            setFileList(newFiles);

            if (onAttach && newFiles.length > 0) {
                const attachments: Attachment[] = newFiles.map((file) => ({
                    id: Math.random().toString(36).substring(7),
                    name: file.name,
                    type: file.type || 'application/octet-stream',
                    size: file.size || 0,
                }));
                onAttach(attachments);
            }
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("w-full relative", className)} id="chat-input-area">
            {/* Pill Container */}
            <div className="flex items-end gap-3 p-2 pl-2 rounded-[24px] border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm transition-all duration-300 focus-within:bg-white/60 focus-within:shadow-md focus-within:border-blue-200 hover:bg-white/50">

                {/* Left Actions (Dropdown) */}
                <div className="flex pb-1.5 pl-1">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={disabled}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-600 hover:bg-slate-300 hover:text-slate-800 cursor-pointer transition-colors shadow-sm">
                                <Plus className="h-5 w-5" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-56 p-2 bg-white/90 backdrop-blur-xl border border-slate-200/50 text-slate-700 rounded-xl shadow-2xl mb-2 ring-1 ring-slate-200/50">
                            <DropdownMenuItem onClick={triggerFileUpload} className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-slate-600 focus:text-blue-700 gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <FileUp className="h-4 w-4" />
                                <span>Tambah foto & file</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-slate-600 focus:text-blue-700 gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <ImageIcon className="h-4 w-4" />
                                <span>Buat gambar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-slate-600 focus:text-blue-700 gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <Globe className="h-4 w-4" />
                                <span>Riset mendalam</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-slate-600 focus:text-blue-700 gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <Bot className="h-4 w-4" />
                                <span>Mode agen</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-slate-600 focus:text-blue-700 gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                                <span>Lainnya</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Main Input */}
                <div className="flex-1 relative py-2">
                    <Textarea
                        ref={textAreaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full min-h-[24px] max-h-32 resize-none border-0 focus-visible:ring-0 p-0 bg-transparent shadow-none text-slate-700 placeholder:text-slate-400 leading-relaxed custom-scrollbar"
                        rows={1}
                        style={{ height: 'auto', overflow: 'hidden' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                </div>

                {/* Right Actions (Voice & Send) */}
                <div className="flex items-center gap-1.5 pb-1.5 pr-1">
                    {/* Command Hint (Visual only for now) */}
                    <div className="hidden md:flex h-6 items-center px-1.5 rounded border border-slate-200 bg-white/50 mx-1">
                        <span className="text-[10px] font-mono text-slate-400">⌘ /</span>
                    </div>

                    {onVoice && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onVoice}
                            disabled={disabled}
                            className="h-8 w-8 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                            <Mic className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        onClick={handleSend}
                        disabled={disabled || (!inputValue.trim() && fileList.length === 0)}
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-full shadow-sm transition-all duration-300",
                            inputValue.trim() || fileList.length > 0
                                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
                                : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                        )}
                    >
                        <Send className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                </div>
            </div>

            {/* File Previews */}
            {fileList.length > 0 && (
                <div className="absolute bottom-full left-0 mb-2 w-full px-4">
                    <div className="flex flex-wrap gap-2 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        {fileList.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                <button onClick={() => {
                                    const newFiles = [...fileList];
                                    newFiles.splice(i, 1);
                                    setFileList(newFiles);
                                }} className="hover:text-blue-900">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

Sender.displayName = 'Sender';
