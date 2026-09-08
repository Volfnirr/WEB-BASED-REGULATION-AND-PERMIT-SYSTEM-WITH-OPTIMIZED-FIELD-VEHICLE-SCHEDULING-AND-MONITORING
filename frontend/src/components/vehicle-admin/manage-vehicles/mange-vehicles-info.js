import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CarFront, CircleCheck } from "lucide-react";
export default function ManageVehicleInfo({ vehiclesData }) {
  const status = [
    {
      label: "All Vehicle",
      total: vehiclesData?.allVehicles ?? "-",
      icon: <CarFront />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "All Vehicles",
    },
    {
      label: "New Vehicles",
      total: vehiclesData?.newVehicles ?? "-",
      icon: <CircleCheck />,
      bg: "bg-green-100 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "New vehicles in the past 7 days",
    },
  ];
  return (
    <div>
      <InfoCardContainer title="Vehicle Overview">
        {status.map((today) => {
          return (
            <Tooltip key={today.label}>
              <TooltipTrigger
                render={
                  <InfoCard
                    // key={today.label}
                    mainBg={today.mainBg}
                    icon={today.icon}
                    label={today.label}
                    total={today.total}
                    bg={today.bg}
                  />
                }
              />
              <TooltipContent>
                <p>{today.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </InfoCardContainer>
    </div>
  );
}
