'use client';

import React from 'react';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import ProductPageTemplate from '@/components/elysian/ProductPageTemplate';

const features = [
  {
    title: "Upload Your Docs",
    description:
      "Drop your files and start querying. Supports PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS, CSV, HTML, HTM, XML, MD, MDX, TXT, JSON, VTT, and PROPERTIES. You can also sync from Notion or crawl websites.",
    image: "/cdn/website/rag/create.png",
  },
  {
    title: "One Line to Add RAG",
    description:
      "Set retriever on your agent for automatic context injection, or add retriever.tool to let the LLM decide when to search. Both options work with a single line of code.",
    image: "/cdn/website/rag/usage.png",
  },
  {
    title: "Automatic Chunking",
    description:
      "Documents are automatically chunked and embedded. Configure chunk size and overlap if needed, or use the defaults.",
    image: "/cdn/website/rag/create-base.png",
  },
];

export default function RAGPage() {
  return (
    <ProductPageTemplate
      title="RAG"
      heroBadgeText="ElysianOps RAG"
      heroBadgeIcon={CircleStackIcon}
      heroH1={
        <>
          Give Your Agent a <span className="text-sky-400 italic">Knowledge Base</span>
        </>
      }
      heroDescription="Upload docs, connect your agent, and start querying. No vector database setup required."
      heroImage="/cdn/website/rag/hero.png"
      features={features}
      demoUrl="https://console.voltagent.dev/demo"
      docsUrl="/docs/"
    />
  );
}
