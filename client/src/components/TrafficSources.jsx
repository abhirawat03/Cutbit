function TrafficRow({ name, visits, percent }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-medium capitalize">{name}</p>

        <div className="text-right">
          <p className="font-semibold">{visits}</p>
          <p className="text-gray-400 text-sm">{percent}%</p>
        </div>
      </div>

      <div className="w-full h-2 bg-[#1f2937] rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default function TrafficSources({ data = {} }) {

  const sources = Object.entries(data)
    .map(([name, visits]) => ({
      name: name === "direct" ? "Direct Traffic" : name,
      visits
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)

  const total = sources.reduce((sum, s) => sum + s.visits, 0)

  return (
    <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-6">

      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Traffic Sources</h2>
      </div>

      {sources.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-400">
          No data available
        </div>
      ) : (
        <div className="space-y-6">
          {sources.map((source, i) => {
            const percent = total
              ? Math.round((source.visits / total) * 100)
              : 0

            return (
              <TrafficRow
                key={i}
                name={source.name}
                visits={source.visits.toLocaleString()}
                percent={percent}
              />
            )
          })}
        </div>
      )}

    </div>
  )
}

