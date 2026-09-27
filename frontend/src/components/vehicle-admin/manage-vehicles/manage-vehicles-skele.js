import { Skeleton } from "@/components/ui/skeleton";

export default function VehiclesPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] p-2.5 md:p-4">
      <div className="mb-7 flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-[47px] flex-1 rounded-xl bg-white" />

        <Skeleton className="h-[47px] w-full rounded-xl bg-white md:w-[200px]" />

        <Skeleton className="h-[47px] w-full rounded-xl bg-white md:w-[240px]" />
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        <VehicleCardSkeleton />
        <VehicleCardSkeleton />
        <VehicleCardSkeleton />
      </div>

      <div className="mt-7 flex min-h-[57px] items-center justify-between rounded-xl bg-white px-4">
        <Skeleton className="h-5 w-32" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-[#4eae78]">
      <div className="flex h-[280px] items-center justify-center bg-white p-8">
        <Skeleton className="h-[150px] w-[75%] rounded-xl" />
      </div>

      <div className="px-3 pb-7">
        <div className="flex h-[59px] items-center justify-center">
          <Skeleton className="h-7 w-1/2 bg-white/40" />
        </div>

        <div className="flex h-[51px] items-center justify-center gap-4 rounded-xl bg-[#effff5]">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-8" />
        </div>

        <div className="mt-3 space-y-3">
          <DetailSkeleton />
          <DetailSkeleton />
          <DetailSkeleton />
        </div>

        <div className="mt-3 space-y-5">
          <Skeleton className="h-11 w-full rounded-xl bg-white/30" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-5 w-[150px] bg-white/30" />
      <Skeleton className="h-5 w-[180px] bg-white/30" />
    </div>
  );
}
