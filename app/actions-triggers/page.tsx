'use client';

import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import ProductPageTemplate from '@/components/elysian/ProductPageTemplate';

const features = [
  {
    title: "Built-in Actions",
    description:
      "Let your agent take action. Pre-built integrations with Airtable, Discord, Gmail that work as agent tools out of the box.",
    image: "https://cdn.voltagent.dev/website/triggers-actions/actions.png",
  },
  {
    title: "Event-Driven Triggers",
    description:
      "Wake up your agents when it matters. Listen for Slack messages, Gmail emails, GitHub webhooks, Airtable updates, and more. All with managed authentication.",
    image: "https://cdn.voltagent.dev/website/triggers-actions/target.png",
  },
  {
    title: "Automation Analytics",
    description:
      "Track every trigger and action. See success rates, execution counts, failure rates, and response times. Know exactly what your automations are doing.",
    image: "https://cdn.voltagent.dev/website/triggers-actions/dashboard.png",
  },
];

export default function ActionsTriggersPage() {
  return (
    <ProductPageTemplate
      title="Actions & Triggers"
      heroBadgeText="ElysianOps Actions & Triggers"
      heroBadgeIcon={ArrowPathIcon}
      heroH1={
        <>
          Automate Your <span className="text-sky-400 italic">AI Agent Workflows</span>
        </>
      }
      heroDescription="Build event-driven automation for your agents. Define triggers, create actions, and let your workflows run on autopilot."
      heroImage="https://cdn.voltagent.dev/website/triggers-actions/hero.png"
      features={features}
      demoUrl="https://console.voltagent.dev/demo"
      docsUrl="/docs/"
    />
  );
}
