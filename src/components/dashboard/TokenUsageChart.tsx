"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/';

const chartData = [
    { day: "Mon", tokens: 1200, cost: 4.2 },
    { day: "Tue", tokens: 3500, cost: 12.5 },
    { day: "Wed", tokens: 2100, cost: 7.8 },
    { day: "Thu", tokens: 4800, cost: 15.2 },
    { day: "Fri", tokens: 3800, cost: 11.4 },
    { day: "Sat", tokens: 1500, cost: 5.1 },
    { day: "Sun", tokens: 900, cost: 3.2 },
];

const chartConfig = {
    tokens: {
        label: "Tokens",
        color: "hsl(var(--primary))",
    },
};

export function TokenUsageChart() {
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
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
