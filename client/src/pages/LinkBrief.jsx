import { useParams, Link, useNavigate } from "react-router-dom"
import { ChartBar } from "../components/ChartBar"
import ChartPie from "../components/ChartPie"
import { KpiCard } from "../components/KpiCard"
import { TopRegions } from "../components/TopRegions"
import TrafficSources from "../components/TrafficSources"
import { useState } from "react"
import { useLinkAnalytics } from "../hooks/queries/useLinkAnalytics"
import { IoArrowBack } from "react-icons/io5"
import LinkBriefSkeleton from "../components/skeletons/LinkBriefSkeleton";
import useMinimumDelay from "../hooks/useMinimumDelay";

export default function LinkBrief() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [range, setRange] = useState(7)

  const { data: linkdetails, isLoading } = useLinkAnalytics(id, range)
  const showSkeleton = useMinimumDelay(isLoading, 600);

  if (showSkeleton) {
  return <LinkBriefSkeleton />;
}

  return (
  <div className="p-4 space-y-5 sm:space-y-6 min-h-screen text-white">

    {/* Breadcrumb */}
    <div className="max-w-7xl flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 hidden md:flex">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 hover:text-white"
      >
        <IoArrowBack size={16} />
      </button>

      <Link to="/dashboard/links" className="hover:text-white">
        My Links
      </Link>

      <span>/</span>

      <Link to={`/dashboard/links/${id}`} className="hover:text-white font-medium truncate max-w-[120px]">
        {linkdetails?.shortUrl}
      </Link>

      <span>/</span>

      <span className="text-teal-400">Analytics</span>
    </div>

    {/* Header */}
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-6">

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

        {/* Left */}
        <div className="space-y-2 ">
          <span className="text-xs md:text-sm text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
            Link Analytics
          </span>

          <h1 className="text-sm md:text-xl mt-1 font-bold break-all">
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/${linkdetails?.shortUrl}`}
              target="_blank"
              className="hover:underline"
            >
              {import.meta.env.VITE_BACKEND_URL}/
              <span className="text-teal-400">{linkdetails?.shortUrl}</span>
            </a>
          </h1>

          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 break-all">
            {linkdetails?.originalUrl}
          </p>
        </div>

        {/* Range */}
        <div className="flex gap-2 w-full h-10 sm:w-auto">
          {[7, 30].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm border cursor-pointer ${
                range === r
                  ? "bg-teal-500/20 text-teal-400 border-teal-500"
                  : "bg-[#1f2937] border-[#334155]"
              }`}
            >
              {r}D
            </button>
          ))}
        </div>

      </div>
    </div>

    {/* KPI */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

      <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-1">
          Daily Performance
        </h2>

        <p className="text-gray-400 text-lg md:text-xl mb-4 sm:mb-6">
          Last {range} days
        </p>

        <ChartBar chartData={linkdetails?.chartData} />
      </div>

      <TopRegions data={linkdetails?.countryStats || {}} />
    </div>

    {/* Bottom */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <ChartPie data={linkdetails?.deviceStats || {}} />
      <TrafficSources data={linkdetails?.referrerStats || {}} />
    </div>

  </div>
)
}