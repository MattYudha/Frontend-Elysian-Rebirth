import { notFound } from "next/navigation";
import usecasesData from "@/data/usecases.json";
import UseCaseClient from "./use-case-client";
import { Metadata } from "next";
import fs from "fs";
import path from "path";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const useCase = usecasesData.find((uc: any) => uc.slug === params.slug);
  if (!useCase) return { title: "Use Case Not Found" };

  const imagePath = `/images/usecases/${params.slug}-og.jpg`;
  const absoluteImagePath = path.join(process.cwd(), 'public', imagePath);
  const ogImage = fs.existsSync(absoluteImagePath) ? imagePath : '/images/usecases/default-og.jpg';
  
  const canonicalUrl = `https://elysianlabs.web.id/use-cases/${params.slug}`;

  return {
    title: `${useCase.title} - Elysian Use Case`,
    description: useCase.hero.subtext,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${useCase.title} - Elysian Use Case`,
      description: useCase.hero.subtext,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${useCase.title} Case Study Preview`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${useCase.title} - Elysian Use Case`,
      description: useCase.hero.subtext,
      images: [ogImage],
    }
  };
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const useCase = usecasesData.find((uc: any) => uc.slug === params.slug);

  if (!useCase) {
    return notFound();
  }

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://elysianlabs.web.id"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Use Cases",
        "item": "https://elysianlabs.web.id/usecases"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": useCase.title,
        "item": `https://elysianlabs.web.id/use-cases/${useCase.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <UseCaseClient useCase={useCase} />
    </>
  );
}
