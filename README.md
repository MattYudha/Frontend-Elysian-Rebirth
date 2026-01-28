🌌 Elysian Rebirth

Intelligent Document Processing (IDP) & RAG Platform

<p align="center"> <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square"/> <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square"/> <img src="https://img.shields.io/badge/Architecture-RAG%20%7C%20Local--First-purple?style=flat-square"/> </p>




🧠 Overview
<p> Elysian Rebirth adalah <b>next-generation document intelligence platform</b> yang menggabungkan <b>Generative AI</b>, <b>RAG (Retrieval-Augmented Generation)</b>, dan <b>Local-First Architecture</b> ke dalam workflow penyuntingan dokumen teknis. </p> <ul> <li>📄 Intelligent Document Processing (IDP)</li> <li>🧠 Context-aware AI dengan RAG</li> <li>💾 Offline-first & auto-save architecture</li> </ul>



🛠️ Tech Stack
⚙️ Core Architecture
<table> <tr> <td><b>Framework</b></td> <td>Next.js 14 (App Router, Server Components, Streaming)</td> </tr> <tr> <td><b>Language</b></td> <td>TypeScript (Strict Type Safety)</td> </tr> <tr> <td><b>State</b></td> <td>Zustand (Editor State & Auth Session)</td> </tr> <tr> <td><b>Persistence</b></td> <td>IndexedDB (Local-First, Offline Drafts)</td> </tr> </table> <p> <img src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs"/> <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript"/> <img src="https://img.shields.io/badge/Zustand-orange"/> <img src="https://img.shields.io/badge/IndexedDB-green"/> </p>


🧠 AI & RAG Stack
<table> <tr> <td><b>AI SDK</b></td> <td>Vercel AI SDK (Streaming Response)</td> </tr> <tr> <td><b>Retrieval</b></td> <td>Vector-based Knowledge Search (RAG)</td> </tr> <tr> <td><b>Validation</b></td> <td>Semantic Guardrail (Pricing & Technical Specs)</td> </tr> </table>

🎨 UI & UX System
<table> <tr> <td><b>Editor</b></td> <td>Headless Rich-Text Editor + Contextual AI Bar</td> </tr> <tr> <td><b>Components</b></td> <td>Shadcn/UI (Radix-based & Accessible)</td> </tr> <tr> <td><b>Animation</b></td> <td>Rive (State-Machine Driven)</td> </tr> </table>


Key Modules
✍️ 1. Intelligent Document Editor

<b>Path:</b> <code>src/components/editor/</code>

<ul> <li>✨ Contextual AI Actions (rewrite, summarize, grammar fix)</li> <li>🛡️ Semantic Guardrail untuk validasi angka & harga</li> <li>💾 Offline-First Auto Save</li> </ul>

📚 2. RAG Knowledge Hub

<b>Path:</b> <code>src/components/knowledge/</code>

<ul> <li>📄 Document Embedding (PDF / Text)</li> <li>🧪 Vector Query Playground</li> <li>🧠 Context Injection ke AI Editor</li> </ul>

🧩 3. Workflow Builder

<b>Path:</b> <code>src/components/workflow/</code>

<ul> <li>🔗 Node-Based Automation (React Flow)</li> <li>⚙️ Visual Document Processing Pipelines</li> </ul>

🧪 Quality & Reliability
<table> <tr> <td><b>Unit & Integration</b></td> <td>Vitest</td> </tr> <tr> <td><b>End-to-End</b></td> <td>Playwright</td> </tr> <tr> <td><b>Static Analysis</b></td> <td>ESLint + TypeScript</td> </tr> </table> <pre> npm run test npm run test:e2e npm run lint npm run typecheck </pre>

🛡️ Security & Observability
<ul> <li>🔒 Strict Content Security Policy (CSP)</li> <li>📡 Global Error Monitoring (Sentry)</li> <li>🧼 Automatic PII Redaction sebelum AI request</li> </ul>

```
📂 Project Structure

app/                    # Next.js Routes
src/
├─ components/
│  ├─ editor/           # IDP Editor Logic
│  ├─ knowledge/        # RAG & Vector Search
│  └─ workflow/         # Automation Builder
├─ lib/                 # SDK & Utilities
├─ store/               # Zustand Global Stores
├─ queries/             # TanStack Query
└─ types/               # Type Definitions

e2e/                    # Playwright Test Suites
public/                 # Static Assets & Rive Animations
```



## 🎬 Demo (Editor + RAG)

<p>
  Berikut preview fitur utama: <b>Contextual AI Editor</b> dan <b>RAG Knowledge Query</b>.
</p>

<table>
  <tr>
    <td width="50%">
      <h3>✍️ Intelligent Document Editor</h3>
      <p>
        Contextual AI actions (rewrite/summarize/grammar) + semantic guardrail untuk validasi angka & harga.
      </p>
      <a href="./assets/demo-editor.gif">
        <img src="./assets/demo-editor.gif" alt="Elysian Rebirth - Editor Demo" width="100%"/>
      </a>
      <p><sub>Tip: klik GIF untuk membuka ukuran penuh.</sub></p>
    </td>
    <td width="50%">
      <h3>📚 RAG Query Playground</h3>
      <p>
        Vector search dari knowledge base untuk inject context ke AI editor secara real-time.
      </p>
      <a href="./assets/demo-rag-query.gif">
        <img src="./assets/demo-rag-query.gif" alt="Elysian Rebirth - RAG Query Demo" width="100%"/>
      </a>
      <p><sub>Menunjukkan retrieval → context → generated answer.</sub></p>
    </td>
  </tr>
</table>



<details>
  <summary><b>🎬 Lihat Demo GIF (Editor + RAG)</b></summary>
  <br/>

  <table>
    <tr>
      <td width="50%">
        <h3>✍️ Intelligent Document Editor</h3>
        <a href="./assets/demo-editor.gif">
          <img src="./assets/demo-editor.gif" alt="Editor Demo" width="100%"/>
        </a>
      </td>
      <td width="50%">
        <h3>📚 RAG Query Playground</h3>
        <a href=".public/demo-rag-query.gif">
          <img src="public/demo-rag-query.gif" alt="RAG Demo" width="100%"/>
        </a>
      </td>
    </tr>
  </table>

</details>

