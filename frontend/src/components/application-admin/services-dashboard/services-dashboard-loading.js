import { Skeleton } from "@/components/ui/skeleton";
import Title from "@/components/ui/title";

export default function DashboardSkeleton() {
  return (
    <>
      {/* <Title
        title2="Dashboard"
        description="View an overview of applications."
      /> */}
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border border-emerald-300 bg-background p-5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-28" />

          <div className="mt-4 flex justify-end">
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>

          <div className="flex items-center justify-center py-10">
            <Skeleton className="h-64 w-64 rounded-full" />
          </div>
          <div className="mt-6 flex justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-300 bg-background p-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-56" />

          <div className="mt-6 flex h-72 items-end justify-around gap-6 border-b pt-10">
            {[20, 30, 45, 70, 85, 95, 80, 25].map((height, i) => (
              <Skeleton
                key={i}
                className="w-10 rounded-t-md"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>

          <div className="mt-5 flex gap-6 border-t pt-5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-28" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
