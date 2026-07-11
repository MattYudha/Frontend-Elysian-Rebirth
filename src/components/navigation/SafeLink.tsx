'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { useSettingsUiStore } from '@/store/ui/settingsStore';
import React from 'react';

interface SafeLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export function SafeLink({ children, href, onClick, ...props }: SafeLinkProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isPathDirty = useSettingsUiStore((s) => s.isPathDirty);
    const setDirty = useSettingsUiStore((s) => s.setDirty);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // If an onClick override was provided, run it first
        if (onClick) {
            onClick(e);
            if (e.defaultPrevented) return; // if they called e.preventDefault()
        }

        // Check if current page is dirty
        if (isPathDirty(pathname)) {
            e.preventDefault();
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin pindah?");
            if (confirmLeave) {
                // Clear dirty state for THIS specific page before leaving
                setDirty(pathname, false);
                router.push(href.toString());
            }
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}

// Hook alternative for programmatic navigation
export function useSafeRouter() {
    const router = useRouter();
    const pathname = usePathname();
    const isPathDirty = useSettingsUiStore((s) => s.isPathDirty);
    const setDirty = useSettingsUiStore((s) => s.setDirty);

    const safePush = (href: string) => {
        if (isPathDirty(pathname)) {
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin pindah?");
            if (confirmLeave) {
                setDirty(pathname, false);
                router.push(href);
            }
        } else {
            router.push(href);
        }
    };

    return { safePush, ...router };
}
