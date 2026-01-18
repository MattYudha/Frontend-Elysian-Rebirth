# ELISYAN REBIRTH AI Platform - Frontend

Next.js 14 frontend application for theElisyan Rebirth AI Platform.

## Running Locally

```bash
# From monorepo root
npm install
npm run dev:platform
```

The app will be available at http://localhost:3000

## Building

```bash
npm run build:platform
```

## Deploying to Vercel

1. Connect your repository to Vercel
2. Set the root directory to `apps/platform`
3. Framework preset: Next.js
4. Build command: `npm run build`
5. Output directory: `.next`

### Environment Variables

Set these in Vercel:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_VERSION` - Application version

## Features

- **Dashboard** - AI control center with stats and pipelines
- **Chat** - Conversational AI interface
- **Knowledge Base** - RAG configuration and document management
- **Document Editor** - Human-in-the-loop editing
- **Settings** - Application configuration

## Tech Stack

- Next.js 14 (App Router)

made by matt
- TypeScript
- React 18
- Ant Design 5
- @enterprise-ai/x UI Library
