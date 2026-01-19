'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/';
import { useTenant } from '@/contexts/TenantContext';

export function TenantSelector() {
  const { currentTenant, availableTenants, switchTenant } = useTenant();

  if (availableTenants.length <= 1) return null;

  return (
    <Select value={currentTenant?.id} onValueChange={switchTenant}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select tenant" />
      </SelectTrigger>
      <SelectContent>
        {availableTenants.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
