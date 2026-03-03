export function KpiCard({ title, value, growth }) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-sm uppercase">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-md">
        {growth}
      </span>
    </div>
  )
}