import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleSchedulesTableSkeleton({ days = 7, rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="grid grid-cols-[220px_repeat(7,minmax(120px,1fr))] border-b bg-gray-50">
        <div className="p-4">
          <Skeleton className="h-4 w-20" />
        </div>

        {Array.from({ length: days }).map((_, index) => (
          <div key={index} className="border-l p-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* BODY */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-[220px_repeat(7,minmax(120px,1fr))]  min-h-24  border-b  last:border-none  "
        >
          <div className=" border-r  p-4  space-y-3   ">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-3 w-24" />

            <Skeleton className="h-5 w-20 rounded-md" />
          </div>

          {Array.from({ length: days }).map((_, dayIndex) => (
            <div key={dayIndex} className=" border-r   p-3 ">
              <Skeleton className=" h-12 w-full rounded-xl  " />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
