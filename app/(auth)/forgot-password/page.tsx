'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { ElysianTextLogo } from '@/components/ui/elysian-logo';

const formSchema = z.object({
    email: z.string().min(1, { message: "Email atau No. Handphone wajib diisi." }),
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(values);
        toast.success('Link reset kata sandi telah dikirim!');
        setIsLoading(false);
    }

    return (
        <>

            {/* --------------------------------------------------------------------------------
               MOBILE LAYOUT (Native App Feel)
               Consistent with Login/Register overrides
            -------------------------------------------------------------------------------- */}
            {/* --------------------------------------------------------------------------------
               MOBILE LAYOUT (UNIFIED LIGHT THEME) - lg:hidden
               Clean, Spacious, Native App Feel. Matches Login Page.
            -------------------------------------------------------------------------------- */}
            <div className="lg:hidden min-h-screen w-full bg-white flex flex-col relative overflow-x-hidden">

                {/* Background Decor (Subtle & Fixed) */}
                <div className="fixed top-[-10%] left-[-20%] w-[80%] h-[300px] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-20%] w-[80%] h-[300px] bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none" />

                {/* Content Container (Scrollable) */}
                <div className="relative z-10 flex flex-col items-center justify-start w-full px-6 pt-24 pb-12">

                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="p-0">
                            <ElysianTextLogo className="scale-110" />
                        </div>
                        <div className="text-center mt-2">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reset Password</h1>
                            <p className="text-slate-500 text-xs font-medium">Recover your account</p>
                        </div>
                    </div>

                    {/* Floating Card */}
                    <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 sm:p-8 animate-in zoom-in-95 duration-500">
                        <div className="text-center mb-6">
                            <p className="text-sm text-slate-500 font-medium">
                                Masukkan email anda yang terdaftar untuk menerima link reset password.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wide">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        className="pl-9 bg-slate-50/50 border-input hover:bg-slate-50 focus:bg-white transition-all duration-200"
                                                        placeholder="name@company.com"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Kirim Link Reset
                                </Button>

                                <div className="text-center pt-2">
                                    <Link href="/login" className="text-xs text-slate-500 hover:text-blue-600 font-semibold inline-flex items-center gap-2 transition-colors">
                                        <ArrowLeft className="w-3 h-3" /> Kembali ke Login
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------------------------------------
               DESKTOP LAYOUT (Glass Citadel)
            -------------------------------------------------------------------------------- */}
            <div className="hidden lg:flex flex-col justify-center min-h-screen py-12 px-12 relative w-full">

                <div className="absolute top-8 left-8">
                    <Link href="/">
                        <ElysianTextLogo />
                    </Link>
                </div>

                <div className="w-full max-w-[400px] mx-auto space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forgot Password?</h1>
                        <p className="text-slate-500 text-sm">
                            Don&apos;t worry, it happens. Enter your email and we&apos;ll send you a reset link.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                placeholder="name@company.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Reset Link"}
                            </Button>

                            <div className="pt-2 text-center">
                                <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-2 transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </Link>
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
            </div>
        </>
    );
}
