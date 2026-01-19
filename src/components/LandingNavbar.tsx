'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/config';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { MobileSidebar } from './MobileSidebar';

export function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out',
                scrolled ? 'top-4' : 'top-0'
            )}
        >
            <div
                className={cn(
                    'mx-auto flex items-center justify-between transition-all duration-300',
                    scrolled
                        ? 'max-w-4xl rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg py-3 px-6'
                        : 'container px-4 py-6 bg-transparent'
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className={cn("text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent transition-opacity", scrolled ? "opacity-100" : "opacity-100")}>
                        {APP_NAME.split(' ')[0]}
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#" className="hover:text-foreground transition-colors">Produk</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Cara Kerja</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Harga</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Perusahaan</Link>
                </nav>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden md:inline-flex rounded-full">
                            Masuk
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white border-0">
                            Daftar
                        </Button>
                    </Link>

                    {/* Mobile Login Icon */}
                    <Link href="/login" className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-slate-700 dark:text-slate-200">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle (Reused from Dashboard) */}
                    <MobileSidebar variant="landing" />
                </div>
            </div>
        </header>
    );
}
