'use client';

import { XErrorState } from '@/components/ui/common/XErrorState';
import { useRouter } from 'next/navigation';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <XErrorState
        type="error"
        title="Something went wrong"
        message={error.message || 'An unexpected error occurred'}
        onRetry={reset}
        onGoBack={() => router.push('/dashboard')}
      />
    </div>
  );
}
