export function TopRegions({data={}}) {
  const topRegions =
  Object.entries(data)
    .map(([country, clicks]) => ({ country, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const max = Math.max(...topRegions.map(r => r.value))

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-6">Top Regions</h2>

      <div className="space-y-5">
        {topRegions.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-400">
          No data available
        </div>
      ) : (

        <div className="space-y-5">
          {topRegions.map((region) => (
            <div key={region.country}>

              <div className="flex justify-between text-sm mb-2">
                <span>{region.country}</span>
                <span className="text-teal-400">
                  {region.clicks.toLocaleString()}
                </span>
              </div>

              <div className="h-2 bg-[#1f2937] rounded-full">
                <div
                  className="h-2 bg-teal-400 rounded-full"
                  style={{
                    width: `${(region.clicks / max) * 100 }%`
                  }}
                />
              </div>

            </div>
          ))}
        </div>

      )}

      </div>
    </div>
  )
}