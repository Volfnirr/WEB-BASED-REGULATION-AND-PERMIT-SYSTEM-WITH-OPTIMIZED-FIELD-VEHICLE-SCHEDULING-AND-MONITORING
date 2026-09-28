import ManageVehicleUI from "@/components/vehicle-admin/manage-vehicles/manage-vehicles-ui";
import ManageVehicleInfo from "@/components/vehicle-admin/manage-vehicles/mange-vehicles-info";
import {
  listAllVehicles,
  vehiclesStatus,
} from "@/lib/api/vehicle/vehicle-server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import Title from "@/components/ui/title";
import VehiclesPage from "@/components/vehicle-admin/manage-vehicles/manage-vehicles-skele";

async function ManageVehicles() {
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

export default function ManageVehiclesSkeleton() {
  return (
    <Suspense
      fallback={
        <>
          <Title
            title="Manage"
            title2="Vehicles"
            description="View and manage all vehicles."
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
          <VehiclesPage />
        </>
      }
    >
      <ManageVehicles />
    </Suspense>
  );
}
