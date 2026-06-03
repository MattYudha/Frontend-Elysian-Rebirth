'use client';

import React from 'react';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import ProductPageTemplate from '@/components/elysian/ProductPageTemplate';

const features = [
  {
    title: "Version History & Environment Labels",
    description:
      "Every edit creates a new version. Compare diffs, roll back instantly, and promote to staging or production with one click.",
    image: "https://cdn.voltagent.dev/website/prompts/version-1.png",
  },
  {
    title: "Import & Export",
    description:
      "Export prompts as JSON for backup or migration. Import them into another project or share with your team.",
    image: "https://cdn.voltagent.dev/website/prompts/import-1.png",
  },
  {
    title: "Usage Analytics",
    description:
      "See which prompts are called, how often, and what they cost. Track performance per version and trace individual requests.",
    image: "https://cdn.voltagent.dev/website/evals/annontations.png",
  },
];

export default function PromptManagementPage() {
  return (
    <ProductPageTemplate
      title="Prompt Management"
      heroBadgeText="ElysianOps Prompt Management"
      heroBadgeIcon={ChatBubbleBottomCenterTextIcon}
      heroH1={
        <>
          Edit Prompts Without <span className="text-sky-400 italic">Deploying Code</span>
        </>
      }
      heroDescription="Store prompts in the cloud, version every change, and promote to production with one click. No redeploy needed."
      heroImage="https://cdn.voltagent.dev/website/prompts/hero-1.png"
      features={features}
      demoUrl="https://console.voltagent.dev/demo"
      docsUrl="/docs/"
    />
  );
}
