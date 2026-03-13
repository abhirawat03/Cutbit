import { TrendingUp, TrendingDown } from "lucide-react"

export function KpiCard({ title, value, growth = 0 }) {

  const isPositive = growth > 0
  const isNegative = growth < 0

  const colorClass = isPositive
    ? "text-green-400 bg-green-400/10"
    : isNegative
    ? "text-red-400 bg-red-400/10"
    : "text-gray-400 bg-gray-400/10"

  const formattedGrowth =
    growth > 0
      ? `+${growth.toFixed(1)}%`
      : `${growth.toFixed(1)}%`

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex justify-between items-center">

      {/* LEFT */}
      <div>
        <p className="text-gray-400 text-sm uppercase tracking-wide">
          {title}
        </p>

        <h3 className="text-3xl font-bold mt-2">
          {value}
        </h3>
      </div>

      {/* RIGHT */}
      <div
        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md ${colorClass}`}
      >

        {isPositive && <TrendingUp size={16} />}
        {isNegative && <TrendingDown size={16} />}

        {formattedGrowth}

      </div>

    </div>
  )
}