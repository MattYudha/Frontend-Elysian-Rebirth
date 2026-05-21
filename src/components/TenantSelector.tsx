'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/';
import { useTenant } from '@/contexts/TenantContext';
import { Building2 } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

export function TenantSelector({ forceOpen = false }: { forceOpen?: boolean } = {}) {
  const { currentTenant, availableTenants, switchTenant, isLoading } = useTenant();
  const { isOpen } = useSidebar();

  const tenants = availableTenants || [];

  // Don't render while loading
  if (isLoading) return null;

  // Nothing to show if no tenants
  if (tenants.length === 0) return null;

  // Collapsed sidebar: just show icon
  if (!isOpen && !forceOpen) {
    return (
      <div className="flex justify-center py-1" title={currentTenant?.name || 'Workspace'}>
        <Building2 className="h-4 w-4 text-blue-400" />
      </div>
    );
  }

  // Single tenant: show as static label (no dropdown needed)
  if (tenants.length === 1) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
        <Building2 className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 truncate">
          {currentTenant?.name || tenants[0].name}
        </span>
      </div>
    );
  }

  // Multiple tenants: show dropdown
  return (
    <Select value={currentTenant?.id} onValueChange={switchTenant}>
      <SelectTrigger className="w-full h-8 text-xs bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold">
        <Building2 className="h-3.5 w-3.5 mr-1.5 text-blue-500 dark:text-blue-400 shrink-0" />
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent>
        {tenants.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
