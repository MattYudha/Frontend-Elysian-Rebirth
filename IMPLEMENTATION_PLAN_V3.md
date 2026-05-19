# IMPLEMENTATION PLAN V3.0 — Elysian Rebirth Architecture Overhaul

> **Status:** Post-Discussion Architecture (Matt × CEO Indra × Claude × Gemini)  
> **Tanggal:** Mei 2026  
> **Versi:** 3.0.0 (Lean & Mean — Batch 2 Submission)  
> **Tujuan:** Framework struktur project scalable dengan FE/BE/ML terpisah, data Nemesis terpisah, dan integrasi financial-services sebagai Cookbook Library.

---

## 1. EXECUTIVE SUMMARY

Elysian Rebirth berevolusi dari arsitektur v2.0 (5-Tool Ecosystem dengan RTK + Quorum + PostgreSQL tunggal) menjadi **arsitektur v3.0 Lean & Mean** yang:

- **Menghapus kompleksitas tidak perlu** (RTK, gRPC, Quorum private node).
- **Memisahkan concern data dengan ketat** (4 database terpisah, masing-masing dengan tanggung jawab tunggal).
- **Menambahkan pipeline integritas data** (MongoDB Staging + Human QA Gate sebelum masuk RAG).
- **Menurunkan barrier deployment blockchain** (dari private chain ke public EVM testnet).
- **Mengintegrasikan financial-services** bukan sebagai kode runtime, melainkan sebagai **Library of Prompts & Audit Skills** untuk MiroFish.

---

## 2. TARGET DIRECTORY STRUCTURE (THE TREE)

```
PROJECT ELYSIAN +MIROFISH/
│
├── AGENTS.md                          # Panduan arsitektur & coding (LIVE DOC)
├── IMPLEMENTATION_PLAN_V3.md          # Dokumen ini
├── README.md                          # Overview project untuk kontributor baru
│
├── frontend-elysian/                  # 🌐 FE — Next.js 14 (BFF Pattern)
│   ├── app/                           # App Router (Next.js 14)
│   ├── components/
│   │   ├── editor/                    # DocumentEditor, EditorSidebar
│   │   ├── swarm/                     # SwarmReviewPanel, AgentChatPanel
│   │   └── ui/                        # shadcn/ui primitives
│   ├── lib/                           # http.ts (proxy client), utils
│   ├── store/                         # Zustand (pure in-memory, NO persist)
│   ├── app/api/proxy/[...slug]/       # Catch-all BFF Proxy → Go Backend
│   ├── app/api/auth/                  # Login/Logout/Refresh (HTTP-Only Cookie)
│   ├── app/api/proxy/swarm/events/    # SSE endpoint (proxy ke Go)
│   ├── e2e/                           # Playwright tests
│   ├── .storybook/                    # Storybook
│   ├── middleware.ts                  # SSR auth guard (cookie-based)
│   ├── package.json
│   └── Dockerfile
│
├── backend-elysian/                   # 🧠 BE — Go 1.25+ (The Orchestrator)
│   ├── cmd/server/
│   ├── internal/
│   │   ├── config/                    # Viper config (.env loader)
│   │   ├── domain/                    # Entities (User, Tenant, SwarmTask, etc.)
│   │   ├── delivery/http/
│   │   │   ├── handler/               # Gin handlers
│   │   │   ├── routes/                # Route definitions
│   │   │   └── middleware/            # Auth, RBAC, Logger, Recovery
│   │   ├── usecase/
│   │   │   ├── auth/
│   │   │   ├── document/
│   │   │   ├── swarm/                 # TriggerSwarm, HandleCallback
│   │   │   ├── workflow/
│   │   │   └── blockchain/            # Sepolia smart contract interaction
│   │   ├── repository/
│   │   │   ├── postgres/              # Instance 1: IAM, Tenants, Permissions
│   │   │   └── mongodb/               # Staging: Raw Docs, Agent Rationale
│   │   └── infrastructure/
│   │       ├── redis/                 # go-redis (Queue + Pub/Sub)
│   │       ├── asynq/                 # Background job worker
│   │       ├── s3/                    # MinIO / S3 document storage
│   │       ├── mail/                  # SMTP / SendGrid
│   │       └── ethereum/              # go-ethereum client (Sepolia RPC)
│   ├── migrations/
│   │   ├── postgres/                  # Goose migrations (IAM DB)
│   │   └── mongodb/                   # MongoDB schema scripts (indexes)
│   ├── .env.example
│   ├── docker-compose.yml             # Redis, PostgreSQL-1, MongoDB local dev
│   └── Dockerfile
│
├── mirofish-engine/                   # 🤖 ML — Python Swarm (The Cognitive Brain)
│   ├── swarm_worker.py                # BRPOP Redis → run swarm → webhook callback
│   ├── agents/
│   │   ├── auditor_agent.py           # Price checking vs Nemesis
│   │   ├── compliance_agent.py        # Regulation checking vs OpenViking
│   │   └── manager_agent.py           # Consensus + JSON output
│   ├── prompts/
│   │   ├── caveman/                   # Caveman Prompts (JSON-only, strict)
│   │   └── system/                    # Persona definitions
│   ├── cookbooks-financial/           # 📚 [financial-services integration]
│   │   ├── audit-xls/                 # Excel RAPBD analysis templates
│   │   ├── statement-auditor/         # Flagger & Reconciler prompts
│   │   └── kyc-rules/                 # Compliance & regulation prompts
│   ├── services/
│   │   ├── nemesis_client.py          # Query PostgreSQL Instance 2 (SIRUP)
│   │   ├── openviking_client.py       # Query OpenViking RAG API
│   │   └── blockchain_hasher.py       # Generate hash before callback
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── openviking-librarian/              # 📚 Facts — Rust RAG Engine
│   ├── src/                           # Rust source (parser, chunker, embedder)
│   ├── crates/                        # Internal Rust crates
│   ├── docs/                          # Perda/SHR PDF ingestion pipelines
│   ├── qdrant-config/                 # Qdrant collection schemas
│   ├── scripts/
│   │   ├── ingest_pdf.py              # Parse PDF → MongoDB (raw staging)
│   │   └── approve_to_qdrant.py       # MongoDB (approved) → Qdrant embed
│   ├── Cargo.toml
│   └── Dockerfile
│
├── nemesis-groundtruth/               # 🗄️ Data — PostgreSQL Instance 2 (SIRUP)
│   ├── data/
│   │   ├── dashboard.sqlite           # ⚠️ LEGACY SOURCE ONLY — untuk migrasi sekali jalan
│   │   ├── dashboard.sql              # SQL dump for import ke PostgreSQL
│   │   └── patch-v1-to-v2.sql         # Migration patch
│   # NOTE: Runtime database adalah PostgreSQL Instance 2.
│   # SQLite ini TIDAK boleh diakses langsung oleh MiroFish saat runtime.
│   ├── migrations/
│   │   └── 001_import_sirup.sql       # Import script to PostgreSQL Instance 2
│   ├── seeders/
│   │   └── sirup_seed.py              # Data loader script
│   ├── docker-compose.yml             # PostgreSQL Instance 2 (dedicated)
│   └── README.md                      # Data dictionary & schema docs
│
├── trust-layer/                       # ⛓️ Blockchain — EVM Smart Contracts
│   ├── contracts/
│   │   └── AuditTrail.sol             # Solidity: insertLog(), supersede(), getStatus()
│   ├── scripts/
│   │   ├── deploy_sepolia.py          # Deployment script
│   │   └── verify_hash.py             # Provenance check helper
│   ├── hardhat.config.ts              # Hardhat config (Sepolia/Amoy)
│   ├── .env.example
│   └── README.md
│
└── infrastructure/                    # 🏗️ DevOps & Shared Infra
    ├── docker-compose.infra.yml       # Shared: Redis, MongoDB, Qdrant
    ├── nginx/                         # Reverse proxy configs
    ├── terraform/                     # (Future) Cloud provisioning
    └── monitoring/
        ├── prometheus/
        └── grafana/
```

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Frontend Elysian (`frontend-elysian/`)

| Aspek         | Spesifikasi                                                      |
| ------------- | ---------------------------------------------------------------- |
| **Framework** | Next.js 14 (App Router), TypeScript                              |
| **Styling**   | Tailwind CSS + Radix UI + shadcn/ui                              |
| **State**     | Zustand (pure in-memory, **NO localStorage persistence**)        |
| **Auth**      | HTTP-Only Cookies (access_token 15m, refresh_token 30d)          |
| **Proxy**     | BFF Pattern: `/api/proxy/[...slug]` → Go Backend                 |
| **Streaming** | SSE Client: `EventSource('/api/proxy/swarm/events?task_id=...')` |
| **Testing**   | Playwright (E2E), Vitest (Unit), Storybook                       |

**Key Rule:** Browser tidak pernah menyentuh JWT mentah. Token hanya ada di HTTP-Only Cookie yang diatur server-side oleh Next.js.

### 3.2 Backend Elysian (`backend-elysian/`)

| Aspek             | Spesifikasi                                            |
| ----------------- | ------------------------------------------------------ |
| **Language**      | Go 1.25+                                               |
| **Framework**     | Gin                                                    |
| **Auth DB**       | PostgreSQL Instance 1 (IAM, Tenants, Permissions)      |
| **Staging DB**    | MongoDB (Raw Docs, Agent Rationale, Audit Logs)        |
| **Queue**         | Redis `swarm:tasks` (LPUSH) / `swarm:events` (Pub/Sub) |
| **Blockchain**    | go-ethereum → Sepolia/Amoy RPC                         |
| **Password Hash** | Argon2id (memory=64MB, iterations=3, parallelism=4)    |
| **JWT**           | RS256, HTTP-Only Cookie, SameSite=Strict               |

### 3.3 MiroFish Engine (`mirofish-engine/`)

| Aspek          | Spesifikasi                                                      |
| -------------- | ---------------------------------------------------------------- |
| **Runtime**    | Python 3.11+                                                     |
| **Framework**  | FastAPI (production-grade async API)                             |
| **Queue**      | `redis-py`: BRPOP `swarm:tasks`, PUBLISH `swarm:events`          |
| **Output**     | JSON Strict Only (Caveman Prompt)                                |
| **Fact Query** | Direct query ke Nemesis (PostgreSQL Instance 2) & OpenViking API |
| **Cookbooks**  | Prompt templates dari `financial-services` (read-only reference) |

### 3.4 OpenViking Librarian (`openviking-librarian/`)

| Aspek             | Spesifikasi                                              |
| ----------------- | -------------------------------------------------------- |
| **Language**      | Rust                                                     |
| **Parser**        | PDF, Word, Excel, AST                                    |
| **Staging**       | MongoDB (`raw_documents` collection, status: PENDING_QA) |
| **Vector Engine** | Qdrant (Rust-native, consistent stack)                   |
| **Flow**          | Parse PDF → MongoDB → Human Approval → Qdrant Embed      |

### 3.5 Nemesis Ground Truth (`nemesis-groundtruth/`)

| Aspek         | Spesifikasi                                       |
| ------------- | ------------------------------------------------- |
| **Format**    | PostgreSQL Instance 2 (migrated from SQLite 4GB+) |
| **Source**    | SIRUP (Sistem Informasi Rencana Umum Pengadaan)   |
| **Access**    | Read-Only selama audit                            |
| **Purpose**   | Ground truth harga wajar untuk deteksi markup     |
| **Isolation** | Dedicated instance untuk performance & security   |

### 3.6 Trust Layer (`trust-layer/`)

| Aspek              | Spesifikasi                                             |
| ------------------ | ------------------------------------------------------- |
| **Chain**          | Sepolia Testnet (primary) / Amoy (backup)               |
| **Contract**       | Solidity: `AuditTrail.sol`                              |
| **Functions**      | `insertLog()`, `supersede()`, `getStatus()`             |
| **Status Enum**    | `VERIFIED`, `SUPERSEDED`, `CORRECTED`                   |
| **Deployment**     | Hardhat + Ethers.js                                     |
| **Go Integration** | go-ethereum `ethclient.Dial("https://rpc.sepolia.org")` |

### 3.7 Infrastructure (`infrastructure/`)

| Service          | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| **Redis**        | Queue (`swarm:tasks`) + Pub/Sub (`swarm:events`) |
| **MongoDB**      | Staging & QA Gate (schemaless document store)    |
| **Qdrant**       | Vector DB untuk semantic search (RAG)            |
| **PostgreSQL-1** | IAM, Tenants, Workflow Status (operational)      |
| **PostgreSQL-2** | Nemesis SIRUP data (analytical, read-only)       |

---

## 4. DATA FLOW ARCHITECTURE (STEP-BY-STEP)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER — Next.js BFF (HTTP-Only Cookies, SSE Client)          │
│  ┌──────────────┐    ┌──────────────────────────────────────┐              │
│  │ Auditor User │───▶│ Next.js 14                           │              │
│  │ (Kepala Dinas│    │ · /api/proxy/[...slug] (Catch-All)   │              │
│  │  / Auditor)  │◀───│ · /api/auth/* (Cookie Manager)       │              │
│  └──────────────┘ SSE│ · SSE EventSource                    │              │
│                      └──────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ HTTP + Cookie
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATION LAYER — Go Backend (Gin)                                    │
│  ┌──────────────┐    ┌─────────────────────┐    ┌─────────────────────┐    │
│  │ HTTP Server  │───▶│ PostgreSQL Inst 1   │    │ S3 / MinIO          │    │
│  │ · Auth       │    │ · IAM / Tenants     │    │ · PDF Storage       │    │
│  │ · Swarm API  │    │ · Workflow Status   │    │                     │    │
│  │ · Webhook    │    └─────────────────────┘    └─────────────────────┘    │
│  └──────┬───────┘                                                           │
└─────────┼─────────────────────────────────────────────────────────────────────┘
          │ LPUSH                           SUBSCRIBE
          ▼                                 ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│  MESSAGING LAYER — Redis (Pure Pub/Sub, NO gRPC)                           │
│  ┌─────────────────┐        ┌─────────────────┐                            │
│  │ Queue           │        │ Pub/Sub         │                            │
│  │ swarm:tasks     │        │ swarm:events    │                            │
│  └─────────────────┘        └─────────────────┘                            │
└─────────────────────────────────────────────────────────────────────────────┘
          │ BRPOP                           PUBLISH
          ▼                                 │
┌─────────────────────────────────────────────────────────────────────────────┐
│  INTELLIGENCE LAYER — MiroFish (Python Swarm Engine)                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │ Agent 1      │───▶│ Agent 2      │───▶│ Agent 3      │                  │
│  │ Auditor      │    │ Compliance   │    │ Manager      │                  │
│  │ (Price Check)│    │ (Regulation) │    │ (Consensus)  │                  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                  │
│         │                   │                   │                          │
│         └───────────────────┴───────────────────┘                          │
│                             │                                              │
│                             ▼ Caveman Prompt (JSON-only output)            │
│  ┌─────────────────────────────────────────────────────────────┐          │
│  │ cookbooks-financial/ (Prompt Library from financial-svcs)   │          │
│  │ · audit-xls skills      · statement-auditor prompts          │          │
│  │ · kyc-rules skills      · mcp.json protocols                │          │
│  └─────────────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
          │                                   ▲
          │ Query Facts                       │ Raw Data (NO RTK)
          ▼                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│  FACTS LAYER — Knowledge & Ground Truth                                     │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ OpenViking      │───▶│ MongoDB         │───▶│ Qdrant          │         │
│  │ (Rust Parser)   │    │ (Staging & QA)  │    │ (Vector Engine) │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│         ▲                                              ▲                    │
│         │ Human Approval Gate                          │                    │
│         │ (Clean data only)                            │                    │
│         └──────────────────────────────────────────────┘                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ Nemesis — PostgreSQL Instance 2 (SIRUP Ground Truth)        │           │
│  │ · 4GB+ procurement data  · Read-Only during audit           │           │
│  └─────────────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼ Hash of Debate + Hash of Consensus
┌─────────────────────────────────────────────────────────────────────────────┐
│  TRUST LAYER — Public EVM Testnet (Sepolia / Amoy)                         │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ Smart Contract: AuditTrail.sol                              │           │
│  │ · insertLog(task_id, rationale_hash, timestamp, status)     │           │
│  │ · supersede(old_tx, new_hash)                               │           │
│  │ · getStatus(task_id)                                        │           │
│  └─────────────────────────────────────────────────────────────┘           │
│         ▲                                                                   │
│         │ Verify Immutable Log (Provenance Check)                           │
│         └───────────────────────────────────────────────────────────────────┘
```

### 4.1 Step-by-Step Execution Flow

**Langkah 1 — Upload & Trigger**

1. User mengunggah draf RAPBD (PDF/Excel) via Next.js UI.
2. Next.js BFF proxy mengirim file ke Go Backend (`POST /api/v1/swarm/upload`).
3. Go menyimpan file ke S3, catat metadata ke PostgreSQL Instance 1 (status: PENDING).
4. Go enqueue task ke Redis queue `swarm:tasks` via `LPUSH`.

**Langkah 2 — Fact Retrieval (MiroFish → Facts Layer)** 5. Python Worker (`BRPOP` pada `swarm:tasks`) mengambil task. 6. **Auditor Agent** query Nemesis (PostgreSQL Instance 2) untuk harga historis. 7. **Compliance Agent** query OpenViking API untuk pasal regulasi. 8. Data diterima **MENTAH** (tanpa RTK) untuk menjaga akurasi 100%.

**Langkah 3 — Swarm Debate (MiroFish Cognitive Layer)** 9. **Auditor Agent:** Evaluasi matematis harga vs Nemesis. Output: MARKUP / WAJAR. 10. **Compliance Agent:** Review legalitas dengan RAG dari OpenViking. Output: Justifikasi regulasi. 11. **Manager Agent:** Konsensus akhir berdasarkan perdebatan. Output: JSON `{"status": "FLAGGED"|"CLEARED", "manager_conclusion": "..."}` 12. **Caveman Prompt** memastikan output JSON kaku, tanpa yapping/hallucination.

**Langkah 4 — Blockchain Audit Trail** 13. Setelah konsensus tercapai, Manager Agent generate 2 hash: - `hash_debate_logs` — SHA256 dari seluruh log perdebatan. - `hash_consensus` — SHA256 dari keputusan akhir. 14. Go Backend kirim hash ke Smart Contract `AuditTrail.sol` di Sepolia via `insertLog()`. 15. Smart contract menyimpan dengan status `VERIFIED`.

**Langkah 5 — Callback & Streaming** 16. Python kirim hasil JSON ke Go via `POST /api/v1/swarm/callback`. 17. Go update DB (status: COMPLETED) dan `PUBLISH` ke Redis channel `swarm:events`. 18. Next.js FE menerima real-time log via SSE (`EventSource` ke `/api/proxy/swarm/events`).

---

## 5. DATABASE ARCHITECTURE (THE 4-DB SPLIT)

| Database                            | Engine                   | Tanggung Jawab                               | Karakteristik                      | Akses                   |
| ----------------------------------- | ------------------------ | -------------------------------------------- | ---------------------------------- | ----------------------- |
| **PostgreSQL Instance 1**           | PostgreSQL 15+           | IAM, Tenants, Permissions, Workflow Status   | Structured, relational, high-write | Go Backend              |
| **PostgreSQL Instance 2 (Nemesis)** | PostgreSQL 15+           | SIRUP procurement data (4GB+)                | Structured, read-only, analytical  | MiroFish (direct RO)    |
| **MongoDB**                         | MongoDB 7+ (Replica Set) | Raw parsed docs, agent rationale, audit logs | Schemaless, flexible, staging      | Go Backend + OpenViking |
| **Qdrant**                          | Qdrant 1.x               | Vector embeddings for semantic RAG           | Vector search, HNSW                | OpenViking + MiroFish   |

### 5.1 MongoDB Staging Schema (QA Gate)

```json
{
  "_id": "doc_uuid",
  "filename": "RAPBD_2026_Kominfo.pdf",
  "parsed_by": "openviking-v1.2",
  "status": "PENDING_QA",
  "raw_chunks": [{ "chunk_id": "c1", "text": "...", "page": 5 }],
  "qa_metadata": {
    "reviewed_by": "auditor_john",
    "reviewed_at": "2026-05-14T10:00:00Z",
    "approved": false
  },
  "created_at": "2026-05-14T09:00:00Z"
}
```

### 5.2 PostgreSQL Instance 1 Schema (IAM)

```sql
-- users, tenants, roles, permissions, workflow_status, audit_logs
-- Standard relational schema with RBAC
-- Goose migrations: internal/repository/postgres/migrations/
```

### 5.3 PostgreSQL Instance 2 Schema (Nemesis SIRUP)

```sql
-- procurement_items, vendors, regions, price_history
-- Imported from dashboard.sqlite + dashboard.sql
-- Read-only access for MiroFish during audit
```

---

## 6. COMMUNICATION PATTERNS

### 6.1 Redis Schema

| Key / Channel  | Arah                  | Format              | Tujuan                  |
| -------------- | --------------------- | ------------------- | ----------------------- |
| `swarm:tasks`  | Go → Python (LPUSH)   | JSON (Task Payload) | Distribute audit tasks  |
| `swarm:events` | Python → Go (PUBLISH) | JSON (Agent Logs)   | Real-time SSE streaming |

### 6.2 JSON Contract: Task Payload (Go → Python)

```json
{
  "task_id": "uuid-string-from-go",
  "document_id": "uuid-string",
  "document_type": "RAPBD",
  "webhook_url": "http://host.docker.internal:7777/api/v1/swarm/callback",
  "items": [
    {
      "item_id": "item-001",
      "name": "Laptop Pengadaan IT",
      "qty": 10,
      "unit_price": 15000000,
      "total": 150000000,
      "category": "Elektronik",
      "department": "Dinas Kominfo"
    }
  ],
  "metadata": {
    "region": "Purbalingga",
    "year": 2026,
    "tenant_id": "tenant_001"
  }
}
```

### 6.3 JSON Contract: Callback Payload (Python → Go)

```json
{
  "task_id": "uuid-string-from-go",
  "status": "COMPLETED",
  "summary": "Ditemukan 2 indikasi markup dari total 5 item.",
  "hashes": {
    "rationale_hash": "0xabc123...",
    "consensus_hash": "0xdef456..."
  },
  "blockchain": {
    "tx_hash": null,
    "network": "sepolia",
    "status": "PENDING_COMMIT"
  },
  "results": [
    {
      "item_id": "item-001",
      "status": "FLAGGED",
      "agent_logs": [
        {
          "agent": "Auditor",
          "action": "Price Checking",
          "message": "Berdasarkan data Nemesis SIRUP, rata-rata harga laptop di wilayah ini Rp 15.000.000. Selisih: Rp 10.000.000."
        },
        {
          "agent": "Pengawas",
          "action": "Compliance Review",
          "message": "Tidak ada pasal pengecualian untuk Dinas Kominfo terkait pengadaan laptop umum di atas batas standar harga."
        }
      ],
      "manager_conclusion": "Indikasi Markup sebesar 66%. Harga yang diajukan melebihi standar tanpa justifikasi regulasi yang memadai."
    }
  ]
}
```

> **Blockchain Commit Flow (Eksplisit):**
> 1. Python Manager Agent generate `rationale_hash` + `consensus_hash` (SHA256).
> 2. Hash dikirim ke Go via callback JSON (field `hashes.rationale_hash` dan `hashes.consensus_hash`).
> 3. Go Backend menerima callback → call `insertLog(hash_rationale, hash_consensus)` ke `AuditTrail.sol` di Sepolia.
> 4. Go terima `tx_hash` dari Sepolia → update DB dengan `tx_hash` dan `status: VERIFIED`.
> 5. Python TIDAK berinteraksi langsung dengan blockchain — Go adalah satu-satunya Blockchain Committer.

---

## 7. CAVEMAN PROMPT SPECIFICATION

### 7.1 Purpose

Menggantikan RTK sebagai pencegah yapping/hallucination. Bukan dengan memotong data (kompresi), tapi dengan **memaksa LLM untuk tidak berimprovisasi**.

### 7.2 System Prompt (Manager Agent)

```text
Kamu adalah Agen Manajer (Kepala Review) di Pemerintah Daerah.
Tugasmu adalah membaca temuan Auditor dan Pengawas, lalu memberikan kesimpulan akhir.

ATURAN KAKU:
1. Kamu HARUS merespon hanya dalam format JSON valid.
2. JANGAN berikan penjelasan, narasi, atau kalimat di luar JSON.
3. Jika data tidak tersedia, gunakan null (bukan teks kosong).
4. Jangan membulatkan angka. Gunakan nilai persis dari sumber data.
5. Gunakan "FLAGGED" jika ada indikasi kuat markup tanpa justifikasi legal.
6. Gunakan "CLEARED" jika harga wajar atau ada justifikasi legal yang kuat.

FORMAT OUTPUT (JSON):
{
  "status": "FLAGGED" | "CLEARED",
  "manager_conclusion": "Kesimpulan singkat maksimal 2 kalimat",
  "confidence_score": 0.0 - 1.0,
  "references": ["nemesis:item_id", "openviking:doc_id"]
}
```

---

## 8. BLOCKCHAIN SMART CONTRACT SPEC

### 8.1 AuditTrail.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuditTrail {
    enum Status { VERIFIED, SUPERSEDED, CORRECTED }

    struct LogEntry {
        string taskId;
        bytes32 rationaleHash;
        bytes32 consensusHash;
        uint256 timestamp;
        Status status;
        address submitter;
        bytes32 prevTx; // reference to superseded entry
    }

    mapping(string => LogEntry[]) public auditLogs;
    mapping(bytes32 => bool) public verifiedHashes;

    event LogInserted(string taskId, bytes32 consensusHash, Status status);
    event LogSuperseded(string taskId, bytes32 oldHash, bytes32 newHash);

    function insertLog(
        string memory _taskId,
        bytes32 _rationaleHash,
        bytes32 _consensusHash,
        Status _status
    ) external returns (bool);

    function supersede(
        string memory _taskId,
        bytes32 _oldHash,
        bytes32 _newRationaleHash,
        bytes32 _newConsensusHash
    ) external returns (bool);

    function getStatus(string memory _taskId) external view returns (Status);
    function getLatestHash(string memory _taskId) external view returns (bytes32);
}
```

### 8.2 Lifecycle States

| State        | Arti                           | Transisi                               |
| ------------ | ------------------------------ | -------------------------------------- |
| `VERIFIED`   | Audit pertama kali, hash aktif | → `SUPERSEDED` (jika ada audit ulang)  |
| `SUPERSEDED` | Hash lama digantikan           | Tidak bisa kembali ke VERIFIED         |
| `CORRECTED`  | Hash baru hasil koreksi data   | → `SUPERSEDED` (jika ada koreksi lagi) |

### 8.3 Observability & LLM Rate Limiting (Revisi Prof)

Prof menekankan bahwa **observability wajib ada** — minimal Prometheus metrics. Juri enterprise akan tanya soal monitoring.

#### Required Metrics

| Metric | Tool | Collection | Threshold |
|--------|------|------------|-----------|
| Redis queue depth (`swarm:tasks`) | Prometheus + redis_exporter | Scrape every 15s | > 100 tasks = backlog |
| Agent latency per task | Prometheus (Go custom) | Histogram | > 5 min = slow |
| Qdrant query latency | Prometheus (Qdrant built-in) | Scrape | > 500ms = degraded |
| Blockchain tx confirmation | Prometheus (Go custom) | Timer | > 2 min = congested |
| LLM API error rate | Prometheus (Python custom) | Counter | > 5% = rate limit |

#### LLM Rate Limiting & Retry
Dokumen RAPBD besar dengan 3 agent bisa hit OpenAI rate limit dengan cepat.

```python
# MiroFish — exponential backoff
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=2, max=60),
    retry=retry_if_exception_type((RateLimitError, APITimeoutError))
)
async def call_llm_with_backoff(prompt: str) -> str:
    return await openai_client.chat.completions.create(...)
```

| Parameter | Nilai |
|-----------|-------|
| Max retries | 3 |
| Base delay | 2 detik |
| Max delay | 60 detik |
| Requests per minute | 20 (configurable via `LLM_REQUESTS_PER_MINUTE`) |
| Batch size | 5 items per LLM call (untuk dokumen besar) |

---

## 9. IMPLEMENTATION ROADMAP

### Fase 1: Foundation & Refactoring (2 Minggu)

- [ ] **Reorganisasi folder** sesuai Target Directory Structure (The Tree)
- [ ] **Setup PostgreSQL Instance 2** (Nemesis migration dari SQLite → PostgreSQL)
- [ ] **Setup MongoDB** (staging area + QA Gate collection)
- [ ] **Setup Qdrant** (vector engine untuk OpenViking)
- [ ] **Remove RTK** dari semua dependency dan pipeline
- [ ] **Remove gRPC** references dari diagram dan kode
- [ ] **Setup Prometheus metrics** (Redis queue depth, agent latency, Qdrant latency, blockchain tx time)
- [ ] **Update AGENTS.md** (dokumen ini sudah menangani)

### Fase 2: Backend & Pipeline (2 Minggu)

- [ ] **Go Backend**: Split DB connection (DB_URL + NEMESIS_DB_URL)
- [ ] **Go Backend**: Integrasi MongoDB repository (staging CRUD)
- [ ] **Go Backend**: Blockchain client (go-ethereum Sepolia RPC)
- [ ] **OpenViking**: Pipeline MongoDB → Qdrant (dengan approval gate)
- [ ] **MiroFish**: Update swarm_worker.py (direct query, no RTK)
- [ ] **MiroFish**: Implementasi Caveman Prompt (JSON-only output)

### Fase 3: Blockchain & Trust Layer (1 Minggu)

- [ ] **Smart Contract**: Deploy `AuditTrail.sol` ke Sepolia Testnet
- [ ] **Go Backend**: Endpoint `POST /api/v1/blockchain/verify`
- [ ] **MiroFish**: Generate hash + trigger blockchain commit
- [ ] **Frontend**: Tambahkan badge "Verified on Sepolia" di UI

### Fase 4: financial-services Integration (1 Minggu)

- [ ] **MiroFish**: Porting prompt templates dari `managed-agent-cookbooks/`
- [ ] **MiroFish**: Adaptasi `audit-xls` skill untuk RAPBD Excel parsing
- [ ] **MiroFish**: Adaptasi `kyc-rules` untuk regulasi POJK/Perda
- [ ] **Prompt Engineering**: Benchmark Caveman Prompt vs baseline

### Fase 5: Observability, Polish & Testing (1 Minggu)

- [ ] **Frontend**: SwarmReviewPanel (Terminal Log SSE)
- [ ] **Frontend**: AgentChatPanel (Deep Interaction)
- [ ] **Prometheus**: Deploy scrape targets untuk Redis, Go Backend, MiroFish, Qdrant
- [ ] **Grafana**: Setup dashboard basic (opsional untuk hackathon, must-have untuk production)
- [ ] **LLM Rate Limiting**: Implementasi exponential backoff + retry logic di MiroFish
- [ ] **E2E Test**: Upload → Trigger → SSE → Flagged (Happy Path)
- [ ] **Load Test**: Redis queue dengan 100 concurrent tasks
- [ ] **Security Audit**: Verifikasi HTTP-Only Cookie + BFF Proxy

---

## 10. ENVIRONMENT CONFIGURATION MATRIX

### 10.1 Backend Go (.env)

```bash
# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=7777
SERVER_ENVIRONMENT=development

# Database — Instance 1 (Operational)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elysian
DB_USER=postgres
DB_PASSWORD=secret

# Database — Instance 2 (Nemesis / SIRUP)
NEMESIS_DB_HOST=localhost
NEMESIS_DB_PORT=5433
NEMESIS_DB_NAME=nemesis
NEMESIS_DB_USER=nemesis_readonly
NEMESIS_DB_PASSWORD=secret

# MongoDB (Staging & QA Gate)
MONGO_URI=mongodb://localhost:27017/elysian_staging
MONGO_DB_NAME=elysian_staging

# Redis (Queue + Pub/Sub)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Qdrant (Vector DB)
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_COLLECTION=elysian_regulations

# Blockchain (Sepolia Testnet)
ETH_RPC_URL=https://rpc.sepolia.org
ETH_PRIVATE_KEY=0x...
ETH_CONTRACT_ADDRESS=0x...
ETH_CHAIN_ID=11155111

# JWT (RS256)
JWT_PRIVATE_KEY_PATH=/etc/elysian/jwt-private.pem
JWT_PUBLIC_KEY_PATH=/etc/elysian/jwt-public.pem
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=720h

# Argon2id
ARGON2ID_MEMORY=65536
ARGON2ID_ITERATIONS=3
ARGON2ID_PARALLELISM=4

# S3
S3_ENDPOINT=minio.example.com
S3_BUCKET=elysian-docs
```

### 10.2 MiroFish Python (.env)

```bash
# LLM Provider
LLM_API_KEY=your_openai_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Nemesis (PostgreSQL Instance 2 — Read-Only)
NEMESIS_DB_HOST=localhost
NEMESIS_DB_PORT=5433
NEMESIS_DB_NAME=nemesis
NEMESIS_DB_USER=nemesis_readonly
NEMESIS_DB_PASSWORD=secret

# OpenViking API
OPENVIKING_API_URL=http://localhost:1929

# Blockchain
ETH_RPC_URL=https://rpc.sepolia.org
ETH_CONTRACT_ADDRESS=0x...

# FastAPI
PYTHON_API_HOST=0.0.0.0
PYTHON_API_PORT=5001
```

---

## 11. RISK & MITIGATION

| Risk                                                    | Likelihood | Impact | Mitigation                                                   |
| ------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------ |
| LLM yapping/hallucination karena data panjang (no RTK)  | Medium     | High   | Caveman Prompt strict JSON + guardrail parser                |
| MongoDB staging tidak di-approve → data kotor masuk RAG | Medium     | High   | UI approval gate wajib + status field enforcement            |
| Sepolia testnet tidak stabil                            | Low        | Medium | Fallback ke Amoy testnet + local dev tanpa blockchain        |
| Nemesis PostgreSQL query lambat (4GB+)                  | Medium     | Medium | Dedicated instance + connection pooling + read replica       |
| Qdrant vector inconsistency antar node                  | Low        | High   | Single Qdrant node untuk hackathon, cluster untuk production |
| financial-services prompts tidak cocok untuk Pemda      | Medium     | Medium | Adaptasi prompt (bukan copy-paste mentah) + benchmark        |
| LLM API rate limit / throttling (OpenAI)                | High       | High   | Exponential backoff + retry (max 3, base 2s). Task queue throttling + monitor TPM |
| Observability blind spot                                | Medium     | Medium | Prometheus wajib: Redis queue, agent latency, Qdrant, blockchain tx |
| LLM data privacy (RAPBD ke OpenAI)                      | Medium     | High   | Flag `SELF_HOSTED_LLM=true` untuk alternatif local. Minimize PII sebelum kirim ke API. |

---

## 12. SUCCESS CRITERIA

| Kriteria                   | Target                   | Cara Ukur                                                  |
| -------------------------- | ------------------------ | ---------------------------------------------------------- |
| Akurasi deteksi markup     | ≥ 95% recall pada test set 50 dokumen RAPBD yang sudah diaudit manual | Benchmark vs ground truth audit manual (sudah diverifikasi BPK) |
| Latency swarm review       | < 5 menit untuk 100 item | Timer dari upload sampai SSE COMPLETED                     |
| Data integrity (QA Gate)   | 100% approved docs only  | MongoDB query: `status == "APPROVED"` sebelum Qdrant embed |
| Blockchain immutability    | 100% hash tersimpan      | Verifikasi tx_hash di Sepolia block explorer               |
| Security (XSS)             | 0 token di browser       | Audit localStorage + cookies di DevTools                   |
| Caveman Prompt consistency | 100% JSON valid          | Parser validation + fallback handler                       |

---

> **Catatan Penting:** Implementation Plan ini adalah **BLUEPRINT TARGET**. Jangan eksekusi reorganisasi folder atau perubahan kode sebelum mendapatkan perintah eksplisit dari Product Owner (Matt / CEO Indra). Dokumen ini dirancang sebagai panduan untuk development bertahap menuju Batch 2 Submission.
