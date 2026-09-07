import VehicleDashboardStatus from "@/components/vehicle-admin/dashboard/dashboard-status";
import { dashboardStatus } from "@/lib/api/vehicle/vehicle-server";

export default async function DashboardPage() {
  const { status } = await dashboardStatus();
  return (
    <div>
      <VehicleDashboardStatus status={status} />
    </div>
  );
}
