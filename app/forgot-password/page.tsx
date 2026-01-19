'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/';
import { Card, CardContent } from '@/components/ui/';
import { Input } from '@/components/ui/';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/';
import { LandingNavbar } from '@/components/LandingNavbar';

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
        // router.push('/login'); // Optional: redirect or show success state
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('/login_background_blue_waves.png')] bg-cover bg-center bg-no-repeat p-4 font-sans relative">
            <LandingNavbar />

            {/* Main Content Container */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left Side: Reset Form Card */}
                <div className="flex justify-center lg:justify-end">
                    <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white rounded-2xl overflow-hidden relative z-10 animate-in slide-in-from-left duration-500">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                    Atur Ulang Kata Sandi
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Masukkan Email/No. Handphone yang terdaftar.<br />
                                    Kami akan mengirimkan kode verifikasi untuk atur ulang kata sandi.
                                </p>
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

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#8bc34a] hover:bg-[#7cb342] text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/20 transition-all"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        Selanjutnya
                                    </Button>

                                    <div className="text-center mt-6">
                                        <Link href="/login" className="inline-flex items-center text-sm text-blue-500 font-semibold hover:underline">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali ke Login
                                        </Link>
                                    </div>

                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Illustration (Same as Login) */}
                <div className="hidden lg:flex flex-col items-center justify-center text-center text-white space-y-8 animate-in slide-in-from-right duration-500">
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

            {/* Footer Help Button */}
            <div className="absolute bottom-8 right-8">
                <Button variant="secondary" size="sm" className="bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-lg">
                    Bantuan
                </Button>
            </div>
        </div>
    );
}
