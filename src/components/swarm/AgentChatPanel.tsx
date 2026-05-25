import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Bot, User, ShieldAlert, Users, MessageSquare } from 'lucide-react';

interface AgentLog {
    agent: string;
    action: string;
    message: string;
}

interface SwarmResult {
    item_id: string;
    name?: string;
    qty?: number;
    requested_price?: number;
    max_price?: number;
    region?: string;
    status: string;
    agent_logs: AgentLog[];
    manager_conclusion?: string;
}

interface AgentChatPanelProps {
    result: SwarmResult;
    onBack: () => void;
}

export function AgentChatPanel({ result, onBack }: AgentChatPanelProps) {
    const cleanThinkTags = (text: string | undefined): string => {
        if (!text) return '';
        let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
        cleaned = cleaned.replace(/<think>[\s\S]*/gi, '');
        cleaned = cleaned.trim();
        
        if (cleaned.startsWith('{') && (cleaned.endsWith('}') || cleaned.includes('"manager_conclusion"') || cleaned.includes('"message"'))) {
            try {
                const parsed = JSON.parse(cleaned.endsWith('}') ? cleaned : cleaned + '}');
                if (parsed.manager_conclusion) {
                    return parsed.manager_conclusion.trim();
                }
                if (parsed.message) {
                    return parsed.message.trim();
                }
            } catch (e) {
                // Ignore parse errors, proceed to regex match
            }
        }
        
        if (cleaned.includes('"manager_conclusion"')) {
            const match = cleaned.match(/"manager_conclusion"\s*:\s*"([^"]*)/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        if (cleaned.includes('"message"')) {
            const match = cleaned.match(/"message"\s*:\s*"([^"]*)/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        return cleaned;
    };

    const [chatMode, setChatMode] = useState<'analyst' | 'debate'>('analyst');
    const [messages, setMessages] = useState<{role: 'agent'|'user', content: string}[]>([]);
    const [debateContent, setDebateContent] = useState('');
    const [isDebating, setIsDebating] = useState(false);

    useEffect(() => {
        setMessages([
            {
                role: 'agent', 
                content: `Halo, saya Agent Analis. Saya men-flag item ${result.name || result.item_id} karena: ${cleanThinkTags(result.manager_conclusion)}. Ada yang ingin Anda tanyakan terkait regulasi atau perhitungan harga ini?`
            }
        ]);
        setDebateContent('');
        setIsDebating(false);
    }, [result]);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, debateContent, isDebating]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userPrompt = input;
        setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
        setInput('');
        setIsTyping(true);

        try {
            const systemInstruction = `Anda adalah Agent Analis (Auditor Swarm) dari Elysian Rebirth.
Kamu sedang berdiskusi dengan pengguna (auditor manusia) mengenai temuan audit untuk item anggaran berikut:
- ID/Nama Item: ${result.name || result.item_id}
- Status Akhir: ${result.status}
- Kesimpulan Manajer Swarm: ${cleanThinkTags(result.manager_conclusion)}

Berikut adalah temuan detail atau catatan perdebatan dari Swarm Agen (Auditor dan Compliance/Pengawas):
${result.agent_logs.map(log => `- [${log.agent}] ${log.action}: ${cleanThinkTags(log.message)}`).join('\n')}

Tugas utama Anda:
1. Jawab pertanyaan pengguna mengenai alasan di-flag, perbandingan harga regional, batas maksimum resmi, regulasi POJK yang berlaku, atau kalkulasi lainnya.
2. Gunakan Bahasa Indonesia yang sopan, ramah, dan profesional. Hindari penjelasan IT yang berbelit-belit. Gunakan sudut pandang "Agent Analis" atau "Auditor".
3. Bantu pengguna menganalisis apakah temuan ini wajar untuk dilakukan 'override' (diabaikan karena justifikasi tertentu) atau jika harus ditolak.
4. JANGAN pernah memberikan jawaban template statis yang berulang. Jawablah sesuai secara spesifik dengan pertanyaan dari pengguna dan gunakan data temuan di atas.`;

            const apiMessages = [
                ...messages.map(m => ({
                    role: m.role === 'agent' ? 'assistant' : 'user',
                    content: m.content
                })),
                { role: 'user', content: userPrompt }
            ];

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    systemInstruction: systemInstruction
                })
            });

            if (!res.ok) {
                throw new Error(`API returned status ${res.status}`);
            }

            const data = await res.json();
            setIsTyping(false);

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'agent', content: `Error: ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'agent', content: 'Maaf, saya tidak menerima balasan yang valid dari server AI.' }]);
            }
        } catch (e: any) {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                role: 'agent', 
                content: `Koneksi gagal: ${e.message || 'Terjadi kesalahan sistem saat menghubungi AI.'}` 
            }]);
        }
    };

    const startDebate = async () => {
        setDebateContent('Menginisialisasi Swarm Group Debate...\n\n');
        setIsDebating(true);

        try {
            const systemInstruction = `Kamu adalah moderator Swarm Intelijen. Simulasikan perdebatan sengit antara 3 Agen Swarm mengenai draf item anggaran berikut.
1. Agen Auditor: Menganalisis ketidakwajaran harga vs Nemesis/POJK.
2. Agen Compliance: Membela atau menolak berdasarkan regulasi lokal dan argumen hukum.
3. Agen Manager: Memberikan keputusan konsensus final.

Tulis perdebatan ini langkah demi langkah, ditandai dengan format:
[Auditor]: <argumen auditor>
[Compliance]: <argumen compliance>
[Manager]: <keputusan final>

Tulis setiap agen secara lengkap dan pisahkan dengan newline ganda. Jangan berbelit-belit dan gunakan Bahasa Indonesia yang ringkas dan lugas.`;

            const userPrompt = `Simulasikan perdebatan untuk item berikut:
- Nama Item: ${result.name || result.item_id}
- Harga Diajukan: Rp ${result.requested_price?.toLocaleString('id-ID') || 0}
- Batas Maksimal: Rp ${result.max_price?.toLocaleString('id-ID') || 0}
- Lokasi: ${result.region || 'Nasional'}
- Status Awal: ${result.status}

Berikut detail temuan awal:
${result.agent_logs.map(l => `- [${l.agent}]: ${l.message}`).join('\n')}`;

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: userPrompt }],
                    systemInstruction: systemInstruction,
                    debate: true
                })
            });

            if (!res.ok) {
                throw new Error(`API returned status ${res.status}`);
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let currentText = '';

            if (reader) {
                setDebateContent('');
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.substring(6));
                                if (data.delta) {
                                    currentText += data.delta;
                                    setDebateContent(currentText);
                                }
                            } catch (err) {
                                // incomplete chunk
                            }
                        }
                    }
                }
            }
            setIsDebating(false);
        } catch (e: any) {
            setIsDebating(false);
            setDebateContent(prev => prev + `\n\n❌ Gagal memulai debat: ${e.message}`);
        }
    };

    const renderDebateMessage = (text: string) => {
        const parts = text.split(/(?=\[(?:Auditor|Compliance|Manager)\]:)/g);
        return parts.map((part, index) => {
            const match = part.match(/^\[(Auditor|Compliance|Manager)\]:\s*([\s\S]*)/i);
            if (match) {
                const sender = match[1];
                const message = match[2].trim();
                const isAuditor = sender === 'Auditor';
                const isCompliance = sender === 'Compliance';
                
                return (
                    <div key={index} className="mb-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isAuditor ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                isCompliance ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                                {sender}
                            </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900/50 leading-relaxed">
                            {message}
                        </p>
                    </div>
                );
            }
            return part.trim() ? (
                <p key={index} className="text-xs text-slate-500 dark:text-slate-400 italic mb-2 pl-2">
                    {part.trim()}
                </p>
            ) : null;
        });
    };

    return (
        <div className="w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-full animate-in slide-in-from-right-8 font-sans">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Interogasi Swarm</h3>
                        <p className="text-[10px] text-red-500 dark:text-red-400 flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> Item: {result.name || result.item_id}
                        </p>
                    </div>
                </div>

                <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-0.5 rounded-md">
                    <Button 
                        variant={chatMode === 'analyst' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setChatMode('analyst')}
                        className={`h-6 text-[10px] px-2 ${chatMode === 'analyst' ? 'bg-white dark:bg-slate-900 shadow-sm' : ''}`}
                    >
                        <MessageSquare className="h-3 w-3 mr-1" /> Tanya
                    </Button>
                    <Button 
                        variant={chatMode === 'debate' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => {
                            setChatMode('debate');
                            if (!debateContent) startDebate();
                        }}
                        className={`h-6 text-[10px] px-2 ${chatMode === 'debate' ? 'bg-white dark:bg-slate-900 shadow-sm text-purple-600 dark:text-purple-400' : ''}`}
                    >
                        <Users className="h-3 w-3 mr-1" /> Debate
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {chatMode === 'analyst' ? (
                    <>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${m.role === 'agent' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                    {m.role === 'agent' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                </div>
                                <div className={`text-xs p-2.5 rounded-lg max-w-[85%] ${m.role === 'agent' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-tl-none leading-relaxed' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-blue-700 dark:text-blue-300">
                                    <Bot className="h-3 w-3" />
                                </div>
                                <div className="text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-tl-none flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-1">
                        {debateContent ? renderDebateMessage(debateContent) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-8">
                                Menginisialisasi perdebatan...
                            </p>
                        )}
                        {isDebating && (
                            <div className="flex items-center justify-center gap-2 py-4">
                                <Bot className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 animate-pulse">Swarm Swarm Intelligence sedang berdebat secara live...</span>
                            </div>
                        )}
                        {!isDebating && debateContent && (
                            <div className="pt-4 flex justify-center">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={startDebate}
                                    className="text-[10px] h-7 border-purple-200 text-purple-600 dark:border-purple-900 dark:text-purple-400"
                                >
                                    Ulangi Debat Swarm
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {chatMode === 'analyst' && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex gap-2">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Tanya agent..."
                            className="h-8 text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 focus-visible:ring-blue-500"
                        />
                        <Button onClick={handleSend} size="icon" className="h-8 w-8 shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
                            <Send className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
