'use client';

import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import ProductPageTemplate from '@/components/elysian/ProductPageTemplate';

const features = [
  {
    title: "Real-time Logs",
    description:
      "Monitor build progress and application logs in real-time. Debug issues, track agent activity, and analyze performance directly from your dashboard.",
    image: "https://cdn.voltagent.dev/website/deployment/logs.png",
  },
  {
    title: "Custom Domain & SSL",
    description:
      "Connect your own domain with CNAME configuration. Automatic SSL certificate provisioning and renewal included at no extra cost.",
    image: "https://cdn.voltagent.dev/website/deployment/domain.png",
  },
  {
    title: "Basic Authentication",
    description:
      "Password-protect your deployments with HTTP Basic Auth. Control access to your agents and ensure only authorized users can interact with them.",
    image: "https://cdn.voltagent.dev/website/deployment/security.png",
  },
];

export default function DeploymentPage() {
  return (
    <ProductPageTemplate
      title="Deployment"
      heroBadgeText="ElysianOps Deployment"
      heroBadgeIcon={CloudArrowUpIcon}
      heroH1={
        <>
          Deploy AI Agents to <span className="text-sky-400 italic">Production</span> in Minutes
        </>
      }
      heroDescription="Deploy your AI agents to the cloud or self-host. Get automatic scalability, built-in security, and direct integration with ElysianOps Console."
      heroImage="https://cdn.voltagent.dev/website/deployment/hero.png"
      features={features}
      demoUrl="https://console.voltagent.dev/demo"
      docsUrl="/docs/"
    />
  );
}
