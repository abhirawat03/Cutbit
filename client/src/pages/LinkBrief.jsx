// import DevicesDonut from "./DevicesDonut"
// import DailyBarChart from "./DailyBarChart"
import { ChartBar } from "../components/ChartBar"
import ChartPie from "../components/ChartPie"
import { KpiCard } from "../components/KpiCard"
import { TopRegions } from "../components/TopRegions"
import TrafficSources from "../components/TrafficSources"

export default function LinkBrief() {
  return (
    <div className="p-6 space-y-6 min-h-screen text-white">

      {/* Header */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
              Active Link Analytics
            </span>
            <h1 className="text-2xl font-bold mt-3">
              short.ly/<span className="text-teal-400">nexus-v1</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 truncate max-w-xl">
              Original: https://product.com/launch/nexus-v1-super-extended-campaign
            </p>
          </div>

          <button className="bg-[#1f2937] border border-[#334155] px-4 py-2 rounded-lg text-sm">
            Last 7 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <KpiCard title="Total Clicks" value="12,458" growth="+12.5%" />
        <KpiCard title="Unique Visitors" value="8,902" growth="+8.2%" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Daily Performance */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Daily Performance</h2>
          <p className="text-gray-400 text-sm mb-6">
            Historical performance over last 7 days
          </p>
          <ChartBar />
        </div>

        {/* Top Regions */}
        <TopRegions />
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">

        <ChartPie />

        <TrafficSources />
      </div>

    </div>
  )
}