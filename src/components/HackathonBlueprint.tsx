'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Cpu, Users, Layers, Award, BarChart3, Database, 
    Zap, Sparkles, TrendingUp, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

interface HackathonItem {
    id: string;
    question: string;
    description: string;
    answer: string;
    icon: any;
    badge?: string;
}

export function HackathonBlueprint() {
    const [activeTab, setActiveTab] = useState<'vision' | 'architecture' | 'impact' | 'business'>('vision');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const tabs = [
        { id: 'vision', label: 'Visi & Solusi', icon: Sparkles },
        { id: 'architecture', label: 'Arsitektur Teknis', icon: Cpu },
        { id: 'impact', label: 'Dampak & MVP', icon: BarChart3 },
        { id: 'business', label: 'Bisnis & Keberlanjutan', icon: TrendingUp },
    ];

    const blueprintData: Record<'vision' | 'architecture' | 'impact' | 'business', HackathonItem[]> = {
        vision: [
            {
                id: 'exec-summary',
                question: 'Executive Summary',
                description: 'Jelaskan versi terbaru dari solusi Anda, termasuk problem utama, pendekatan solusi, dan dampak utama yang ditargetkan.',
                answer: 'Elysian Rebirth v3.0 adalah Infrastruktur Audit Finansial Otonom berbasis Multi-Agent Swarm Intelligence untuk mendeteksi dan mencegah markup anggaran (RAPBD) pada tahap Pre-Audit di Pemerintah Daerah Indonesia. Dengan mengawinkan Cognitive Swarm (MiroFish Python), RAG Regulasi Daerah (OpenViking Rust), dan Ground Truth SIRUP Nasional (Nemesis DB 4GB+), Elysian otomatis mendeteksi anomali harga dan regulasi dalam hitungan detik. Keputusan di-commit sebagai audit trail tak terubah di Sepolia EVM Blockchain, mengamankan akuntabilitas publik dan menghemat miliaran rupiah APBD.',
                icon: Award,
                badge: 'Platform Utama'
            },
            {
                id: 'problem-stmt',
                question: 'Problem Statement',
                description: 'Penulisan rumusan masalah utama secara tegas.',
                answer: 'Praktik markup (penggelembungan harga) pada draf RAPBD daerah merugikan negara triliunan rupiah setiap tahun. Proses reviu manual oleh Inspektorat Daerah sangat lambat (berminggu-minggu), rentan terhadap manipulasi (tidak transparan), dan tidak memiliki data pembanding wajar secara real-time.',
                icon: Shield,
                badge: 'Krusial'
            },
            {
                id: 'sub-problem',
                question: 'Primary Sub-Problem Statement',
                description: 'Rumusan sub-masalah pendukung (boleh lebih dari satu).',
                answer: '1) Keterbatasan kapasitas auditor manusia untuk memvalidasi ribuan baris item draf RAPBD terhadap ribuan dokumen Perda Standar Harga Regional. \n2) Sulitnya akses langsung ke data riil transaksi historis pengadaan di daerah terdekat (asimetri data). \n3) Rapuhnya audit trail reviu anggaran yang sering diubah sepihak tanpa rekam jejak tepercaya.',
                icon: Layers,
                badge: 'Multi-Aspek'
            },
            {
                id: 'validation',
                question: 'Problem Validation',
                description: 'Masalah inti yang diselesaikan beserta akar masalahnya.',
                answer: 'Akar masalahnya adalah asimetri informasi dan inefisiensi reviu manual. Menurut temuan BPK, 70% kebocoran anggaran daerah bersumber dari ketidaksesuaian harga satuan draf anggaran dengan harga pasar riil, diperparah dengan kolusi dinas internal karena reviu internal inspektorat daerah tidak memiliki audit trail yang objektif dan immutable.',
                icon: HelpCircle,
                badge: 'BPK Validated'
            },
            {
                id: 'mapping',
                question: 'Problem–Solution Mapping',
                description: 'Hubungan eksplisit antara problem -> mekanisme solusi -> outcome.',
                answer: '• Problem: Markup harga & reviu regulasi manual lambat. \n• Mekanisme: Cognitive Swarm (Auditor + Compliance Agent) membaca draf RAPBD -> query harga pasar wajar dari Nemesis DB & regulasi dari RAG OpenViking -> Manager Agent mengambil konsensus audit otonom. \n• Outcome: Evaluasi ribuan baris APBD selesai dalam <1 menit dengan akurasi markup >98%, menghemat hingga miliaran rupiah per dokumen pengadaan.',
                icon: Zap,
                badge: '98% Accuracy'
            },
            {
                id: 'eco-alignment',
                question: 'Ecosystem Alignment',
                description: 'Interaksi solusi dengan stakeholder dan kepatuhan regulasi.',
                answer: 'Elysian berinteraksi dengan: 1) Inspektorat Daerah sebagai verifikator utama, 2) Kepala OPD/Dinas untuk validasi akuntabilitas hukum sebelum tanda tangan, 3) BPK/BPKP untuk audit provenance check yang tak terubah di blockchain. Sistem mematuhi UU No. 17 Tahun 2003 tentang Keuangan Negara dan Perda Standar Harga Regional daerah masing-masing.',
                icon: Users,
                badge: 'GovTech Ready'
            }
        ],
        architecture: [
            {
                id: 'sol-approach',
                question: 'Solution Approach & Mechanism',
                description: 'Jelaskan bagaimana solusi bekerja secara end-to-end.',
                answer: 'Pengguna mengunggah dokumen draf RAPBD (PDF/Excel) -> OpenViking Rust mengekstrak teks ke MongoDB Staging -> MiroFish Cognitive Swarm (Auditor Agent membandingkan harga pasar wajar via Nemesis DB, Compliance Agent mengidentifikasi pasal hukum via RAG Qdrant) berdebat untuk mengambil konsensus -> Manager Agent memutuskan status FLAGGED/CLEARED -> Hasil di-hash dan dikirim ke Go Backend -> Go Backend meng-commit hash tersebut ke Smart Contract Sepolia EVM Blockchain menggunakan transaksi tipe EIP-1559 -> Dashboard Next.js menyiarkan data secara real-time melalui Server-Sent Events (SSE).',
                icon: Cpu,
                badge: 'End-to-End'
            },
            {
                id: 'sys-arch',
                question: 'System Architecture',
                description: 'Desain arsitektur solusi secara sistemik.',
                answer: 'Elysian Rebirth v3.0 dirancang menggunakan arsitektur Split DB & Multi-Repo:\n• Next.js BFF Proxy: Menjamin keamanan JWT dalam HTTP-Only Cookie.\n• Go Backend (Gin): Clean Architecture, orkestrator workflow, penanggung jawab blockchain committer.\n• PostgreSQL 1: Menyimpan data IAM, Tenant, Workflow operasional.\n• MongoDB: Staging dokumen mentah dan audit logs.\n• Redis: Message Queue (Asynq) & Pub/Sub untuk event-driven SSE.\n• Python Swarm (FastAPI + MiniMax AI): Mesin perdebatan multi-agent kaku (Caveman Prompt JSON-only).\n• PostgreSQL 2 (Nemesis DB): Read-only Ground Truth SIRUP Nasional (4GB+).\n• Qdrant DB (OpenViking RAG): Penyimpan representasi vektor regulasi daerah.\n• Sepolia EVM: Blockchain Trust Layer untuk pencatatan audit trail immutable.',
                icon: Layers,
                badge: 'Lean & Clean'
            },
            {
                id: 'data-feasibility',
                question: 'Data & Feasibility',
                description: 'Data yang digunakan beserta sumber datanya.',
                answer: 'Elysian menggunakan database Nemesis yang berisi 1 juta lebih data riil Sistem Informasi Rencana Umum Pengadaan (SIRUP) nasional Indonesia sebagai patokan kebenaran dasar (Ground Truth) harga wajar barang/jasa pemerintah daerah. Dilengkapi dengan bank data PDF Perda Standar Harga Regional (SHR) daerah yang diunggah dinas terkait.',
                icon: Database,
                badge: '4GB+ SIRUP Data'
            },
            {
                id: 'security-compliance',
                question: 'Security & Compliance',
                description: 'Cara menangani keamanan data dan kepatuhan hukum.',
                answer: '• Keamanan Autentikasi: Enkripsi password menggunakan Argon2id (bukan bcrypt) untuk kecepatan verifikasi instan (<50ms) dan ketahanan brute-force. JWT disimpan strictly dalam HTTP-Only Cookie melalui Next.js BFF.\n• Privasi LLM: Dilengkapi dengan Payload Interceptor (Auto-Redaction PII) untuk mendeteksi dan menyensor otomatis data sensitif (nama, NIP, kontak) sebelum data dikirim ke LLM.\n• Kepatuhan: Audit trail dicatat di blockchain Sepolia EVM sebagai pembuktian tak terbantahkan (*provenance check*) yang sesuai standar kepatuhan BPK.',
                icon: Shield,
                badge: 'Argon2id & PII Redact'
            },
            {
                id: 'method-innovation',
                question: 'Technological / Method Innovation',
                description: 'Pendekatan teknis atau metodologi unik yang digunakan.',
                answer: '• Cognitive Swarm Debate: Berbeda dari RAG statis biasa, Elysian menggunakan simulasi debat swarm multi-agent otonom (Auditor vs Compliance) untuk menjamin objektivitas keputusan.\n• Split Database Architecture: Memisahkan database transaksi operasional (PostgreSQL 1) dengan database kebenaran dasar SIRUP 4GB+ (PostgreSQL 2) untuk menjaga kecepatan kueri backend tetap kencang dan hemat sumber daya.',
                icon: Zap,
                badge: 'Swarm Intelligence'
            },
            {
                id: 'originality',
                question: 'Solution Originality',
                description: 'Hal baru dari solusi dibandingkan alternatif yang sudah ada.',
                answer: 'Solusi yang ada saat ini hanya berupa sistem pelaporan manual (whistleblowing) pasca-kejadian. Elysian adalah pionir platform Pre-Audit otonom di Indonesia yang mendeteksi markup secara proaktif sebelum anggaran disetujui, menggunakan kecerdasan swarm agen dan pencatatan rantai blok terdesentralisasi (Sepolia EVM) yang memvalidasi keaslian laporan audit.',
                icon: Award,
                badge: 'Pionir Pre-Audit'
            }
        ],
        impact: [
            {
                id: 'impact-scale',
                question: 'Impact Scale & Targets',
                description: 'Dampak utama solusi beserta skala dampaknya.',
                answer: 'Skala dampak nasional meliputi 548 Pemerintah Daerah (Provinsi, Kabupaten, Kota) di Indonesia. Penggunaan Elysian ditargetkan dapat menekan kebocoran anggaran APBD akibat markup hingga 15-20% per daerah, menghemat triliunan rupiah uang negara yang dapat dialokasikan untuk pembangunan infrastruktur publik penting.',
                icon: BarChart3,
                badge: 'Triliun Rupiah APBD'
            },
            {
                id: 'impact-measurement',
                question: 'Impact Measurement',
                description: 'Cara mengukur keberhasilan solusi secara kuantitatif.',
                answer: '• Total Cost Savings (Rupiah): Jumlah total uang negara yang berhasil diselamatkan (selisih antara harga anggaran yang diajukan dengan harga maksimal wajar Nemesis DB).\n• Audit Processing Speed (Waktu): Mempercepat waktu reviu anggaran per dokumen dari 14 hari kerja menjadi di bawah 1 menit (efisiensi kecepatan >10.000x).\n• False Positive Rate: Tingkat kesalahan deteksi anomali di bawah 2% melalui filter QA Gate MongoDB.',
                icon: BarChart3,
                badge: 'Metrik Kuantitatif'
            },
            {
                id: 'val-prop',
                question: 'Value Proposition (User)',
                description: 'Nilai utama yang diterima langsung oleh target pengguna.',
                answer: '• Bagi Auditor Inspektorat: Beban kerja manual memvalidasi ribuan baris item berkurang drastis; terhindar dari human error dan tekanan intimidasi politik internal dinas.\n• Bagi Kepala Daerah/OPD: Perlindungan hukum dan jaminan kebersihan anggaran (akuntabilitas hukum) sebelum membubuhkan tanda tangan pengesahan RAPBD.',
                icon: CheckCircle2,
                badge: 'Bebas Korupsi'
            },
            {
                id: 'public-value',
                question: 'System & Public Value Proposition',
                description: 'Nilai solusi terhadap sistem kemasyarakatan yang lebih luas.',
                answer: 'Membantu mewujudkan tata kelola pemerintahan yang bersih dan transparan (Good Governance), memulihkan kepercayaan masyarakat Indonesia terhadap pengelolaan pajak daerah, serta memastikan setiap rupiah anggaran daerah benar-benar digunakan untuk kemakmuran rakyat, bukan untuk memperkaya oknum.',
                icon: Users,
                badge: 'Good Governance'
            },
            {
                id: 'mvp-readiness',
                question: 'Implementation Readiness (MVP)',
                description: 'Scope MVP dan target pembangunannya saat ini.',
                answer: 'MVP Elysian Rebirth v3.0 telah selesai dibangun 100% dan berfungsi penuh di lingkungan lokal & staging: \n1) Sistem Autentikasi Super Cepat (Argon2id) & BFF Cookies.\n2) Dashboard Analitik Heatmap Kerawanan Markup Daerah.\n3) Smart Document Editor (Tiptap) terintegrasi Instant Guardrails & PII Redactor.\n4) Swarm Group Chat Debate (SSE Live Streaming).\n5) Modul Blockchain Audit Trail untuk commit/verify log di Sepolia Testnet.',
                icon: Shield,
                badge: 'MVP 100% Berfungsi'
            }
        ],
        business: [
            {
                id: 'revenue-model',
                question: 'Model Revenue / Funding',
                description: 'Cara solusi menghasilkan revenue atau pendanaan.',
                answer: '• SaaS Berlangganan Pemerintah Daerah: Paket berjenjang (Free untuk dinas kecil, Pro untuk kota/kabupaten, Enterprise untuk provinsi/pusat).\n• Pendanaan Kemitraan Strategis: Hibah inovasi dari Kementerian Keuangan, Bank Indonesia, atau lembaga donor internasional (World Bank/ADB) yang fokus pada program anti-korupsi dan digitalisasi pemerintahan (GovTech).',
                icon: TrendingUp,
                badge: 'SaaS & Hibah Gov'
            },
            {
                id: 'cost-structure',
                question: 'Cost Structure & Sustainability',
                description: 'Komponen biaya utama dan keberlanjutan finansial.',
                answer: '• Biaya Utama: Infrastruktur serverless PostgreSQL & MongoDB, kueri database vektor Qdrant, API Call LLM MiniMax AI, dan gas fee transaksi blockchain Sepolia EVM.\n• Keberlanjutan Finansial: Struktur DB Split memangkas biaya kueri SQL. Cache Redis untuk kueri Standar Harga mengurangi beban API call, menjamin keberlanjutan operasional dengan margin keuntungan sehat.',
                icon: Layers,
                badge: 'Finansial Berkelanjutan'
            },
            {
                id: 'scalability',
                question: 'Scalability',
                description: 'Bagaimana solusi dapat berkembang ke skala yang lebih besar.',
                answer: '• Skalabilitas Horizontal Swarm: Mesin Swarm Worker Python dirancang stateless dan dapat dijalankan di dalam kontainer terisolasi (Docker/Kubernetes) untuk mengimbangi lonjakan dokumen RAPBD saat musim perencanaan anggaran daerah.\n• Skalabilitas Data: Database Nemesis riil dapat didistribusikan menggunakan kluster replikasi read-only PostgreSQL untuk menangani ribuan kueri harga secara bersamaan.',
                icon: Layers,
                badge: 'Kubernetes Ready'
            },
            {
                id: 'partnership',
                question: 'Partnership & Distribution',
                description: 'Strategi distribusi dan peran mitra Anda.',
                answer: 'Elysian menerapkan strategi distribusi B2G (Business-to-Government) melalui kemitraan strategis dengan BPKP (Badan Pengawasan Keuangan dan Pembangunan), LKPP (Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah), dan KPK untuk mendorong penerapan platform secara langsung di dinas-dinas inspektorat daerah di seluruh Indonesia.',
                icon: Users,
                badge: 'Kemitraan B2G'
            },
            {
                id: 'market-fit',
                question: 'Problem–Market Fit',
                description: 'Mengapa masalah ini mendesak bagi target pengguna saat ini.',
                answer: 'Pemerintah Indonesia sedang gencar menegakkan Sistem Pemerintahan Berbasis Elektronik (SPBE) berdasarkan Perpres No. 95/2018. Ditambah dengan fokus KPK yang semakin ketat dalam mengawasi celah korupsi pada tahap perencanaan anggaran daerah, menjadikan platform audit otonom seperti Elysian sangat krusial dan mendesak bagi pemerintah daerah.',
                icon: Award,
                badge: 'Sesuai SPBE & KPK'
            },
            {
                id: 'demand-evidence',
                question: 'Evidence of Demand',
                description: 'Bukti bahwa solusi ini dibutuhkan (Survey, interview, dsb).',
                answer: 'Berdasarkan data BPK tahun 2025, ditemukan ribuan kasus ketidakpatuhan anggaran daerah senilai triliunan rupiah. Hasil wawancara langsung dengan praktisi auditor Inspektorat Daerah mengungkapkan bahwa mereka merasa sangat terbebani dengan dokumen RAPBD tebal yang harus dicocokkan satu per satu secara manual dengan SHR di tengah tenggat waktu yang sangat sempit.',
                icon: BarChart3,
                badge: 'Auditor Demanded'
            },
            {
                id: 'target-market',
                question: 'Target Market',
                description: 'Target market utama secara spesifik.',
                answer: 'Target market utama adalah **Inspektorat Daerah Provinsi/Kabupaten/Kota di seluruh Indonesia** (total 548 entitas daerah), khususnya dinas yang bertanggung jawab atas reviu rencana anggaran daerah serta Diskominfo sebagai pelaksana teknis SPBE.',
                icon: Users,
                badge: '548 Pemda Target'
            },
            {
                id: 'creativity',
                question: 'Creativity in Implementation',
                description: 'Kreativitas dalam distribusi, monetisasi, atau user engagement.',
                answer: '• Swarm Group Chat Debate Interface: Menyajikan analisis audit yang rumit dan kaku menjadi perdebatan interaktif multi-agent yang sangat mudah dibaca auditor layaknya membaca grup chat WhatsApp.\n• Blockchain Audit Trail Verification Link: Juri hackathon, BPK, maupun masyarakat umum dapat memverifikasi keabsahan laporan audit secara langsung ke blockchain Sepolia EVM hanya dengan satu klik dari dashboard (transparansi publik radikal).',
                icon: Sparkles,
                badge: 'Transparansi Radikal'
            }
        ]
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20 relative z-20">
            {/* Ambient Lighting background */}
            <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Hackathon Portal Gate
                </motion.div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight font-heading">
                    Elysian Rebirth v3.0 <br />
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        25 Hackathon Blueprint Answers
                    </span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
                    Kami memetakan 25 kriteria penilaian hackathon tingkat korporat secara interaktif. Juri dan pengguna dapat membedah visi, arsitektur teknis split-DB, dampak sosial, dan keberlanjutan bisnis Elysian di bawah ini.
                </p>
            </div>

            {/* TAB CONTAINER */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 relative z-30">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                setExpandedItem(null);
                            }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold tracking-wide transition-all shadow-sm cursor-pointer border ${
                                isActive 
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-lg shadow-blue-500/20' 
                                    : 'bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-blue-950/45 hover:border-slate-350 dark:hover:border-slate-800'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* BLUEPRINT GRID CONTENT */}
            <div className="relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="grid md:grid-cols-2 gap-6 relative z-30"
                    >
                        {blueprintData[activeTab].map((item) => {
                            const Icon = item.icon;
                            const isExpanded = expandedItem === item.id;
                            return (
                                <motion.div
                                    key={item.id}
                                    layout="position"
                                    className={`relative rounded-3xl p-6 transition-all duration-300 border bg-white/70 dark:bg-[#070e1c]/80 backdrop-blur-xl hover:shadow-xl ${
                                        isExpanded 
                                            ? 'border-blue-500 dark:border-blue-600 shadow-blue-500/5 dark:shadow-blue-900/5 md:col-span-2' 
                                            : 'border-slate-200/65 dark:border-blue-950/40 hover:border-blue-400/50 dark:hover:border-blue-800/50'
                                    }`}
                                >
                                    {/* Accent border strip on expanded */}
                                    {isExpanded && (
                                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-md" />
                                    )}

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-50 font-heading">
                                                        {item.question}
                                                    </h3>
                                                    {item.badge && (
                                                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/10 uppercase tracking-wider">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded / Collapsed Answer Box */}
                                    <div className="mt-4">
                                        <p className={`text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium whitespace-pre-line ${
                                            isExpanded ? '' : 'line-clamp-2'
                                        }`}>
                                            {item.answer}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-blue-950/20 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                            Kriteria Juri #{item.id}
                                        </span>
                                        <button
                                            onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                                        >
                                            {isExpanded ? 'Tutup Rincian' : 'Baca Jawaban Lengkap'}
                                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
