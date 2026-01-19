import { Button } from '@/components/ui/';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
                <FileQuestion className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">404 Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-[600px]">
                Sorry, the page you visited does not exist. It might have been moved or deleted.
            </p>
            <Link href="/dashboard">
                <Button size="lg">Back to Dashboard</Button>
            </Link>
        </div>
    );
}
