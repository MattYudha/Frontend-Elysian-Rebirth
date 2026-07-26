'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/';

import { Input } from '@/components/ui/';
import { InputPassword } from '@/components/ui/input-password';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/';

import { useAuthStore } from '@/store/authStore';


import { ElysianTextLogo } from '@/components/ui/elysian-logo';
import { SocialAuth } from '@/components/auth/social-auth';
import { authService } from '@/services/auth.service';

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
});

function LoginForm() {
    const { login } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get('session_expired') === 'true') {
            toast.error('Sesi Anda telah berakhir. Silakan masuk kembali.');
            // Clean up the URL
            window.history.replaceState({}, '', '/login');
        }
    }, [searchParams]);

    // Rive Animation States
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setSubmitStatus('idle');

        try {
            // Panggilan langsung ke API Backend Go
            const response = await authService.login({
                email: values.email,
                password: values.password
            });

            // Normalisasi data sesuai skema Zustand frontend
            const userData = {
                id: response.data.user.id,
                email: response.data.user.email,
                name: (response.data.user as any).full_name || response.data.user.name,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                role: (response.data.user as any).role || 'user', // Gunakan role fallback jika backend belum menyediakannya
                company: 'Elysian Corp',
                avatar: (response.data.user as any).avatar_url || (response.data.user as any).avatar || null
            };

            // Masukkan data autentik yang valid ke Global Store
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            login(userData as any, (response as any).data?.access_token || (response as any).data?.data?.access_token);

            setSubmitStatus('success');
            toast.success('Berhasil masuk!');

            // Eksekusi animasi sebelum redirect
            setTimeout(() => {
                // Read redirect from URL query param first, then fallback to sessionStorage, then /dashboard
                const urlRedirect = searchParams.get('redirect');
                const redirectTo = urlRedirect || sessionStorage.getItem('redirect_after_login') || '/dashboard';
                sessionStorage.removeItem('redirect_after_login');
                window.location.href = redirectTo;
            }, 1000);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Login API Error:", error);
            setSubmitStatus('error');

            // Ekstrak pesan error spesifik dari Backend (misal: "invalid password" atau "user not found")
            const errorMessage = error.response?.data?.message || error.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Watch email for character count tracking
    const emailValue = form.watch('email');

    return (
        <>
            {/* --------------------------------------------------------------------------------
               MOBILE LAYOUT: "Native App" Feel with Bear (Visible only on Mobile)
               Overrides AuthShell's default white styling with full-screen dark blue.
            -------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------
               MOBILE LAYOUT: Unified "Clean Light" Aesthetic
               Matches Desktop "Glass Citadel" vibes.
            -------------------------------------------------------------------------------- */}
            <div className="lg:hidden fixed inset-0 z-50 w-full min-h-screen flex flex-col items-center justify-start pt-12 px-6 bg-slate-50 dark:bg-[#0b1120] overflow-y-auto overflow-x-hidden">
                {/* Background Decor (Subtle) */}
                <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[300px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[80px] pointer-events-none overflow-hidden" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[300px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[80px] pointer-events-none overflow-hidden" />

                {/* 1. Header & Rive Stage */}
                <div className="w-full flex flex-col items-center z-10 relative">
                    {/* Brand Logo */}
                    <div className="mb-4">
                        <ElysianTextLogo />
                    </div>


                </div>

                {/* 2. The Card (Floating, White, Clean) */}
                <div className="w-full max-w-[380px] bg-transparent dark:bg-transparent backdrop-blur-xl rounded-3xl shadow-none border-none p-6 z-30 relative mb-8">
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Masuk Sistem Audit Finansial Otonom</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Masukkan kredensial auditor/inspektorat Anda untuk mengakses fitur.</p>
                    </div>

                    <SocialAuth />

                    <div className="flex items-center gap-3 my-6">
                        <hr className="flex-1 border-slate-200" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atau masuk manual</span>
                        <hr className="flex-1 border-slate-200" />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 h-11 rounded-xl px-4 text-slate-900 dark:text-white font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all shadow-sm"
                                                placeholder="name@company.com"
                                                {...field}
                                                onFocus={() => setIsEmailFocused(true)}
                                                onBlur={() => setIsEmailFocused(false)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kata Sandi</FormLabel>
                                            <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                                Lupa?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <InputPassword
                                                    className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 h-11 rounded-xl px-4 text-slate-900 dark:text-white font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all shadow-sm"
                                                    placeholder="••••••••"
                                                    {...field}
                                                    onFocus={() => setIsPasswordFocused(true)}
                                                    onBlur={() => setIsPasswordFocused(false)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-none transition-all mt-2"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Masuk
                            </Button>

                            <div className="text-center text-sm text-slate-500 mt-6 pb-2">
                                Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Buat akun</Link>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Footer Copyright */}
                <div className="pb-8 text-center opacity-40">
                    <p className="text-[10px] text-slate-400">&copy; 2026 Elysian Rebirth v3.0.</p>
                </div>
            </div>

            {/* --------------------------------------------------------------------------------
               DESKTOP LAYOUT: "Glass Citadel" & "Premium Stage" (Visible only on Desktop)
            -------------------------------------------------------------------------------- */}
            <div className="hidden lg:flex flex-col justify-center min-h-screen py-10 px-12 relative w-full items-center overflow-y-auto">

                <div className="w-full max-w-[380px] space-y-6">

                    <div className="flex flex-col items-center justify-center text-center w-full">
                        <div className="flex justify-center mb-4 scale-110">
                            <ElysianTextLogo />
                        </div>
                        <p className="text-sm text-slate-400 mb-8 font-medium">
                            Infrastruktur Audit Finansial Otonom (Pre-Audit Pemda)
                        </p>
                        <h1 className="text-xl font-bold text-white mb-6">
                            Masuk Sistem Audit Finansial Otonom
                        </h1>
                    </div>

                    <SocialAuth />

                    <div className="flex items-center gap-3 py-2">
                        <hr className="flex-1 border-slate-200" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atau masuk manual</span>
                        <hr className="flex-1 border-slate-200" />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Alamat Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-11 bg-transparent dark:bg-transparent border-slate-300 dark:border-white/10 focus:bg-white/5 dark:focus:bg-white/5 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 rounded-lg placeholder:text-slate-400 text-slate-900 dark:text-white font-medium shadow-sm"
                                                placeholder="name@company.com"
                                                onFocus={() => setIsEmailFocused(true)}
                                                onBlur={() => setIsEmailFocused(false)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Kata Sandi</FormLabel>
                                            <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline">
                                                Lupa?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <InputPassword
                                                {...field}
                                                className="h-11 bg-transparent dark:bg-transparent border-slate-300 dark:border-white/10 focus:bg-white/5 dark:focus:bg-white/5 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 rounded-lg placeholder:text-slate-400 text-slate-900 dark:text-white font-medium shadow-sm"
                                                placeholder="••••••••"
                                                onFocus={() => setIsPasswordFocused(true)}
                                                onBlur={() => setIsPasswordFocused(false)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-none transition-all active:scale-[0.98] mt-4"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Masuk"}
                            </Button>

                            <div className="pt-4 text-center text-sm text-slate-500">
                                Belum punya akun? <Link href="/register" className="text-blue-700 font-semibold hover:underline">Buat akun</Link>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-xs text-slate-400">
                        &copy; 2026 Elysian Corp. <Link href="#" className="hover:text-slate-400">Privasi</Link> &middot; <Link href="#" className="hover:text-slate-400">Syarat</Link>
                    </p>
                </div>
            </div >
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}