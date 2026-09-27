import { Skeleton } from "@/components/ui/skeleton";

const items = Array.from({ length: 5 });

export function StatusCardSkeleton() {
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((_, index) => (
          <div
            key={index}
            className="flex h-[116px] items-center gap-4 rounded-2xl border bg-white px-6 shadow-sm"
          >
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((_, index) => (
          <div
            key={index}
            className="flex h-[116px] items-center gap-4 rounded-2xl border bg-white px-6 shadow-sm"
          >
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
