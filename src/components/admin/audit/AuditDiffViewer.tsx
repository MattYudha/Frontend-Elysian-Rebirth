'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useTheme } from "next-themes";
import { AuditLogEntry } from "@/types/admin";

interface AuditDiffViewerProps {
    log: AuditLogEntry;
}

export function AuditDiffViewer({ log }: AuditDiffViewerProps) {
    const { theme } = useTheme();

    if (!log.changes) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                    <Eye className="h-3 w-3" />
                    View Changes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Forensic Diff Viewer</DialogTitle>
                    <DialogDescription>
                        Comparing previous state vs new state. <br />
                        <span className="text-xs text-muted-foreground">Action: {log.action} on {log.resource}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto border rounded-md mt-4">
                    {/* The diff viewer needs cleaner standard JSON string inputs */}
                    <ReactDiffViewer
                        oldValue={JSON.stringify(log.changes.before, null, 2)}
                        newValue={JSON.stringify(log.changes.after, null, 2)}
                        splitView={true}
                        compareMethod={DiffMethod.WORDS}
                        useDarkTheme={true}
                        // True Obsidian Theme Overrides
                        styles={{
                            variables: {
                                dark: {
                                    diffViewerBackground: '#020617', // Slate 950 - True Obsidian
                                    diffViewerColor: '#cbd5e1', // Slate 300
                                    addedBackground: '#064e3b', // Emerald 900
                                    addedColor: '#34d399', // Emerald 400
                                    removedBackground: '#881337', // Rose 900
                                    removedColor: '#f43f5e', // Rose 500
                                    wordAddedBackground: '#059669',
                                    wordRemovedBackground: '#be123c',
                                    diffViewerTitleBackground: '#0f172a', // Slate 900
                                    diffViewerTitleColor: '#94a3b8',
                                    diffViewerTitleBorderColor: '#1e293b',
                                }
                            }
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
