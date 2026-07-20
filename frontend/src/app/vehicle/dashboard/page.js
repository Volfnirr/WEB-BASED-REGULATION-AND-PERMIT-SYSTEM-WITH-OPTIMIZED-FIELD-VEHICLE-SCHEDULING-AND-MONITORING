import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";
import {
  Route,
  CirclePlus,
  CarFront,
  Wrench,
  CalendarCheck,
  CircleCheck,
} from "lucide-react";

export default function DashboardPage() {
  const applications_data = [
    {
      id: "1",
      label: "Total Trips",
      total: "5",
      icon: <Route />,
      bg: "bg-blue-100 text-blue-600",
    },
    {
      id: "2",
      label: "New Trips",
      total: "1",
      icon: <CirclePlus />,
      bg: "bg-green-100 text-green-600",
    },
  ];
  const vehicles_data = [
    {
      id: "1",
      icon: <CarFront />,
      label: "All Vehicle",
      total: "2",
      bg: "bg-blue-100 text-blue-600",
    },
    {
      id: "2",
      icon: <Wrench />,
      label: "Under Maintenance",
      total: "3",
      bg: "bg-amber-100 text-amber-600",
    },
    {
      id: "3",
      icon: <CalendarCheck />,
      label: "Scheduled This Week",
      total: "4",
      bg: "bg-purple-100 text-purple-600",
    },
    {
      id: "4",
      icon: <CircleCheck />,
      label: "Available This Week",
      total: "2",
      bg: "bg-green-100 text-green-600",
    },
  ];
  return (
    <div>
      <Title
        title2="Dashboard"
        description="View an overview of applications and vehicles."
      />
      <InfoCardContainer title="Applications">
        {applications_data.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>
      <InfoCardContainer title="Vehicles">
        {vehicles_data.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>
    </div>
  );
}
