'use client';

import React, { useState } from 'react';
import { LandingNavbar } from '@/components/LandingNavbar';
import { 
  Download, 
  FileCode, 
  Server, 
  Terminal, 
  ExternalLink, 
  Cpu, 
  ShieldCheck, 
  Heart,
  Copy,
  Check
} from 'lucide-react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'users' | 'health'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const endpoints = {
    auth: [
      { method: 'POST', path: '/api/v1/auth/register', desc: 'Register a new user account' },
      { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate user and return tokens' },
      { method: 'POST', path: '/api/v1/auth/logout', desc: 'Revoke and clear user session tokens' },
      { method: 'POST', path: '/api/v1/auth/refresh', desc: 'Exchange refresh token for a new access token' },
    ],
    users: [
      { method: 'GET', path: '/api/v1/users', desc: 'Retrieve list of users (paginated)' },
      { method: 'GET', path: '/api/v1/users/me', desc: 'Get active session profile details' },
      { method: 'PUT', path: '/api/v1/users/me', desc: 'Update profile details (name, avatar)' },
      { method: 'DELETE', path: '/api/v1/users/me', desc: 'Permanently close user account' },
      { method: 'GET', path: '/api/v1/users/{id}', desc: 'Retrieve user details by ID' },
      { method: 'GET', path: '/api/v1/users/email/{email}', desc: 'Find user details by email' },
    ],
    health: [
      { method: 'GET', path: '/api/v1/ping', desc: 'Simple latency diagnostic check' },
      { method: 'GET', path: '/health', desc: 'Comprehensive telemetry and service dependency health check' },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-300">
      <LandingNavbar forceDark={true} />
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400 text-xs font-semibold mb-6">
            <Cpu className="w-3.5 h-3.5" />
            AI-Crawlable OpenAPI v2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            API Documentation
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Welcome to the Elysian Enterprise API developer and AI agent portal. Integrate our autonomous workflow intelligence directly into your systems.
          </p>
        </div>

        {/* Specifications Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-sky-500/20 transition-all duration-300 backdrop-blur-sm group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
                <FileCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-500 group-hover:text-slate-400">v1.0.0 (JSON)</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">OpenAPI Swagger JSON</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Standard OpenAPI schema file optimized for modern developer clients, Postman, and automated AI bots parsing endpoint definitions.
            </p>
            <div className="flex gap-3">
              <a 
                href="/swagger.json" 
                target="_blank"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white font-medium text-sm transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                View Spec
              </a>
              <a 
                href="/swagger.json" 
                download
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all cursor-pointer shadow-lg shadow-sky-900/20"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-sky-500/20 transition-all duration-300 backdrop-blur-sm group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
                <FileCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-500 group-hover:text-slate-400">v1.0.0 (YAML)</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">OpenAPI Swagger YAML</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Human-friendly specification format optimized for system architectures, configuration review, and direct ingestion by Custom GPTs or Claude.
            </p>
            <div className="flex gap-3">
              <a 
                href="/swagger.yaml" 
                target="_blank"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white font-medium text-sm transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                View Spec
              </a>
              <a 
                href="/swagger.yaml" 
                download
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all cursor-pointer shadow-lg shadow-sky-900/20"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden backdrop-blur-sm">
          
          {/* Tab Selector */}
          <div className="flex border-b border-slate-800 bg-slate-900/30 overflow-x-auto">
            {(['overview', 'auth', 'users', 'health'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'border-sky-500 text-sky-400 bg-sky-500/5' 
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Overview</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Elysian operates a high-performance backend architecture written in Go utilizing the Gin framework. It is optimized for low TTFB (Time to First Byte) using Redis caching and asynchronous job handling via Asynq. Security is enforced globally through strict Role-Based Access Control (RBAC) middleware.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1 text-sm">
                      <Server className="w-4 h-4" />
                      Host Url
                    </div>
                    <code className="text-xs font-mono text-slate-300">http://localhost:7777</code>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1 text-sm">
                      <Terminal className="w-4 h-4" />
                      API Base
                    </div>
                    <code className="text-xs font-mono text-slate-300">/</code>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1 text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      Auth
                    </div>
                    <code className="text-xs font-mono text-slate-300">Bearer Auth (JWT)</code>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Example Request</span>
                    <button 
                      onClick={() => copyToClipboard('curl -H "Authorization: Bearer <TOKEN>" http://localhost:7777/api/v1/users/me', 'req')}
                      className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-slate-800 px-2.5 py-1 rounded transition-all cursor-pointer"
                    >
                      {copiedText === 'req' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Curl
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                    {`curl -X GET \\
  http://localhost:7777/api/v1/users/me \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...' \\
  -H 'Content-Type: application/json'`}
                  </pre>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 capitalize">{activeTab} Endpoints</h2>
                  <p className="text-slate-400 text-sm">
                    Review specifications for `{activeTab}` resources. All requests accept and respond with `application/json`.
                  </p>
                </div>

                <div className="space-y-4">
                  {endpoints[activeTab].map((ep, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-800 transition-all flex flex-col md:flex-row md:items-center gap-4">
                      <span className={`inline-flex items-center justify-center text-xs font-mono font-bold px-2.5 py-1 rounded-md w-16 text-center ${
                        ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        ep.method === 'PUT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        ep.method === 'DELETE' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}>
                        {ep.method}
                      </span>
                      <div className="flex-1">
                        <code className="text-sm font-mono font-bold text-white">{ep.path}</code>
                        <p className="text-xs text-slate-400 mt-1">{ep.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
