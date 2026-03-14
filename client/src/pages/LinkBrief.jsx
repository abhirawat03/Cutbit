import { useParams, Link, useNavigate } from "react-router-dom"
import { ChartBar } from "../components/ChartBar"
import ChartPie from "../components/ChartPie"
import { KpiCard } from "../components/KpiCard"
import { TopRegions } from "../components/TopRegions"
import TrafficSources from "../components/TrafficSources"
import { useState } from "react"
import { useLinkAnalytics } from "../hooks/queries/useLinkAnalytics"
import { IoArrowBack } from "react-icons/io5"

export default function LinkBrief() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [range, setRange] = useState(7)

  const { data: linkdetails, isLoading } = useLinkAnalytics(id, range)

  if (isLoading) {
    return (
      <div className="p-6 text-gray-400">
        Loading analytics...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen text-white">

      {/* Breadcrumb / Back */}
      <div className="max-w-7xl flex items-center gap-3 text-sm text-gray-400">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-white"
        >
          <IoArrowBack size={18} />
        </button>

        <Link to="/dashboard/links" className="hover:text-white">
          My Links
        </Link>

        <span>/</span>
        
        <Link to={`/dashboard/links/${id}`} className="hover:text-white font-medium">
          {linkdetails?.shortUrl}
        </Link>

        <span>/</span>

        <span className="text-teal-400">
          Analytics
        </span>

      </div>

      {/* Header */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">

        <div className="flex justify-between items-start">

          <div>
            <span className="text-sm text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
              Link Analytics
            </span>

            <h1 className="text-2xl font-bold mt-3">
              <a
                href={`${import.meta.env.VITE_BACKEND_URL_ID}/${linkdetails?.shortUrl}`}
                target="_blank"
                className="hover:underline"
              >
                {import.meta.env.VITE_BACKEND_URL_ID}/
                <span className="text-teal-400">{linkdetails?.shortUrl}</span>
              </a>
            </h1>

            <p className="text-gray-400 text-sm mt-2 truncate max-w-xl">
              Original: {linkdetails?.originalUrl}
            </p>
          </div>

          {/* Range selector */}
          <div className="flex gap-2">

            <button
              onClick={() => setRange(7)}
              className={`px-4 py-2 rounded-lg text-sm border
                ${range === 7
                  ? "bg-teal-500/20 text-teal-400 border-teal-500"
                  : "bg-[#1f2937] border-[#334155] hover:bg-[#273244]"
                }`}
            >
              7D
            </button>

            <button
              onClick={() => setRange(30)}
              className={`px-4 py-2 rounded-lg text-sm border
                ${range === 30
                  ? "bg-teal-500/20 text-teal-400 border-teal-500"
                  : "bg-[#1f2937] border-[#334155] hover:bg-[#273244]"
                }`}
            >
              30D
            </button>

          </div>

        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <KpiCard
          title="Total Clicks"
          value={linkdetails?.totalClicks?.toLocaleString()}
          growth={linkdetails?.clickGrowth}
        />

        <KpiCard
          title="Unique Visitors"
          value={linkdetails?.totalUniqueVisitors?.toLocaleString()}
          growth={linkdetails?.clickGrowth}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Daily Performance */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-6">

          <h2 className="text-lg font-semibold mb-1">
            Daily Performance
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Historical performance over last {range} days
          </p>

          <ChartBar chartData={linkdetails?.chartData} />

        </div>

        <TopRegions data={linkdetails?.countryStats || {}} />

      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">

        <ChartPie data={linkdetails?.deviceStats || {}} />

        <TrafficSources data={linkdetails?.referrerStats || {}} />

      </div>

    </div>
  )
}