"use client";

import React, { useRef, useState } from "react";
import { Paperclip, ArrowUp, X, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Pastikan pakai shadcn textarea
import { cn } from "@/lib/utils";

interface ChatInputAreaProps {
    onSend: (message: string, files: File[]) => void;
    isLoading?: boolean;
}

export function ChatInputArea({ onSend, isLoading }: ChatInputAreaProps) {
    const [input, setInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!input.trim() && files.length === 0) return;
        onSend(input, files);
        setInput("");
        setFiles([]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 pb-6">
            <div className={cn(
                "relative flex flex-col w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-all",
                "focus-within:shadow-md focus-within:border-zinc-300 dark:focus-within:border-zinc-700"
            )}>

                {/* File Preview Area (Inside Input) */}
                {files.length > 0 && (
                    <div className="flex gap-3 mb-3 overflow-x-auto p-1">
                        {files.map((file, idx) => (
                            <div key={idx} className="relative group flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-2 pr-3 rounded-lg border border-zinc-100 dark:border-zinc-700 shrink-0">
                                <div className="p-2 bg-white dark:bg-zinc-900 rounded-md">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="text-xs font-medium max-w-[100px] truncate">{file.name}</span>
                                <button
                                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                    className="absolute -top-1 -right-1 bg-zinc-200 dark:bg-zinc-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input Textarea */}
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Elysian..."
                    className="min-h-[44px] max-h-[200px] w-full resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 px-2 py-2 text-base outline-none ring-0 focus:ring-0"
                    rows={1}
                />

                {/* Bottom Toolbar */}
                <div className="flex justify-between items-center mt-2">

                    {/* Left: Tools & Attachments */}
                    <div className="flex gap-2">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="file-upload">
                            <div className="cursor-pointer rounded-full h-8 w-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <Paperclip className="w-4 h-4" />
                            </div>
                        </label>

                        {/* Mode Toggles (Optional) */}
                        <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs text-zinc-500 gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <Globe className="w-3 h-3" /> Search
                        </Button>
                    </div>

                    {/* Right: Send Button */}
                    <Button
                        onClick={handleSend}
                        disabled={(!input.trim() && files.length === 0) || isLoading}
                        size="icon"
                        className={cn(
                            "rounded-full h-8 w-8 transition-all",
                            input.trim() || files.length > 0
                                ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600"
                        )}
                    >
                        <ArrowUp className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <p className="text-center text-xs text-zinc-400 mt-2">
                Elysian can make mistakes. Check important info.
            </p>
        </div>
    );
}
