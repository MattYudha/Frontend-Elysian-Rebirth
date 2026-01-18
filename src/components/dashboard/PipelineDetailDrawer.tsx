"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ScrollArea } from "@/ui/scroll-area";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { Activity, Settings } from "lucide-react";
import type { PipelineItem } from "@/packages/x/types";

interface PipelineDetailDrawerProps {
    pipeline: PipelineItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PipelineDetailDrawer({ pipeline, open, onOpenChange }: PipelineDetailDrawerProps) {
    if (!pipeline) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* Elysian Glass Effect on the Sheet Content */}
            <SheetContent className="w-[400px] sm:w-[540px] backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border-l border-zinc-200 dark:border-zinc-800">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-3">
                        <Badge variant={pipeline.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                            {pipeline.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">ID: {pipeline.id}</span>
                    </div>
                    <SheetTitle className="text-xl">{pipeline.name}</SheetTitle>
                    <SheetDescription>
                        Last updated: {new Date(pipeline.lastUpdated).toLocaleString()}
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="overview" className="h-full">
                    <TabsList className="w-full grid grid-cols-3 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="logs">Live Logs</TabsTrigger>
                        <TabsTrigger value="config">Config</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-xs font-medium">Progress</span>
                                    </div>
                                    <div className="text-2xl font-bold">{pipeline.progress ?? 0}%</div>
                                </div>
                                {/* Add other metrics here */}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-medium">Summary</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    This pipeline processed {pipeline.name} data sources.
                                    (Simulated detail data...)
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="logs">
                            <div className="bg-black/95 text-green-400 font-mono text-xs p-4 rounded-md h-[400px] overflow-y-auto">
                                <div className="flex gap-2 mb-1"><span className="text-gray-500">[10:00:01]</span> <span>Initializing pipeline...</span></div>
                                <div className="flex gap-2 mb-1"><span className="text-gray-500">[10:00:05]</span> <span>Fetching RAG sources...</span></div>
                                <div className="flex gap-2 mb-1"><span className="text-gray-500">[10:00:12]</span> <span>Vectorizing content...</span></div>
                                {/* Simulated logs */}
                            </div>
                        </TabsContent>

                        <TabsContent value="config">
                            <div className="p-4 rounded-lg border bg-muted/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings className="h-4 w-4" />
                                    <h4 className="font-medium">Configuration</h4>
                                </div>
                                <pre className="text-xs bg-zinc-950 text-zinc-50 p-4 rounded overflow-auto">
                                    {JSON.stringify({
                                        model: "gpt-4-turbo",
                                        temperature: 0.7,
                                        max_tokens: 4096,
                                        sources: ["gs://bucket/data", "s3://bucket/docs"]
                                    }, null, 2)}
                                </pre>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
