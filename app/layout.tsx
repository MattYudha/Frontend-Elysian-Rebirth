import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { APP_NAME } from '@/lib/config';
import { XErrorBoundary } from '@enterprise-ai/x';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: `${APP_NAME} - Enterprise AI Platform`,
    description: 'Open LLM application devops platform for enterprise scenarios',
    keywords: 'AI, Enterprise, LLM, RAG, Workflow, Document Processing',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.className}>
                <XErrorBoundary>
                    <Providers>
                        {children}
                    </Providers>
                </XErrorBoundary>
            </body>
        </html>
    );
}
