import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";
import { FileText, Clock3, BadgeCheck, CircleX } from "lucide-react";
export default function AdminDashboard() {
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
  const tree = [
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
  const chainsaw = [
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
  const agri = [
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
  const resi = [
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
      <InfoCardContainer title="Agricultural Free Patent">
        {agri.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>
      <InfoCardContainer title="Residential Free Patent">
        {resi.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>
      <InfoCardContainer title="Chainsaw Registration">
        {chainsaw.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>
      <InfoCardContainer title="Tree Cutting Permit">
        {tree.map((d) => (
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
