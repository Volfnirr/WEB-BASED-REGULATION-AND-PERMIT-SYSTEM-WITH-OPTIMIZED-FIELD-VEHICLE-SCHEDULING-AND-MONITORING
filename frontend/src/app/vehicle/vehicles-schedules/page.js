import { Skeleton } from "@/components/ui/skeleton";
import Title from "@/components/ui/title";
import VehicleSchedulesTableSkeleton from "@/components/vehicle-admin/vehicle-schedules/schedules-table-skele";
import VehicleSchedulesStatus from "@/components/vehicle-admin/vehicle-schedules/vehicle-schedules-status";
import VehicleSchedulesTable from "@/components/vehicle-admin/vehicle-schedules/vehicle-schedules-table";
import { vehicleSchedulesStatus } from "@/lib/api/vehicle/vehicle-server";
import AutoRefresh from "@/lib/router-refresh";
import { Suspense } from "react";
const items = Array.from({ length: 5 });

async function VehicleSchedules() {
  const { status } = await vehicleSchedulesStatus();

  return (
    <>
      {/* <AutoRefresh /> */}
      <VehicleSchedulesStatus status={status} />
      <VehicleSchedulesTable />
    </>
  );
}

export default function VehicleSchedulesSkeleton() {
  return (
    <Suspense
      fallback={
        <>
          <Title
            title="Vehicle"
            title2="Schedules"
            description="View all vehicle schedules."
          />

          <div className="grid grid-cols-1 gap-4 my-2 sm:grid-cols-2 lg:grid-cols-5">
            {items.map((_, index) => (
              <div
                key={index}
                className="flex h-29 items-center gap-4 rounded-2xl border bg-white px-6 shadow-sm"
              >
                <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-background p-5 shadow-sm mb-2">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-44 rounded-md" />

                <Skeleton className="h-5 w-72 rounded-md" />
              </div>

              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          </div>
          <VehicleSchedulesTableSkeleton />
        </>
      }
    >
      <VehicleSchedules />
    </Suspense>
  );
}
