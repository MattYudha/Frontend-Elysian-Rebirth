import { notFound } from "next/navigation";
import usecasesData from "@/data/usecases.json";
import UseCaseClient from "./use-case-client";
import { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const useCase = usecasesData.find((uc: any) => uc.slug === params.slug);
  if (!useCase) return { title: "Use Case Not Found" };

  return {
    title: `${useCase.title} - Elysian Use Case`,
    description: useCase.hero.subtext,
  };
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const useCase = usecasesData.find((uc: any) => uc.slug === params.slug);

  if (!useCase) {
    return notFound();
  }

  return <UseCaseClient useCase={useCase} />;
}
