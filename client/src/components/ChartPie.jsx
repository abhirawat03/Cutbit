import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const COLORS = {
    mobile: "#14b8a6",
    desktop: "#6366f1",
    tablet: "#8b5cf6"
}

export default function ChartPie({ data = [
    { device: "mobile", value: 7800 },
    { device: "desktop", value: 3000 },
    { device: "tablet", value: 1200 }
] }) {
    // Expected data format:
    // [
    //   { device: "mobile", value: 7800 },
    //   { device: "desktop", value: 3000 },
    //   { device: "tablet", value: 1200 }
    // ]
    const chartConfig = {
  mobile: { label: "Mobile", color: COLORS.mobile },
  desktop: { label: "Desktop", color: COLORS.desktop },
  tablet: { label: "Tablet", color: COLORS.tablet },
}

    const total = React.useMemo(
        () => data.reduce((acc, curr) => acc + curr.value, 0),
        [data]
    )

    const formatted = data.map(item => ({
        ...item,
        percent: ((item.value / total) * 100).toFixed(0)
    }))

    return (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 w-full">
            <h2 className="text-white text-2xl font-bold mb-2">Devices Distribution</h2>
            <p className="text-lg text-gray-400">Breakdown of traffic by hardware category</p>

            <div className="flex flex-col items-center mt-5">

                {/* Chart */}
                <div className="relative w-[200px] h-[200px]">

                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                className=""
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={formatted}
                                dataKey="value"
                                nameKey="device"
                                innerRadius={65}
                                outerRadius={90}
                                paddingAngle={3}
                                stroke="none"
                            >
                                {formatted.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[entry.device]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-white">
                            {(total / 1000).toFixed(0)}k
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                            Sessions
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-full mt-6 space-y-3">
                    {formatted.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[item.device] }}
                                />
                                <span className="text-gray-300 capitalize">
                                    {item.device}
                                </span>
                            </div>
                            <span className="text-white font-medium">
                                {item.percent}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}