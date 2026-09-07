import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";
import { CircleCheck, CalendarCheck, Wrench } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VehicleSchedulesStatus({ status }) {
  const vehicle = [
    {
      id: "1",
      icon: <Wrench />,
      label: "Under Maintenance",
      total: status.vehicle.underMaintenance ?? "-",
      bg: "bg-red-200 text-red-600",
      mainBg: "bg-red-100",
      tooltip: "Vehicles scheduled for maintenance today",
    },
    {
      id: "2",
      icon: <CalendarCheck />,
      label: "Scheduled Vehicles",
      total: status.vehicle.scheduled ?? "-",
      bg: "bg-purple-200 text-purple-600",
      mainBg: "bg-purple-100",
      tooltip: "Vehicles scheduled for trips today",
    },
    {
      id: "3",
      icon: <CircleCheck />,
      label: "Available Vehicles",
      total: status.vehicle.available ?? "-",
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Vehicles available for trips today",
    },
  ];

  return (
    <div>
      <Title
        title="Vehicle"
        title2="Schedules"
        description="View all vehicle schedules."
      />
      <InfoCardContainer title="Vehicle Status Today">
        {vehicle.map((status) => {
          return (
            <Tooltip key={status.id}>
              <TooltipTrigger
                render={
                  <InfoCard
                    mainBg={status.mainBg}
                    icon={status.icon}
                    label={status.label}
                    total={status.total}
                    bg={status.bg}
                  />
                }
              ></TooltipTrigger>
              <TooltipContent>
                <p>{status.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </InfoCardContainer>
    </div>
  );
}
