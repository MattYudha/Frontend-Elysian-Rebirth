'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, Flag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/ui/primitives/button';
import { Card, CardContent } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/primitives/form';
import { Checkbox } from '@/ui/primitives/checkbox';
import { APP_NAME } from '@/lib/config';
import { LandingNavbar } from '@/components/LandingNavbar';

const formSchema = z.object({
    phone: z.string().min(10, { message: "Nomor telepon tidak valid." }),
    email: z.string().email({ message: "Email tidak valid." }),
    fullName: z.string().min(3, { message: "Nama lengkap wajib diisi." }),
    referralCode: z.string().optional(),
    terms: z.boolean().refine(val => val === true, {
        message: "Anda harus menyetujui Syarat dan Ketentuan.",
    }),
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
            referralCode: "",
            terms: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(values);
        toast.success('Pendaftaran berhasil! Silakan masuk.');
        setIsLoading(false);
        router.push('/login');
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('/elysian_register_bg.png')] bg-cover bg-center bg-no-repeat p-4 font-sans relative">
            <div className="absolute inset-0 bg-sky-100/30 backdrop-blur-[1px]"></div> {/* Overlay for better text contrast if needed */}
            <LandingNavbar />

            {/* Main Content Container */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
                <Card className="w-full border-none shadow-2xl bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                                Daftar ke {APP_NAME}
                                <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-100" />
                            </h2>
                            <div className="w-12 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-600 font-medium text-xs uppercase tracking-wide">Nomor Telepon <span className="text-red-500">*</span></FormLabel>
                                            <div className="flex items-center gap-2 border-b-2 border-slate-200 focus-within:border-blue-500 transition-colors">
                                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded text-sm text-slate-600 font-medium">
                                                    <img src="https://flagcdn.com/w20/id.png" alt="Indonesia" className="w-5 h-auto shadow-sm rounded-sm" />
                                                    <span>+62</span>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        className="bg-transparent border-0 rounded-none px-0 shadow-none focus-visible:ring-0 placeholder:text-slate-300"
                                                        placeholder="812..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">Nomor telepon akan digunakan untuk masuk ke akun Anda</p>
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
                                            <FormLabel className="text-slate-600 font-medium text-xs uppercase tracking-wide">Email <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-transparent border-0 border-b-2 border-slate-200 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors placeholder:text-slate-300"
                                                    placeholder="cth. elysian@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-600 font-medium text-xs uppercase tracking-wide">Nama Lengkap Pengguna <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-transparent border-0 border-b-2 border-slate-200 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors placeholder:text-slate-300"
                                                    placeholder="cth. Aditya Pangestu"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Referral Code */}
                                <FormField
                                    control={form.control}
                                    name="referralCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-600 font-medium text-xs uppercase tracking-wide">Kode Referral (Opsional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-transparent border-0 border-b-2 border-slate-200 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors placeholder:text-slate-300"
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
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50 border-slate-100">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-xs font-normal text-slate-600">
                                                    Saya telah membaca dan setuju akan <Link href="#" className="text-blue-600 font-semibold hover:underline">Syarat dan Ketentuan</Link> penggunaan platform {APP_NAME} untuk penggunaan usaha saya
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    Daftar
                                </Button>

                                <div className="text-center text-xs text-slate-500 mt-6">
                                    Sudah memiliki akun {APP_NAME}? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Masuk Sekarang</Link>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            {/* Footer Help Button */}
            <div className="absolute bottom-8 right-8 hidden md:block">
                <Button variant="secondary" size="sm" className="bg-white text-slate-700 hover:bg-slate-100 rounded-full shadow-lg">
                    Bantuan
                </Button>
            </div>
        </div>
    );
}
