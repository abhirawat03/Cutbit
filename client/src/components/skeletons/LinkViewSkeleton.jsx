import Skeleton from "../ui/Skeleton";

export default function LinkViewSkeleton() {
  return (
    <div className="min-h-screen text-white p-4 sm:p-6">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Skeleton className="h-3 sm:h-4 w-14 sm:w-20" />
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Header */}
          <div className="bg-[#111827] p-4 sm:p-6 rounded-xl space-y-3 sm:space-y-4">
            <Skeleton className="h-5 sm:h-6 w-full sm:w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-2/3" />
            <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#111827] p-4 sm:p-6 rounded-xl space-y-2 sm:space-y-3">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
              <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" />
            </div>

            <div className="bg-[#111827] p-4 sm:p-6 rounded-xl space-y-2 sm:space-y-3">
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[#111827] p-4 sm:p-6 rounded-xl space-y-3 sm:space-y-4">
            <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />

            <div className="flex justify-between">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
              <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
            </div>
          </div>

          {/* Button */}
          <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />

        </div>

        {/* RIGHT (moves below on mobile) */}
        <div className="space-y-4 sm:space-y-6 order-last lg:order-none">

          {/* QR */}
          <div className="bg-[#111827] p-4 sm:p-6 rounded-xl flex flex-col items-center space-y-3 sm:space-y-4">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
            <Skeleton className="h-[140px] w-[140px] sm:h-[170px] sm:w-[170px] rounded-lg" />
            <Skeleton className="h-9 sm:h-10 w-24 sm:w-28 rounded-lg" />
          </div>

          {/* Actions */}
          <div className="bg-[#111827] p-4 sm:p-6 rounded-xl space-y-3 sm:space-y-4">
            <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />

            <div className="flex gap-3 sm:gap-4 justify-center">
              <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg" />
              <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg" />
              <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}