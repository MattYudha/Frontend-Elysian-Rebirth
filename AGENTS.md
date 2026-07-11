<!-- AGENTS.md — Elysian Rebirth v3.0 (Lean & Mean Architecture) -->

> **Versi:** 3.0.0 (Post-Discussion — Batch 2 Submission)  
> **Tanggal:** Mei 2026  
> **Pemilik:** Matt (Team Elysian)  
> **Status:** Implementation-Ready Blueprint  
> **Perubahan Mayor dari v2.0:**
>
> - RTK di-drop → ganti Caveman Prompt
> - gRPC di-drop → pure Redis Pub/Sub
> - PostgreSQL tunggal → Split 4 DB (PG-1 IAM, PG-2 Nemesis, MongoDB Staging, Qdrant Vector)
> - Quorum private chain → Public EVM Testnet (Sepolia/Amoy)
> - Tambah `financial-services` sebagai Cookbook Library

---

## 1. PROJECT IDENTITY & VISION

### 1.1 Apa itu Elysian?

**Elysian Rebirth** adalah Infrastruktur Audit Finansial Otonom berbasis Multi-Agent Swarm Intelligence yang dirancang untuk mendeteksi dan mencegah **markup anggaran** pada tahap perencanaan (Pre-Audit) di Pemerintah Daerah (Pemda) Indonesia.

**Tagline:** _"Transformasi dari Passive Checking menjadi Autonomous Financial Oversight."_

### 1.2 Masalah yang Dipecahkan

- **Markup Anggaran:** Praktik penggelembungan harga pada RAPBD yang menyebabkan kerugian negara triliunan rupiah per tahun.
- **Verifikasi Manual yang Lambat:** Auditor harus mencocokkan ribuan item anggaran dengan Standar Harga Regional (SHR) secara manual — rentan human error.
- **Ketiadaan Data Pembanding Real-Time:** Sulitnya akses cepat ke data historis pengadaan untuk deteksi objektif.
- **Audit Trail yang Rapuh:** Rekam jejak keputusan verifikasi sering tidak transparan dan dapat dimanipulasi.

### 1.3 Target User

| User                                  | Kebutuhan                                        |
| ------------------------------------- | ------------------------------------------------ |
| Auditor Internal (Inspektorat Daerah) | Mempercepat reviu draf anggaran                  |
| Kepala Dinas/OPD                      | Jaminan akuntabilitas sebelum tanda tangan       |
| BPK/BPKP                              | Audit trail immutable dan data pembanding akurat |
| Masyarakat/Jurnalis                   | Transparansi anomali pengadaan                   |

### 1.4 Visi Post-Hackathon

- ✅ **Blockchain Audit Trail (Implemented):** Setiap temuan agen di-hash ke Public EVM Testnet (Sepolia). Go Backend dapat melakukan **Verify Immutable Log (Provenance Check)**.
- **Predictive Procurement:** Rekomendasi vendor terdekat berdasarkan data historis Nemesis.
- **Auto-Redaction PII:** Sensor data pribadi otomatis sebelum dokumen dibaca LLM.
- **MongoDB QA Gate:** Pipeline approval manusia sebelum data masuk ke RAG Vector DB.

---

## 2. THE 6-TOOL ECOSYSTEM

Setiap kali bekerja pada Elysian, pahami bahwa ada **6 repositori yang saling terintegrasi**. Jangan pernah menganggap Elysian sebagai monolit tunggal.

### 2.1 Elysian — The Orchestrator & Interface

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + Radix UI + React Flow
- **Backend:** Go (Gin) dengan Clean Architecture (domain → delivery → usecase → repository → infrastructure)
- **Fungsi:** Otak distribusi tugas, manajemen User/Tenant, Message Queue (Asynq/Redis), SSE streaming.
- **Database:** PostgreSQL Instance 1 (IAM, Tenants, Permissions) + MongoDB (Staging & QA Gate)

### 2.2 MiroFish — The Cognitive Swarm

- **Stack:** Python (FastAPI) + OpenAI-compatible LLM (Menggunakan MiniMax AI provider, model MiniMax-M2.5)
- **Fungsi:** Mesin simulasi Multi-Agent (Auditor, Compliance, Manager) yang saling berdebat untuk konsensus audit.
- **Key Files:** `swarm_worker.py`, `auditor_agent.py`, `compliance_agent.py`, `manager_agent.py`
- **Prompt Style:** Caveman Prompt (JSON-only, strict, no yapping) — **RTK sudah di-drop.** Saringan regex `(?s)<think>.*?</think>` diterapkan untuk menyaring teks penalaran (thinking block) dari respons model.

### 2.3 OpenViking — The Librarian

- **Stack:** Rust (CLI + HTTP API) + Qdrant Vector DB
- **Fungsi:** Parsing & RAG engine untuk membedah PDF Perda/Regulasi tebal.
- **Pipeline:** OpenViking parse PDF → MongoDB (Staging, status: PENDING_QA) → Human Approval → Qdrant (Vector Embed)
- **Key Capability:** Semantic retrieval via Qdrant, context-aware search, content abstraction.

### 2.4 Nemesis — The Ground Truth

- **Stack:** PostgreSQL Instance 2 (migrated dari SQLite 4GB+) — **dedicated instance, read-only**
- **Legacy Source:** `dashboard.sqlite` hanya untuk migrasi sekali jalan. Runtime MiroFish TIDAK BOLEH mengakses SQLite langsung.
- **Fungsi:** Database riil pengadaan barang/jasa Indonesia. Patokan harga wajar untuk deteksi markup.
- **Data Source:** Sistem Informasi Rencana Umum Pengadaan (SIRUP) — jutaan baris data riil.
- **Access:** MiroFish query langsung via read-only connection.

### 2.5 financial-services — The Cookbook Library

- **Stack:** Markdown + YAML prompt templates (read-only reference)
- **Fungsi:** **Library of Wisdom** bagi MiroFish. Bukan kode runtime, melainkan koleksi prompt engineering gred institusi keuangan.
- **Key Assets:**
  - `managed-agent-cookbooks/statement-auditor/` — Prompt Flagger & Reconciler
  - `managed-agent-cookbooks/gl-reconciler/` — Prompt General Ledger reconciliation
  - `plugins/vertical-plugins/financial-analysis/skills/audit-xls/` — Excel analysis logic
  - `plugins/vertical-plugins/operations/skills/kyc-rules/` — Compliance regulation logic
- **Integration Pattern:** Tim ML membaca dan mengadaptasi prompt templates ke MiroFish `caveman/` folder. Tidak di-import sebagai dependency kode.

### 2.6 Trust Layer — The Immutable Seal

- **Stack:** Solidity (Hardhat) + go-ethereum (Go) + Sepolia/Amoy Testnet
- **Fungsi:** Audit trail immutable via Public EVM Testnet. Smart contract `AuditTrail.sol` menyimpan hash keputusan agen.
- **Key Functions:** `insertLog()`, `supersede()`, `getStatus()` — status: `VERIFIED`, `SUPERSEDED`, `CORRECTED`.

---

## 3. SYSTEM ARCHITECTURE & DATA FLOW

### 3.1 High-Level Sequence Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Elysian Rebirth (Go / Next.js) — The Orchestrator & Interface             │
│  ┌──────────────┐    ┌──────────────┐                                       │
│  │ Next.js BFF  │    │ Go Backend   │                                       │
│  │ · HTTP-Only  │◄──►│ · HTTP Server│                                       │
│  │   Cookies    │SSE │ · PostgreSQL │                                       │
│  │ · Proxy      │    │   Instance 1 │                                       │
│  │ · SSE Client │    │ · MongoDB    │                                       │
│  └──────────────┘    └──────────────┘                                       │
│         │                  │                                                │
│    Upload PDF        LPUSH │                                                │
│         │                  ▼                                                │
└─────────┼──────────────────┼────────────────────────────────────────────────┘
          │                  │
          │          ┌───────▼────────┐
          │          │   Redis        │ ◄── Messaging & Job Layer
          │          │ · swarm:tasks  │     (LPUSH from Go, BRPOP by Python)
          │          │ · swarm:events │     (Pub/Sub for SSE streaming)
          │          └───────┬────────┘
          │                  │ BRPOP
          │                  │
          │      ┌───────────▼───────────┐
          │      │  MiroFish             │ ◄── Python Swarm Engine
          │      │  (Cognitive Layer)    │     (Auditor → Compliance → Manager)
          │      │  · Caveman Prompt     │     JSON-only, strict output
          │      │  · Raw Data Context   │     No compression, no RTK
          │      └───────────┬───────────┘
          │                  │
          │    Query Facts   │ Query Facts
          │        │         │
          │        ▼         ▼
          │      ┌───────────────────────────┐
          │      │   Facts Layer             │ ◄── The Librarian & Ground Truth
          │      │  ┌─────────────────┐      │
          │      │  │ OpenViking      │      │     Red Section — Knowledge
          │      │  │ · Rust Parser   │      │     · Parse PDF/Perda
          │      │  │ · MongoDB Staging│     │     · Human QA Gate
          │      │  │ · Qdrant Vector │      │     · Semantic Search
          │      │  └─────────────────┘      │
          │      │  ┌─────────────────┐      │
          │      │  │ Nemesis         │      │     Grey Section — Ground Truth
          │      │  │ · PostgreSQL    │      │     · SIRUP Procurement Data
          │      │  │   Instance 2    │      │     · Read-Only SQL Interface
          │      │  │ · 4GB+ SIRUP    │      │
          │      │  └─────────────────┘      │
          │      └───────────────────────────┘
          │                  │
          │    After Swarm   │
          │    consensus,    │
          │    push hash     │
          │                  ▼
          │      ┌───────────────────────────┐
          │      │ Public EVM Testnet        │ ◄── Trust Layer
          │      │ · Sepolia / Amoy          │     · insertLog()
          │      │ · AuditTrail.sol          │     · supersede()
          │      │ · Block Explorer          │     · getStatus()
          │      └───────────────────────────┘
          │                  │
          │    Verify        │ Verify Immutable Log
          │    Immutable     │ (Provenance Check)
          │    Log           │
          │                  │
          └──────────────────┘
                             │
         ┌───────────────────┘
         │
         ▼
[Go Webhook Callback] → [Redis Pub/Sub] → [SSE] → [Next.js FE]
```

### 3.2 Step-by-Step Execution

1. **Upload & Trigger (Elysian FE → Go BE):**
   - User mengunggah draf RAPBD (PDF/Excel) via Next.js UI.
   - Go Backend menerima file, simpan ke S3, catat metadata ke PostgreSQL Instance 1 (status: PENDING).
   - Go enqueue task ke Redis queue `swarm:tasks` via `LPUSH`.

2. **Fact Retrieval (MiroFish → Facts Layer):**
   - Python Worker (`BRPOP` pada `swarm:tasks`) mengambil task.
   - **Auditor Agent** query **Nemesis PostgreSQL Instance 2** untuk harga historis (read-only).
   - **Compliance Agent** query **OpenViking API** untuk pasal regulasi.
   - Data diterima **MENTAH** — **tidak ada RTK, tidak ada kompresi.** Akurasi 100% di atas segalanya.

3. **Swarm Debate (MiroFish Cognitive Layer):**
   - **Auditor Agent (Analis):** Evaluasi matematis harga vs data Nemesis. Output: MARKUP / WAJAR.
   - **Compliance Agent (Pengawas):** Review legalitas dengan RAG dari OpenViking. Output: Justifikasi regulasi.
   - **Manager Agent (Decision):** Konsensus akhir. Output: JSON `{"status": "FLAGGED"|"CLEARED", "manager_conclusion": "..."}`
   - **Caveman Prompt** memastikan output JSON kaku, tidak yapping, tidak halusinasi.

4. **Blockchain Audit Trail (Trust Layer) — Hash Flow Eksplisit:**
   - **Langkah A (Python):** Setelah konsensus, Manager Agent generate 2 hash:
     - `rationale_hash` — SHA256 dari seluruh log perdebatan (Auditor vs Pengawas).
     - `consensus_hash` — SHA256 dari keputusan akhir Manager Agent.
   - **Langkah B (Python → Go):** Kedua hash dikirim ke Go Backend melalui **Webhook Callback JSON** (field `hashes.rationale_hash` dan `hashes.consensus_hash`).
   - **Langkah C (Go → Sepolia):** Go Backend (Blockchain Committer) extract hash dari callback → call `insertLog(rationale_hash, consensus_hash)` ke Smart Contract `AuditTrail.sol` di Sepolia. **Menggunakan transaksi tipe EIP-1559 (Dynamic Fee)** dengan estimasi Gas Tip Cap dan Gas Fee Cap dinamis untuk menjamin kecepatan transaksi tanpa stuck di mempool.
   - **Langkah D (Go → DB):** Go Backend terima `tx_hash` dari Sepolia → update DB dengan `tx_hash` dan `status: VERIFIED`.
   - **Lifecycle:** Status awal `VERIFIED`. Jika ada koreksi data → `SUPERSEDED` + `CORRECTED`.

5. **Callback & Streaming (Go BE → FE):**
   - Python kirim hasil JSON ke Go via `POST /api/v1/swarm/callback`.
   - Go update DB (status: COMPLETED) dan `PUBLISH` ke Redis channel `swarm:events`.
   - Next.js FE menerima real-time log via SSE.

---

## 4. FRONTEND SPECIFICATIONS (Next.js)

### 4.1 Technology Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS, Radix UI primitives, shadcn/ui
- **State:** Zustand (pure in-memory, **NO localStorage persistence**)
- **Data Fetching:** TanStack Query (React Query)
- **Workflow Viz:** React Flow
- **Testing:** Playwright (E2E), Vitest (Unit), Storybook

### 4.2 BFF Proxy Architecture (CRITICAL SECURITY RULE)

**JANGAN PERNAH** menyimpan JWT di browser (localStorage/Zustand persist). Gunakan pola **Backend-for-Frontend (BFF) Proxy**.

#### How It Works:

1. Browser memanggil `/api/proxy/[...slug]` (Next.js API Route).
2. Next.js server membaca `access_token` dari **HTTP-Only Cookie** (server-side only).
3. Token disuntikkan ke header `Authorization: Bearer <token>`.
4. Request diteruskan ke Backend Go di `/api/v1/<slug>`.
5. Response dari Go diteruskan kembali ke browser.

#### Auth Routes (BFF Internal)

| Route                | Method | Function                                     |
| -------------------- | ------ | -------------------------------------------- |
| `/api/auth/login`    | POST   | Validate creds via Go, set HTTP-Only cookies |
| `/api/auth/logout`   | POST   | Clear cookies, invalidate server-side        |
| `/api/auth/refresh`  | POST   | Rotate access_token via cookie               |
| `/api/auth/register` | POST   | Create user via Go                           |

### 4.3 Key Frontend Components

#### SwarmReviewPanel (`src/components/swarm/SwarmReviewPanel.tsx`)

- **Style:** Terminal/CI-CD log (monospace, badges, skeleton loaders).
- **States:** IDLE → PROCESSING (skeleton + spinner) → COMPLETED/FAILED.
- **SSE:** `new EventSource('/api/proxy/swarm/events?task_id=${taskId}')`.
- **Badges:** Red `FLAGGED` (ShieldAlert) / Green `CLEARED` (CheckCircle2).

#### AgentChatPanel (`src/components/swarm/AgentChatPanel.tsx`)

- **Function:** Deep Interaction — user bisa chat langsung dengan agen spesifik.
- **Trigger:** Klik item yang di-flag di SwarmReviewPanel.
- **UI:** Clean chat interface (no avatars, enterprise style).

#### DocumentEditor (`src/components/editor/DocumentEditor.tsx`)

- **Integration:** Tombol "Swarm Review" bersanding dengan "Guardrail Check".
- **Highlight:** Item anggaran yang di-flag menyala merah di dokumen.

### 4.4 Auth & Session Rules (Enterprise-Grade)

- **No JWT on Client:** `access_token` dan `refresh_token` hanya di HTTP-Only Cookies (HttpOnly, Secure, SameSite=Strict).
- **Password Hashing:** Gunakan **Argon2id** (bukan bcrypt/SHA256). Parameter: memory=64MB, iterations=3, parallelism=4.
- **SSR-First:** Dashboard layout validasi session server-side sebelum render.
- **Hydration Fix:** Gunakan `_hasHydrated` flag di Zustand atau Next.js Middleware untuk cegah flicker redirect.

---

## 5. BACKEND SPECIFICATIONS (Go)

### 5.1 Technology Stack

- **Language:** Go 1.25+
- **Framework:** Gin
- **Database Instance 1:** PostgreSQL (IAM, Tenants, Permissions, Workflow Status)
- **Database Instance 2:** PostgreSQL (Nemesis SIRUP — read-only fact storage)
- **Staging DB:** MongoDB (Raw parsed docs, Agent rationale, Audit logs)
- **Vector DB:** Qdrant (Semantic search untuk regulasi)
- **Cache/Queue:** Redis (go-redis + Asynq)
- **Auth:** JWT (golang-jwt/jwt/v5, RS256) + Argon2id + OAuth 2.0 (Google, GitHub, Azure AD)
- **Blockchain:** go-ethereum (Sepolia/Amoy RPC)
- **Migration:** Goose (PostgreSQL), MongoDB scripts (indexes)
- **Docs:** Swagger (swaggo)
- **Monitoring:** Prometheus metrics

### 5.2 Clean Architecture Layers

```
cmd/server/main.go              → Entry point
internal/config/                → Viper-based config
internal/domain/                → Entities (User, Document, Workflow, SwarmTask)
internal/delivery/http/handler/ → HTTP handlers (Gin)
internal/delivery/http/routes/  → Route definitions
internal/usecase/               → Business logic (auth, document, swarm, workflow, rag, blockchain)
internal/repository/
  ├── postgres/                 → DB Instance 1 (IAM, workflow)
  └── mongodb/                  → DB Staging (raw docs, agent logs)
internal/infrastructure/        → External services (Redis, S3, Asynq, Ethereum RPC, Mail)
internal/middleware/            → Auth, RBAC, Logger, Recovery
```

### 5.3 Critical API Endpoints

#### Authentication

| Method | Path                    | Auth   | Description                     |
| ------ | ----------------------- | ------ | ------------------------------- |
| POST   | `/api/v1/auth/register` | Public | Registrasi user baru            |
| POST   | `/api/v1/auth/login`    | Public | Login, set refresh_token cookie |
| POST   | `/api/v1/auth/refresh`  | Public | Refresh access token            |
| POST   | `/api/v1/auth/logout`   | Public | Logout, hapus cookie            |
| GET    | `/api/v1/users/me`      | Bearer | Data user login                 |

#### OAuth 2.0 Providers

| Method | Path                                 | Auth   | Description                    |
| ------ | ------------------------------------ | ------ | ------------------------------ |
| GET    | `/api/v1/auth/oauth/google`          | Public | Redirect ke Google OAuth       |
| GET    | `/api/v1/auth/oauth/google/callback` | Public | Callback Google                |
| GET    | `/api/v1/auth/oauth/github`          | Public | Redirect ke GitHub OAuth       |
| GET    | `/api/v1/auth/oauth/github/callback` | Public | Callback GitHub                |
| POST   | `/api/v1/auth/verify-otp`            | Public | Verifikasi email OTP           |
| POST   | `/api/v1/auth/resend-otp`            | Public | Kirim ulang OTP (rate limited) |

#### Documents & RAG

| Method | Path                                     | Auth   | Description                                      |
| ------ | ---------------------------------------- | ------ | ------------------------------------------------ |
| GET    | `/api/v1/documents/presign?filename=...` | Bearer | Presigned S3 URL                                 |
| POST   | `/api/v1/documents/confirm`              | Bearer | Konfirmasi upload, trigger parsing ke MongoDB    |
| POST   | `/api/v1/documents/approve`              | Bearer | Approve dokumen dari MongoDB → Qdrant embed      |
| DELETE | `/api/v1/knowledge/:doc_id`              | Bearer | Hapus dokumen di MongoDB + drop vector di Qdrant |
| GET    | `/api/v1/documents`                      | Bearer | List docs                                        |
| POST   | `/api/v1/documents/search`               | Bearer | Hybrid RAG Search (Qdrant)                       |

#### Swarm (Multi-Agent Integration)

| Method | Path                     | Auth     | Description                                            |
| ------ | ------------------------ | -------- | ------------------------------------------------------ |
| POST   | `/api/v1/swarm/upload`   | Bearer   | Trigger Swarm Review. Push task ke Redis `swarm:tasks` |
| POST   | `/api/v1/swarm/callback` | Internal | Webhook dari MiroFish Python. Update DB + PubSub       |
| GET    | `/api/v1/swarm/events`   | Open\*   | SSE endpoint. Subscribe `swarm:events` Redis channel   |

#### Blockchain (Trust Layer)

| Method | Path                                 | Auth   | Description                             |
| ------ | ------------------------------------ | ------ | --------------------------------------- |
| POST   | `/api/v1/blockchain/commit`          | Bearer | Commit hash audit trail ke Sepolia      |
| GET    | `/api/v1/blockchain/verify/:task_id` | Bearer | Verify hash on-chain (Provenance Check) |
| GET    | `/api/v1/blockchain/status/:task_id` | Bearer | Get status from smart contract          |

> _Note: `/swarm/events` currently open for hackathon. For production, add token validation via query param._

### 5.4 Authentication Enterprise Specifications

#### 5.4.1 Password Hashing (Argon2id)

```go
import "golang.org/x/crypto/argon2"

func HashPassword(password string) (string, error) {
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil { return "", err }
    hash := argon2.IDKey([]byte(password), salt, 3, 64*1024, 4, 32)
    return fmt.Sprintf("$argon2id$v=19$m=65536,t=3,p=4$%x$%x", salt, hash), nil
}
```

- **Parameter:** memory=64MB, iterations=3, parallelism=4, salt=16 bytes, key=32 bytes
- **Jangan pernah gunakan bcrypt, PBKDF2, atau SHA-256 untuk password.**

#### 5.4.2 JWT Token Strategy

| Atribut      | Access Token                      | Refresh Token                     |
| ------------ | --------------------------------- | --------------------------------- |
| Algorithm    | RS256 (asymmetric)                | RS256 (asymmetric)                |
| Lifetime     | 15 menit                          | 30 hari                           |
| Storage      | HTTP-Only Cookie                  | HTTP-Only Cookie                  |
| Cookie Flags | HttpOnly, Secure, SameSite=Strict | HttpOnly, Secure, SameSite=Strict |
| Rotation     | Tidak                             | **Ya — setiap refresh**           |
| Redis Store  | Tidak perlu                       | **Ya — whitelist untuk revoke**   |

#### 5.4.3 Refresh Token Rotation & Reuse Detection

```go
func RefreshAccessToken(refreshToken string) (string, string, error) {
    claims, err := parseRefreshToken(refreshToken)
    if err != nil { return "", "", err }

    storedHash, err := redisClient.Get(ctx, "refresh:"+claims.JTI).Result()
    if err == redis.Nil || !compareHash(storedHash, refreshToken) {
        revokeAllUserSessions(claims.UserID)
        auditLog("REFRESH_TOKEN_REUSE_DETECTED", claims.UserID)
        return "", "", errors.New("token reuse detected, all sessions revoked")
    }

    newAccess, newRefresh := generateJWTPair(claims.UserID)
    redisClient.Set(ctx, "refresh:"+newRefresh.JTI, hashToken(newRefresh), 30*24*time.Hour)
    redisClient.Del(ctx, "refresh:"+claims.JTI)
    return newAccess, newRefresh, nil
}
```

#### 5.4.4 Rate Limiting (Auth Endpoints)

| Endpoint                | Limit | Window   | Per   |
| ----------------------- | ----- | -------- | ----- |
| POST `/auth/login`      | 5     | 15 menit | IP    |
| POST `/auth/register`   | 3     | 1 jam    | IP    |
| POST `/auth/refresh`    | 10    | 5 menit  | User  |
| POST `/auth/verify-otp` | 3     | 10 menit | Email |

#### 5.4.5 Email Verification OTP

- OTP: 6 digit numeric, expire 10 menit
- OTP di-hash SHA-256 sebelum disimpan di Redis (key: `otp:{email}`, TTL: 600s)
- Maksimal 3 percobaan per OTP. Jika gagal, OTP dihapus.
- Rate limit: 1 request OTP per 60 detik per email.

#### 5.4.6 Startup and Health Check Resiliency

- **Connection Retry Loops:** Saat inisialisasi, Go backend mencoba melakukan koneksi ke database Postgres dan Redis dengan retry loop (maksimal 15 kali, jeda 3 detik). Hal ini mencegah aplikasi mengalami _startup crash_ jika kontainer database/redis memerlukan waktu tambahan untuk siap menerima trafik.
- **Resilient Health Check Status:** Endpoint `/health` mengembalikan kode status HTTP `200 OK` bahkan ketika status koneksi ke Postgres atau Redis dalam keadaan terdegradasi (`degraded`). Hal ini penting agar sistem orkestrasi cloud (seperti Railway) tidak membatalkan atau mere-roll deployment akibat kendala koneksi temporer saat start-up, sementara status detail `"status": "degraded"` tetap tercantum dalam respon payload JSON.

### 5.5 Redis Communication Schema

#### Queue: `swarm:tasks`

- **Go:** `LPUSH swarm:tasks <json_payload>`
- **Python:** `BRPOP swarm:tasks 0`

#### Pub/Sub: `swarm:events`

- **Python (after completion):** `PUBLISH swarm:events <results_json>`
- **Go (SSE handler):** `SUBSCRIBE swarm:events`

### 5.6 Database Split Architecture

#### PostgreSQL Instance 1 (Operational)

- **Scope:** IAM, Tenants, Permissions, Workflow Status, User Metadata
- **Connection:** `DB_URL` → `postgres://user:pass@localhost:5432/elysian`
- **Karakteristik:** High-write, data sensitif, ukuran relatif kecil, krusial untuk availability.

#### PostgreSQL Instance 2 (Nemesis / SIRUP)

- **Scope:** Ground Truth procurement data (4GB+ SIRUP dataset)
- **Connection:** `NEMESIS_DB_URL` → `postgres://user:pass@localhost:5433/nemesis`
- **Karakteristik:** Read-Only selama audit, beban query analitik berat, dedicated instance.
- **Alasan Pemisahan:** Performance isolation, security & compliance, scalability flexibility.

#### MongoDB (Staging & QA Gate)

- **Scope:** Raw parsed documents, agent rationale logs, audit logs, schemaless metadata
- **Connection:** `MONGO_URI` → `mongodb://localhost:27017/elysian_staging`
- **Karakteristik:** Schemaless, flexible, ad-hoc query untuk QA approval.
- **Collections:** `raw_documents`, `agent_logs`, `audit_trails`, `workflow_metadata`

#### Qdrant (Vector DB Engine)

- **Scope:** Semantic embeddings untuk regulasi, Perda, Standar Harga Regional
- **Connection:** `QDRANT_HOST` → `http://localhost:6333`
- **Karakteristik:** HNSW vector search, Rust-native (konsisten dengan OpenViking).
- **Collection:** `elysian_regulations`

### 5.7 JSON Contract: Redis Payload (Go → Python)

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

> **Catatan Flow Blockchain:** Python Manager Agent generate hash (SHA256), kirim via field `blockchain_hash` di callback JSON. Go Backend menerima hash dan push ke Sepolia via `insertLog()`. Go adalah satu-satunya komponen yang berinteraksi dengan private key blockchain.

### 5.8 JSON Contract: Webhook Callback (Python → Go)

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
>
> 1. Python Manager Agent generate `rationale_hash` + `consensus_hash` (SHA256).
> 2. Hash dikirim ke Go via callback JSON (field `hashes.rationale_hash` dan `hashes.consensus_hash`).
> 3. Go Backend menerima callback → extract hash → call `insertLog(rationale_hash, consensus_hash)` ke `AuditTrail.sol` di Sepolia.
> 4. Go Backend terima `tx_hash` dari Sepolia → update DB dengan `tx_hash` dan `status: VERIFIED`.
> 5. Python TIDAK berinteraksi langsung dengan blockchain — Go adalah satu-satunya Blockchain Committer.

---

## 6. ML / SWARM SPECIFICATIONS (Python / MiroFish)

### 6.1 Technology Stack

- **Runtime:** Python 3.11+
- **Framework:** FastAPI (production-grade async API)
- **LLM Client:** OpenAI-compatible API (Menggunakan MiniMax AI provider, model `MiniMax-M2.5` untuk teks dan `embo-01` untuk embeddings)
- **Redis:** `redis-py` for queue consumption
- **Memory:** Zep Graph Memory (planned for Phase 2)
- **Output Style:** Caveman Prompt (JSON-only, strict, no yapping) dengan pembersihan regex `(?s)<think>.*?</think>` untuk membuang block pemikiran internal model.

### 6.2 The Three Agents

#### Agent 1: Auditor (Analis / Price Checker)

- **Persona:** Agen Analis (Auditor Anggaran) di Pemerintah Daerah.
- **Task:** Membandingkan item anggaran dengan data Nemesis (PostgreSQL Instance 2).
- **Prompt System (Caveman):**

```
Kamu adalah Agen Analis (Auditor Anggaran) di Pemerintah Daerah.
Tugasmu adalah membandingkan item anggaran yang diajukan dengan data Nemesis (SIRUP).
Jika harga yang diajukan lebih tinggi dari standar harga pasar wajar, nyatakan dengan tegas potensi MARKUP beserta selisih angkanya.
Jika wajar, nyatakan WAJAR.
Jawab secara analitis dan singkat (maksimal 3 kalimat).
JANGAN membulatkan angka. Gunakan nilai persis dari sumber data.
```

- **Tools:** Query Nemesis PostgreSQL Instance 2 untuk harga historis.

#### Agent 2: Compliance (Pengawas / Legal)

- **Persona:** Agen Pengawas (Compliance/Legal) di Pemerintah Daerah.
- **Task:** Mengevaluasi temuan Auditor dari sisi hukum/regulasi.
- **Prompt System (Caveman):**

```
Kamu adalah Agen Pengawas (Compliance/Legal) di Pemerintah Daerah.
Tugasmu adalah meninjau temuan dari Agen Analis dan mengevaluasi apakah ada justifikasi atau pasal regulasi yang mengizinkan pengecualian harga.
Jawab secara legal dan kepatuhan (maksimal 3 kalimat).
JANGAN membulatkan angka. Gunakan nilai persis dari sumber data.
```

- **Tools:** RAG search ke OpenViking (Qdrant) untuk pasal Perda/POJK.

#### Agent 3: Manager (Decision Maker / Consensus)

- **Persona:** Agen Manajer (Kepala Review).
- **Task:** Membaca temuan Auditor & Pengawas, lalu memberikan keputusan akhir JSON.
- **Prompt System (Caveman — JSON Strict):**

```
Kamu adalah Agen Manajer (Kepala Review).
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

### 6.3 Error Handling Strategy

| Error Type                   | Fallback Behavior                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **LLM Halusinasi / Yapping** | If Manager output is not valid JSON, parse string for keyword "FLAGGED". Default status: `CLEARED`. Log as `LLM_YAPPING_DETECTED`. |
| **OpenViking Timeout**       | Continue audit with empty context. Do NOT block pipeline.                                                                          |
| **Nemesis Data Missing**     | Log as `DATA_NOT_FOUND` and ask Auditor to use general knowledge.                                                                  |
| **Qdrant Vector Missing**    | Continue with empty RAG context. Log as `VECTOR_NOT_FOUND`.                                                                        |
| **Blockchain Tx Fail**       | Save hash locally. Retry up to 3x with exponential backoff. Log as `BLOCKCHAIN_RETRY`.                                             |
| **Webhook Retry**            | Save result to local file. Retry up to 3x with exponential backoff.                                                                |

### 6.4 Caveman Prompt Strategy (Replacing RTK)

#### Why Caveman?

CEO Indra menyatakan: _"Kalau basis-nya fact, better seadanya. Data fakta jangan di-compress."_

#### How It Works:

- **Tidak ada RTK** yang memotong token.
- Data dari Nemesis dan OpenViking masuk **MENTAH** ke LLM context.
- **Caveman Prompt** memaksa LLM untuk tidak berimprovisasi, tidak membulatkan angka, dan tidak memberikan narasi di luar format JSON.
- Trade-off: Biaya token lebih tinggi, tapi **akurasi 100%** untuk dokumen finansial.

#### Caveman vs RTK

| Aspek              | RTK (v2.0, DROPPED)            | Caveman Prompt (v3.0)       |
| ------------------ | ------------------------------ | --------------------------- |
| **Mekanisme**      | Kompresi teks (Rust CLI)       | Prompt engineering (Python) |
| **Data Integrity** | Risiko angka terpotong         | 100% utuh                   |
| **Token Cost**     | Hemat 60-90%                   | Lebih mahal                 |
| **Akurasi Audit**  | Berisiko halusinasi            | Maksimal                    |
| **Complexity**     | Butuh binary Rust + cache mgmt | Pure prompt, zero infra     |

### 6.5 financial-services Integration (Cookbook Library)

#### Pattern: Read-Only Reference

- **Jangan import** seluruh repo `financial-services` ke MiroFish.
- **Copy-paste & adapt** prompt templates dan skill logic ke folder `mirofish-engine/cookbooks-financial/`.
- **Adaptasi wajib:** Ubah terminology Wall Street ("investment banking") menjadi terminology Pemda ("RAPBD", "Standar Harga Regional", "POJK").

#### Key Assets to Extract

| Source in financial-services                                    | Destination in MiroFish             | Purpose                                   |
| --------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `managed-agent-cookbooks/statement-auditor/flagger.yaml`        | `cookbooks-financial/flagger.md`    | Prompt untuk menandai item markup         |
| `managed-agent-cookbooks/gl-reconciler/reconciler.yaml`         | `cookbooks-financial/reconciler.md` | Prompt pencocokan harga vs data eksternal |
| `plugins/vertical-plugins/financial-analysis/skills/audit-xls/` | `cookbooks-financial/audit-xls.md`  | Logika analisis Excel RAPBD               |
| `plugins/vertical-plugins/operations/skills/kyc-rules/`         | `cookbooks-financial/kyc-rules.md`  | Prompt compliance regulasi POJK/Perda     |

### 6.6 Nemesis DB Search Resilience

MiroFish Swarm Worker menggunakan mekanisme pencarian tangguh untuk pencocokan standar harga di database Nemesis:

1. **Case-Insensitive Match (`ILIKE`):** Menggunakan query SQL case-insensitive agar variasi huruf kapital tidak menggagalkan pencarian.
2. **First-Word Fallback:** Jika pencarian menggunakan nama lengkap item (misal: "Laptop IT Acer") tidak menghasilkan kecocokan (0 sampel), worker secara otomatis memotong query dan mencoba kembali menggunakan kata pertama saja (misal: "Laptop") untuk menemukan standar harga batas atas yang masuk akal.

---

## 7. OPENVIKING SPECIFICATIONS

### 7.1 Role in Ecosystem

OpenViking adalah **"The Librarian"** — menyimpan dan mengambil konteks regulasi. Bukan sekadar parser PDF, tapi **Rust parser + MongoDB staging + Qdrant vector engine** terintegrasi.

### 7.2 Ingestion Pipeline (NEW: QA Gate)

```
Upload PDF Perda/SHR
    ↓
OpenViking Rust Parser (chunking + cleaning)
    ↓
MongoDB (collection: raw_documents, status: PENDING_QA)
    ↓
Human Approval Gate (Frontend UI: "Approve Data untuk RAG")
    ↓
Qdrant (embed approved chunks, collection: elysian_regulations)
```

### 7.3 Upsert / Replace Mechanism

Jika dokumen salah dan perlu dikoreksi:

1. Hapus dokumen dari MongoDB: `db.raw_documents.deleteOne({doc_id: "xxx"})`
2. Drop vector di Qdrant: `DELETE /collections/elysian_regulations/points/{point_id}`
3. Upload dokumen koreksi → ulangi pipeline dari awal.

### 7.4 Key API Endpoints

| Method | Path                           | Purpose                                   |
| ------ | ------------------------------ | ----------------------------------------- |
| POST   | `/api/v1/resources`            | Upload PDF ke staging (MongoDB)           |
| POST   | `/api/v1/search/find`          | Semantic retrieval (Qdrant vector search) |
| POST   | `/api/v1/search/search`        | Context-aware retrieval (with session)    |
| GET    | `/api/v1/content/read?uri=...` | Read full content from MongoDB            |
| POST   | `/api/v1/ingestion/approve`    | Approve MongoDB doc → Qdrant embed        |
| DELETE | `/api/v1/ingestion/:doc_id`    | Delete doc + drop vector                  |

### 7.5 Integration Pattern

1. Admin upload dokumen Perda/SHR via Elysian UI.
2. OpenViking parse → simpan ke MongoDB (status: PENDING_QA).
3. Auditor manusia review di UI, klik "Approve".
4. OpenViking embed approved chunks ke Qdrant.
5. MiroFish Compliance Agent query: `POST /api/v1/search/find` dengan item description.
6. Qdrant return relevant pasal/regulasi.
7. Data masuk MENTAH ke LLM prompt (tanpa RTK).

---

## 8. NEMESIS SPECIFICATIONS

### 8.1 Role in Ecosystem

Nemesis adalah **"The Ground Truth"** — sumber data riil pengadaan barang/jasa Indonesia dari SIRUP.

### 8.2 Data Structure (Migrated to PostgreSQL)

- **Format:** PostgreSQL Instance 2 (migrasi dari SQLite 4GB+).
- **Source:** SIRUP (Sistem Informasi Rencana Umum Pengadaan).
- **Content:** Jutaan baris data historis pengadaan pemerintah (item, harga, vendor, wilayah, tahun).
- **Access:** Read-Only selama proses audit.
- **Isolation:** Dedicated instance untuk performance isolation.

### 8.3 Integration Pattern

1. MiroFish Auditor Agent receives item name (e.g., "Laptop Acer").
2. Query Nemesis PostgreSQL Instance 2:
   ```sql
   SELECT AVG(unit_price), MIN(unit_price), MAX(unit_price), COUNT(*)
   FROM procurement
   WHERE item_name ILIKE '%laptop%'
     AND region = 'Purbalingga'
     AND year BETWEEN 2024 AND 2026;
   ```
3. Return historical price range.
4. Data masuk MENTAH ke LLM prompt (tanpa RTK).

### 8.4 Setup Notes

```bash
# Migrate from SQLite to PostgreSQL Instance 2
pgloader sqlite:///path/to/dashboard.sqlite postgresql://user:pass@localhost:5433/nemesis

# Or import from SQL dump
psql -h localhost -p 5433 -U nemesis_readonly -d nemesis < data/dashboard.sql
psql -h localhost -p 5433 -U nemesis_readonly -d nemesis < data/patch-v1-to-v2.sql
```

### 8.5 Connection Security

- **User:** `nemesis_readonly` (hanya SELECT privilege).
- **No Write Access:** MiroFish tidak boleh menulis ke Nemesis.
- **Connection Pooling:** Gunakan `pgxpool` di Go, `psycopg2.pool` di Python.

---

## 9. BLOCKCHAIN SPECIFICATIONS (Trust Layer)

### 9.1 Role in Ecosystem

Trust Layer menjamin **immutability** audit trail. Setiap keputusan agen di-hash dan disimpan di Public EVM Testnet.

### 9.2 Technology Stack

- **Chain:** Sepolia Testnet (primary) / Amoy Testnet (backup)
- **Contract:** Solidity `AuditTrail.sol`
- **Deployment:** Hardhat
- **Go Integration:** go-ethereum (`ethclient.Dial`)

### 9.3 Smart Contract: AuditTrail.sol

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
        bytes32 prevTx;
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

### 9.4 Lifecycle States

| State        | Arti                           | Transisi       |
| ------------ | ------------------------------ | -------------- |
| `VERIFIED`   | Audit pertama kali, hash aktif | → `SUPERSEDED` |
| `SUPERSEDED` | Hash lama digantikan           | Final          |
| `CORRECTED`  | Hash baru hasil koreksi data   | → `SUPERSEDED` |

### 9.5 Why Public EVM Testnet?

CEO Indra: _"Blockchain taro di tempat yang ez, selama EVM dimanapun dia bisa jalan, coba pakai testnet yang faucetnya gampang."_

**Keuntungan:**

- Tidak perlu setup node sendiri (Quorum private butuh DevOps serius).
- Faucet Sepolia melimpah, development cepat.
- Juri bisa langsung verifikasi tx di block explorer publik.
- Solidity familiar, tooling lengkap (Hardhat, Ethers.js).

### 9.6 Go Integration Example

```go
import "github.com/ethereum/go-ethereum/ethclient"

func CommitToBlockchain(taskID string, rationaleHash, consensusHash [32]byte) (string, error) {
    client, err := ethclient.Dial("https://rpc.sepolia.org")
    if err != nil { return "", err }

    // Load private key from secure storage (Vault / env)
    // Call insertLog on deployed contract
    txHash, err := contract.InsertLog(...)
    return txHash.Hex(), nil
}
```

---

## 10. OBSERVABILITY SPECIFICATIONS (NEW)

### 10.1 Purpose

Prof menyatakan bahwa observability wajib ada — minimal untuk hackathon dengan Prometheus metrics. Juri enterprise akan tanya: "Bagaimana Anda tahu sistem sedang sehat?"

### 10.2 Required Metrics

| Metric                                | Tool       | Collection Method       | Alert Threshold               |
| ------------------------------------- | ---------- | ----------------------- | ----------------------------- |
| **Redis queue depth** (`swarm:tasks`) | Prometheus | `redis_exporter`        | > 100 tasks = backlog         |
| **Agent latency per task**            | Prometheus | Custom Go middleware    | > 5 menit = slow              |
| **Qdrant query latency**              | Prometheus | Qdrant built-in metrics | > 500ms = degraded            |
| **Blockchain tx confirmation time**   | Prometheus | Custom Go metric        | > 2 menit = Sepolia congested |
| **LLM API error rate**                | Prometheus | Custom Python metric    | > 5% errors = rate limit      |
| **Nemesis query latency**             | Prometheus | Custom Python metric    | > 2 detik = slow query        |

### 10.3 Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: "elysian-backend"
    static_configs:
      - targets: ["backend-elysian:9090"]
  - job_name: "redis"
    static_configs:
      - targets: ["redis-exporter:9121"]
  - job_name: "qdrant"
    static_configs:
      - targets: ["qdrant:6333"]
  - job_name: "mirofish"
    static_configs:
      - targets: ["mirofish-engine:8000"]
```

### 10.4 Grafana Dashboard (Opsional untuk Hackathon)

- Panel 1: Redis Queue Depth (real-time)
- Panel 2: Swarm Task Latency Distribution (histogram)
- Panel 3: Qdrant Query Latency (line graph)
- Panel 4: Blockchain Tx Status (table)

> **Note:** Untuk hackathon, cukup deploy Prometheus + basic metrics. Grafana sebagai nice-to-have di slide presentasi. Untuk production, Grafana wajib.

### 10.5 LLM Rate Limiting & Retry

Dokumen RAPBD besar dengan 3 agent bisa hit OpenAI rate limit dengan cepat. Implementasi wajib:

```python
# Python (MiroFish) — exponential backoff
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=2, max=60),
    retry=retry_if_exception_type((RateLimitError, APITimeoutError))
)
async def call_llm_with_backoff(prompt: str) -> str:
    return await openai_client.chat.completions.create(...)
```

| Parameter           | Nilai                                      |
| ------------------- | ------------------------------------------ |
| Max retries         | 3                                          |
| Base delay          | 2 detik                                    |
| Max delay           | 60 detik                                   |
| Requests per minute | 20 (configurable via env)                  |
| Batch size          | 5 items per LLM call (untuk dokumen besar) |

---

---

## 11. ENVIRONMENT & CONFIGURATION

### 11.1 Backend Go (.env)

```bash
# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=7777
SERVER_ENVIRONMENT=development

# Database — Instance 1 (Operational: IAM, Tenants, Permissions)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elysian
DB_USER=postgres
DB_PASSWORD=secret

# Database — Instance 2 (Nemesis / SIRUP Ground Truth)
NEMESIS_DB_HOST=localhost
NEMESIS_DB_PORT=5433
NEMESIS_DB_NAME=nemesis
NEMESIS_DB_USER=nemesis_readonly
NEMESIS_DB_PASSWORD=secret

# MongoDB (Staging & QA Gate)
MONGO_URI=mongodb://localhost:27017/elysian_staging
MONGO_DB_NAME=elysian_staging

# Redis (Asynq + Auth Cache + SSE PubSub)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Qdrant (Vector DB for RAG)
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_COLLECTION=elysian_regulations

# AI / LLM
LLM_API_KEY=your_openai_key
LLM_BASE_URL=https://api.openai.com/v1

# S3 Storage
S3_ENDPOINT=minio.example.com
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=elysian-docs
S3_REGION=us-east-1

# JWT (RS256 — asymmetric, requires private + public key pair)
JWT_PRIVATE_KEY_PATH=/etc/elysian/jwt-private.pem
JWT_PUBLIC_KEY_PATH=/etc/elysian/jwt-public.pem
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=720h

# Blockchain (Sepolia Testnet)
ETH_RPC_URL=https://rpc.sepolia.org
ETH_PRIVATE_KEY=0x...
ETH_CONTRACT_ADDRESS=0x...
ETH_CHAIN_ID=11155111

# OAuth 2.0 Providers
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_GOOGLE_REDIRECT_URL=http://localhost:7777/api/v1/auth/oauth/google/callback

OAUTH_GITHUB_CLIENT_ID=your_github_client_id
OAUTH_GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_GITHUB_REDIRECT_URL=http://localhost:7777/api/v1/auth/oauth/github/callback

# Email / OTP (SMTP or SendGrid)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@elysian.id

# Argon2id (password hashing)
ARGON2ID_MEMORY=65536
ARGON2ID_ITERATIONS=3
ARGON2ID_PARALLELISM=4

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 11.2 MiroFish Python (.env)

```bash
# LLM Provider (OpenAI-compatible)
LLM_API_KEY=your_openai_or_qwen_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini

# Redis (same as Go)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

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

# Zep Graph Memory (Phase 2)
ZEP_API_KEY=your_zep_key
ZEP_BASE_URL=http://localhost:8000

# FastAPI
PYTHON_API_HOST=0.0.0.0
PYTHON_API_PORT=5001
PYTHON_API_DEBUG=true
```

### 11.3 OpenViking + Qdrant Config

```toml
# openviking-config.toml
[parser]
pdf_engine = "pdfium"
chunk_size = 512
chunk_overlap = 50

[mongodb]
uri = "mongodb://localhost:27017"
database = "elysian_staging"
collection = "raw_documents"

[qdrant]
host = "localhost"
port = 6333
collection = "elysian_regulations"
embedding_model = "text-embedding-3-small"
vector_size = 1536
```

### 11.4 Trust Layer (Hardhat .env)

```bash
# Sepolia Testnet
SEPOLIA_RPC_URL=https://rpc.sepolia.org
SEPOLIA_PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=your_etherscan_key

# Amoy Testnet (backup)
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AMOY_PRIVATE_KEY=0x...
```

---

## 12. IMPLEMENTATION ROADMAP (Quick Reference)

### Fase 1: Foundation (2 Minggu)

- [ ] **Setup Prometheus metrics** (Redis queue depth, agent latency, Qdrant latency, blockchain tx time)
- [ ] Reorganisasi folder sesuai Target Directory Structure
- [ ] Setup PostgreSQL Instance 2 (Nemesis migration SQLite → PostgreSQL)
- [ ] Setup MongoDB (staging area + QA Gate collection)
- [ ] Setup Qdrant (vector engine untuk OpenViking)
- [ ] Hapus semua dependency RTK dari pipeline

### Fase 2: Backend & Pipeline (2 Minggu)

- [ ] Go Backend: Split DB connection (DB_URL + NEMESIS_DB_URL + MONGO_URI)
- [ ] Go Backend: Integrasi MongoDB repository (staging CRUD)
- [ ] Go Backend: Blockchain client (go-ethereum Sepolia RPC)
- [ ] OpenViking: Pipeline MongoDB → Qdrant (dengan approval gate)
- [ ] MiroFish: Update swarm_worker.py (direct query, no RTK)
- [ ] MiroFish: Implementasi Caveman Prompt (JSON-only output)

### Fase 3: Blockchain & Trust Layer (1 Minggu)

- [ ] Deploy `AuditTrail.sol` ke Sepolia Testnet
- [ ] Go Backend: Endpoint verify hash on-chain
- [ ] MiroFish: Generate hash + trigger blockchain commit
- [ ] Frontend: Badge "Verified on Sepolia"

### Fase 4: financial-services Integration (1 Minggu)

- [ ] Porting prompt templates ke `cookbooks-financial/`
- [ ] Adaptasi terminology ke konteks Pemda
- [ ] Benchmark Caveman Prompt vs baseline

### Fase 5: Observability & Polish (1 Minggu)

- [ ] **Prometheus**: Deploy scrape targets untuk Redis, Go Backend, MiroFish, Qdrant
- [ ] **Grafana**: Setup dashboard basic (opsional untuk hackathon)
- [ ] **LLM Rate Limiting**: Implementasi exponential backoff + retry logic di MiroFish
- [ ] SwarmReviewPanel (Terminal Log SSE)
- [ ] AgentChatPanel (Deep Interaction)
- [ ] E2E Test: Happy Path Upload → Flagged
- [ ] Security Audit: HTTP-Only Cookie + BFF Proxy

---

## 13. DIRECTORY TREE REFERENCE (Target Structure)

```
PROJECT ELYSIAN +MIROFISH/
├── AGENTS.md                          # Dokumen ini (LIVE)
├── IMPLEMENTATION_PLAN_V3.md          # Blueprint implementasi
├── README.md                          # Overview untuk kontributor
│
├── frontend-elysian/                  # 🌐 Next.js BFF
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   ├── app/api/proxy/[...slug]/
│   ├── app/api/auth/
│   ├── middleware.ts
│   └── Dockerfile
│
├── backend-elysian/                   # 🧠 Go Orchestrator
│   ├── cmd/server/
│   ├── internal/
│   │   ├── config/
│   │   ├── domain/
│   │   ├── delivery/http/
│   │   ├── usecase/
│   │   ├── repository/
│   │   │   ├── postgres/
│   │   │   └── mongodb/
│   │   └── infrastructure/
│   ├── migrations/
│   └── Dockerfile
│
├── mirofish-engine/                   # 🤖 Python Swarm
│   ├── swarm_worker.py
│   ├── agents/
│   ├── prompts/caveman/
│   ├── cookbooks-financial/           # [financial-services integration]
│   ├── services/
│   └── Dockerfile
│
├── openviking-librarian/              # 📚 Rust RAG + Qdrant
│   ├── src/
│   ├── scripts/
│   │   ├── ingest_pdf.py
│   │   └── approve_to_qdrant.py
│   └── Dockerfile
│
├── nemesis-groundtruth/               # 🗄️ PostgreSQL Instance 2
│   ├── data/
│   ├── migrations/
│   └── docker-compose.yml
│
├── trust-layer/                       # ⛓️ Solidity Smart Contracts
│   ├── contracts/AuditTrail.sol
│   ├── scripts/deploy_sepolia.py
│   └── hardhat.config.ts
│
└── infrastructure/                    # 🏗️ DevOps
    ├── docker-compose.infra.yml       # Redis, MongoDB, Qdrant
    ├── nginx/
    └── monitoring/
```

---

> **Catatan Akhir:** AGENTS.md ini adalah **dokumen hidup (living document)**. Setiap kali ada perubahan arsitektur, database, atau flow, wajib memperbarui dokumen ini agar selaras dengan kode aktual. Versi ini (v3.0) menggantikan seluruh isi v2.1.0.
