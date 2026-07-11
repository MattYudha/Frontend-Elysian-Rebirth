'use client';

import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import ProductPageTemplate from '@/components/elysian/ProductPageTemplate';

const features = [
  {
    title: "Evaluation Datasets",
    description:
      "Define inputs and expected outputs once. Run them against any agent version, any time.",
    image: "/cdn/website/evals/dataset.png",
  },
  {
    title: "Experiment Queue",
    description:
      "Queue test cases, run them in parallel. Apply multiple scorers and track SLA compliance. See which ones fail and why.",
    image: "/cdn/website/evals/queque.png",
  },
  {
    title: "Result Annotations",
    description:
      "See exactly why a test passed or failed. Compare scores across runs to track improvements.",
    image: "/cdn/website/evals/annontations.png",
  },
];

export default function EvalsPage() {
  return (
    <ProductPageTemplate
      title="Evals"
      heroBadgeText="ElysianOps Evals"
      heroBadgeIcon={ChartBarIcon}
      heroH1={
        <>
          Test Your Agents Before They <span className="text-sky-400 italic">Break in Production</span>
        </>
      }
      heroDescription="Run the same test suite every time you change a prompt or model. Catch regressions in CI, not from users."
      heroImage="/cdn/website/evals/hero.png"
      features={features}
      demoUrl="https://console.voltagent.dev/demo"
      docsUrl="/docs/"
    />
  );
}
