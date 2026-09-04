import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import { Route, CirclePlus, CalendarDays } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function TripApplicationInfo({ status }) {
  const infocardstatus = [
    {
      label: "Total Trips",
      total: status.totalTrips ?? "-",
      icon: <Route />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "All trips",
    },
    {
      label: "Monthly Trips",
      total: status.monthlyTrips ?? "-",
      icon: <CalendarDays />,
      mainBg: "bg-green-100",
      bg: "bg-green-100 text-green-600",
      tooltip: "New trips this past 30 days",
    },
    {
      label: "New Trips",
      total: status.newTrips ?? "-",
      icon: <CirclePlus />,
      mainBg: "bg-green-100",
      bg: "bg-green-100 text-green-600",
      tooltip: "New trips this past 7 days",
    },
  ];
  return (
    <div>
      <InfoCardContainer title="Status">
        {infocardstatus.map((status) => {
          return (
            <Tooltip key={status.label}>
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
