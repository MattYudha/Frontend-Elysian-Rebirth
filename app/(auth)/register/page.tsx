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
import { InputPassword } from '@/components/ui/';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/';
import { Checkbox } from '@/components/ui/';
import { PasswordStrengthMeter } from '@/components/ui/';
import { checkPasswordStrength } from '@/lib/password-strength';
import { APP_NAME } from '@/lib/config';

import { ElysianTextLogo } from '@/components/ui/elysian-logo';

// --- LOGIC AREA (TIDAK BERUBAH SAMA SEKALI) ---
const formSchema = z.object({
    phone: z.string()
        .min(10, { message: "Nomor telepon tidak valid." })
        .transform((val) => {
            let clean = val.replace(/\D/g, '');
            if (clean.startsWith('0')) clean = clean.slice(1);
            if (clean.startsWith('62')) clean = clean.slice(2);
            return `62${clean}`;
        }),
    email: z.string().email({ message: "Email tidak valid." }),
    fullName: z.string().min(3, { message: "Nama lengkap wajib diisi." }),
    password: z.string().min(8, { message: "Password minimal 8 karakter" }),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    terms: z.boolean().refine(val => val === true, {
        message: "Anda harus menyetujui Syarat dan Ketentuan.",
    }),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password tidak cocok",
            path: ["confirmPassword"],
        });
    }

    if (data.password) {
        const passwordLower = data.password.toLowerCase();
        const nameParts = data.fullName.toLowerCase().split(' ');
        for (const part of nameParts) {
            if (part.length > 3 && passwordLower.includes(part)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password tidak boleh mengandung nama Anda",
                    path: ["password"],
                });
                return;
            }
        }

        const emailUser = data.email.split('@')[0]?.toLowerCase();
        if (emailUser && emailUser.length > 3 && passwordLower.includes(emailUser)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password tidak boleh mengandung username email",
                path: ["password"],
            });
            return;
        }

        const { score } = checkPasswordStrength(data.password);
        if (score < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password terlalu lemah",
                path: ["password"],
            });
        }
    }
});

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
            email: "",
            fullName: "",
            password: "",
            confirmPassword: "",
            referralCode: "",
            terms: false,
        },
    });



    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log("Submitting Sanitized Values:", values);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast.success('Pendaftaran berhasil! Silakan masuk.');
        setIsLoading(false);
        router.push('/login');
    }

    return (
        <>
            {/* =====================================================================================
                MOBILE LAYOUT (UNIFIED LIGHT THEME) - lg:hidden
                Clean, Spacious, Native App Feel. Matches Login Page.
               ===================================================================================== */}
            <div className="lg:hidden min-h-screen w-full bg-white flex flex-col relative overflow-x-hidden">

                {/* Background Decor (Subtle & Fixed) */}
                <div className="fixed top-[-10%] left-[-20%] w-[80%] h-[300px] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-20%] w-[80%] h-[300px] bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none" />

                {/* Content Container (Scrollable) */}
                <div className="relative z-10 flex flex-col items-center justify-start w-full px-6 pt-8 pb-12">

                    {/* 1. Brand Header */}
                    <div className="flex flex-col items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="p-0">
                            <ElysianTextLogo className="scale-110" />
                        </div>
                        <div className="text-center mt-2">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                            <p className="text-slate-500 text-xs font-medium">Join Elysian today</p>
                        </div>
                    </div>

                    {/* 2. The Form Card - Clean & Floating */}
                    <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 sm:p-8 animate-in zoom-in-95 duration-500">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                {/* Nama Lengkap */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
                                                    placeholder="Aditya..."
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Nomor Telepon - Layout Rapi */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor Telepon</FormLabel>
                                            <div className="flex gap-3">
                                                <div className="flex items-center justify-center bg-slate-100 border border-slate-200 rounded-xl px-3 h-12 min-w-[72px] shrink-0">
                                                    <span className="text-sm font-bold text-slate-700">+62</span>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all flex-1"
                                                        placeholder="812-3456-7890"
                                                        type="tel"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
                                                    placeholder="contoh@email.com"
                                                    type="email"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Fields Grid */}
                                <div className="space-y-4 pt-1">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</FormLabel>
                                                <FormControl>
                                                    <InputPassword
                                                        className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
                                                        placeholder="Rahasia..."
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <PasswordStrengthMeter password={field.value} />
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ulangi Password</FormLabel>
                                                <FormControl>
                                                    <InputPassword
                                                        className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
                                                        placeholder="Konfirmasi..."
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Referral Code (Optional) */}
                                <FormField
                                    control={form.control}
                                    name="referralCode"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kode Referral (Opsional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
                                                    placeholder="ELYSIAN2024"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Terms & Conditions */}
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                    className="mt-0.5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none text-xs text-slate-600">
                                                <FormLabel className="font-medium text-slate-600">
                                                    Saya setuju dengan <Link href="#" className="text-blue-600 font-bold hover:underline">Syarat & Ketentuan</Link> {APP_NAME}.
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button - Besar & Touchable */}
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    Buat Akun Sekarang
                                </Button>

                                {/* Footer Link */}
                                <div className="text-center mt-6">
                                    <p className="text-sm text-slate-500 font-medium">
                                        Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline ml-1">Masuk</Link>
                                    </p>
                                </div>

                            </form>
                        </Form>
                    </div>

                    {/* Footer Copyright Kecil */}
                    <div className="mt-8 text-center opacity-40">
                        <p className="text-[10px] text-white">&copy; 2026 Elysian Corp.</p>
                    </div>

                </div>
            </div>

            {/* =====================================================================================
                DESKTOP LAYOUT (GLASS CITADEL) - hidden lg:flex
                TIDAK DIUBAH SAMA SEKALI DARI ORIGINAL
               ===================================================================================== */}
            <div className="hidden lg:flex flex-col justify-center min-h-screen py-12 px-8 lg:px-12 w-full relative">

                {/* Brand Logo */}
                <div className="absolute top-8 left-8">
                    <Link href="/">
                        <ElysianTextLogo />
                    </Link>
                </div>

                <div className="w-full max-w-[420px] mx-auto space-y-6">
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
                        <p className="text-slate-500 text-sm">Start your 14-day free trial with Elysian.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                placeholder="cth. Aditya Pangestu"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone Number */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Nomor Telepon <span className="text-red-500">*</span></FormLabel>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center gap-1 bg-slate-50 border border-slate-200 h-11 px-3 rounded-lg text-sm text-slate-600 font-medium cursor-not-allowed select-none min-w-[80px]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-5 h-auto rounded-sm shadow-sm" />
                                                <span>+62</span>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                    placeholder="812..."
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Email <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                placeholder="cth. elysian@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Password <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <InputPassword
                                                    disabled={isLoading}
                                                    className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                    placeholder="Rahasia..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <PasswordStrengthMeter password={field.value} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Konfirmasi</FormLabel>
                                            <FormControl>
                                                <InputPassword
                                                    disabled={isLoading}
                                                    className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                    placeholder="Ulangi..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Referral Code */}
                            <FormField
                                control={form.control}
                                name="referralCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Kode Referral (Opsional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="h-11 bg-white/50 border-slate-200 focus:bg-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 rounded-lg placeholder:text-slate-400"
                                                placeholder="cth. ELYSIAN2024"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Terms Checkbox */}
                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-1">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isLoading}
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none text-sm text-slate-600">
                                            <FormLabel className="font-normal">
                                                Saya setuju dengan <Link href="#" className="text-blue-600 font-semibold hover:underline">Syarat dan Ketentuan</Link> {APP_NAME}.
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] mt-2"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Daftar Akun
                            </Button>

                            <div className="text-center text-sm text-slate-500 mt-6 pb-6 lg:pb-0">
                                Sudah memiliki akun {APP_NAME}? <Link href="/login" className="text-blue-700 font-semibold hover:underline">Masuk Sekarang</Link>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
}