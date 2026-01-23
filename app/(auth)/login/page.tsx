'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
import RiveLoginAvatar from '@/components/ui/rive-login-avatar';

import { ElysianTextLogo } from '@/components/ui/elysian-logo';

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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
        setSubmitStatus('idle'); // Reset status

        try {
            // Mock Login Logic
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API slightly longer to enjoy animation

            // Simple validation simulation
            if (!values.email || !values.password) {
                throw new Error("Invalid credentials");
            }

            const mockUser = {
                id: 'usr_' + Math.random().toString(36).substr(2, 9),
                email: values.email || 'demo@elysian.ai',
                name: 'Demo User',
                role: 'admin' as const,
                company: 'Elysian Corp',
                avatar: 'https://github.com/shadcn.png'
            };

            // Call Global Store
            login(mockUser);

            setSubmitStatus('success');
            toast.success('Berhasil masuk!');

            // Allow animation to play success trigger before redirecting
            setTimeout(() => {
                const redirectTo = sessionStorage.getItem('redirect_after_login') || '/dashboard';
                sessionStorage.removeItem('redirect_after_login');
                router.push(redirectTo);
            }, 1000);

        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
            toast.error('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
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
            <div className="lg:hidden fixed inset-0 z-50 w-full min-h-screen flex flex-col items-center justify-start pt-12 px-6 bg-white overflow-y-auto">

                {/* Background Decor (Subtle) */}
                <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[300px] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[300px] bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none" />

                {/* 1. Header & Rive Stage */}
                <div className="w-full flex flex-col items-center z-10 relative">
                    {/* Brand Logo */}
                    <div className="mb-4">
                        <ElysianTextLogo />
                    </div>

                    {/* Rive Avatar - Adjusted size for Mobile */}
                    <div className="w-[260px] h-[260px] pointer-events-none -mb-10 drop-shadow-xl z-20 flex justify-center items-center">
                        <RiveLoginAvatar
                            emailValue={emailValue || ""}
                            isEmailFocused={isEmailFocused}
                            isPasswordFocused={isPasswordFocused}
                            submitStatus={submitStatus}
                        />
                    </div>
                </div>

                {/* 2. The Card (Floating, White, Clean) */}
                <div className="w-full max-w-[380px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 z-30 relative mb-8">
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                        <p className="text-slate-500 text-xs font-medium mt-1">Enter your credentials to access functionality.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 border-slate-200 h-11 rounded-xl px-4 text-slate-900 font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
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
                                            <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</FormLabel>
                                            <Link href="/forgot-password" className="text-xs text-blue-600 font-bold hover:underline">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <InputPassword
                                                    className="bg-slate-50 border-slate-200 h-11 rounded-xl px-4 text-slate-900 font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
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
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-2"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Sign In
                            </Button>

                            <div className="text-center text-sm text-slate-500 mt-6 pb-2">
                                Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Create one</Link>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Footer Copyright */}
                <div className="pb-8 text-center opacity-40">
                    <p className="text-[10px] text-slate-400">&copy; 2026 Elysian Corp.</p>
                </div>
            </div>

            {/* --------------------------------------------------------------------------------
               DESKTOP LAYOUT: "Glass Citadel" & "Premium Stage" (Visible only on Desktop)
            -------------------------------------------------------------------------------- */}
            < div className="hidden lg:flex flex-col justify-center h-full px-12 relative w-full items-center" >

                {/* Brand Logo (Absolute Top Left of Panel) */}
                < div className="absolute top-8 left-8" >
                    <Link href="/">
                        <ElysianTextLogo />
                    </Link>
                </div >

                <div className="w-full max-w-[380px] space-y-6">

                    {/* Rive Stage (Breaking the grid) */}
                    <div className="h-[260px] w-[140%] -ml-[20%] flex items-end justify-center pb-0 pointer-events-none">
                        <RiveLoginAvatar
                            emailValue={emailValue || ""}
                            isEmailFocused={isEmailFocused}
                            isPasswordFocused={isPasswordFocused}
                            submitStatus={submitStatus}
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Enter your credentials to access your workspace.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
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
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Password</FormLabel>
                                            <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <InputPassword
                                                {...field}
                                                className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
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
                                className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] mt-4"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                            </Button>

                            <div className="pt-4 text-center text-sm text-slate-500">
                                Don&apos;t have an account? <Link href="/register" className="text-blue-700 font-semibold hover:underline">Create one</Link>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-xs text-slate-400">
                        &copy; 2026 Elysian Corp. <Link href="#" className="hover:text-slate-600">Privacy</Link> &middot; <Link href="#" className="hover:text-slate-600">Terms</Link>
                    </p>
                </div>
            </div >
        </>
    );
}
