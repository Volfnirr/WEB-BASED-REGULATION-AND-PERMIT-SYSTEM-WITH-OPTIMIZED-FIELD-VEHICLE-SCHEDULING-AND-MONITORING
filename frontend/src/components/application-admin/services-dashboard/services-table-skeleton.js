import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="mt-1 w-full min-w-0 space-y-4">
      <div className="w-full min-w-0 overflow-hidden rounded-lg border border-[#E1E5E9] bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1.1fr_1fr_1.3fr_1.2fr_1.3fr_0.8fr_1fr] items-center gap-4 border-b border-[#E8EBEF] bg-[#FAFBFC] px-5 py-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24 rounded-md" />
              ))}
            </div>

            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-[1.1fr_1fr_1.3fr_1.2fr_1.3fr_0.8fr_1fr] items-center gap-4 border-b border-[#E8EBEF] px-5 py-5 last:border-b-0"
              >
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-xl" />
                <Skeleton className="h-9 w-36 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex min-h-14 flex-col items-start justify-between gap-3 rounded-lg border border-[#E1E5E9] bg-white px-3 py-3 sm:flex-row sm:items-center sm:px-5">
        <Skeleton className="h-4 w-28 rounded-md" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
