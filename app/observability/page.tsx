'use client';

import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import ProductPageTemplate from '@/components/elysian/ProductPageTemplate';

const features = [
  {
    title: "Visual Agent Execution",
    description:
      "Visualize your agent's execution as an interactive flow diagram. Instantly spot bottlenecks, failed steps, and unexpected behaviors.",
    image: "https://cdn.voltagent.dev/website/observability/framework.png",
  },
  {
    title: "Alerts & Notifications",
    description:
      "Get notified when things break. Set up alerts for latency, errors, and token usage. Receive notifications via Slack, email, or webhooks.",
    image: "https://cdn.voltagent.dev/website/observability/alerts.png",
  },
  {
    title: "Detailed Tracing & Logs",
    description:
      "Trace every LLM call, tool execution, and agent interaction. Replay sessions, inspect payloads, and find the root cause fast.",
    image: "https://cdn.voltagent.dev/website/observability/logs.png",
  },
];

export default function ObservabilityPage() {
  return (
    <ProductPageTemplate
      title="Observability"
      heroBadgeText="ElysianOps Observability"
      heroBadgeIcon={ChartBarIcon}
      heroH1={
        <>
          Real-time <span className="text-sky-400 italic">LLM Observability</span> for AI Agents
        </>
      }
      heroDescription="Catch AI agent failures before they reach production. Get full visibility into every step, from input to output."
      heroImage="https://cdn.voltagent.dev/website/observability/dashboard.png"
      features={features}
      demoUrl="https://console.voltagent.dev/demo"
      docsUrl="/docs/"
    />
  );
}
