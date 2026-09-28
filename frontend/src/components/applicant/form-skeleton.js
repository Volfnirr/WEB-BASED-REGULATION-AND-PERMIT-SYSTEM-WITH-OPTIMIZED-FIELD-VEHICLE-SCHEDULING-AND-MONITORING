import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <main className="min-h-[calc(100vh-92px)] bg-[#4caf78] p-4 md:p-10">
        <div className="mx-auto max-w-[1460px] rounded-[18px] bg-white px-6 py-8 md:px-12 md:py-12">
          <Skeleton className="h-9 w-[430px] max-w-full" />

          <div className="my-7 h-px w-full bg-[#d9dee5]" />

          <Skeleton className="mb-5 h-5 w-48" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-12 w-full rounded-[10px]" />
            <Skeleton className="h-12 w-full rounded-[10px]" />
            <Skeleton className="h-12 w-full rounded-[10px]" />
            <Skeleton className="h-12 w-full rounded-[10px]" />
          </div>

          <Skeleton className="mt-4 h-12 w-full rounded-[10px]" />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-[10px]" />
            <Skeleton className="h-12 w-full rounded-[10px]" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
            </div>
          </div>

          <div className="mt-10">
            <Skeleton className="mb-5 h-5 w-36" />

            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-12 w-full rounded-[10px]" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <Skeleton className="h-5 w-40" />

            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-12 w-full rounded-[10px]" />
              <Skeleton className="h-12 w-full rounded-[10px]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
