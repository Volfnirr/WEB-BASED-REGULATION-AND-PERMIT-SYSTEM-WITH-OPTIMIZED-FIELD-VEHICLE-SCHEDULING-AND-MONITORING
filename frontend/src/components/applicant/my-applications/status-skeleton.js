import { Skeleton } from "@/components/ui/skeleton";

export function UserApplicationsSkeleton() {
  return (
    <div className="min-h-screen bg-[#f4f4f6] p-0">
      <div className="flex gap-3 bg-[#f4f4f6] pb-5">
        <Skeleton className="h-11 flex-1 rounded-xl bg-white" />

        <Skeleton className="h-11 w-[200px] rounded-xl bg-white" />

        <Skeleton className="h-11 w-[240px] rounded-xl bg-white" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl bg-white px-[22px] py-7">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-5 w-44 rounded-md" />

                <div className="flex items-center gap-3">
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
