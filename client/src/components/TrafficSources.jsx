function TrafficRow({ name, visits, trend }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-gray-400 text-sm">Top referrer</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{visits}</p>
        <p className="text-green-400 text-sm">{trend}</p>
      </div>
    </div>
  )
}

 export default function TrafficSources() {
  return (
    <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Traffic Sources</h2>
        <button className="text-teal-400 text-sm">View Detailed</button>
      </div>

      <div className="space-y-6">
        <TrafficRow
          name="Direct Traffic"
          visits="5,410"
          trend="+5%"
        />
        <TrafficRow
          name="Twitter.com"
          visits="3,204"
          trend="+8%"
        />
      </div>
    </div>
  )
}

