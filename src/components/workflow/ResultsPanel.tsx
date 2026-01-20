'use client';

import React from 'react';
import { useWorkflowStore } from './store';
import { X, Terminal, CheckCircle2, Clock, FileJson } from 'lucide-react';
import { Button, ScrollArea } from '@/components/ui/';

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
        <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 z-30 flex flex-col ${isOpen ? 'h-64' : 'h-10'}`}>
            {/* Header / Tab Bar */}
            <div
                className="flex items-center justify-between px-4 h-10 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Terminal className="h-4 w-4 text-slate-500" />
                        Execution Console
                    </div>
                    {execution.status === 'running' && (
                        <span className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            Running...
                        </span>
                    )}
                    {execution.status === 'idle' && execution.runId && (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
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
                    <div className="w-1/4 border-r border-slate-100 bg-slate-50/50 p-2 overflow-y-auto">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">Timeline</h4>
                        <div className="space-y-1">
                            {Object.entries(execution.nodeStatus).map(([nodeId, status], idx) => (
                                <div key={nodeId} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-600 bg-white border border-slate-100 shadow-sm">
                                    <span className="font-mono text-[10px] text-slate-400">00:0{idx}s</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-amber-400 animate-pulse' : status === 'success' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span className="truncate flex-1">Node {nodeId.split('-')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Output */}
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-600 bg-white">
                        {execution.runId ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-200 pb-2">
                                        <FileJson className="h-3 w-3" />
                                        <span>Output Preview</span>
                                    </div>
                                    <pre className="text-[10px] leading-relaxed overflow-x-auto text-slate-600">
                                        {`{
  "execution_id": "${execution.runId}",
  "status": "${execution.status}",
  "results": [
    {
      "node": "llm-1",
      "output": "Based on the document provided..."
    }
  ]
}`}
                                    </pre>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    <span>Execution finished in 1.2s</span>
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
