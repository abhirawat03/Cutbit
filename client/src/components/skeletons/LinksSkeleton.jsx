// components/skeletons/LinksSkeleton.jsx
import Skeleton from "../ui/Skeleton";

export default function LinksSkeleton() {
  return (
    <section className="text-white space-y-6">
      
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-8 rounded-2xl border bg-[#1e293b62] space-y-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] rounded-xl border mt-6">
        <div className="divide-y divide-[#1e293b]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between p-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}