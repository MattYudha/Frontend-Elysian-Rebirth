
"use client";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Separator } from "@/ui/separator";
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Send,
} from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="relative w-full overflow-hidden bg-gradient-to-b from-white to-sky-100 dark:from-background dark:to-background pt-16 pb-8">
            {/* Decorative gradient orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-sky-200/50 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
                            Elysian Rebirth
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Empowering enterprise innovation with advanced AI solutions.
                            Reliable, scalable, and designed for the future.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Analytics</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Workflows</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for the latest AI trends and platform updates.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <Input
                                    placeholder="Enter your email"
                                    className="bg-white/50 border-sky-200 focus-visible:ring-sky-400"
                                />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg shadow-sky-400/20">
                                Subscribe <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="bg-sky-100 dark:bg-zinc-800" />

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2024 Elysian Rebirth. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
