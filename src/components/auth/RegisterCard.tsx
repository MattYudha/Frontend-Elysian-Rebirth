'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useOnboardingStore } from '@/store/useOnboardingStore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import { checkPasswordStrength } from '@/lib/password-strength';
import { APP_NAME } from '@/lib/config';
import { ElysianTextLogo } from '@/components/ui/elysian-logo';
import { cn } from '@/lib/utils';

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

interface RegisterCardProps {
    isModal?: boolean;
}

export function RegisterCard({ isModal = false }: RegisterCardProps) {
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

        try {
            await authService.register({
                name: values.fullName,
                email: values.email,
                password: values.password
            });

            toast.success('Registration successful!', {
                description: 'Please login with your new account.'
            });

            // Activate onboarding for first-time users
            useOnboardingStore.getState().startOnboarding();

            if (isModal) {
                window.location.href = '/login';
            } else {
                router.push('/login');
            }

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Registration failed';
            toast.error('Registration Failed', { description: msg });
        } finally {
            setIsLoading(false);
        }
    }

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

            <div className="text-center space-y-2 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h1>
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
                                        <img src="public/indonesia.png" alt="ID" className="w-5 h-auto rounded-sm shadow-sm" />
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
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] mt-2"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Daftar Akun
                    </Button>

                    <div className="text-center text-sm text-slate-500 mt-6 lg:pb-0">
                        Sudah memiliki akun {APP_NAME}? <Link href="/login" className="text-blue-700 font-semibold hover:underline">Masuk Sekarang</Link>
                    </div>

                </form>
            </Form>
        </div>
    );
}
