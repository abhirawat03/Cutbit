
import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

export const description = "An interactive line chart"

const chartConfig = {
    clicks: {
        label: "Clicks",
        color: "var(--chart-1)",
    },
    uniqueVisitors: {
        label: "Unique Clicks",
        color: "var(--chart-4)",
    },
}

export function ChartLine({ data = [], range }) {
    console.log(data)
    return (
        <Card className="py-4 sm:py-0 bg-[#1e202399] text-white">
            <CardHeader className="flex flex-col items-center border-b sm:flex-row py-3 pt-8">
                <div className="flex flex-1 flex-col justify-center gap-1">
                    <CardTitle>Click Activity</CardTitle>
                    <CardDescription className="text-gray-400">
                        Historical data for the last {range} day
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        {/* <CartesianGrid vertical={false} /> */}
                        {/* <CartesianGrid vertical={false} strokeDasharray="3 3" /> */}
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis
                            domain={[0, "dataMax + 2"]}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px] text-black"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey="clicks"
                            type="natural"
                            stroke={`${chartConfig.clicks.color}`}
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                        />
                        <Line
                            dataKey="uniqueVisitors"
                            type="natural"
                            stroke={`${chartConfig.uniqueVisitors.color}`}
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

