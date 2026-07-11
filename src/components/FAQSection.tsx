'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
    return (
        <div className="max-w-3xl mx-auto pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white">
                Pertanyaan yang Sering Diajukan
            </h2>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                        Apa saja Produk dan Fitur dari Aplikasi Elysian?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400">
                        Elysian menawarkan platform otomatisasi dokumen berbasis AI, asisten virtual internal, manajemen alur kerja tanpa koding, dan sistem manajemen pengetahuan terpusat untuk modernisasi bisnis Anda.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                        Mengapa harus menggunakan Elysian untuk bisnis Anda?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400">
                        Kami membantu Anda menghemat waktu dan biaya operasional dengan mengotomatiskan tugas repetitif, meningkatkan akurasi data, and memungkinkan tim Anda fokus pada pekerjaan strategis.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                        Apakah Aplikasi Elysian Gratis?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400">
                        Kami menawarkan paket Free Tier untuk UMKM pemula. Untuk fitur enterprise dan volume data yang lebih besar, kami menyediakan paket berlangganan yang fleksibel sesuai kebutuhan Anda.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                        Apakah Elysian terjamin keamanannya?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400">
                        Ya, keamanan data adalah prioritas kami. Semua data dienkripsi dengan standar industri (AES-256) dan kami mematuhi regulasi perlindungan data yang berlaku.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                        Bagaimana Cara Mulai Menggunakan Elysian?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400">
                        Cukup klik tombol &quot;Mulai Sekarang&quot; atau &quot;Coba Sekarang&quot; di halaman ini untuk mendaftar akun gratis dan mulai jelajahi fitur-fitur kami dalam hitungan menit.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
