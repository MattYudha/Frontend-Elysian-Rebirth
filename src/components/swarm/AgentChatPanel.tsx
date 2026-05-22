import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Bot, User, ShieldAlert } from 'lucide-react';

interface AgentLog {
    agent: string;
    action: string;
    message: string;
}

interface SwarmResult {
    item_id: string;
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
        
        // Check if the cleaned text is a JSON representation or contains JSON manager_conclusion key
        if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
            try {
                const parsed = JSON.parse(cleaned);
                if (parsed.manager_conclusion) {
                    return parsed.manager_conclusion.trim();
                }
                if (parsed.message) {
                    return parsed.message.trim();
                }
            } catch (e) {
                // Regex fallback for invalid JSON strings containing manager_conclusion
                const match = cleaned.match(/"manager_conclusion"\s*:\s*"([^"]+)"/);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }
        }
        
        // Regex check if the string contains the manager_conclusion key
        if (cleaned.includes('"manager_conclusion"')) {
            const match = cleaned.match(/"manager_conclusion"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        return cleaned;
    };

    const [messages, setMessages] = useState<{role: 'agent'|'user', content: string}[]>([]);

    useEffect(() => {
        setMessages([
            {
                role: 'agent', 
                content: `Halo, saya Agent Analis. Saya men-flag item ${result.item_id} karena: ${cleanThinkTags(result.manager_conclusion)}. Ada yang ingin Anda tanyakan terkait regulasi atau perhitungan harga ini?`
            }
        ]);
    }, [result]);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userPrompt = input;
        setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
        setInput('');
        setIsTyping(true);

        try {
            const systemInstruction = `Anda adalah Agent Analis (Auditor Swarm) dari Elysian Rebirth.
Kamu sedang berdiskusi dengan pengguna (auditor manusia) mengenai temuan audit untuk item anggaran berikut:
- ID Item: ${result.item_id}
- Status Akhir: ${result.status}
- Kesimpulan Manajer Swarm: ${cleanThinkTags(result.manager_conclusion)}

Berikut adalah temuan detail atau catatan perdebatan dari Swarm Agen (Auditor dan Compliance/Pengawas):
${result.agent_logs.map(log => `- [${log.agent}] ${log.action}: ${cleanThinkTags(log.message)}`).join('\n')}

Tugas utama Anda:
1. Jawab pertanyaan pengguna mengenai alasan di-flag, perbandingan harga regional, batas maksimum resmi, regulasi POJK yang berlaku, atau kalkulasi lainnya.
2. Gunakan Bahasa Indonesia yang sopan, ramah, dan profesional. Hindari penjelasan IT yang berbelit-belit. Gunakan sudut pandang "Agent Analis" atau "Auditor".
3. Bantu pengguna menganalisis apakah temuan ini wajar untuk dilakukan 'override' (diabaikan karena justifikasi tertentu) atau jika harus ditolak.
4. JANGAN pernah memberikan jawaban template statis yang berulang. Jawablah sesuai secara spesifik dengan pertanyaan dari pengguna dan gunakan data temuan di atas.`;

            // Prepare messages for Next.js BFF API chat route
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

    return (
        <div className="w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-full animate-in slide-in-from-right-8 font-sans">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Interogasi Agent</h3>
                    <p className="text-[10px] text-red-500 dark:text-red-400 flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> Item: {result.item_id}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${m.role === 'agent' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                            {m.role === 'agent' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        </div>
                        <div className={`text-xs p-2.5 rounded-lg max-w-[85%] ${m.role === 'agent' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
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
            </div>

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
        </div>
    );
}
