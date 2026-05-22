# 🏛️ Elysian Rebirth — Frontend

> **Frontend untuk Infrastruktur Audit Finansial Otonom berbasis Multi-Agent Swarm Intelligence**

<p align="center">
  <img src="https://img.shields.io/badge/Status-Pilot%20Ready-success?style=flat-square"/>
  <img src="https://img.shields.io/badge/Version-3.0.0-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Architecture-BFF%20Proxy%20%7C%20Swarm%20%7C%20Blockchain-purple?style=flat-square"/>
</p>

---

## 🎯 Apa itu Elysian?

**Elysian Rebirth** adalah platform audit finansial otonom yang mendeteksi **markup anggaran** pada tahap perencanaan (Pre-Audit) di Pemerintah Daerah Indonesia.

**Tagline:** _"Transformasi dari Passive Checking menjadi Autonomous Financial Oversight."_

### Masalah yang Dipecahkan:

- 📈 **Markup Anggaran:** Penggelembungan harga pada RAPBD
- 🐌 **Verifikasi Manual:** Ribuan item dicek manual — rentan human error
- 📊 **Ketiadaan Data Real-Time:** Sulit akses data historis pengadaan
- 🔍 **Audit Trail Rapuh:** Rekam jejak tidak transparan

---

## 🏗️ Architecture v3.0

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Next.js UI   │◄──►│ BFF Proxy    │◄──►│ Go Backend   │      │
│  │ · Budget     │    │ · Cookie     │    │ · API        │      │
│  │   Editor     │    │   Auth       │    │ · SSE        │      │
│  │ · Swarm      │    │ · Proxy      │    │ · Blockchain │      │
│  │   Review     │    │   Routes     │    │   Commit     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│    HTTP-Only          Server-Side          Sepolia/Amoy         │
│    Cookies            Only                 Testnet              │
└─────────────────────────────────────────────────────────────────┘
```

### BFF Proxy Architecture (CRITICAL)

**JANGAN PERNAH** simpan JWT di browser (localStorage/Zustand persist).

**How It Works:**

1. Browser → `/api/proxy/[...slug]` (Next.js API Route)
2. Server membaca `access_token` dari **HTTP-Only Cookie**
3. Token disuntikkan ke header `Authorization: Bearer <token>`
4. Request diteruskan ke Go Backend
5. Response diteruskan kembali ke browser

**Routes:**
| Route | Method | Function |
|-------|--------|----------|
| `/api/proxy/[...slug]` | ALL | Catch-all proxy ke Go Backend |
| `/api/proxy/swarm/events` | GET | SSE streaming proxy |
| `/api/auth/login` | POST | Set HTTP-Only cookies |
| `/api/auth/register` | POST | Register via Go |

---

## 🛠️ Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| **Framework**    | Next.js 14 (App Router)                   |
| **Language**     | TypeScript                                |
| **Styling**      | Tailwind CSS + Radix UI + shadcn/ui       |
| **State**        | Zustand (pure in-memory, NO localStorage) |
| **Auth**         | HTTP-Only Cookies (BFF Proxy)             |
| **Workflow Viz** | React Flow                                |
| **Testing**      | Playwright (E2E), Vitest (Unit)           |

---

## 📁 Key Components

### SwarmReviewPanel (`src/components/swarm/SwarmReviewPanel.tsx`)

- **Style:** Terminal/CI-CD log (monospace, badges, skeleton loaders)
- **States:** IDLE → CHECKING_EXISTING → PROCESSING → COMPLETED/FAILED
- **SSE:** `EventSource('/api/proxy/swarm/events?task_id=${taskId}')`
- **Blockchain Badge:** Menampilkan "Verified on Blockchain" jika tx_hash tersedia
- **Task Resumption:** Mendukung pengecekan status tugas yang ada saat inisialisasi komponen (`CHECKING_EXISTING`) berdasarkan filter query document ID guna mencegah trigger duplikat.
- **Re-run Audit:** Tombol override untuk memicu audit Swarm ulang secara manual pada draf aktif.

### AgentChatPanel (`src/components/swarm/AgentChatPanel.tsx`)

- Chat langsung dengan agen spesifik (Auditor, Compliance, Manager)
- Trigger: Klik item yang di-flag di SwarmReviewPanel

### Middleware (`middleware.ts`)

- Redirect unauthenticated → `/login`
- Redirect authenticated dari auth pages → `/dashboard`
- Protected paths: `/dashboard`, `/editor`, `/admin`, `/action-center`, `/chat`

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:7777
# ELYSIAN_API_URL=http://localhost:7777

# 3. Run development server
npm run dev

# 4. Open browser
http://localhost:3000
```

---

## 🔐 Auth & Session Rules

- **No JWT on Client:** Token hanya di HTTP-Only Cookies
- **Cookie Flags:** HttpOnly, Secure, SameSite=Strict
- **SSR-First:** Dashboard validasi session server-side
- **Hydration Fix:** Gunakan `_hasHydrated` flag di Zustand

---

## 📡 API Integration

### Swarm Review Flow:

```typescript
// 1. Trigger Swarm Review
const res = await fetch('/api/proxy/swarm/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ document_id, items })
});

// 2. Listen SSE
const eventSource = new EventSource(
  `/api/proxy/swarm/events?task_id=${taskId}`
);

// 3. Receive blockchain verification
{
  status: 'COMPLETED',
  results: [...],
  blockchain: {
    tx_hash: '0x...',
    network: 'sepolia',
    status: 'VERIFIED'
  }
}
```

---

## 🏛️ Elysian Ecosystem

| Repo                                                                               | Role                     | Stack                   |
| ---------------------------------------------------------------------------------- | ------------------------ | ----------------------- |
| [Frontend](https://github.com/MattYudha/Frontend-Elysian-Rebirth)                  | Orchestrator & Interface | Next.js 14 + TypeScript |
| [Backend](https://github.com/MattYudha/Backend-Elysian-)                           | API & Task Queue         | Go + Gin + PostgreSQL   |
| [ML](https://github.com/MattYudha/ML-ELYSIAN)                                      | Cognitive Swarm          | Python + Flask          |
| [Trust Layer](https://github.com/MattYudha/Backend-Elysian-/tree/main/trust-layer) | Blockchain Audit Trail   | Solidity + Hardhat      |

---

> **Versi:** 3.0.0 (Blockchain-Integrated)  
> **Tanggal:** Mei 2026  
> **Pemilik:** Matt (Team Elysian)
