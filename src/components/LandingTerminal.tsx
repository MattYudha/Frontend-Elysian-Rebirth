'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const ASCII_ART = `
                      -------   ----     ---- ---=  ------   ---=     ----     ----  ---            
                      ---=--=    --        -----    -----=   ---      -=--     ------ --            
                      ------     --         ---      -----   =--     ------    ---------            
                      ---= =-    --= --=    ---    --- =--   =--    --   ---   ---  ----            
                      -------   -------    =---     -----    ----  ---   ---   ---    -
`;

interface LogLine {
    prefix?: string;
    text: string;
    color?: string;
    isCommand?: boolean;
    isMultiLine?: boolean;
}

// Command Data kept outside for now or can be moved in if needed
type CommandDetail = {
    name: string;
    usage?: string;
    description?: string;
    commands?: { cmd: string; desc: string }[];
    examples?: string[];
};

const COMMAND_DATA: Record<string, CommandDetail> = {
    products: {
        name: "Produk Elysian - Platform Operasi Bisnis Terpadu",
        usage: "elysian products <fitur>",
        commands: [
            { cmd: "workflows", desc: "Orkestrasi logika bisnis yang kompleks & otomatis." },
            { cmd: "agents", desc: "Asisten AI otonom untuk tim Anda (24/7)." },
            { cmd: "knowledge", desc: "Satu sumber kebenaran data perusahaan." },
            { cmd: "analytics", desc: "Wawasan real-time untuk pengambilan keputusan." }
        ],
        examples: [
            "$ elysian products list --all",
            "$ elysian agents --deploy support-bot"
        ]
    },
    compliance: {
        name: "Modul Kepatuhan & Keamanan (SOC 2 / ISO 27001)",
        usage: "elysian compliance [action]",
        commands: [
            { cmd: "audit", desc: "Mulai audit otomatis sistem & infrastruktur." },
            { cmd: "evidence", desc: "Kumpulkan bukti kepatuhan secara real-time." },
            { cmd: "report", desc: "Generate laporan siap audit untuk auditor eksternal." }
        ],
        examples: [
            "$ elysian compliance --init soc2",
            "$ elysian compliance status --live"
        ]
    },
    iam: {
        name: "Identity & Access Management (RBAC)",
        usage: "elysian iam <user|role>",
        commands: [
            { cmd: "users", desc: "Kelola siklus hidup akses pengguna (hire to retire)." },
            { cmd: "policies", desc: "Terapkan prinsip 'least privilege' secara otomatis." },
            { cmd: "sso", desc: "Konfigurasi Single Sign-On (Google, Okta, Azure AD)." }
        ],
        examples: [
            "$ elysian iam create-user --role admin",
            "$ elysian iam audit-log --user john.doe"
        ]
    },
    mdm: {
        name: "Mobile Device Management (Fleet Security)",
        usage: "elysian mdm [device-id]",
        commands: [
            { cmd: "enroll", desc: "Daftarkan perangkat baru ke jaringan perusahaan." },
            { cmd: "lock", desc: "Kunci perangkat jarak jauh (Lost Mode)." },
            { cmd: "wipe", desc: "Hapus data perusahaan dari perangkat yang hilang." }
        ],
        examples: [
            "$ elysian mdm list --status active",
            "$ elysian mdm --lock macbook-pro-12"
        ]
    },
    elysian: {
        name: "Tentang Elysian Operating System",
        description: "Elysian adalah sistem operasi pertama yang dirancang untuk 'AI-native enterprise'. Kami menjembatani kesenjangan antara kreativitas manusia dan kecerdasan mesin, memungkinkan bisnis berjalan dengan kecepatan software.",
        examples: [
            "$ elysian about",
            "$ elysian version --v2.0-beta"
        ]
    },
    help: {
        name: "Bantuan & Daftar Perintah",
        usage: "help [command_name]",
        description: "Menampilkan daftar perintah yang tersedia atau detail penggunaan perintah tertentu.",
        commands: [
            { cmd: "products", desc: "Lihat produk utama Elysian" },
            { cmd: "compliance", desc: "Cek status kepatuhan (SOC 2)" },
            { cmd: "iam", desc: "Manajemen identitas & akses" },
            { cmd: "mdm", desc: "Manajemen perangkat mobile" },
            { cmd: "elysian", desc: "Tentang sistem operasi ini" },
            { cmd: "clear", desc: "Bersihkan layar terminal" },
            { cmd: "login", desc: "Masuk ke dashboard akun" }
        ],
        examples: ["$ help products", "$ help iam"]
    }
};

export function LandingTerminal() {
    const { t } = useTranslation();
    const [history, setHistory] = useState<LogLine[]>([]);
    const [input, setInput] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialization Effect
    useEffect(() => {
        const INITIAL_LOGS: LogLine[] = [
            { prefix: '[SYSTEM]', text: t.landing.terminal.logs.system, color: 'text-blue-600' },
            { prefix: '[SCAN]', text: t.landing.terminal.logs.scan, color: 'text-indigo-600' },
            { prefix: '[SIAP]', text: t.landing.terminal.logs.ready, color: 'text-emerald-500 font-bold' },
            { prefix: '[SUCCESS]', text: t.landing.terminal.logs.success, color: 'text-emerald-600' },
            { prefix: '[COMPLIANCE]', text: t.landing.terminal.logs.compliance, color: 'text-emerald-600' },
            { text: t.landing.terminal.logs.operational, color: 'text-slate-600 dark:text-slate-400' },
            { text: t.landing.terminal.logs.welcome, color: 'text-slate-900 dark:text-white font-bold mt-2' },
            { text: t.landing.terminal.logs.help, color: 'text-slate-500 dark:text-slate-400' },
        ];

        let currentIndex = 0;
        const interval = setInterval(() => {
            setHistory(prev => {
                if (currentIndex < INITIAL_LOGS.length) {
                    const nextLine = INITIAL_LOGS[currentIndex];
                    currentIndex++;
                    return [...prev, nextLine];
                }
                clearInterval(interval);
                setIsInitialized(true);
                return prev;
            });
        }, 800);
        return () => clearInterval(interval);
    }, [t]); // Added t dependency just in case, though component remounts on locale change

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const formatStructuredResponse = (data: CommandDetail): LogLine[] => {
        const lines: LogLine[] = [];

        // NAME SECTION
        lines.push({ text: 'NAME', color: 'text-blue-500 font-bold mt-2' });
        lines.push({ text: `    ${data.name}`, color: 'text-slate-700 dark:text-slate-300' });
        if (data.description) lines.push({ text: `    ${data.description}`, color: 'text-slate-600 dark:text-slate-400' });

        // USAGE SECTION
        if (data.usage) {
            lines.push({ text: 'USAGE', color: 'text-blue-500 font-bold mt-2' });
            lines.push({ text: `    ${data.usage}`, color: 'text-slate-700 dark:text-slate-300 font-mono' });
        }

        // COMMANDS SECTION
        if (data.commands && data.commands.length > 0) {
            lines.push({ text: 'COMMANDS', color: 'text-blue-500 font-bold mt-2' });
            data.commands.forEach(c => {
                lines.push({ text: `    ${c.cmd}`, color: 'text-slate-800 dark:text-slate-200 font-semibold' });
                lines.push({ text: `        ${c.desc}`, color: 'text-slate-600 dark:text-slate-400' });
            });
        }

        // EXAMPLES SECTION
        if (data.examples && data.examples.length > 0) {
            lines.push({ text: 'EXAMPLES', color: 'text-blue-500 font-bold mt-2' });
            data.examples.forEach(ex => {
                lines.push({ text: `    ${ex}`, color: 'text-slate-500 dark:text-slate-400 italic font-mono' });
            });
        }

        return lines;
    };

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        if (!trimmed) return;

        const newHistory = [...history, { text: `> ${cmd}`, isCommand: true }];
        let response: LogLine[] = [];

        if (COMMAND_DATA[trimmed]) {
            response = formatStructuredResponse(COMMAND_DATA[trimmed]);
        } else if (trimmed === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (trimmed === 'login' || trimmed === 'masuk') {
            window.location.href = '/login';
            return;
        } else {
            response = [{ text: `Perintah tidak ditemukan: "${trimmed}". Ketik "help" untuk melihat perintah.`, color: 'text-red-500' }];
        }

        setTimeout(() => {
            setHistory(prev => [...prev, ...response]);
        }, 100);

        setHistory(newHistory);
        setInput('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div
                className="relative rounded-xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-blue-900/10 dark:shadow-black/50 h-[400px] sm:h-[450px] flex flex-col transition-colors duration-300"
                onClick={() => document.getElementById('terminal-input')?.focus()}
            >
                {/* Header */}
                <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400/80 shadow-sm" />
                    </div>
                    <div className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                        Elysian System Console
                    </div>
                    <div className="w-12" />
                </div>

                {/* Content Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 p-6 sm:p-8 font-mono text-sm sm:text-base overflow-y-auto scrollbar-none relative"
                >
                    {/* Log History */}
                    <div className="space-y-1 relative z-10 text-left">
                        {history.map((line, i) => (
                            <div key={i} className={`flex items-start gap-3 animate-in fade-in duration-300 ${line.isCommand ? 'opacity-80 mt-6 mb-2' : ''}`}>
                                {!line.isCommand && line.prefix && (
                                    <span className={`font-bold shrink-0 ${line.color}`}>{line.prefix}</span>
                                )}
                                <pre className={`${line.isCommand ? 'text-slate-400 dark:text-slate-500' : (line.color || 'text-slate-600 dark:text-slate-300')} font-medium break-words whitespace-pre-wrap font-mono leading-relaxed`}>
                                    {line.text}
                                </pre>
                            </div>
                        ))}

                        {/* Interactive Input */}
                        {isInitialized && (
                            <div className="hidden sm:flex items-center gap-3 mt-4">
                                <span className="text-blue-500 font-bold shrink-0 animate-pulse">➜</span>
                                <span className="text-slate-400 dark:text-slate-500">~</span>
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}
                                    className="flex-1"
                                >
                                    <input
                                        id="terminal-input"
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 font-medium placeholder-slate-400/50"
                                        autoFocus
                                        autoComplete="off"
                                    />
                                </form>
                            </div>
                        )}
                    </div>

                    {/* ASCII Background */}
                    <div className="mt-8 select-none pointer-events-none opacity-[0.05] dark:opacity-[0.08] absolute bottom-4 right-4 z-0 text-slate-900 dark:text-white">
                        <pre className="text-[6px] leading-[6px] font-bold text-right overflow-hidden">
                            {ASCII_ART}
                        </pre>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
