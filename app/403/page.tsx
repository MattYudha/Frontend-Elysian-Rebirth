import { Button } from '@/components/ui/';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="rounded-full bg-destructive/10 p-6 mb-6">
                <ShieldAlert className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">403 Forbidden</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-[600px]">
                Sorry, you don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <Link href="/dashboard">
                <Button size="lg">Back to Dashboard</Button>
            </Link>
        </div>
    );
}
