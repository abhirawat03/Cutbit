// components/skeletons/DashboardSkeleton.jsx
import Skeleton from "../ui/Skeleton";

function StatsCardSkeleton() {
  return (
    <div className="p-8 rounded-2xl border bg-[#1e293b62] space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-24 rounded" />
      <Skeleton className="h-4 w-28 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] rounded-2xl bg-[#1e293b62] p-6">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  );
}

function TopLinkSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[#33373d55] border space-y-6">
      <Skeleton className="h-6 w-40 rounded" />
      <Skeleton className="h-5 w-60 rounded" />
      <Skeleton className="h-6 w-32 rounded" />

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-[#33373d55] rounded-xl border mt-6">
      <div className="p-6 flex justify-between">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>

      <div className="divide-y divide-[#334155]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between p-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <section className="text-white space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Range buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-16 rounded-lg" />
        <Skeleton className="h-10 w-16 rounded-lg" />
      </div>

      {/* Chart + Top Link */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChartSkeleton />
        </div>
        <TopLinkSkeleton />
      </div>

      {/* Table */}
      <TableSkeleton />
    </section>
  );
}