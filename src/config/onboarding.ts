export interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    targetId: string; // The DOM ID to highlight
    label?: string;
    outcome?: string;
    ctaLabel: string;
    navigateTo?: string; // Optional: Auto-navigate to this route
    mobileOnly?: boolean; // Only show on mobile
    desktopOnly?: boolean; // Only show on desktop
}

// Desktop-focused onboarding (full feature tour with spotlight)
export const desktopOnboardingSteps: OnboardingStep[] = [
    {
        id: 1,
        title: "Selamat Datang di Elysian!",
        description: "Ini adalah Dashboard utama Anda. Di sini Anda bisa melihat ringkasan aktivitas, penggunaan token, dan status pipeline terkini.",
        targetId: "dashboard-header",
        label: "MULAI",
        outcome: "Anda sekarang paham pusat kontrol aplikasi",
        ctaLabel: "Mulai Tour",
        navigateTo: "/dashboard",
        desktopOnly: true
    },
    {
        id: 2,
        title: "Navigasi Global",
        description: "Gunakan sidebar ini untuk berpindah antar modul: Dashboard, Chat AI, Knowledge Base, Editor, Workflow, dan Settings.",
        targetId: "main-sidebar",
        label: "NAVIGASI",
        outcome: "Anda tau cara berpindah antar fitur",
        ctaLabel: "Mengerti",
        desktopOnly: true
    },
    {
        id: 3,
        title: "AI Assistant - Otak Sistem",
        description: "Klik di sini untuk membuka Chat AI. Anda bisa bertanya apa saja, meminta analisis data, atau memberi perintah otomasi.",
        targetId: "ai-assistant-trigger",
        label: "AI CORE",
        outcome: "Akses ke asisten AI utama",
        ctaLabel: "Lanjut",
        desktopOnly: true
    },
    {
        id: 4,
        title: "Knowledge Base - Pustaka Cerdas",
        description: "Upload dokumen perusahaan Anda di sini (SOP, Invoice, Kontrak). AI akan mengindeks dan siap menjawab pertanyaan berdasarkan dokumen ini.",
        targetId: "knowledge-base-trigger",
        label: "KNOWLEDGE",
        outcome: "Sistem 'belajar' dari dokumen Anda",
        ctaLabel: "Paham",
        navigateTo: "/knowledge",
        desktopOnly: true
    },
    {
        id: 5,
        title: "Smart Editor - Tulis dengan AI",
        description: "Editor canggih untuk menulis dokumen, proposal, atau laporan dengan bantuan AI. Markdown + AI Completion dalam satu tempat.",
        targetId: "editor-trigger",
        label: "EDITOR",
        outcome: "Tool untuk konten berkualitas tinggi",
        ctaLabel: "Oke",
        desktopOnly: true
    },
    {
        id: 6,
        title: "Workflow Builder - Otomasi Visual",
        description: "Buat alur kerja otomatis dengan drag-and-drop. Contoh: 'Saat email masuk → Ekstrak data → Simpan ke database → Kirim notifikasi'",
        targetId: "workflow-trigger",
        label: "AUTOMATION",
        outcome: "Otomasi tanpa coding",
        ctaLabel: "Menarik!",
        desktopOnly: true
    },
    {
        id: 7,
        title: "Settings - Kontrol Penuh",
        description: "Kelola tim, API keys, model AI, dan preferensi sistem enterprise di sini.",
        targetId: "settings-trigger",
        label: "SETTINGS",
        outcome: "Kustomisasi sesuai kebutuhan",
        ctaLabel: "Jelas",
        desktopOnly: true
    },
    {
        id: 8,
        title: "Profil & Akun",
        description: "Akses profil Anda, ganti password, atur notifikasi, atau logout di sini.",
        targetId: "user-menu-trigger",
        label: "AKUN",
        outcome: "Manajemen akun personal",
        ctaLabel: "Selesai",
        desktopOnly: true
    }
];

// Mobile-focused onboarding (compact, bottom nav focused, no spotlight)
export const mobileOnboardingSteps: OnboardingStep[] = [
    {
        id: 101,
        title: "👋 Selamat Datang!",
        description: "Elysian adalah platform AI enterprise Anda. Mari kenali fitur-fitur utama dalam 5 langkah singkat.",
        targetId: "mobile-bottom-nav",
        label: "MULAI",
        ctaLabel: "Mulai",
        mobileOnly: true
    },
    {
        id: 102,
        title: "🏠 Dashboard",
        description: "Halaman ini menampilkan ringkasan aktivitas AI, penggunaan token, dan performa sistem Anda.",
        targetId: "mobile-nav-dashboard",
        label: "HOME",
        outcome: "Monitor aktivitas real-time",
        ctaLabel: "Lanjut",
        mobileOnly: true
    },
    {
        id: 103,
        title: "💬 Chat AI",
        description: "Tap ikon Chat di bawah untuk berbicara dengan AI. Tanya apa saja, minta analisis, atau beri perintah.",
        targetId: "mobile-nav-chat",
        label: "AI",
        outcome: "Akses asisten AI kapan saja",
        ctaLabel: "Paham",
        mobileOnly: true
    },
    {
        id: 104,
        title: "📚 Knowledge Base",
        description: "Upload dokumen perusahaan (SOP, Invoice) agar AI bisa 'belajar' dan menjawab pertanyaan Anda.",
        targetId: "mobile-nav-knowledge",
        label: "DOCS",
        outcome: "AI yang lebih pintar",
        ctaLabel: "Mengerti",
        mobileOnly: true
    },
    {
        id: 105,
        title: "👤 Profil Anda",
        description: "Tap ikon Profile untuk mengatur akun, notifikasi, dan preferensi aplikasi.",
        targetId: "mobile-nav-profile",
        label: "AKUN",
        outcome: "Kontrol penuh akun Anda",
        ctaLabel: "Selesai",
        mobileOnly: true
    }
];

// Helper function to get appropriate steps based on device
export function getOnboardingSteps(isMobile: boolean): OnboardingStep[] {
    return isMobile ? mobileOnboardingSteps : desktopOnboardingSteps;
}

// Export all steps combined (for backward compatibility)
export const onboardingSteps = [...desktopOnboardingSteps, ...mobileOnboardingSteps];
