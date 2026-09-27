import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full space-y-4 mt-1">
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="grid grid-cols-[1.1fr_1fr_1.3fr_1.2fr_1.3fr_0.8fr_1fr] items-center gap-4 border-b px-5 py-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24 rounded-md" />
          ))}
        </div>

        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[1.1fr_1fr_1.3fr_1.2fr_1.3fr_0.8fr_1fr] items-center gap-4 border-b px-5 py-5 last:border-b-0"
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

      {/* Pagination */}
      <div className="flex h-14 items-center justify-between rounded-xl border bg-background px-5">
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
