'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import RiveLoginAvatar from '@/components/ui/rive-login-avatar';
import { ElysianTextLogo } from '@/components/ui/elysian-logo';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
});

interface LoginCardProps {
    isModal?: boolean;
}

export function LoginCard({ isModal = false }: LoginCardProps) {
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
        setSubmitStatus('idle');

        try {
            // Real API Call
            const response = await authService.login({
                email: values.email,
                password: values.password
            });

            // Map API user to Store user (providing defaults for missing fields)
            const user = {
                role: 'viewer', // Default for now, generic backend might not return role
                avatar: undefined,
                ...response.data.user // Spread user fields (id, email, name, etc.)
            };

            login(user as any, response.data.access_token); // Store token for authenticated API calls

            setSubmitStatus('success');
            toast.success('Login Successful', { description: 'Welcome back to Elysian.' });

            setTimeout(() => {
                const redirectTo = sessionStorage.getItem('redirect_after_login') || '/dashboard';
                sessionStorage.removeItem('redirect_after_login');
                window.location.href = redirectTo;
            }, 500);

        } catch (error: any) {
            console.error(error);
            setSubmitStatus('error');
            // Extract error message if available
            const msg = error.response?.data?.error || error.message || 'Failed to login';
            toast.error('Login Failed', { description: msg });
        } finally {
            setIsLoading(false);
        }
    }

    const emailValue = form.watch('email');

    return (
        <div className={cn(
            "w-full max-w-[420px] mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 sm:p-8",
            isModal && "shadow-none border-0 bg-transparent"
        )}>
            {/* Logo for Modal */}
            {isModal && (
                <div className="flex justify-center mb-6">
                    <ElysianTextLogo />
                </div>
            )}

            {/* Rive Stage */}
            <div className="h-[200px] w-full flex items-end justify-center pb-0 pointer-events-none -mt-10 overflow-hidden">
                <div className="scale-75 origin-bottom">
                    <RiveLoginAvatar
                        emailValue={emailValue || ""}
                        isEmailFocused={isEmailFocused}
                        isPasswordFocused={isPasswordFocused}
                        submitStatus={submitStatus}
                    />
                </div>
            </div>

            <div className="text-center space-y-2 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
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
                        className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] mt-4"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                    </Button>

                    <div className="pt-4 text-center text-sm text-slate-500">
                        Don&apos;t have an account? <Link href="/register" className="text-blue-700 font-semibold hover:underline">Create one</Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}
