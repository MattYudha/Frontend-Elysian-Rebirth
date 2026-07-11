"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/';
import { Home } from "lucide-react";

const routeNameMap: Record<string, string> = {
    dashboard: "Dashboard",
    chat: "AI Chat",
    settings: "Settings",
    workflow: "Workflows",
    knowledge: "Knowledge Base",
};

export function DynamicBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter((item) => item !== "");

    if (segments.length === 0) return null;

    return (
        <Breadcrumb className="hidden md:flex mb-4 px-6 pt-4"> {/* Padding adjusted for Topbar placement */}
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    let displayName = routeNameMap[segment] || segment;

                    // Formatting simple (Capitalize)
                    if (!routeNameMap[segment] && segment.length <= 20) {
                        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                    }

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{displayName}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
