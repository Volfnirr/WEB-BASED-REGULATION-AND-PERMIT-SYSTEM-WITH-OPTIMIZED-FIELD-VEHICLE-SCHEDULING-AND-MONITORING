import ManageVehicleUI from "@/components/vehicle-admin/manage-vehicles/manage-vehicles-ui";
import ManageVehicleInfo from "@/components/vehicle-admin/manage-vehicles/mange-vehicles-info";
import {
  listAllVehicles,
  vehiclesStatus,
} from "@/lib/api/vehicle/vehicle-server";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ManageVehicles() {
  const { vehicles } = await listAllVehicles();
  const { vehiclesInfo } = await vehiclesStatus();
  return (
    <TooltipProvider>
      <div>
        <ManageVehicleUI initialData={vehicles} vehiclesData={vehiclesInfo}>
          <ManageVehicleInfo vehiclesData={vehiclesInfo} />
        </ManageVehicleUI>
      </div>
    </TooltipProvider>
  );
}
