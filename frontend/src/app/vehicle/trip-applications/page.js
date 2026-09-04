import ManageTripApplication from "@/components/vehicle-admin/review-applications/manage-trip-applications";
import TripApplicationInfo from "@/components/vehicle-admin/review-applications/trip-application-info";
import TripApplicationTable from "@/components/vehicle-admin/review-applications/trip-applications-table";
import {
  tripTicketList,
  tripTicketStatus,
} from "@/lib/api/vehicle/vehicle-server";

export default async function ReviewApplications() {
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
