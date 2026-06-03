import type { TranslationKeys } from './en';

export const translationsID: TranslationKeys = {
    common: {
        loading: 'Memuat...',
        save: 'Simpan',
        cancel: 'Batal',
        delete: 'Hapus',
        edit: 'Edit',
        close: 'Tutup',
        search: 'Cari',
        filter: 'Filter',
        export: 'Ekspor',
        import: 'Impor',
    },
    nav: {
        dashboard: 'Dasbor',
        chat: 'Obrolan',
        knowledge: 'Basis Pengetahuan',
        editor: 'Editor Dokumen',
        settings: 'Pengaturan',
        logout: 'Keluar',
        product: 'Produk',
        solutions: 'Solusi',
        enterprise: 'Perusahaan',
        pricing: 'Harga',
        login: 'Masuk',
        getStarted: 'Mulai Gratis',
        toggleTerminal: 'Ganti Terminal',
        toggleTheme: 'Ganti Tema',
    },
    auth: {
        loginTitle: 'Masuk',
        loginSubtitle: 'Masuk untuk melanjutkan',
        email: 'Email',
        password: 'Kata Sandi',
        login: 'Masuk',
        logout: 'Keluar',
        demoHint: 'Demo: Gunakan email/kata sandi apa saja untuk masuk',
        loginSuccess: 'Login berhasil!',
        loginFailed: 'Login gagal. Silakan coba lagi.',
        accessDenied: 'Akses Ditolak',
        noPermission: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    },
    dashboard: {
        title: 'Pusat Kontrol AI',
        subtitle: 'Dashboard Operasional',
        breadcrumb: 'Dasbor',
        heading: 'Dasbor',
        description: 'Monitor penggunaan token dan status pipeline.',
        documents: 'Dokumen',
        apiCalls: 'Token LLM',
        errorRate: 'Tingkat Error',
        knowledgeHealth: 'Kesehatan Pengetahuan',
        activePipelines: 'Pipeline Aktif',
        vectorIndexSync: 'Sinkronisasi Indeks Vektor',
        docsIndexed: 'Dokumen Terindeks',
        success: 'Berhasil',
        fromLastMonth: 'dari bulan lalu',
        fromLastWeek: 'dari minggu lalu',
        withinLimits: 'Dalam batas',
        solidPerformance: 'Performa solid',
    },
    chat: {
        title: 'Obrolan AI',
        subtitle: 'Percakapan dengan Asisten AI',
        placeholder: 'Ketik pesan Anda...',
        send: 'Kirim',
    },
    knowledge: {
        title: 'Basis Pengetahuan',
        subtitle: 'Konfigurasi & Manajemen RAG',
        chunkingStrategy: 'Strategi Chunking',
        chunkSize: 'Ukuran Chunk',
        overlap: 'Overlap',
        embeddingModel: 'Model Embedding',
        sources: 'Sumber Pengetahuan',
        searchPlayground: 'Playground Pencarian',
        uploadDocument: 'Unggah Dokumen',
    },
    editor: {
        title: 'Editor Dokumen',
        subtitle: 'Pengeditan Human-in-the-Loop',
        save: 'Simpan',
        export: 'Ekspor',
        aiActions: 'Aksi AI',
        rewrite: 'Tulis Ulang',
        summarize: 'Ringkas',
        translate: 'Terjemahkan',
    },
    settings: {
        title: 'Pengaturan',
        subtitle: 'Konfigurasi Aplikasi',
        appearance: 'Tampilan',
        darkMode: 'Mode Gelap',
        language: 'Bahasa',
        languageRegion: 'Bahasa & Wilayah',
        features: 'Fitur',
        advancedMode: 'Mode Lanjutan',
        telemetry: 'Aktifkan Telemetri',
        saveSettings: 'Simpan Pengaturan',
    },
    landingNav: {
        products: {
            title: 'Products',
        },
        documentations: {
            title: 'Documentations',
        },
        pricing: {
            title: 'Pricing',
        },
        usecases: {
            title: 'Usecases',
        },
        resources: {
            title: 'Resources',
        },
        actions: {
            startFree: 'Mulai Audit',
            search: 'Cari',
            microCopy: 'Audit otomatis dalam hitungan detik.'
        }
    },
    landing: {
        hero: {
            badge: 'Infrastruktur Audit Finansial Otonom',
            title1: 'Transformasi Pre-Audit',
            title2: 'RAPBD Pemda.',
            description: 'Sistem Multi-Agent Swarm Intelligence untuk mendeteksi dan mencegah markup anggaran secara otomatis dengan perlindungan Immutable Audit Trail.',
            ctaStart: 'Mulai Audit Sekarang',
            ctaDemo: 'Lihat Cara Kerjanya',
            proof: 'Dibangun untuk Pemerintah Daerah & Inspektorat',
        },
        marquee: ['Inspektorat Daerah', 'BPK', 'BPKP', 'KPK', 'Kepala Dinas', 'Pemerintah Provinsi', 'Pemerintah Kota', 'LKPP'],
        showcase: {
            badge: 'Power of Elysian v3.0',
            title1: 'Satu Infrastruktur.',
            title2: 'Tiga Kekuatan Utama.',
            description: 'Menggabungkan kecerdasan Swarm AI, basis fakta RAG, dan keamanan Blockchain dalam satu ekosistem otonom.',
            cards: {
                dev: { title: 'Cognitive Swarm Engine', desc: 'MiroFish dengan 3 Agen AI yang saling berdebat untuk mencapai konsensus audit yang objektif.' },
                docs: { title: 'Ground Truth & RAG', desc: 'OpenViking & Nemesis DB mengamankan fakta riil dari data SIRUP dan Perda tanpa kompromi.' },
                insights: { title: 'Immutable Trust Layer', desc: 'Rekam jejak keputusan agen dikunci secara permanen di Public EVM Testnet (Sepolia/Amoy).' }
            }
        },
        deepDive: {
            badge: 'Deep Dive',
            title1: 'Otomatisasi Audit',
            title2: 'Tanpa Bias Manusia.',
            description: 'Elysian meniadakan pengecekan manual yang rawan kesalahan dalam proses review anggaran.',
            cards: {
                cycles: { title: 'Verifikasi Harga Otomatis', desc: 'Bandingkan usulan anggaran dengan data historis pengadaan di SIRUP dalam hitungan detik.' },
                inbox: { title: 'Uji Kepatuhan Regulasi', desc: 'Deteksi pelanggaran aturan pengadaan menggunakan RAG berkinerja tinggi.' },
                insights: { title: 'Blockchain Provenance', desc: 'Pastikan laporan hasil audit tidak dapat dimanipulasi dengan jejak kriptografis on-chain.', action: 'Lihat Bukti On-Chain' }
            }
        },
        integration: {
            badge: 'Ecosystem',
            title1: 'Terhubung dengan',
            title2: 'Arsitektur Enterprise.',
            description: 'Elysian Rebirth v3.0 dirancang terintegrasi dengan ekosistem data pemerintah dan infrastruktur modern.',
            hint: 'Geser untuk melihat ekosistem',
            items: {
                slack: { title: 'SIRUP LKPP', desc: 'Akses data historis pengadaan riil (Nemesis DB) sebagai basis kebenaran harga.' },
                figma: { title: 'SIPD Kemendagri', desc: 'Penyesuaian standar pengelolaan keuangan daerah yang terintegrasi.' },
                github: { title: 'Qdrant Vector DB', desc: 'Mesin pencarian semantik ultracepat untuk menelusuri ratusan halaman Perda.' },
                drive: { title: 'MongoDB QA Gate', desc: 'Lapisan penyaringan data untuk memastikan hanya fakta valid yang dipelajari AI.' },
                notion: { title: 'Sepolia Testnet', desc: 'Menyimpan segel persetujuan hash secara immutable di jaringan publik EVM.' },
                postgres: { title: 'PostgreSQL IAM', desc: 'Manajemen otentikasi dan kontrol akses berbasis peran (RBAC) yang solid.' },
                gmail: { title: 'Redis Pub/Sub', desc: 'Streaming log perdebatan antar agen AI secara real-time tanpa jeda.' },
                cta: 'Pelajari Arsitektur Kami'
            }
        },
        agents: {
            badge: 'Cognitive Swarm Intelligence',
            title1: 'Serahkan Analisis ke',
            title2: 'Spesialis AI Agent Kami.',
            description: 'MiroFish menggunakan pendekatan Multi-Agent di mana setiap bot memiliki perannya masing-masing dalam membongkar RAPBD.',
            demo: {
                assign: 'Proses Audit...',
                processing: 'Menganalisis anomali...',
                available: '3 Agen Siap Bekerja'
            },
            items: {
                analyst: { name: 'Auditor Agent', role: 'Deteksi Markup Harga' },
                editor: { name: 'Compliance Agent', role: 'Pengawas Regulasi Hukum' },
                compliance: { name: 'Manager Agent', role: 'Konsensus Keputusan (Manager)' },
                coder: { name: 'Blockchain Committer', role: 'Segel Audit Immutable' }
            }
        },
        terminal: {
            logs: {
                system: 'Memulai Elysian Rebirth v3.0... (Swarm Engine | Nemesis DB | Trust Layer)',
                scan: 'Menghubungkan ke PostgreSQL IAM dan Sepolia Testnet...',
                ready: 'MiroFish Swarm siap menerima dokumen RAPBD.',
                success: 'Sistem Terhubung. Menunggu unggahan draf anggaran.',
                compliance: 'Audit Trail On-Chain Active ✓ OpenViking Sync ✓ MongoDB QA Gate Online',
                operational: 'Semua lapisan arsitektur operasional.',
                welcome: 'Selamat datang di Konsol Infrastruktur Audit Otonom.',
                help: 'Ketik "help" untuk panduan, atau klik ikon terminal untuk mode visual.'
            }
        },
        problem: {
            title1: 'Mengapa Markup Anggaran',
            title2: 'Sulit Dideteksi?',
            description: 'Proses reviu manual oleh auditor Inspektorat memakan waktu lama, rentan human error, dan seringkali tidak memiliki referensi data historis yang memadai secara instan.',
            items: [
                'Verifikasi manual ribuan item anggaran sangat lambat',
                'Ketiadaan data pembanding pengadaan yang real-time',
                'Standar Harga Regional (SHR) tersebar di dokumen PDF tebal',
                'Rekam jejak persetujuan (audit trail) rapuh dan bisa diubah'
            ],
            solutionTitle: 'Inovasi Elysian',
            solutionItems: [
                { title: 'Swarm Intelligence', desc: 'Agen AI saling berdebat untuk keputusan objektif' },
                { title: 'Ground Truth Database', desc: 'Menarik referensi harga asli (SIRUP) tanpa manipulasi LLM' },
                { title: 'Immutable Audit Log', desc: 'Jejak keputusan agen disematkan permanen di Blockchain' }
            ],
            cta: 'Transformasi Proses Audit'
        },
        features: {
            title: 'Mendefinisikan Ulang Standar Audit',
            subtitle: 'Teknologi all-in-one untuk tata kelola pemerintahan yang bersih',
            items: {
                ai: { title: 'MiroFish Engine', desc: 'Konsensus otomatis antar agen AI' },
                docs: { title: 'OpenViking RAG', desc: 'Ekstraksi presisi tinggi untuk Perda & SHR' },
                security: { title: 'Trust Layer', desc: 'Pencatatan on-chain di Sepolia' },
                automation: { title: 'Caveman Prompt', desc: 'Output JSON tanpa halusinasi LLM' }
            }
        },
        useCases: {
            title: 'Dibangun Untuk Semua Pemangku Kepentingan',
            subtitle: 'Dari pengawas internal hingga masyarakat, semua mendapatkan transparansi.',
            items: {
                retail: { title: 'Inspektorat Daerah', items: ['Reviu RAPBD instan', 'Deteksi markup', 'Referensi harga otomatis'] },
                logistics: { title: 'Kepala Dinas / OPD', items: ['Pengecekan draf sebelum ttd', 'Jaminan kepatuhan', 'Mitigasi risiko'] },
                agency: { title: 'BPK & BPKP', items: ['Akses audit trail on-chain', 'Data pembanding akurat', 'Investigasi mendalam'] },
                clinic: { title: 'Masyarakat & Jurnalis', items: ['Transparansi anggaran', 'Lacak jejak keputusan', 'Akuntabilitas publik'] }
            }
        },
        cta: {
            badge: 'Wujudkan Pemerintahan Bersih',
            title1: 'Siap Hentikan Pemborosan',
            title2: 'Anggaran Daerah?',
            description: 'Ubah proses pengecekan yang pasif menjadi pengawasan finansial yang otonom, cerdas, dan transparan.',
            btnStart: 'Uji Coba Sistem Audit',
            btnConsult: 'Diskusi Teknis',
            foot: 'Dibuat untuk Indonesia yang Lebih Akuntabel'
        },
        collaboration: {
            badge: 'Automated Oversight',
            title1: 'Pengawasan Finansial',
            title2: 'Tanpa Kompromi.',
            description: 'Gabungan data historis pengadaan, regulasi hukum, dan agen otonom untuk memastikan tidak ada celah bagi markup.',
            cards: {
                project: {
                    title: 'Sinkronisasi Fakta',
                    desc: 'Akses 4GB+ data SIRUP dan jutaan kata dari dokumen Perda secara instan.'
                },
                updates: {
                    title: 'Log Perdebatan Real-time',
                    desc: 'Pantau secara langsung bagaimana AI Auditor dan AI Pengawas mencapai kesimpulan.'
                },
                workflow: {
                    title: 'Blockchain Integrity',
                    desc: 'Segel hasil audit dalam hitungan detik. Buktikan integritas dokumen di masa depan tanpa keraguan.',
                    cta: 'Lihat Contoh Laporan'
                }
            }
        },
        faq: {
            title: 'Pertanyaan Umum',
            subtitle: 'Pelajari lebih lanjut tentang sistem Elysian',
            q1: 'Bagaimana AI mencegah halusinasi data (Yapping)?',
            a1: 'Kami menggunakan teknik "Caveman Prompt" yang memaksa LLM mengeluarkan output JSON kaku tanpa narasi bebas, dan beroperasi di atas data fakta (Ground Truth) murni.',
            q2: 'Apa peran Blockchain di sistem ini?',
            a2: 'Blockchain (Sepolia Testnet) berfungsi sebagai Trust Layer. Setiap keputusan konsensus AI dibuatkan nilai Hash Kriptografis dan disimpan secara permanen on-chain agar tidak dapat dimodifikasi oleh siapapun (termasuk admin server).',
            q3: 'Bagaimana jika data regulasi di RAG ada yang salah?',
            a3: 'Elysian memiliki arsitektur MongoDB QA Gate. Dokumen harus melalui persetujuan (approval) manusia terlebih dahulu sebelum di-embed ke Qdrant Vector DB, mencegah "data kotor" dipelajari AI.',
            q4: 'Apakah data anggaran Pemda akan tersebar ke publik?',
            a4: 'Tidak. Kami dapat mengimplementasikan node Blockchain privat (Quorum) atau sistem on-premise sepenuhnya sesuai kebutuhan kebijakan kerahasiaan institusi Anda.'
        },
        cta_section: {
            title1: 'Langkah Awal Menuju',
            title2: 'Transparansi Maksimal',
            description: 'Mari bertransformasi dari sekadar pengecekan (checking) menjadi pengawasan otonom (autonomous oversight).',
            btn: 'Mulai Sekarang'
        },
        footer: {
            description: 'Infrastruktur Audit Finansial Otonom terdepan di Indonesia. Kami memadukan Swarm Intelligence dan Blockchain untuk memastikan transparansi, integritas, dan akuntabilitas anggaran daerah.',
            solutions: {
                title: 'Teknologi Utama',
                items: {
                    docs: 'MiroFish Swarm',
                    finance: 'OpenViking RAG',
                    inventory: 'Nemesis Ground Truth',
                    trends: 'Sepolia Trust Layer',
                    erp: 'Redis Asynchronous'
                }
            },
            support: {
                title: 'Eksplorasi',
                items: {
                    help: 'Whitepaper Arsitektur',
                    api: 'Dokumentasi Smart Contract',
                    status: 'Status Testnet',
                    community: 'Forum Pengembang',
                    sales: 'Hubungi Tim Inti'
                }
            },
            contact: {
                title: 'Kontak Kami',
                address: 'Jakarta, Indonesia'
            },
            legal: {
                copyright: '© 2026 Elysian Rebirth v3.0.',
                privacy: 'Kebijakan Privasi',
                terms: 'Syarat & Ketentuan',
                accessibility: 'Pernyataan Aksesibilitas'
            }
        },
        cookies: {
            title: 'Penggunaan Cookie',
            description: 'Kami menggunakan cookie untuk analitik operasional dasbor. Dengan melanjutkan, Anda menyetujui kebijakan cookie kami.',
            accept: 'Terima',
            decline: 'Tolak'
        }
    }
};
