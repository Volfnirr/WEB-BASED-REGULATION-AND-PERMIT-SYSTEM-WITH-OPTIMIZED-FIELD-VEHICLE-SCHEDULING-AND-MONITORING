import ManageVehicleUI from "@/components/vehicle-admin/manage-vehicles/manage-vehicles-ui";
import {
  listAllVehicles,
  vehiclesStatus,
} from "@/lib/api/vehicle/vehicle-server";

export default async function ManageVehicles() {
  const { vehicles } = await listAllVehicles();
  const { vehiclesInfo } = await vehiclesStatus();
  return (
    <div>
      <ManageVehicleUI initialData={vehicles} vehiclesData={vehiclesInfo} />
    </div>
  );
}
