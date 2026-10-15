import { Skeleton } from "@/components/ui/skeleton";

export function UserApplicationsSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="grid min-w-0 grid-cols-1 gap-3 pb-1 sm:grid-cols-[minmax(0,1fr)_200px_240px]">
        <Skeleton className="h-11 w-full min-w-0 rounded-lg bg-white" />

        <Skeleton className="h-11 w-full rounded-lg bg-white" />

        <Skeleton className="h-11 w-full rounded-lg bg-white" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="min-w-0 rounded-lg border border-[#E1E5E9] bg-white px-4 py-5 sm:px-5"
          >
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-3">
                <Skeleton className="h-5 w-44 rounded-md" />

                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-1 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>

              <Skeleton className="h-8 w-[110px] rounded-lg" />
            </div>

            <div className="my-4 h-px bg-[#e5e5e5]" />

            <Skeleton className="mb-5 h-4 w-20 rounded-md" />

            <div className="flex min-h-[250px] flex-col items-center justify-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
