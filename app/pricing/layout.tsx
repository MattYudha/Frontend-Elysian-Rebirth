import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Flexible pricing plans for Elysian Core Framework and ElysianOps. View cloud and self-hosted options.',
  alternates: {
    canonical: 'https://elysianlabs.web.id/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
