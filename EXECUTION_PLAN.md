# EXECUTION PLAN — Elysian v3.0 Integration

> **Tanggal:** Mei 2026  
> **Versi:** 3.0.1 (Ready for Execution)  
> **Scope:** Integrasi FE/BE/ML + Data + Blockchain + Observability  
> **Timeline:** 7 minggu (target September Hackathon)

---

## STEP 1: REORGANISASI FOLDER (Minggu 1)

**Target:** Pisahkan monolit jadi 6 repo terpisah.

```
BEFORE (monolit):
Frontend-Elysian-Rebirth/
├── Backend-Elysian-/   ← ← ← SALAH: BE di dalam FE
├── app/
├── components/
└── ...

AFTER (6 repo terpisah):
frontend-elysian/          ← Next.js BFF (pindah dari Frontend-Elysian-Rebirth/)
backend-elysian/           ← Go (pindah dari Frontend-Elysian-Rebirth/Backend-Elysian-/)
mirofish-engine/           ← Python (pindah dari MiroFish/)
openviking-librarian/      ← Rust (pindah dari OpenViking/)
nemesis-groundtruth/       ← PostgreSQL Instance 2 (baru)
trust-layer/               ← Solidity (baru)
```

**Action:**
```bash
# 1.1 Pindah FE
mv Frontend-Elysian-Rebirth/ frontend-elysian/

# 1.2 Pindah BE (dari dalam FE)
mv frontend-elysian/Backend-Elysian-/ backend-elysian/

# 1.3 Pindah MiroFish
mv MiroFish/ mirofish-engine/

# 1.4 Pindah OpenViking
mv OpenViking/ openviking-librarian/

# 1.5 Buat repo baru
mkdir nemesis-groundtruth/
mkdir trust-layer/
mkdir infrastructure/
```

---

## STEP 2: INFRASTRUCTURE (Minggu 1)

**Target:** Semua database + Redis + Qdrant jalan.

```bash
# docker-compose.infra.yml
docker-compose -f infrastructure/docker-compose.infra.yml up -d
```

| Service | Port | Status Check |
|---|---|---|
| Redis | 6379 | `redis-cli ping` → PONG |
| PostgreSQL-1 (IAM) | 5432 | `psql -U postgres -d elysian` |
| PostgreSQL-2 (Nemesis) | 5433 | `psql -U nemesis_readonly -d nemesis` |
| MongoDB | 27017 | `mongosh --eval "db.adminCommand('ping')"` |
| Qdrant | 6333 | `curl http://localhost:6333` |
| Prometheus | 9090 | `curl http://localhost:9090/-/healthy` |

---

## STEP 3: NEMESIS MIGRASI (Minggu 1)

**Target:** SQLite 4GB → PostgreSQL Instance 2.

```bash
# 3.1 Install pgloader
apt-get install pgloader

# 3.2 Migrate
pgloader sqlite:///nemesis-groundtruth/data/dashboard.sqlite \
  postgresql://nemesis_admin:secret@localhost:5433/nemesis

# 3.3 Buat user read-only
psql -h localhost -p 5433 -U nemesis_admin -d nemesis <<EOF
CREATE USER nemesis_readonly WITH PASSWORD 'secret';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO nemesis_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO nemesis_readonly;
EOF

# 3.4 Verifikasi
psql -h localhost -p 5433 -U nemesis_readonly -d nemesis \
  -c "SELECT COUNT(*) FROM procurement_items;"
```

---

## STEP 4: BACKEND GO — CORE API (Minggu 2)

**File:** `backend-elysian/internal/`

```
backend-elysian/
├── cmd/server/main.go
├── internal/
│   ├── config/              ← load .env (DB_URL + NEMESIS_DB_URL + MONGO_URI)
│   ├── domain/
│   │   ├── user.go
│   │   ├── swarm_task.go
│   │   └── blockchain_tx.go
│   ├── delivery/http/
│   │   ├── handler/
│   │   │   ├── auth_handler.go
│   │   │   ├── swarm_handler.go      ← POST /api/v1/swarm/upload
│   │   │   └── blockchain_handler.go ← POST /api/v1/blockchain/verify
│   │   ├── routes/
│   │   └── middleware/
│   ├── usecase/
│   │   ├── auth_usecase.go
│   │   ├── swarm_usecase.go          ← LPUSH redis + HandleCallback
│   │   └── blockchain_usecase.go     ← go-ethereum Sepolia RPC
│   ├── repository/
│   │   ├── postgres/                 ← Instance 1 (IAM)
│   │   └── mongodb/                  ← Staging (raw docs)
│   └── infrastructure/
│       ├── redis/
│       ├── ethereum/                 ← go-ethereum client
│       └── prometheus/               ← metrics exporter
```

**Endpoint Prioritas:**
| # | Endpoint | Method | Status |
|---|---|---|---|
| 1 | `/api/v1/auth/login` | POST | 🔴 |
| 2 | `/api/v1/auth/refresh` | POST | 🔴 |
| 3 | `/api/v1/swarm/upload` | POST | 🔴 |
| 4 | `/api/v1/swarm/callback` | POST | 🔴 |
| 5 | `/api/v1/swarm/events` | GET (SSE) | 🔴 |
| 6 | `/api/v1/blockchain/verify/:id` | GET | 🔴 |

---

## STEP 5: BACKEND GO — BLOCKCHAIN (Minggu 2-3)

**File:** `trust-layer/contracts/AuditTrail.sol`

```solidity
// Deploy ke Sepolia
// 1. Install deps
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

// 2. Deploy
npx hardhat run scripts/deploy_sepolia.js --network sepolia

// 3. Simpan contract address ke .env Go
ETH_CONTRACT_ADDRESS=0x...
```

**Go Integration:**
```go
// backend-elysian/internal/infrastructure/ethereum/client.go
package ethereum

import (
    "github.com/ethereum/go-ethereum/ethclient"
)

type Client struct {
    client *ethclient.Client
    contract *AuditTrail
}

func (c *Client) InsertLog(taskID string, rationaleHash, consensusHash [32]byte) (string, error) {
    // call insertLog on Sepolia
    tx, err := c.contract.InsertLog(...)
    return tx.Hash().Hex(), nil
}
```

---

## STEP 6: MIROFISH — SWARM ENGINE (Minggu 3)

**File:** `mirofish-engine/`

```
mirofish-engine/
├── swarm_worker.py              ← BRPOP redis → run agents → callback
├── agents/
│   ├── __init__.py
│   ├── auditor_agent.py         ← query Nemesis PG Instance 2
│   ├── compliance_agent.py      ← query OpenViking API
│   └── manager_agent.py         ← generate hash + JSON output
├── prompts/
│   └── caveman/
│       ├── auditor.md
│       ├── compliance.md
│       └── manager.md           ← JSON-only, strict
├── cookbooks-financial/         ← [from financial-services]
│   ├── audit-xls.md
│   ├── statement-auditor.md
│   └── kyc-rules.md
├── services/
│   ├── nemesis_client.py        ← psycopg2 → PG Instance 2
│   ├── openviking_client.py     ← requests → OpenViking API
│   └── blockchain_hasher.py     ← SHA256 generator
└── requirements.txt
```

**Caveman Prompt (manager.md):**
```markdown
Kamu adalah Agen Manajer (Kepala Review).

ATURAN KAKU:
1. HANYA JSON valid. JANGAN narasi di luar JSON.
2. Jika data tidak ada → null.
3. Jangan membulatkan angka.
4. "FLAGGED" = markup tanpa justifikasi.
5. "CLEARED" = wajar atau justifikasi kuat.

FORMAT:
{
  "status": "FLAGGED" | "CLEARED",
  "manager_conclusion": "max 2 kalimat",
  "confidence_score": 0.0 - 1.0
}
```

---

## STEP 7: OPENVIKING — RAG PIPELINE (Minggu 3-4)

**File:** `openviking-librarian/`

```
openviking-librarian/
├── src/                         ← Rust parser + chunker
├── scripts/
│   ├── ingest_pdf.py            ← PDF → MongoDB (status: PENDING_QA)
│   └── approve_to_qdrant.py     ← MongoDB (APPROVED) → Qdrant embed
└── qdrant-config/
    └── collection.yaml
```

**Flow:**
```
Upload PDF
    ↓
openviking-librarian/src/parser (Rust)
    ↓
MongoDB (collection: raw_documents, status: PENDING_QA)
    ↓
[Human Approval via Elysian UI]
    ↓
MongoDB (status: APPROVED)
    ↓
openviking-librarian/scripts/approve_to_qdrant.py
    ↓
Qdrant (collection: elysian_regulations)
```

---

## STEP 8: FRONTEND — BFF + SSE (Minggu 4)

**File:** `frontend-elysian/`

```
frontend-elysian/
├── app/
│   ├── api/
│   │   ├── proxy/[...slug]/route.ts    ← Catch-all → Go Backend
│   │   ├── auth/
│   │   │   ├── login/route.ts          ← HTTP-Only Cookie
│   │   │   ├── logout/route.ts
│   │   │   └── refresh/route.ts
│   │   └── proxy/swarm/events/route.ts ← SSE proxy
│   └── (dashboard)/
│       └── workflow/
├── components/
│   ├── swarm/
│   │   ├── SwarmReviewPanel.tsx        ← Terminal log SSE
│   │   └── AgentChatPanel.tsx          ← Deep interaction
│   └── editor/
│       └── DocumentEditor.tsx
├── lib/
│   └── http.ts                         ← baseURL: /api/proxy
├── store/
│   └── authStore.ts                    ← pure in-memory, NO persist
└── middleware.ts                       ← SSR auth guard
```

**BFF Proxy Route:**
```typescript
// app/api/proxy/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const slug = req.nextUrl.pathname.replace('/api/proxy', '');
  
  const res = await fetch(`http://localhost:7777/api/v1${slug}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return NextResponse.json(await res.json());
}
```

---

## STEP 9: INTEGRASI END-TO-END (Minggu 5)

**Target:** Semua komponen ngomong satu sama lain.

```
Test Case: Upload RAPBD → Detect Markup → Verify Blockchain

Step 9.1: FE → BE
  curl -X POST http://localhost:3000/api/proxy/swarm/upload \
    -F "file=@RAPBD_2026.pdf" \
    -H "Cookie: access_token=..."
  
  Expected: 200, task_id returned

Step 9.2: BE → Redis
  redis-cli LRANGE swarm:tasks 0 0
  
  Expected: JSON payload dengan task_id

Step 9.3: Redis → MiroFish
  tail -f mirofish-engine/logs/worker.log
  
  Expected: "Task received", agent logs

Step 9.4: MiroFish → Nemesis (PG Instance 2)
  psql -h localhost -p 5433 -U nemesis_readonly \
    -c "SELECT query FROM pg_stat_statements WHERE query LIKE '%procurement%'"
  
  Expected: SELECT query executed

Step 9.5: MiroFish → OpenViking
  curl http://localhost:1929/api/v1/search/find \
    -d '{"query": "standar harga laptop"}'
  
  Expected: JSON dengan relevant pasal

Step 9.6: MiroFish → Go (Callback)
  curl -X POST http://localhost:7777/api/v1/swarm/callback \
    -d '{"task_id": "...", "hashes": {"rationale_hash": "0x...", "consensus_hash": "0x..."}}'
  
  Expected: 200, Go menerima hash

Step 9.7: Go → Sepolia
  npx hardhat console --network sepolia
  > const contract = await ethers.getContractAt("AuditTrail", "0x...")
  > await contract.getStatus("task_id")
  
  Expected: Status.VERIFIED (0)

Step 9.8: Go → FE (SSE)
  EventSource('/api/proxy/swarm/events?task_id=...')
  
  Expected: Real-time log stream, FLAGGED badge muncul
```

---

## STEP 10: OBSERVABILITY + LOAD TEST (Minggu 6-7)

**Target:** Sistem terukur dan ter-monitor.

```
Step 10.1: Prometheus Metrics
  curl http://localhost:9090/metrics
  
  Expected:
  - redis_queue_depth{queue="swarm:tasks"} 0
  - agent_latency_seconds_bucket{le="300"} 42
  - qdrant_query_latency_ms 45
  - blockchain_tx_confirmation_seconds 18

Step 10.2: Load Test (100 concurrent tasks)
  # Script: scripts/load_test.py
  import asyncio, aiohttp
  
  async def upload_task(session, file):
      async with session.post('/api/proxy/swarm/upload', data=file) as resp:
          return await resp.json()
  
  async def main():
      async with aiohttp.ClientSession() as session:
          tasks = [upload_task(session, file) for _ in range(100)]
          results = await asyncio.gather(*tasks)
          print(f"Success: {len([r for r in results if r['status'] == 'ok'])}/100")
  
  asyncio.run(main())

Step 10.3: Security Audit
  # Verifikasi: tidak ada JWT di localStorage
  browser DevTools → Application → Local Storage → kosong
  
  # Verifikasi: HTTP-Only Cookie
  browser DevTools → Application → Cookies → access_token (HttpOnly: true)

Step 10.4: E2E Test (Playwright)
  npx playwright test e2e/swarm_review.spec.ts
  
  Expected: Upload → Processing → FLAGGED → Chat Panel → Verified on Sepolia
```

---

## RINGKASAN EXECUTION

| Minggu | Step | Fokus | Output |
|---|---|---|---|
| 1 | 1-3 | Reorganisasi + Infra + Nemesis | 6 repo terpisah, semua DB jalan, data SIRUP migrated |
| 2 | 4-5 | Go Backend + Blockchain | API auth jalan, Sepolia contract deployed |
| 3 | 6 | MiroFish Swarm | 3 agent berdebat, output JSON valid |
| 4 | 7-8 | OpenViking + Frontend | RAG pipeline + BFF Proxy + SSE streaming |
| 5 | 9 | E2E Integration | Upload → Flagged → Blockchain verified (Happy Path) |
| 6-7 | 10 | Observability + Load Test | Prometheus metrics, 100 concurrent tasks pass |

---

---

## LOG IMPLEMENTASI — Batch Fix (Mei 2026)

> Tanggal: 15–16 Mei 2026  
> Status: Selesai & Terverifikasi  
> Scope: Bug fixes + End-to-End Swarm Flow Integration

### 1. Swarm Upload 500 Error — Database Schema Fix

**Problem:** `ERROR: column "rationale_hash" of relation "swarm_tasks" does not exist`

**Root Cause:**
- Migration asli `20260430000003_swarm_tasks.sql` tidak membuat kolom blockchain
- GORM snake_case mapping mismatch: struct field `BlockchainNet` → mencari kolom `blockchain_net` (bukan `blockchain_network`)

**Fix:**
- `be/internal/config/loader.go` — tambah parsing `REDIS_DB` dari env var (`strconv.Atoi`)
- `be/migrations/20260516000001_add_swarm_blockchain_fields.sql` — migration proper dengan kolom:
  - `rationale_hash`, `consensus_hash`, `blockchain_tx`
  - `blockchain_net`, `blockchain_stat` (sesuai GORM convention)
- Rebuild binary `server` dengan `go build -o server cmd/server/main.go`
- Run `goose up` — migration applied successfully

**Verifikasi:**
```bash
curl -X POST http://localhost:7777/api/v1/swarm/upload \
  -H "Authorization: Bearer <token>" \
  -d '{"document_id":"...","items":[...]}'
# → HTTP 200, task_id returned
```

---

### 2. Login Redirect Loop / Blank Screen

**Problem:** Setelah login, dashboard blank / redirect loop kembali ke login.

**Fix:**
- `fe/app/api/auth/login/route.ts` — BFF login route sekarang set **dua cookie**: `access_token` (15 menit) + `refresh_token` (7 hari), keduanya HTTP-Only
- `fe/app/api/proxy/[...slug]/route.ts` — forward `Cookie` header ke backend (critical untuk refresh token)
- `fe/app/dashboard/layout.tsx` — SSR auth check via `/api/proxy/auth/refresh` dengan cookie forwarding
- `fe/src/components/onboarding/OnboardingController.tsx` — kondisional render `OnboardingWidget` hanya saat tour phase
- `fe/src/store/useOnboardingStore.ts` — `partialize` persist: hanya `isCompleted` + `hasSeenOnboardingAt`
- Onboarding UI: dark mode support untuk `WelcomeScreen`, `SetupWizard`, `CelebrationOverlay`

---

### 3. SwarmReviewPanel Build Error

**Problem:** JSX missing closing tags saat build Next.js.

**Fix:** Complete all closing tags di `SwarmReviewPanel.tsx`.

---

### 4. LLM Provider Setup — Groq Integration

**Problem:** Swarm worker gagal proses task karena `LLM_API_KEY=dummy_key` → `401 Authentication Error`.

**Percobaan:**
- ❌ Kimi Code API key (kimi.com/code/console) — 401, karena key tersebut hanya untuk IDE plugin, bukan Moonshot AI API
- ✅ **Groq** (console.groq.com) — key valid, model `llama-3.3-70b-versatile`

**Fix:**
- `ml/.env` — update `LLM_API_KEY`, `LLM_BASE_URL=https://api.groq.com/openai/v1`, `LLM_MODEL_NAME=llama-3.3-70b-versatile`
- `ml/swarm-worker/.env` — sama
- Install deps: `pip install openai redis requests python-dotenv`

---

### 5. End-to-End Swarm Flow — Full Verification

**Flow Tested:**

```
Frontend (Next.js :3000)
  → BFF /api/proxy/swarm/upload
    → Go Backend /api/v1/swarm/upload (:7777)
      → PostgreSQL: task created (status: PENDING)
      → Redis LPUSH: swarm:tasks
        → Python Swarm Worker (BRPOP)
          → Nemesis DB query (16,905 samples Laptop)
          → Groq LLM: Auditor → Compliance → Manager
          → Generate SHA256 hashes
          → POST callback /api/v1/swarm/callback
            → Go Backend update DB
              → PostgreSQL: status = COMPLETED
```

**Hasil:**
| Step | Status | Detail |
|---|---|---|
| Upload task | ✅ HTTP 200 | `task_id` returned |
| Redis queue | ✅ | `swarm:tasks` terisi, worker BRPOP consume |
| Nemesis query | ✅ | 16,905 samples, avg=Rp 107,368,581 |
| LLM call (Groq) | ✅ | `llama-3.3-70b-versatile`, response < 3 detik |
| Agent debate | ✅ | Auditor → Compliance → Manager |
| Hash generation | ✅ | `rationale_hash` + `consensus_hash` |
| Webhook callback | ✅ | HTTP 200 ke Go backend |
| DB update | ✅ | `status=COMPLETED`, hashes tersimpan |

**Sample Output Worker:**
```
[Auditor] Evaluating: Laptop
  Nemesis: 16905 samples, avg=Rp 107,368,581
  Standard: max=Rp 15,000,000
[Compliance] Reviewing: Laptop
[Manager] Concluding: Laptop
[Worker] Webhook sent successfully: 200
```

**Keterbatasan Dev:**
- `blockchain_stat = FAILED` — expected, karena tidak ada real Sepolia RPC + private key di dev environment. Untuk production, set `BLOCKCHAIN_RPC_URL` dan deployer key.

---

### 6. Service Orchestration — All Running Locally

| Service | Port | Status |
|---|---|---|
| Next.js Frontend | 3000 | ✅ Running |
| Go Backend | 7777 | ✅ Running, health OK |
| Flask ML Backend | 5001 | ✅ Running |
| Redis | 6379 | ✅ Running, auth enabled |
| PostgreSQL | 5432 | ✅ Running, migrations applied |
| Swarm Worker | — | ✅ On-demand (python swarm_worker.py) |

---

### Ringkasan File yang Dimodifikasi

| File | Perubahan |
|---|---|
| `be/internal/config/loader.go` | Tambah `REDIS_DB` env parsing |
| `be/migrations/20260516000001_add_swarm_blockchain_fields.sql` | Fix kolom blockchain (GORM naming) |
| `be/internal/domain/swarm.go` | Domain model (sudah ada, tidak perlu edit) |
| `ml/.env` | Groq API key + base URL |
| `ml/swarm-worker/.env` | Groq API key + base URL |
| `fe/app/api/auth/login/route.ts` | Set dual cookie (access + refresh) |
| `fe/app/api/proxy/[...slug]/route.ts` | Forward Cookie header |
| `fe/app/dashboard/layout.tsx` | SSR auth check via refresh proxy |
| `fe/src/store/useOnboardingStore.ts` | Minimal persist config |
| `fe/src/components/onboarding/OnboardingController.tsx` | Kondisional render |

---

> **Mulai dari Step 1?** Konfirmasi dan saya eksekusi reorganisasi folder + docker-compose.infra.yml sekarang.
