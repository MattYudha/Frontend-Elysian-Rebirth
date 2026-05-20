'use client';

import React from 'react';
import { useWorkflowStore } from './store';
import { X, Terminal, CheckCircle2, Clock, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/';

export function ResultsPanel() {
    const { execution } = useWorkflowStore();
    const [isOpen, setIsOpen] = React.useState(false);

    // Auto-open on run start
    React.useEffect(() => {
        if (execution.status === 'running') {
            setIsOpen(true);
        }
    }, [execution.status]);

    if (!isOpen && execution.status === 'idle' && !execution.runId) return null;

    return (
        <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-blue-900/30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 z-30 flex flex-col ${isOpen ? 'h-64' : 'h-10'}`}>
            {/* Header / Tab Bar */}
            <div
                className="flex items-center justify-between px-4 h-10 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-100 dark:border-blue-900/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Terminal className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        Execution Console
                    </div>
                    {execution.status === 'running' && (
                        <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            Running...
                        </span>
                    )}
                    {execution.status === 'idle' && execution.runId && (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                        <X className="h-3 w-3 text-slate-400" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {isOpen && (
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar / Steps */}
                    <div className="w-1/4 border-r border-slate-100 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#0B1120]/50 p-2 overflow-y-auto">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2 px-2">Timeline</h4>
                        <div className="space-y-1">
                            {Object.entries(execution.nodeStatus).map(([nodeId, status], idx) => (
                                <div key={nodeId} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">00:0{idx}s</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-amber-400 animate-pulse' : status === 'success' ? 'bg-green-500' : 'bg-slate-600'}`} />
                                    <span className="truncate flex-1">Node {nodeId.split('-')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Output */}
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                        {execution.runId ? (
                            <div className="h-full flex gap-4 overflow-hidden">
                                {/* Live Logs */}
                                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] rounded border border-slate-100 dark:border-blue-900/30 p-3 h-full overflow-hidden">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-200 dark:border-blue-900/30 pb-2 sticky top-0 bg-slate-50 dark:bg-[#0B1120] z-10 shrink-0">
                                        <Terminal className="h-3 w-3 text-blue-500" />
                                        <span>Live Logs</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[10px]">
                                        {execution.logs?.length ? execution.logs.map((log, i) => (
                                            <div key={i} className={`flex gap-2 ${log.level === 'ERROR' ? 'text-red-500 dark:text-red-400' : log.level === 'WARN' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                                <span className="text-slate-400 dark:text-slate-500">[{typeof log.timestamp === 'string' ? log.timestamp.split('T')[1]?.split('.')[0] : 'Time'}]</span>
                                                <span className={`font-bold ${log.level === 'INFO' ? 'text-blue-500 dark:text-blue-400' : 'text-amber-500 dark:text-amber-400'}`}>{log.level}</span>
                                                <span>{log.message}</span>
                                            </div>
                                        )) : <span className="text-slate-400 italic">No logs yet...</span>}
                                    </div>
                                </div>

                                {/* JSON Output */}
                                <div className="w-80 border-l border-slate-100 dark:border-blue-900/30 pl-4 flex flex-col min-w-0 h-full overflow-hidden">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-200 dark:border-blue-900/30 pb-2 sticky top-0 bg-white dark:bg-slate-900 z-10 shrink-0">
                                        <FileJson className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="font-semibold text-xs">Output Payload</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0B1120] p-2.5 rounded border border-slate-100 dark:border-blue-900/30 font-mono text-[9px] text-slate-700 dark:text-slate-300">
                                        {execution.status === 'completed' && Object.keys(execution.results || {}).length > 0 ? (
                                            <pre className="whitespace-pre-wrap">{JSON.stringify(execution.results, null, 2)}</pre>
                                        ) : execution.status === 'running' ? (
                                            <span className="text-slate-400 italic">Generating output payload...</span>
                                        ) : (
                                            <span className="text-slate-400 italic">Run workflow to see output...</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Terminal className="h-8 w-8 mb-2 opacity-20" />
                                <p>Ready to execute workflow...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
