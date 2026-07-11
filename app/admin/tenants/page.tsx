import { DataTable } from "@/components/ui/data-table/DataTable";
import { tenantColumns } from "@/components/admin/tenants/columns";
import { Tenant } from "@/types/admin";
import { GlassCard } from "@/components/ui/GlassCard";

const MOCK_TENANTS: Tenant[] = [
    {
        id: "ten_001",
        name: "Acme Corp",
        email: "admin@acme.com",
        status: "Active",
        tier: "Enterprise",
        createdAt: "2024-01-12",
        tokenUsage: 840000,
        tokenLimit: 1000000,
        healthScore: 98,
        region: "US-East"
    },
    {
        id: "ten_002",
        name: "Cyberdyne Systems",
        email: "skynet@cyberdyne.ai",
        status: "Active",
        tier: "Pro",
        createdAt: "2024-02-01",
        tokenUsage: 45000,
        tokenLimit: 50000, // 90% usage
        healthScore: 65, // Low health
        region: "EU-West"
    },
    {
        id: "ten_003",
        name: "Wayne Enterprises",
        email: "bruce@wayne.com",
        status: "Active",
        tier: "Enterprise",
        createdAt: "2023-11-20",
        tokenUsage: 120000,
        tokenLimit: 5000000,
        healthScore: 100,
        region: "US-East"
    },
    {
        id: "ten_004",
        name: "Umbrella Corp",
        email: "albert@umbrella.com",
        status: "Suspended",
        tier: "Free",
        createdAt: "2024-03-15",
        tokenUsage: 0,
        tokenLimit: 1000,
        healthScore: 10,
        region: "Raccoon City"
    }
];

export default function TenantsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tenant Overwatch</h1>
                    <p className="text-muted-foreground">Monitor health, usage, and active sessions across all tenants.</p>
                </div>
                {/* Could add filters here */}
            </div>

            <div className="rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/50">
                <DataTable
                    columns={tenantColumns}
                    data={MOCK_TENANTS}
                    searchKey="name"
                />
            </div>
        </div>
    );
}
