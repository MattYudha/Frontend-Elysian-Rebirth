"use client";

import React from "react";
import { CheckCircle2, Circle, Trophy, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuestWidget() {
    const quests = [
        { id: 1, title: "Upload Dokumen Pertama", completed: true, xp: 50 },
        { id: 2, title: "Lakukan Analisis AI", completed: false, xp: 100 },
        { id: 3, title: "Export Laporan PDF", completed: false, xp: 150 },
    ];

    const progress = 33; // 1 out of 3 done

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" /> Setup Quest
                    </h4>
                    <p className="text-xs text-zinc-500">Selesaikan untuk dapat kredit gratis.</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Level 1</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mb-6">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-zinc-100 dark:bg-zinc-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>

            {/* Quest List */}
            <div className="space-y-3 relative z-10">
                {quests.map((q) => (
                    <div
                        key={q.id}
                        className={cn(
                            "flex items-center justify-between p-2 md:p-3 rounded-xl border transition-all cursor-pointer group",
                            q.completed
                                ? "bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30"
                                : "bg-zinc-50 border-zinc-100 hover:border-blue-200 dark:bg-zinc-800/50 dark:border-zinc-800"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {q.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                                <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-400" />
                            )}
                            <span className={cn("text-sm font-medium", q.completed ? "text-zinc-500 line-through" : "text-zinc-700 dark:text-zinc-200")}>
                                {q.title}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded-md border border-zinc-100 dark:border-zinc-700">
                            +{q.xp} XP
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA Bottom */}
            {!quests.every(q => q.completed) && (
                <Button variant="ghost" className="w-full mt-4 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                    Lihat semua misi <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
            )}
        </div>
    );
}
