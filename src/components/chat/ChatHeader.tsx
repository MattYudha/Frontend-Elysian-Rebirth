"use client";

import { ChevronDown, Sparkles, Database, Zap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ChatHeader() {
    return (
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 px-4 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-transparent dark:border-blue-900/30">
            <div className="hidden md:block w-1/3" /> {/* Spacer kiri */}

            <div className="flex justify-center w-full md:w-1/3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-slate-900/50 rounded-xl px-4 py-2 h-auto text-slate-800 dark:text-slate-200">
                            <span>Elysian 4.0</span>
                            <ChevronDown className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[200px]">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <div className="flex flex-col">
                                <span className="font-medium">GPT-4 (Smartest)</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <div className="flex flex-col">
                                <span className="font-medium">GPT-3.5 (Fast)</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Database className="w-4 h-4 text-blue-500" />
                            <div className="flex flex-col">
                                <span className="font-medium">RAG (Data)</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex justify-end w-1/3">
                {/* Tombol Share atau History bisa ditaruh sini */}
            </div>
        </div>
    );
}
