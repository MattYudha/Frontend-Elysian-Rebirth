import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, ShieldAlert, CheckCircle2, Loader2, X, Link2 } from 'lucide-react';
import { AgentChatPanel } from './AgentChatPanel';

interface LogLine {
    agent: string;
    action: string;
    message: string;
}

interface SwarmResult {
    item_id: string;
    status: 'FLAGGED' | 'CLEARED' | 'PENDING';
    agent_logs: LogLine[];
    manager_conclusion?: string;
}

interface BlockchainInfo {
    tx_hash?: string;
    network?: string;
    status?: string;
}

interface SwarmReviewPanelProps {
    documentId: string;
    items: any[];
    onClose: () => void;
}

export function SwarmReviewPanel({ documentId, items, onClose }: SwarmReviewPanelProps) {
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('IDLE');
    const [results, setResults] = useState<SwarmResult[]>([]);
    const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
    const [selectedItemForChat, setSelectedItemForChat] = useState<SwarmResult | null>(null);

    const triggerSwarm = async () => {
        setStatus('PROCESSING');
        try {
            // Use BFF Proxy route (reads token from HTTP-Only cookie server-side)
            const res = await fetch('/api/proxy/swarm/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document_id: documentId, items })
            });
            const data = await res.json();
            
            if (data.task_id) {
                listenToSSE(data.task_id);
            } else {
                setStatus('FAILED');
            }
        } catch (e) {
            setStatus('FAILED');
        }
    };

    const listenToSSE = (taskId: string) => {
        // Use BFF Proxy SSE endpoint
        const eventSource = new EventSource(`/api/proxy/swarm/events?task_id=${taskId}`);
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'COMPLETED') {
                    setResults(data.results);
                    setBlockchainInfo(data.blockchain || null);
                    setStatus('COMPLETED');
                    eventSource.close();
                }
            } catch (e) {
                console.error("Failed to parse SSE", e);
            }
        };

        eventSource.onerror = (e) => {
            console.error("SSE Error", e);
        };
    };

    useEffect(() => {
        if (items.length > 0 && status === 'IDLE') {
            triggerSwarm();
        }
    }, [items, status]);

    if (selectedItemForChat) {
        return (
            <AgentChatPanel 
                result={selectedItemForChat} 
                onBack={() => setSelectedItemForChat(null)} 
            />
        );
    }

    return (
        <div className="w-80 lg:w-96 border-l border-slate-800 bg-slate-950 p-4 overflow-y-auto animate-in slide-in-from-right-8 text-slate-300 font-mono text-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-400">
                    <Terminal className="h-4 w-4" />
                    <h3 className="font-semibold uppercase tracking-wider text-xs">Swarm Pipeline</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            
            {status === 'PROCESSING' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-70">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="animate-pulse text-xs">Awaiting Agent Consensus...</p>
                    
                    <div className="w-full space-y-3 mt-8">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-12 w-full bg-slate-900 rounded border border-slate-800 animate-pulse flex items-center px-3 gap-3">
                                <div className="h-2 w-2 rounded-full bg-slate-700"></div>
                                <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {status === 'COMPLETED' && (
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    {/* Blockchain verification badge */}
                    {blockchainInfo?.tx_hash && (
                        <div className="p-2 rounded border border-emerald-900/50 bg-emerald-950/20">
                            <div className="flex items-center gap-2 text-emerald-400 text-[10px]">
                                <Link2 className="h-3 w-3" />
                                <span className="font-semibold">Verified on Blockchain</span>
                            </div>
                            <div className="text-[9px] text-emerald-600/70 mt-1 truncate">
                                {blockchainInfo.network} · {blockchainInfo.tx_hash.slice(0, 20)}...
                            </div>
                        </div>
                    )}

                    {results.map((res, idx) => (
                        <div 
                            key={idx} 
                            className={`p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                                res.status === 'FLAGGED' 
                                ? 'bg-red-950/20 border-red-900/50 hover:bg-red-950/40' 
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80'
                            }`}
                            onClick={() => {
                                if (res.status === 'FLAGGED') {
                                    setSelectedItemForChat(res);
                                }
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-slate-400">Item: {res.item_id}</span>
                                {res.status === 'FLAGGED' ? (
                                    <Badge variant="destructive" className="h-5 text-[10px] px-1 rounded-sm gap-1 bg-red-900 hover:bg-red-800">
                                        <ShieldAlert className="h-3 w-3" /> FLAGGED
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="h-5 text-[10px] px-1 rounded-sm gap-1 border-emerald-900 text-emerald-500">
                                        <CheckCircle2 className="h-3 w-3" /> CLEARED
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="space-y-1 mb-2 pl-2 border-l border-slate-800">
                                {res.agent_logs?.map((log, i) => (
                                    <div key={i} className="text-[10px]">
                                        <span className="text-blue-400 font-bold">[{log.agent}]</span>{' '}
                                        <span className="text-slate-500">{log.action}:</span>{' '}
                                        <span className={res.status === 'FLAGGED' ? 'text-red-300' : 'text-slate-300'}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {res.manager_conclusion && (
                                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
                                    {res.manager_conclusion}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
