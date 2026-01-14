'use client';

import { Protected } from '@/components/Protected';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Switch } from '@/ui/switch';
import { Bell, Lock, User, Palette } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
    return (
        <Protected>
            <div className="container max-w-5xl mx-auto py-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
                    <p className="text-slate-500">Kelola preferensi dan informasi akun Anda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    {/* Settings Sidebar */}
                    <nav className="flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start font-semibold bg-blue-50 text-blue-700">
                            <User className="mr-2 h-4 w-4" />
                            Profil
                        </Button>
                        <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
                            <Lock className="mr-2 h-4 w-4" />
                            Keamanan
                        </Button>
                        <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
                            <Palette className="mr-2 h-4 w-4" />
                            Tampilan
                        </Button>
                        <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
                            <Bell className="mr-2 h-4 w-4" />
                            Notifikasi
                        </Button>
                    </nav>

                    {/* Main Settings Content */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card className="border shadow-sm">
                            <CardHeader>
                                <CardTitle>Profil Pengguna</CardTitle>
                                <CardDescription>Informasi pribadi yang akan ditampilkan di akun Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100">
                                        <Image src="/public/avatar-placeholder.png" alt="Avatar" width={80} height={80} className="object-cover bg-slate-200" />
                                        {/* Fallback text if image missing usually handled by Avatar component, simplifying here */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-xl">
                                            JD
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Ganti Foto</Button>
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input id="name" defaultValue="John Doe" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="john.doe@example.com" disabled />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Nomor Telepon</Label>
                                        <Input id="phone" placeholder="+62..." />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-blue-600 hover:bg-blue-700">Simpan Perubahan</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interface Settings */}
                        <Card className="border shadow-sm">
                            <CardHeader>
                                <CardTitle>Preferensi</CardTitle>
                                <CardDescription>Sesuaikan pengalaman penggunaan aplikasi.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Mode Gelap</Label>
                                        <p className="text-sm text-slate-500">
                                            Aktifkan tampilan gelap untuk kenyamanan mata.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Notifikasi Email</Label>
                                        <p className="text-sm text-slate-500">
                                            Terima update mingguan tentang aktivitas dokumen.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Protected>
    );
}
