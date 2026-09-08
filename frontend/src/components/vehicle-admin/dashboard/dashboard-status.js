import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";
import {
  CircleCheck,
  CalendarCheck,
  CarFront,
  Wrench,
  Route,
  CirclePlus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VehicleDashboardStatus({ status }) {
  const trips = [
    {
      id: "1",
      total: status.tripticketStatus.totalTrips ?? "-",
      label: "All Trips",
      icon: <Route />,
      bg: "bg-blue-200 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "All existing trips",
    },
    {
      id: "2",
      total: status.tripticketStatus.monthlyTrips ?? "-",
      label: "New Trips (30 Days)",
      icon: <CirclePlus />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Trips added in the past 30 days",
    },
    {
      id: "3",
      total: status.tripticketStatus.newTrips ?? "-",
      label: "New Trips (7 Days)",
      icon: <CirclePlus />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Trips added in the past 7 days",
    },
  ];
  const vehicle = [
    {
      id: "1",
      icon: <CarFront />,
      label: "All Vehicles",
      total: status.vehicleStatus.allVehicles ?? "-",
      bg: "bg-blue-200 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "All existing vehicles",
    },
    {
      id: "2",
      icon: <Wrench />,
      label: "Under Maintenance",
      total: status.vehicleStatus.underMaintenance ?? "-",
      bg: "bg-red-200 text-red-600",
      mainBg: "bg-red-100",
      tooltip: "Vehicles scheduled for maintenance",
    },
    {
      id: "3",
      icon: <CalendarCheck />,
      label: "Scheduled Vehicles",
      total: status.vehicleStatus.scheduled ?? "-",
      bg: "bg-purple-200 text-purple-600",
      mainBg: "bg-purple-100",
      tooltip: "Vehicles scheduled for trips today",
    },
    {
      id: "4",
      icon: <CircleCheck />,
      label: "Available Vehicles",
      total: status.vehicleStatus.available ?? "-",
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Vehicles available today",
    },
  ];
  return (
    <div>
      <Title
        title2="Dashboard"
        description="View an overview of applications and vehicles."
      />
      <InfoCardContainer title="Applications">
        {trips.map((status) => {
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
      <InfoCardContainer title="Vehicles">
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
