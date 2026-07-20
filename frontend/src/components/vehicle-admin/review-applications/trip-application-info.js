import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import { Route, CirclePlus } from "lucide-react";

export default function TripApplicationInfo() {
  const infocardstatus = [
    {
      label: "Total Trips",
      total: "5",
      icon: <Route />,
      bg: "bg-blue-100 text-blue-600",
    },
    {
      label: "New Trips",
      total: "1",
      icon: <CirclePlus />,
      bg: "bg-green-100 text-green-600",
    },
  ];
  return (
    <div>
      <InfoCardContainer title="Status">
        {infocardstatus.map((status) => {
          return (
            <InfoCard
              key={status.label}
              icon={status.icon}
              label={status.label}
              total={status.total}
              bg={status.bg}
            />
          );
        })}
      </InfoCardContainer>
    </div>
  );
}
