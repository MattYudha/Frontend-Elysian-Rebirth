// Centralized Demo Mock Data for Elysian Rebirth v3.0 (Pre-Audit Budget Markup Detection)

export interface DemoMarkupItem {
    id: string;
    title: string;
    department: string;
    proposedPrice: number;
    standardPrice: number;
    markupPercentage: number;
    status: 'FLAGGED' | 'RESOLVED' | 'UNDER_REVIEW';
    auditorConclusion: string;
    complianceJustification: string;
    managerVerdict: string;
    txHash?: string;
    timestamp: string;
}

export interface DemoPipelineNode {
    id: string;
    name: string;
    type: string;
    status: 'completed' | 'processing' | 'pending';
    durationMs: number;
}

export const DEMO_MARKUP_ITEMS: DemoMarkupItem[] = [
    {
        id: 'MARKUP-2026-001',
        title: 'Pengadaan Server Workstation SIMDA & Storage Array (12 Unit)',
        department: 'Dinas Komunikasi & Informatika',
        proposedPrice: 145000000,
        standardPrice: 62000000,
        markupPercentage: 133.8,
        status: 'FLAGGED',
        auditorConclusion: 'Berdasarkan data Nemesis SIRUP LKPP & SHR 2026, unit price workstation sejenis berada di rentang Rp 60-65jt. Ditemukan indikasi penggelembungan anggaran sebesar 133.8%.',
        complianceJustification: 'Melanggar Perpres No. 12 Tahun 2021 Pasal 51 ayat 2 tentang Efisiensi Pengadaan Finansial Daerah.',
        managerVerdict: 'Ditolak untuk pengesahan RAPBD. Wajib dilakukan revisi HPS sesuai HSBGN/SHR Pemda.',
        txHash: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
        timestamp: '2026-07-26 10:15:32',
    },
    {
        id: 'MARKUP-2026-002',
        title: 'Lisensi Perangkat Lunak Database Enterprise & Analytics (3 Year)',
        department: 'Badan Pengelolaan Keuangan & Aset Daerah (BPKAD)',
        proposedPrice: 890000000,
        standardPrice: 420000000,
        markupPercentage: 111.9,
        status: 'FLAGGED',
        auditorConclusion: 'Selisih harga usulan vs kontrak e-Katalog LKPP mencapai Rp 470.000.000. Komponen pemeliharaan di-markup di atas wajar.',
        complianceJustification: 'Permendagri No. 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah.',
        managerVerdict: 'Di-flag untuk audit investigatif Inspektorat Daerah sebelum masuk RUA-RAPBD.',
        txHash: '0x1e948c271b0593f48a12059a4c912048f02931a50b4c81092e48275c91823901',
        timestamp: '2026-07-26 11:02:14',
    },
    {
        id: 'MARKUP-2026-003',
        title: 'Pengadaan Laptop Operational Inspektorat (25 Unit Core i7)',
        department: 'Inspektorat Daerah',
        proposedPrice: 28500000,
        standardPrice: 17500000,
        markupPercentage: 62.8,
        status: 'RESOLVED',
        auditorConclusion: 'Harga satuan telah disesuaikan dari Rp 28,5jt menjadi Rp 17,5jt mengacu pada e-Katalog resmi V5.',
        complianceJustification: 'Sesuai SHR Pemda 2026 Sub-Kategori Peralatan Kantor Komputerisasi.',
        managerVerdict: 'Disetujui setelah penyesuaian HPS. Total penghematan: Rp 275.000.000.',
        txHash: '0x3f1920491a82740b19284c719e029471b0293847c50192847d918274a5019284',
        timestamp: '2026-07-26 09:45:00',
    },
    {
        id: 'MARKUP-2026-004',
        title: 'Bahan Konstruksi Aspal Hotmix Jalan Kabupaten (15 KM)',
        department: 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)',
        proposedPrice: 4200000000,
        standardPrice: 3850000000,
        markupPercentage: 9.1,
        status: 'UNDER_REVIEW',
        auditorConclusion: 'Variansi harga dalam batas wajar fluktuasi bahan baku (9.1%). Memerlukan klarifikasi spesifikasi teknis.',
        complianceJustification: 'SNI 03-2847-2019 Standar Mutu Beton & Aspal Jalan Raya.',
        managerVerdict: 'Menunggu konfirmasi Pejabat Pembuat Komitmen (PPK) PUPR.',
        txHash: '0x7a2948019b48275c0192847c918204918274a50192847c918274a50192847102',
        timestamp: '2026-07-26 12:30:19',
    }
];

export const DEMO_SWARM_DEBATE_LOGS = [
    {
        agent: 'Auditor Agent (Analis Matematika)',
        role: 'AUDITOR',
        status: 'MARKUP_DETECTED',
        text: 'Membandingkan item RAPBD "Server Workstation SIMDA 12 Unit" (usulan Rp 145jt/unit) dengan data Nemesis Ground Truth (SIRUP LKPP ID #849201). Ditemukan markup harga sebesar +133.8% dari standar harga pasar (Rp 62jt/unit).',
        timestamp: '13:28:01'
    },
    {
        agent: 'Compliance Agent (Pengawas Hukum)',
        role: 'COMPLIANCE',
        status: 'LEGAL_FLAG',
        text: 'Mengueri OpenViking RAG DB untuk Perda SHR 2026 & Perpres No. 12 Tahun 2021. Penggelembungan harga tanpa HPS pembanding melanggar Kepatuhan Pengadaan Keuangan Daerah.',
        timestamp: '13:28:03'
    },
    {
        agent: 'Manager Agent (Consensus Engine)',
        role: 'MANAGER',
        status: 'CONSENSUS_REACHED',
        text: 'KONSENSUS DICAPAI: Status = FLAGGED (MARKUP DETECTED). Mengirimkan hash SHA-256 (0x8f3c71a9...) ke Smart Contract Sepolia EVM untuk audit trail anti-manipulasi.',
        timestamp: '13:28:05'
    }
];

export const DEMO_CHAT_RESPONSES: Record<string, string> = {
    default: `Saya adalah **Elysian AI Financial Auditor**. Berdasarkan analisis data **Nemesis Ground Truth (SIRUP LKPP 4GB+)** dan **OpenViking RAG**, draf RAPBD yang dikaji memiliki 14 indikasi anomali markup anggaran dengan total potensi penghematan sebesar **Rp 4.250.000.000**. 

Beberapa item paling kritis meliputi:
1. **Pengadaan Server SIMDA Diskominfo**: Markup +133.8% (Selisih Rp 996 Juta).
2. **Lisensi DB BPKAD**: Markup +111.9% (Selisih Rp 470 Juta).

Ada yang ingin Anda klarifikasi atau verifikasi ke blockchain Sepolia EVM?`,
    markup: `Analisis deteksi markup untuk **Draf RAPBD Dinas PUPR & Diskominfo**:
- Total HPS Diusulkan: **Rp 12.4 Miliar**
- Standar Harga Regional (SHR 2026): **Rp 8.15 Miliar**
- **Potensi Penghematan:** **Rp 4.25 Miliar** (34.2% Efisiensi).

Seluruh temuan ini telah dikunci pada Sepolia EVM Smart Contract (Tx: \`0x8f3c71a9...\`) sehingga keputusan verifikasi tidak dapat dimanipulasi.`,
};
