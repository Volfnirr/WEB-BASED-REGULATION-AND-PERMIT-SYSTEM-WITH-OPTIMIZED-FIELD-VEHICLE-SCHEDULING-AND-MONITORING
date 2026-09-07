import VehicleSchedulesStatus from "@/components/vehicle-admin/vehicle-schedules/vehicle-schedules-status";
import VehicleSchedulesTable from "@/components/vehicle-admin/vehicle-schedules/vehicle-schedules-table";
import { vehicleSchedulesStatus } from "@/lib/api/vehicle/vehicle-server";

export default async function VehicleSchedules() {
  const { status } = await vehicleSchedulesStatus();

  return (
    <>
      <VehicleSchedulesStatus status={status} />
      <VehicleSchedulesTable />
    </>
  );
}
