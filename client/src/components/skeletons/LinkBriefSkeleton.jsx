// components/skeletons/LinkBriefSkeleton.jsx
import Skeleton from "../ui/Skeleton";

export default function LinkBriefSkeleton() {
  return (
    <div className="p-6 space-y-6 min-h-screen text-white">

      {/* Breadcrumb */}
      <div className="flex gap-3 items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header */}
      <div className="bg-[#111827] border rounded-2xl p-6 space-y-4">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex gap-2 mt-4">
          <Skeleton className="h-10 w-16 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#111827] border rounded-2xl p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-[#111827] border rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>

        {/* Top Regions */}
        <div className="bg-[#111827] border rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Pie Chart */}
        <div className="bg-[#111827] border rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>

        {/* Traffic Sources */}
        <div className="bg-[#111827] border rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

      </div>

    </div>
  );
}