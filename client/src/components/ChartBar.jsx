import { Bar, BarChart, XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartConfig = {
    clicks: {
        label: "Clicks",
        color: "var(--chart-2)",
    },
    uniqueVisitors: {
        label: "Unique Visitors",
        color: "var(--chart-4)",
    },
}

export function ChartBar({ chartData = [] }) {
    return (
        <Card className="bg-[#0f172a] border border-[#1e293b] text-white">
            <CardHeader>
                <CardTitle className="text-lg tracking-wide md:text-2xl">Total Clicks Trend</CardTitle>
                <CardDescription className="text-lg text-gray-400 hidden md:block">Aggregated click volume across all links</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} className="text-lg">
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-gray-400 text-sm"
                            tickFormatter={(value) => {
                                const d = new Date(value)
                                return d.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                className="w-[150px] text-black"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                            />}
                        />
                        <Bar dataKey="clicks" fill="var(--chart-2)" radius={8} minPointSize={4}/>
                        <Bar dataKey="uniqueVisitors" fill="var(--chart-1)" radius={8} minPointSize={4}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
