'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ShieldAlert,
    LayoutDashboard,
    Users,
    Shield,
    Activity,
    FileText,
    ToggleLeft
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Tenants", href: "/admin/tenants" },
    { icon: Shield, label: "RBAC Matrix", href: "/admin/rbac" },
    { icon: ToggleLeft, label: "Feature Flags", href: "/admin/flags" },
    { icon: FileText, label: "Audit Logs", href: "/admin/audit" },
    { icon: Activity, label: "AI Observability", href: "/admin/ai-monitor" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        // Floating Sidebar: m-2 rounded-2xl
        // Light: bg-white border-slate-200 text-slate-900
        // Dark: glass-obsidian border-white/5 text-slate-100
        <div className="hidden md:flex flex-col w-64 m-2 rounded-2xl bg-white dark:bg-slate-950/50 dark:glass-obsidian border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-100 h-[calc(100vh-16px)] sticky top-2 shadow-2xl overflow-hidden transition-colors duration-300">

            {/* Header - "Control Room" Vibe */}
            <Link href="/admin" className="block">
                <div className="p-5 flex items-center gap-3 bg-gradient-to-b from-slate-50 to-transparent dark:from-rose-950/20 dark:to-transparent hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="p-2 bg-white dark:bg-rose-600/20 border border-slate-200 dark:border-rose-500/30 rounded-lg shadow-sm dark:shadow-[0_0_15px_rgba(225,29,72,0.3)] group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-shadow">
                        <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-[0.2em] text-slate-900 dark:text-rose-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">DASHBOARD</h1>
                        <p className="text-[10px] uppercase text-slate-500 tracking-wider group-hover:text-slate-800 dark:group-hover:text-slate-400">Elysian Admin</p>
                    </div>
                </div>
            </Link>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm dark:shadow-inner"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_10px_#e11d48]" />
                            )}
                            <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Health Status Footer - Compact */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                    <span className="font-medium tracking-wide">SYSTEM HEALTH</span>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Ok</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
