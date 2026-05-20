"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/';

import { useChartData } from "@/queries/dashboard.queries";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
    tokens: {
        label: "Tokens",
        color: "hsl(var(--primary))",
    },
};

export function TokenUsageChart() {
    const { data: chartData, isLoading } = useChartData();

    const formattedData = (chartData && 'usage_costs' in chartData && Array.isArray(chartData.usage_costs) ? chartData.usage_costs : []).map(d => ({
        day: d.date,
        tokens: d.tokens,
    }));

    return (
        <Card className="col-span-2 shadow-sm border-none card-professional">
            <CardHeader>
                <CardTitle>Weekly Token Consumption</CardTitle>
                <CardDescription>
                    Tracking LLM usage across all pipelines.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    {isLoading ? (
                        <Skeleton className="w-full h-full" />
                    ) : formattedData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-sm font-medium">Data consumption belum tersedia</p>
                            <p className="text-xs">Statistik akan muncul setelah pipeline berjalan.</p>
                        </div>
                    ) : (
                        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-tokens)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-tokens)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={12}
                            />
                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Area
                                dataKey="tokens"
                                type="natural"
                                fill="url(#fillTokens)"
                                stroke="var(--color-tokens)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
