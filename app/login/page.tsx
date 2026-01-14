'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/ui/primitives/button';
import { Card, CardContent } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/primitives/form';
import { Checkbox } from '@/ui/primitives/checkbox';
import { APP_NAME } from '@/lib/config';
import { LandingNavbar } from '@/components/LandingNavbar';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
    email: z.string().min(1, { message: "Email atau No. Handphone wajib diisi." }),
    password: z.string().min(1, { message: "Kata sandi wajib diisi." }),
    rememberMe: z.boolean(),
});

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false, // Ensure defaults match exactly
        },
    });

    /*
    useEffect(() => {
        if (isAuthenticated) {
            const redirectTo = sessionStorage.getItem('redirect_after_login') || '/dashboard';
            sessionStorage.removeItem('redirect_after_login');
            router.push(redirectTo);
        }
    }, [isAuthenticated, router]);
    */

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await login({ email: values.email, password: values.password });
            toast.success('Berhasil masuk!');
            const redirectTo = sessionStorage.getItem('redirect_after_login') || '/dashboard';
            sessionStorage.removeItem('redirect_after_login');
            router.push(redirectTo);
        } catch (error) {
            toast.error('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('/login_background_blue_waves.png')] bg-cover bg-center bg-no-repeat p-4 font-sans relative">
            <LandingNavbar />
            {/* Main Content Container */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left Side: Login Card */}
                <div className="flex justify-center lg:justify-end">
                    <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white rounded-2xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                                    Masuk ke {APP_NAME}
                                    <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-100" />
                                </h2>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-600 font-medium">Email atau No. Handphone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="bg-transparent border-0 border-b-2 border-slate-200 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-green-500 transition-colors placeholder:text-slate-400"
                                                        placeholder="Masukkan email atau no. handphone Anda"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Password field - implicitly handled, but for this specific design mimicking simple login first */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="text-slate-600 font-medium">Kata Sandi</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        className="bg-transparent border-0 border-b-2 border-slate-200 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-green-500 transition-colors placeholder:text-slate-400"
                                                        placeholder="Masukkan kata sandi Anda"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#8bc34a] hover:bg-[#7cb342] text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20 transition-all"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        Masuk
                                    </Button>

                                    <div className="flex items-center justify-between mt-4">
                                        <FormField
                                            control={form.control}
                                            name="rememberMe"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0 text-slate-500">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="border-slate-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal text-xs cursor-pointer pt-0.5">
                                                        Ingat Saya
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline">
                                            Lupa kata sandi?
                                        </Link>
                                    </div>

                                    <div className="text-center text-xs text-slate-500 mt-6">
                                        Belum memiliki akun {APP_NAME}? <Link href="/register" className="text-blue-500 font-semibold hover:underline">Daftar Sekarang</Link>
                                    </div>

                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Illustration */}
                <div className="hidden lg:flex flex-col items-center justify-center text-center text-white space-y-8">
                    <div className="relative w-[500px] h-[500px]">
                        <Image
                            src="/backgroundlogin.png"
                            alt="Login Illustration"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="space-y-2 max-w-md">
                        <h3 className="text-xl font-bold">Solusi Mendapatkan Pembayaran</h3>
                        <p className="text-white/80">Tercepat untuk Semua Bisnis</p>
                    </div>
                </div>

            </div>

            {/* Brand Logo Top Right */}

            {/* Footer Help Button */}
            <div className="absolute bottom-8 right-8">
                <Button variant="secondary" size="sm" className="bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-lg">
                    Bantuan
                </Button>
            </div>
        </div>
    );
}
