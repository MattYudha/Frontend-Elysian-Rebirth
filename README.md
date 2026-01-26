# 🌌 Elysian Rebirth - Enterprise AI Platform

> **Status**: 🚀 Production Ready | **v1.0.0**

Next-generation AI Platform built with a focus on **Enterprise Security**, **Scalability**, and **Developer Experience**. Built for the modern web with Next.js 14, fully typed, tested, and monitored.

---

## 🛠️ Enterprise Tech Stack

### Core Framework
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Database**: [IndexedDB (via idb-keyval)](https://github.com/jakearchibald/idb-keyval) + Encryption

### UI & Design System
- **Component Library**: [Shadcn/UI](https://ui.shadcn.com/) (Radix Primitives)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Documentation**: [Storybook v8](https://storybook.js.org/)

### Quality Assurance (The Testing Pyramid)
- **Unit & Integration**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **End-to-End (E2E)**: [Playwright](https://playwright.dev/)
- **Pre-Commit Hooks**: [Husky](https://typicode.github.io/husky/) + [Lint-Staged](https://github.com/lint-staged/lint-staged)

### Security & Observability
- **Security Headers**: Strict **Content Security Policy (CSP)**
- **Error Tracking**: [Sentry](https://sentry.io/) (Client, Server, Edge)
- **Compliance**: PII Redaction configured

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/Elysian-Rebirth/Frontend-Elysian-Rebirth.git
cd Frontend-Elysian-Rebirth

# Install dependencies
npm install
```

### Development Environment

```bash
# Start the development server
npm run dev
# Access at http://localhost:3000
```

### Component Catalog (Storybook)

Explore the "Mini Design System" without running the full app.

```bash
npm run storybook
# Access at http://localhost:6006
```

---

## 🧪 Testing Strategies

We employ a robust testing strategy to ensure reliability.

### 1. Unit & Integration Tests (Vitest)
Fast feedback loop for logic and component interactions.

```bash
npm run test         # Run all unit/integration tests
npm run test:watch   # Watch mode for TDD
```

### 2. End-to-End Tests (Playwright)
Validates critical user journeys (Login -> Workflow -> Save) in a real browser environment.

```bash
npm run test:e2e     # Run E2E suite
```

---

## 🛡️ Security Features

### Content Security Policy (CSP)
Configured in `next.config.mjs`.
- **Transitional Mode**: Allows minimal inline scripts/styles for hydration.
- **Strict Mode**: Blocks object/iframe injection.

### Sentry Observability
- Errors are captured globally via `XErrorBoundary` and `global-error.tsx`.
- Sensitive data is redacted before egress.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router (Routes & Layouts)
├── src/
│   ├── components/       # React Components
│   │   ├── ui/           # Design System (Shadcn)
│   │   └── workflow/     # Feature Components
│   ├── lib/              # Utilities & Helpers
│   ├── store/            # Zustand State Stores
│   ├── queries/          # React Query Hooks
│   ├── test/             # Test setup & Mocks
│   └── styles/           # Global CSS
├── e2e/                  # Playwright E2E Tests
├── .storybook/           # Storybook Configuration
└── public/               # Static Assets
```


