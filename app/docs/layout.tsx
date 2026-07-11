import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation - Elysian',
  description: 'Ingest and explore the Elysian OpenAPI Swagger specification for AI agents and developer integrations.',
  alternates: {
    canonical: 'https://elysianlabs.web.id/docs',
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
