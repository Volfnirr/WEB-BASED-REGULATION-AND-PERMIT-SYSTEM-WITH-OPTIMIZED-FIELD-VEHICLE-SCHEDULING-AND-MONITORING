import ManageVehicleUI from "@/components/vehicle-admin/manage-vehicles/manage-vehicles-ui";
import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import {
  Route,
  CirclePlus,
  CarFront,
  Wrench,
  CalendarCheck,
  CircleCheck,
} from "lucide-react";

export default function ManageVehicles() {
  return (
    <div>
      <ManageVehicleUI />
    </div>
  );
}
