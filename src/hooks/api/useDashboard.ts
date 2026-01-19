'use client';

import { useState, useEffect } from 'react';

export function useDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        const timer = setTimeout(() => {
            setStats({
                revenue: '$12,345',
                activeUsers: '1,234',
                sales: '567'
            });
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return { stats, isLoading };
}
