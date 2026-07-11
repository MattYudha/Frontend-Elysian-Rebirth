'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const ADMIN_RECOVERY_KEY = 'x-admin-recovery-token';
const AUTH_TOKEN_KEY = 'token'; // Standard token key

export function useImpersonate() {
    const [isImpersonating, setIsImpersonating] = useState(false);

    useEffect(() => {
        // Check if we have a recovery token on mount
        const recoveryToken = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_RECOVERY_KEY) : null;
        setIsImpersonating(!!recoveryToken);
    }, []);

    const impersonate = async (tenantId: string, tenantName: string) => {
        try {
            // 1. Get current Admin Token
            const adminToken = localStorage.getItem(AUTH_TOKEN_KEY);
            if (!adminToken) {
                toast.error("Security Error: No admin session found");
                return;
            }

            // 2. Call API to get Tenant Token
            // NOTE: In production, this MUST call POST /api/admin/impersonate
            // For integration demo, we simulate a token swap
            const mockTenantToken = `mock_user_token_for_${tenantId}`;

            // 3. Store Return Ticket (The Professor's Requirement)
            localStorage.setItem(ADMIN_RECOVERY_KEY, adminToken);
            // Store name for UI display
            localStorage.setItem('impersonating_tenant', tenantName);

            // 4. Swap to Target Token
            localStorage.setItem(AUTH_TOKEN_KEY, mockTenantToken);

            // 5. Redirect and Reload
            toast.loading(`Entering Ghost Mode: ${tenantName}...`);

            // Force hard reload to flush all memory states/providers
            window.location.href = '/dashboard';

        } catch (error) {
            console.error(error);
            toast.error("Failed to enter Ghost Mode");
        }
    };

    const exitGhostMode = () => {
        const adminToken = localStorage.getItem(ADMIN_RECOVERY_KEY);
        if (!adminToken) {
            toast.error("Critical: No return ticket found. Please re-login.");
            // Fallback to logout if needed
            return;
        }

        // Restore Admin Token
        localStorage.setItem(AUTH_TOKEN_KEY, adminToken);

        // Cleanup
        localStorage.removeItem(ADMIN_RECOVERY_KEY);
        localStorage.removeItem('impersonating_tenant');

        toast.success("Ghost Mode Deactivated. Welcome back, Admin.");
        window.location.href = '/admin/tenants';
    };

    return { isImpersonating, impersonate, exitGhostMode };
}
