export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-5 h-6 w-28 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[116px] items-center gap-4 rounded-[20px] bg-white p-6 shadow-sm"
          >
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />

            <div className="space-y-2">
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-8 w-12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)]">
        <div className="overflow-hidden rounded-[20px] border bg-white">
          <div className="flex items-start justify-between border-b p-5">
            <div className="space-y-2">
              <div className="h-6 w-28 animate-pulse rounded bg-muted" />
              <div className="h-5 w-44 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="p-5">
            <div className="h-[370px] animate-pulse rounded bg-muted/50" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border bg-white">
          <div className="border-b p-5">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-5 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-8 p-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-5 w-28 animate-pulse rounded bg-muted" />

                <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />

                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>

          <div className="border-t p-5">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
