/**
 * TenantContext.tsx — Server-First Tenant Management
 *
 * Architecture:
 * - Tenant list → React Query (useTenants), single source of truth
 * - Selected tenant ID → HTTP cookie (server-readable for SSR)
 * - No Zustand involvement whatsoever
 *
 * On switchTenant():
 * 1. Write tenant_id cookie via document.cookie
 * 2. Call router.refresh() → triggers server re-render with new cookie
 * 3. React Query cache remains valid (tenant list doesn't change)
 */
'use client';

import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useTenants } from '@/queries/tenant.queries';
import type { Tenant } from '@/services/tenant.service';

const TENANT_COOKIE = 'tenant_id';

interface TenantContextValue {
  currentTenant: Tenant | null;
  switchTenant: (tenantId: string) => void;
  availableTenants: Tenant[];
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

/**
 * Read tenant_id from cookie (client-side)
 */
function getTenantIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${TENANT_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Write tenant_id to cookie (client-side)
 */
function setTenantCookie(tenantId: string) {
  document.cookie = `${TENANT_COOKIE}=${encodeURIComponent(tenantId)};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const { data: availableTenants = [], isLoading } = useTenants();

  // Derive current tenant from cookie + React Query data
  const currentTenant = useMemo(() => {
    const tenantId = getTenantIdFromCookie();
    const tenants = availableTenants || [];
    if (tenants.length === 0) return null;
    
    const found = tenants.find((t) => t.id === tenantId);
    if (found) return found;

    // Fallback: write cookie for the first one client-side
    if (typeof window !== 'undefined') {
      setTenantCookie(tenants[0].id);
    }
    return tenants[0];
  }, [availableTenants]);

  const switchTenant = useCallback((tenantId: string) => {
    setTenantCookie(tenantId);
    // Hard-Navigation to prevent cross-tenant state leakage (React Query, Websockets)
    window.location.assign('/dashboard');
  }, []);

  return (
    <TenantContext.Provider value={{
      currentTenant,
      availableTenants: (availableTenants || []) as Tenant[],
      switchTenant,
      isLoading,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}

// Re-export Tenant type for consumers that previously imported from tenantStore
export type { Tenant } from '@/services/tenant.service';
