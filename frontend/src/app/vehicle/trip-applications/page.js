import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
import Title from "@/components/ui/title";
import ManageTripApplication from "@/components/vehicle-admin/trip-ticket/manage-trip-applications";
import TripApplicationInfo from "@/components/vehicle-admin/trip-ticket/trip-application-info";
import TripApplicationTable from "@/components/vehicle-admin/trip-ticket/trip-applications-table";
import {
  tripTicketList,
  tripTicketStatus,
} from "@/lib/api/vehicle/vehicle-server";
import { Suspense } from "react";

async function ReviewApplications() {
  const { tripticketlist } = await tripTicketList();
  const { status } = await tripTicketStatus();
  return (
    <div>
      <ManageTripApplication />
      <TripApplicationInfo status={status} />
      <TripApplicationTable initialData={tripticketlist} />
    </div>
  );
}

export default function ReviewApplicationsSkeleton() {
  return (
    <Suspense
      fallback={
        <>
          <Title
            title="Manage"
            title2="Applications"
            description="View and manage all trip applications."
          />
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
          <TableSkeleton />
        </>
      }
    >
      <ReviewApplications />
    </Suspense>
  );
}
