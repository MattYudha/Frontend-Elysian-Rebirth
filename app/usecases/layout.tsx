import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use Cases',
  description: 'Discover how organizations build custom AI agents in TypeScript using the Elysian platform.',
  alternates: {
    canonical: 'https://elysianlabs.web.id/usecases',
  },
};

export default function UsecasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
