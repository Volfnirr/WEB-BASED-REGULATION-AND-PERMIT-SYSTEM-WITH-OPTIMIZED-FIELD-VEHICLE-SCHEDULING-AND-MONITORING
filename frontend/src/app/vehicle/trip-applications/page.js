import ManageTripApplication from "@/components/vehicle-admin/review-applications/manage-trip-applications";
import { listAllVehicles } from "@/lib/api/vehicle/vehicle-server";

export default async function ReviewApplications() {
  const { vehicles } = await listAllVehicles();
  return (
    <div>
      <ManageTripApplication vehicles={vehicles} />
    </div>
  );
}
