
import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

    // const chartData = [
    //     { date: "2024-04-01", desktop: 222, mobile: 150 },
    //     { date: "2024-04-02", desktop: 97, mobile: 180 },
    //     { date: "2024-04-03", desktop: 167, mobile: 120 },
    //     { date: "2024-04-04", desktop: 242, mobile: 260 },
    //     { date: "2024-04-05", desktop: 373, mobile: 290 },
    //     { date: "2024-04-06", desktop: 301, mobile: 340 },
    //     { date: "2024-04-07", desktop: 245, mobile: 180 },
    //     { date: "2024-04-08", desktop: 409, mobile: 320 },
    //     { date: "2024-04-09", desktop: 59, mobile: 110 },
    //     { date: "2024-04-10", desktop: 261, mobile: 190 },
    //     { date: "2024-04-11", desktop: 327, mobile: 350 },
    //     { date: "2024-04-12", desktop: 292, mobile: 210 },
    //     { date: "2024-04-13", desktop: 342, mobile: 380 },
    //     { date: "2024-04-14", desktop: 137, mobile: 220 },
    //     { date: "2024-04-15", desktop: 120, mobile: 170 },
    //     { date: "2024-04-16", desktop: 138, mobile: 190 },
    //     { date: "2024-04-17", desktop: 446, mobile: 360 },
    //     { date: "2024-04-18", desktop: 364, mobile: 410 },
    //     { date: "2024-04-19", desktop: 243, mobile: 180 },
    //     { date: "2024-04-20", desktop: 89, mobile: 150 },
    //     { date: "2024-04-21", desktop: 137, mobile: 200 },
    //     { date: "2024-04-22", desktop: 224, mobile: 170 },
    //     { date: "2024-04-23", desktop: 138, mobile: 230 },
    //     { date: "2024-04-24", desktop: 387, mobile: 290 },
    //     { date: "2024-04-25", desktop: 215, mobile: 250 },
    //     { date: "2024-04-26", desktop: 75, mobile: 130 },
    //     { date: "2024-04-27", desktop: 383, mobile: 420 },
    //     { date: "2024-04-28", desktop: 122, mobile: 180 },
    //     { date: "2024-04-29", desktop: 315, mobile: 240 },
    //     { date: "2024-04-30", desktop: 454, mobile: 380 },
    // ]

const chartConfig = {
    views: {
        label: "Clicks",
    },
    desktop: {
        label: "7D",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "30D",
        color: "var(--chart-2)",
    },
}

export function ChartLine({data,range}) {
    const [activeChart, setActiveChart] =
        React.useState ("desktop")

    // const total = React.useMemo(
    //     () => ({
    //         desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
    //         mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    //     }),
    //     []
    // )

    return (
        <Card className="py-4 sm:py-0 bg-[#1e202399] text-white">
            <CardHeader className="flex flex-col items-center border-b sm:flex-row py-3">
                <div className="flex flex-1 flex-col justify-center gap-1">
                    <CardTitle>Click Activity</CardTitle>
                    <CardDescription className="text-gray-400">
                        Historical data for the last {range} day 
                    </CardDescription>
                </div>
                <div className="fle items-center">
                    {["desktop", "mobile"].map((key) => {
                        const chart = key 
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-blue-600 rounded-lg px-2 bg-gray-600 mr-2"
                                onClick={() => setActiveChart(chart)}
                            >
                                {/* <span className="text-muted text-base">
                                    {chartConfig[chart].label}
                                </span> */}
                                {/* <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {total[key].toLocaleString()}
                                </span> */}
                            </button>
                        )
                    })}
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
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px] text-black"
                                    nameKey="views"
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
                            dataKey={activeChart}
                            type="monotone"
                            stroke={`var(--color-${activeChart})`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}


// convert it into our dashboard click activity line chart for 7 and 30 days