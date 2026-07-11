import { Button } from '@/components/ui/';
import Link from 'next/link';
import { ServerCrash } from 'lucide-react';

export default function ServerErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="rounded-full bg-destructive/10 p-6 mb-6">
                <ServerCrash className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">500 Server Error</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-[600px]">
                Sorry, something went wrong on our end. We are working to fix the issue. Please try again later.
            </p>
            <Link href="/dashboard">
                <Button size="lg">Back to Dashboard</Button>
            </Link>
        </div>
    );
}
