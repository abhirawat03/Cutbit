export function TopRegions() {
  const regions = [
    { country: "United States", value: 4281 },
    { country: "United Kingdom", value: 2104 },
    { country: "Germany", value: 1850 },
    { country: "Canada", value: 1210 },
  ]

  const max = Math.max(...regions.map(r => r.value))

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-6">Top Regions</h2>

      <div className="space-y-5">
        {regions.map((r, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span>{r.country}</span>
              <span className="text-teal-400">{r.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-[#1f2937] rounded-full">
              <div
                className="h-2 bg-teal-400 rounded-full"
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}