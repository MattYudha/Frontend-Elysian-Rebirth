'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, Minus, Loader2, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/TenantContext';
import { useUpdateTenant } from '@/queries/tenant.queries';

export default function BillingPage() {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
    const { currentTenant, isLoading } = useTenant();
    const updateTenantMutation = useUpdateTenant();

    const activeTier = (currentTenant?.plan_tier || "starter").toLowerCase();

    const plans = [
        {
            id: "starter",
            name: "Starter",
            price: billingPeriod === "monthly" ? "$0" : "$0",
            period: "per user/month",
            badge: null,
            isCurrent: activeTier === "starter",
        },
        {
            id: "professional",
            name: "Professional",
            price: billingPeriod === "monthly" ? "$29" : "$24",
            period: "per user/month",
            badge: billingPeriod === "annual" ? "Save 17%" : null,
            isCurrent: activeTier === "professional",
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: "Custom",
            period: "contact sales",
            badge: null,
            isCurrent: activeTier === "enterprise",
        },
    ];

    const features = [
        { id: "users", label: "Team members", values: ["Up to 3", "Unlimited", "Unlimited"] },
        { id: "ai-tokens", label: "AI Tokens/mo", values: ["1,000", "50,000", "Unlimited"] },
        { id: "agents", label: "Custom Agents", values: [false, true, true] },
        { id: "integrations", label: "Integrations", values: ["Basic", "Advanced", "Custom ERP"] },
        { id: "support", label: "Support", values: ["Community", "Priority Email", "24/7 Phone + SLA"] },
        { id: "sso", label: "SAML SSO & SCIM", values: [false, false, true] },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading billing details...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Plans & Billing</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your subscription and billing details. Upgrade your plan to unlock more AI capabilities.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className={cn("text-sm font-medium cursor-pointer transition-colors", billingPeriod === "monthly" ? "text-blue-600 dark:text-blue-400" : "text-slate-500")} onClick={() => setBillingPeriod("monthly")}>Monthly</span>
                    <Switch
                        checked={billingPeriod === "annual"}
                        onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
                        className="data-[state=checked]:bg-blue-600"
                    />
                    <span className={cn("text-sm font-medium cursor-pointer transition-colors", billingPeriod === "annual" ? "text-blue-600 dark:text-blue-400" : "text-slate-500")} onClick={() => setBillingPeriod("annual")}>
                        Annually <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">Save 17%</span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className={cn(
                        "relative flex flex-col rounded-2xl border p-6 bg-white dark:bg-[#0B1120] transition-all duration-300",
                        plan.isCurrent
                            ? "border-transparent ring-2 ring-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    )}>
                        {/* Gradient top accent for current plan */}
                        {plan.isCurrent && (
                            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />
                        )}
                        {plan.isCurrent && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] uppercase tracking-wider font-bold shadow-md shadow-blue-500/20 flex items-center gap-1">
                                <Crown className="h-3 w-3" /> Current Plan
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white">{plan.name}</h4>
                            {plan.badge && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                    {plan.badge}
                                </span>
                            )}
                        </div>
                        <div className="mt-2 mb-6 flex items-baseline gap-1 text-slate-900 dark:text-white">
                            <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>
                        </div>

                        {plan.isCurrent ? (
                            <div className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                                <CheckCircle2 className="h-4 w-4" />
                                Current Plan
                            </div>
                        ) : (
                            <Button
                                variant="default"
                                className="w-full mt-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
                                disabled={updateTenantMutation.isPending}
                                onClick={() => {
                                    if (!currentTenant) return;
                                    updateTenantMutation.mutate({
                                        id: currentTenant.id,
                                        data: { plan_tier: plan.id }
                                    });
                                }}
                            >
                                {updateTenantMutation.isPending ? "Upgrading..." : "Upgrade"}
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Feature Table Comparison */}
            <div className="mt-12 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="py-4 font-semibold text-slate-900 dark:text-white">Compare Features</th>
                            <th className="py-4 px-4 font-semibold text-slate-900 dark:text-white text-center w-32">Starter</th>
                            <th className="py-4 px-4 font-semibold text-slate-900 dark:text-white text-center w-32">Professional</th>
                            <th className="py-4 px-4 font-semibold text-slate-900 dark:text-white text-center w-32">Enterprise</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {features.map((feature) => (
                            <tr key={feature.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="py-3 text-slate-600 dark:text-slate-400">{feature.label}</td>
                                {feature.values.map((val, idx) => (
                                    <td key={idx} className="py-3 px-4 text-center">
                                        {typeof val === 'boolean' ? (
                                            val ? <CheckCircle2 className="h-4 w-4 mx-auto text-blue-500" /> : <Minus className="h-4 w-4 mx-auto text-slate-300 dark:text-slate-600" />
                                        ) : (
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
