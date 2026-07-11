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
    <div className="flex items-center justify-center min-h-screen p-4">
      <XErrorState
        type="error"
        title="Chat Error"
        message={error.message || 'Failed to load chat'}
        onRetry={reset}
        onGoBack={() => router.push('/dashboard')}
      />
    </div>
  );
}
