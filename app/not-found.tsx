import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileQuestion, Home, HelpCircle } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050507] p-4 text-center overflow-hidden">
            {/* Dot Pattern Background */}
            <DotPattern dotColor="#38bdf8" dotSize={1.5} spacing={24} className="opacity-40" />

            {/* Glowing background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
                {/* Visual Icon Box */}
                <div className="mb-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md shadow-2xl flex items-center justify-center animate-bounce duration-1000">
                    <FileQuestion className="h-16 w-16 text-sky-400" />
                </div>

                {/* Subtitle / Title */}
                <h2 className="text-sky-500 text-sm font-semibold tracking-wider uppercase mb-3">
                    Error 404
                </h2>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white mb-4">
                    Page Not Found
                </h1>
                <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
                    Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan ke alamat lain.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold flex items-center justify-center gap-2">
                            <Home className="h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/help" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white font-semibold flex items-center justify-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Help Center
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
