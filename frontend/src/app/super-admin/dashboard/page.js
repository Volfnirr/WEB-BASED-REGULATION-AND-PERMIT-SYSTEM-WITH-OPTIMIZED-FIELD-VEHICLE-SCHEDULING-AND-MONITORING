import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";

import {
  UserPlus,
  UserRound,
  UserCog,
  CarFront,
  ShieldCheck,
  FileText,
  Clock3,
  BadgeCheck,
  CircleX,
  Wrench,
  CalendarCheck,
  CircleCheck,
} from "lucide-react";

export default function Dashboard() {
  const data = [
    {
      id: "1",
      icon: <UserPlus />,
      label: "New users",
      total: "2",
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "2",
      icon: <UserRound />,
      label: "Applicant",
      total: "3",
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "3",
      icon: <UserCog />,
      label: "Applicant Admin",
      total: "4",
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "4",
      icon: <CarFront />,
      label: "Vehicle Admin",
      total: "2",
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "5",
      icon: <ShieldCheck />,
      label: "Super Admin",
      total: "4",
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];
  const applications_data = [
    {
      id: "1",
      icon: <FileText />,
      label: "New Applications",
      total: "2",
      bg: "bg-blue-100 text-blue-600",
    },
    {
      id: "2",
      icon: <Clock3 />,
      label: "Pending",
      total: "3",
      bg: "bg-amber-100 text-amber-600",
    },
    {
      id: "3",
      icon: <BadgeCheck />,
      label: "Approved",
      total: "4",
      bg: "bg-green-100 text-green-600",
    },
    {
      id: "4",
      icon: <CircleX />,
      label: "Rejected",
      total: "2",
      bg: "bg-red-100 text-red-600",
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
        description="View an overview of users, applications, and vehicles."
      />
      <InfoCardContainer title="Accounts">
        {data.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>

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
