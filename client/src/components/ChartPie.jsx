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

export default function ChartPie({ data = {} }) {

  const deviceData = React.useMemo(() => {
    return Object.entries(data).map(([device, value]) => ({
      device,
      value,
    }))
  }, [data])

  const chartConfig = {
    mobile: { label: "Mobile", color: COLORS.mobile },
    desktop: { label: "Desktop", color: COLORS.desktop },
    tablet: { label: "Tablet", color: COLORS.tablet },
  }

  const total = deviceData.reduce((sum, d) => sum + d.value, 0)

  const formatted = deviceData.map(d => ({
    ...d,
    percent: total ? Math.round((d.value / total) * 100) : 0
  }))

  const hasData = deviceData.length > 0

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 w-full">

      <h2 className="text-white text-2xl font-bold mb-2">
        Devices Distribution
      </h2>

      <p className="text-lg text-gray-400">
        Breakdown of traffic by hardware category
      </p>

      <div className="flex flex-col items-center mt-5">

        {!hasData ? (

          <div className="flex items-center justify-center h-[220px] text-gray-400">
            No device data yet
          </div>

        ) : (

          <>
            {/* Chart */}
            <div className="relative w-[200px] h-[200px]">

              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >

                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    wrapperStyle={{ zIndex: 20 }}
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
                        fill={COLORS[entry.device] || "#64748b"}
                        style={{ transition: "all 0.2s ease" }}
                      />
                    ))}

                  </Pie>
                </PieChart>

              </ChartContainer>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">

                <span className="text-2xl font-bold text-white">
                  {total.toLocaleString()}
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
                      style={{
                        backgroundColor: COLORS[item.device] || "#64748b"
                      }}
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
          </>
        )}

      </div>
    </div>
  )
}