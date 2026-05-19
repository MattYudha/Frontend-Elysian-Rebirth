# PROPOSAL HACKATHON BANK INDONESIA (BI)
## Elysian Rebirth: Intelligent Document Processing dengan RAG & Local-First Architecture

---

### 1. Executive Summary Project
Di era kecepatan regulasi digital, Bank Indonesia (BI) serta institusi pemerintahan daerah dituntut untuk mengelola, mengawasi, dan mereviu ribuan dokumen legal, laporan keuangan, kepatuhan (compliance), dan proposal anggaran setiap harinya. Ketergantungan pada peninjauan manual menciptakan hambatan (*bottleneck*) luar biasa yang memengaruhi rasio inklusi keuangan dan penegakan regulasi.

**Elysian Rebirth** adalah platform *Intelligent Document Processing* (IDP) generasi baru yang dirancang khusus untuk mempercepat dan mengamankan alur kerja dokumen kritis tersebut. Elysian mengusung tiga teknologi inti: **Retrieval-Augmented Generation (RAG)** untuk menyediakan konteks referensi hukum secara otomatis, **Semantic Guardrails** untuk mengunci akurasi angka/spesifikasi demi mencegah halusinasi AI, serta **Local-First Architecture** untuk memastikan *draft* dokumen 100% diproses di ruang kerja lokal pengguna (*offline-capable*). Elysian hadir bukan sekadar sebagai editor teks, melainkan *"Intelligent Workspace"* pemecah kebuntuan *Regtech* di lanskap ekonomi digital Indonesia.

---

### 2. Problem Statement yang Dipilih
**Regtech & Suptech** *(Regulatory Technology & Supervisory Technology)*

#### Sub-Problem Statement Acuan
1. Fraud Detection Systems (FDS) (Validasi silang angka anggaran & laporan keuangan)
2. Cyber Security & Data Protection (Perlindungan privasi dokumen lokal tanpa *cloud tracking* terbuka)
3. Perlindungan Konsumen & Penyelesaian Transaksi (Otomatisasi resolusi komplain konsumen berdasar *database* POJK/PBI)

---

### 3. Tujuan Utama
Membangun infrastruktur **Copilot Dokumen Kritis (IDP)** yang memungkinkan analis/auditor menyusun laporan penyelidikan, draf regulasi, atau draf persetujuan anggaran dengan target spesifik: **(1)** Menurunkan waktu *cross-checking* referensi hukum hingga 70%, **(2)** Mencapai 0% tingkat halusinasi angka AI (*zero hallucination*), dan **(3)** Menjamin pelindungan data pribadi (PII) sebelum dokumen dianalisis oleh siklus AI.

---

### 4. Analisis Masalah (Pain Points)

#### Apa Masalah Utamanya?
Proses penyusunan, audit, dan reviu dokumen finansial/regulasi saat ini mengandalkan cara usang dan parsial. Ada dua skenario masalah utama:
1. **Manual & *Context-Switching Penalty*:** Seorang pemeriksa/auditor sering menggunakan Microsoft Word di satu layar, seraya membuka puluhan file PDF tebal (Peraturan Bank Indonesia, Standar Harga Regional) di layar lain. Proses *copy-paste* dan pencarian referensi silang ini (*context-switching*) sangat menguras kognitif dan waktu.
2. **Risiko Fatal AI Generik:** Penggunaan AI publik (seperti ChatGPT / Notion AI) sangat dibatasi di industri perbankan karena 2 alasan: 
   - *Halusinasi AI:* AI cenderung mengarang referensi hukum (menciptakan fiksi pasal) dan menebak-nebak angka finansial.
   - *Ancaman Privasi (Data Leakage):* Memasukkan data investigasi ke *prompt* layanan *cloud* publik tanpa enkripsi melanggar prinsip *Data Protection/Secrecy*.

#### Siapa yang Terdampak dan Seberapa Besar?
1. **Analis, Pengawas, & Auditor (BI/OJK/Perbankan):** Menghabiskan ±15-20 jam seminggu hanya untuk administrasi reviu dokumen ketimbang investigasi lapangan.
2. **Pemerintah Daerah (Pemda) & Penyelenggara Anggaran:** Sering kecolongan *mark-up* harga karena proses sinkronisasi angka proposal terhadap "Standar Harga Regional" tidak berjalan otomatis.
3. **Masyarakat (Konsumen):** Resolusi pengaduan finansial molor lantaran tumpukan dokumen manual yang lambat dieksekusi oleh petugas.

#### Bukti Masalah
Berdasarkan laporan *Cost of Compliance* oleh Thomson Reuters, tim kepatuhan menghabiskan sepertiga hari kerjanya hanya berurusan dengan integrasi dokumen tidak terstruktur. Selain itu, dengan berlakunya UU Pelindungan Data Pribadi (PDP) di Indonesia, perbankan dilarang membagikan informasi KYC (seperti KTP atau profil sensitif) secara mentah ke API *Cloud* AI tanpa adanya intervensi penyensoran.

---

### 5. Solusi Inti & Mekanisme Kerja

#### Deskripsi Solusi
**Elysian Rebirth** menyatukan Editor Teks (Workspace) dengan Mesin AI (Vercel AI SDK) dan Pusat Pengetahuan Regulasi (Vector Database). Daripada membiarkan *user* mencari referensi sendiri, Elysian menggunakan **RAG (Retrieval-Augmented Generation)** di mana AI akan "membaca" basis data hukum institusi yang telah diunggah dan menyuntikkannya sebagai konteks (*Injection*) ke layar editor setiap kali pengguna mengetik.
Ditambah dengan sistem **Semantic Guardrails**, setiap angka atau persentase yang diketik akan selalu divalidasi dengan sumber aslinya. Jika menyimpang, UI akan memberikan *Alert*.

#### Bagaimana Solusi Bekerja? (Alur Proses)

```text
[Input Data Awal]
  1. Admin BI mengunggah PDF (Dokumen PBI/POJK/Buku Tarif).
  2. Sistem memecah teks (Chunking) & membuat Vector Embeddings.
  
[Proses Pembuatan/Audit Dokumen oleh User]
  3. Editor Input: User (Auditor) membuka Elysian Editor & mengetik atau me-paste laporan.
     V
  4. Instant Save: Draft langsung dikunci di komputer lokal (IndexedDB) => Offline Ready.
     V
  5. PII Redaction: Regex mendeteksi nama NIK/No. Rekening, lalu disensor sementara (***).
     V
  6. RAG Trigger: Teks di-scan, dikirim ke Vector DB Query (Mencari kemiripan masalah).
     V
  7. Semantic Guardrail Check: Algoritma memverifikasi apakah nominal anggaran/pasal sah.
  
[Output Final]
  8. AI men-generate perbaikan kalimat, peringatan anomali (fraud flag), dan referensi rujukan di pinggiran Editor.
  9. Laporan Final siap di-export secara compliance-ready.
```

---

### 6. Value & Dampak Solusi

#### Manfaat Utama & Dampak Jangka Pendek-Menengah
Apabila diimplementasikan dalam struktur operasi Bank Indonesia atau Pemda:
- **Jangka Pendek (1-6 bulan):** Terciptanya prototipe *sandbox* untuk spesifik *use-case*, misalnya *"Copilot Reviu Proposal Anggaran"* yang mendeteksi indikasi *mark-up* harga sebelum dicairkan.
- **Jangka Menengah (1-3 tahun):** Menghemat puluhan miliar anggaran audit institusi dengan menurunkan waktu reviu hingga 70%. Meningkatkan *trust* publik terhadap perlindungan data, karena semua PII dianonimkan lewat sistem lokal Elysian. Membantu UMKM untuk memiliki *score compliance* instan tanpa antrean analisis manusia yang panjang.

#### Apa yang Membuat Solusi Ini Berbeda? (Keunikan)
Elysian tidak memaksa AI untuk *menulis dari nol* (seperti ChatGPT), melainkan bertindak sebagai **Validator & Copilot Pasif**.
1. **Local-First Architecture:** Berbekal *IndexedDB* browser, jika koneksi *internet fiber* instansi putus, pekerjaan peninjauan teks tidak akan hilang sepeserpun.
2. **Visual Workflow Builder:** Pengguna tanpa latar *coding* bisa merangkai pipa analisis dokumennya sendiri lewat kanvas *node-based* interaktif (React Flow).

#### Posisi terhadap Solusi Serupa
- **vs Microsoft Copilot / Notion AI:** Copilot/Notion sangat generik dan mengorbankan privasi demi integrasi *cloud*. Elysian fokus pada keamanan *Enterprise*, sensor PII lokal, dan *Semantic Guardrails* matematis (Anti-Halusinasi Harga).
- **vs Traditional Audit Software:** Software konvensional terlalu kaku dan formatnya tabular (*form-based*). Elysian mengakomodasi keluwesan format dokumen berbasis narasi (Teks / Rich-Text Editor).

---

### 7. Aspek Teknologi & Arsitektur

#### Teknologi Utama yang Digunakan
1. **Frontend Core:** Next.js 14 App Router, React 18
2. **Language & Styling:** TypeScript (Strict), TailwindCSS, Shadcn/UI (Komponen Aksesibel)
3. **Core State & Persistence:** Zustand (Global State), IndexedDB (Offline Storage)
4. **AI & Integration Engine:** Vercel AI SDK, LangChain (Node Prompts), React Flow (Workflow Builder)
5. **Animation & UI Polish:** Rive (State-Machine Driven Animation), Framer Motion.

#### Pemilihan dan Penggunaan Teknologi
TypeScript dipilih untuk menghindari *runtime error* pada form perbankan yang kritis. Next.js 14 dipilih karena arsitektur *Server Components*-nya yang bisa melakukan *streaming response* AI sedemikian cepat dengan latensi yang sangat rendah. IndexedDB adalah nyawa dari kapabilitas *Local-First* di Elysian.

#### Algoritma Solusi (AI & Machine Learning)
1. **Embedding Algorithm & Vector Search:** PDF buku hukum dikonversi menggunakan model *Embedding* (misal: *OpenAI text-embedding-ada-002* atau LLM khusus lokal *BGE-m3*). Elysian lalu menggunakan algoritma **Cosine Similarity** di dalam *Vector Database* (seperti Pinecone/Qdrant) untuk menemukan paragraf referensi (RAG) yang nilai sudut multidiemsinya paling identik dengan draf yang sedang diketik *user*.
2. **Named Entity Recognition (NER) / PII Filter:** Menggunakan kombinasi pola heuristik (*RegEx*) ringan untuk menyensor No. KTP dan Nomor Rekening sebelum *prompt generation* diinisialisasi.
3. **Double-Pass Verification (Guardrail):** Menggunakan LLM kedua berbiaya rendah dengan instruksi spesifik "Hanya ekstrak angka dan bandingkan dua struktur", jika *FALSE*, tampilkan ralat UI.

#### Data Input dan Pertimbangan Keamanan
- **Input Utama:** Bersumber dari data *open-legal* BI, POJK, Katalog Harga Daerah, dan draf mentah analis.
- **Keamanan:** Elysian dipagari dengan *Strict Content Security Policy (CSP)*. Peluruhan sesi (session wipe) akan otomatis membuang token saat *browser* ditutup. 

---

### 8. Rencana Implementasi dan Bisnis

#### Status Inovasi & Apakah Realistis Dibangun?
Proyek ini sekarang berada dalam status **Prototype / PoC (Proof of Concept)**. Ini sangat realistis direalisasikan oleh tim kami. Repositori *Frontend-Elysian-Rebirth* kami telah memiliki pondasi editor cerdas (*Tiptap* integrasi AI), interaksi RAG (*Knowledge Hub Playground*), dan kerangka kanvas *workflow*. Kami dapat memutar fokus prototipe ini langsung untuk *use-case* spesifik (*Fraud Detection*).

#### Tahapan Pengembangan (Roadmap)
- **Fase 1 (Design & Setup - 1 Minggu):** Penyesuaian antarmuka Editor dan Pemasangan *Database Vector* untuk meng-injeksi dokumen *dummy* regulasi BI.
- **Fase 2 (Integration - 2 Minggu):** Integrasi *PII Redaction Engine* di level *Frontend* dan mengunci panel *Semantic Guardrail* pada UI Editor.
- **Fase 3 (Testing - 1 Minggu):** *End-to-End Test* menggunakan *Playwright* untuk menguji ketahanan aplikasi saat koneksi dimatikan (*offline-mode*).
- **Fase 4 (Deployment Pilot):** MVP divalidasi ke internal BI atau institusi lokal untuk simulasi reviu anggaran.

#### Bisnis Model dan Keberlanjutan (Business Model Canvas Konsep)

1. **Customer Segments:** 
   - *Government & Regulators* (Bank Indonesia, OJK, Pemda)
   - *Financial Institutions* (Bank Umum, BPR, Fintech Lending)
   - *Law/Audit Firms* (KAP)
2. **Value Propositions:** 
   - "IDP dengan jaminan 0% Halusinasi Angka" 
   - Keamanan data tingkat-tinggi (*Local-first/On-Premise*)
3. **Channels:** Penetrasi B2B, Kemitraan vendor IT Pemerintah (*e-Katalog*).
4. **Customer Relationships:** *Dedicated Support, Custom SLA, Continuous AI Training Updates*.
5. **Revenue Streams:** 
   - **Enterprise Licensing:** Langganan per-kursi (*per-seat subscription*) model SaaS.
   - **On-Premise Instantiation Fee:** Biaya setup lokal murni tanpa akses internet terbuka bagi Bank yang sangat restriktif.
   - **Maintenance & Custom Workflow Integration:** Biaya per perbaikan pipa/konektor data kustom.
6. **Key Resources:** Tim Engineer, *Vector Database Server*, Ahli Hukum Perbankan (untuk anotasi dan perancangan instruksi guardrail).
7. **Key Activities:** Pengembangan Sistem RAG, *Platform Maintenance*, Akuisisi Klien (*B2B Sales*).
8. **Key Partnerships:** Penyedia Cloud Lokal (di Indonesia), Konsultan Hukum/Auditor (*Subject Matter Expert*).
9. **Cost Structure:** Biaya API/Inferensi LLM, *Hosting Vector Database*, Biaya SDM/Operasional, Lisensi Keamanan pihak ketiga.
