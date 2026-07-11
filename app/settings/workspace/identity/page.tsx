'use client';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTenant } from '@/contexts/TenantContext';
import { useUpdateTenant } from '@/queries/tenant.queries';

export default function IdentityPage() {
    const { currentTenant, isLoading } = useTenant();
    const updateTenantMutation = useUpdateTenant();

    const isEnterprise = currentTenant?.plan_tier?.toLowerCase() === 'enterprise';

    const identityCards = [
        {
            id: "saml",
            title: "SAML SSO",
            description: "Allow users to log in with SAML single sign-on (SSO). Security configuration required at the Identity Provider level.",
            helpHref: "#",
            toggleLabel: "Enable SAML SSO",
            enabled: isEnterprise,
        },
        {
            id: "scim",
            title: "SCIM Provisioning",
            description: "Use SCIM to automatically create, update, and delete users from your active directory.",
            helpHref: "#",
            toggleLabel: "Enable SCIM",
            enabled: isEnterprise,
        },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading identity configuration...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Identity & Access</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Secure and streamline user access. Enable SAML SSO for enterprise single sign-on.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Providers Section */}
            <div className="space-y-6">
                {identityCards.map((card) => (
                    <div key={card.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.title}</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                            {card.description}
                            <Link href={card.helpHref} className="inline-flex items-center ml-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                Read documentation <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Link>
                        </p>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B1120] px-4 py-4">
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-slate-400" />
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{card.toggleLabel}</span>
                            </div>
                            <Switch disabled={!card.enabled} defaultChecked={card.enabled} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Upgrade CTA for Free/Pro tier */}
            {!isEnterprise && (
                <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Enterprise Feature</h4>
                        <p className="text-sm text-blue-700/80 dark:text-blue-300/80 mt-1">SAML & SCIM require an Enterprise subscription.</p>
                    </div>
                    <Button
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shrink-0 mt-2 sm:mt-0"
                        disabled={updateTenantMutation.isPending}
                        onClick={() => {
                            if (!currentTenant) return;
                            updateTenantMutation.mutate({
                                id: currentTenant.id,
                                data: { plan_tier: 'enterprise' }
                            });
                        }}
                    >
                        {updateTenantMutation.isPending ? "Upgrading..." : "Upgrade to Enterprise"}
                    </Button>
                </div>
            )}
        </div>
    );
}
