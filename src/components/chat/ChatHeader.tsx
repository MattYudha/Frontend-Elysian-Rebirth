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
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 px-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-transparent">
            <div className="hidden md:block w-1/3" /> {/* Spacer kiri */}

            <div className="flex justify-center w-full md:w-1/3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl px-4 py-2 h-auto">
                            <span>Elysian 4.0</span>
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
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
