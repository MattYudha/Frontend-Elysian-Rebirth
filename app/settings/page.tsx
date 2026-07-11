'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkScreenAndRedirect = () => {
            // Tailwind 'md' is 768px. If desktop, go straight to profile
            if (window.innerWidth >= 768) {
                router.replace('/settings/profile');
            } else {
                // If mobile, stop checking, stay on this page.
                // The SettingsLayout handles the UI by showing the Sidebar and hiding this children pane.
                setIsChecking(false);
            }
        };

        checkScreenAndRedirect();

        window.addEventListener('resize', checkScreenAndRedirect);
        return () => window.removeEventListener('resize', checkScreenAndRedirect);
    }, [router]);

    // On mobile, this shouldn't even be visible because SettingsLayout hides the <main> block 
    // when pathname === '/settings'. Just in case, return null or a skeleton.
    if (isChecking) return <div className="p-8 hidden md:block">Routing...</div>;

    return null;
}
