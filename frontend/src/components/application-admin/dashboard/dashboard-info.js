import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";
import { FilePlus2, ClipboardCheck, BadgeCheck, CircleX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AppAdminDashboardInfo({ status }) {
  const applications_data = [
    {
      label: "New Applications", // Weekly
      total: status?.all?.newApplications ?? "-",
      icon: <FilePlus2 />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "New applications, submitted in the past 7 days",
    },
    {
      label: "Pending", // All Time
      total: status?.all?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications, including unassigned.",
    },
    {
      label: "Approved", // Monthly
      total: status?.all?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications in the past 30 days",
    },
    {
      label: "Rejected", // Monthly
      total: status?.all?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications in the past 30 days",
    },
  ];
  const tree = [
    {
      label: "New Applications", // Weekly
      total: status?.tree?.newApplications ?? "-",
      icon: <FilePlus2 />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "New applications, submitted in the past 7 days",
    },
    {
      label: "Pending", // All Time
      total: status?.tree?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications, including unassigned.",
    },
    {
      label: "Approved", // Monthly
      total: status?.tree?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications in the past 30 days",
    },
    {
      label: "Rejected", // Monthly
      total: status?.tree?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications in the past 30 days",
    },
  ];
  const chainsaw = [
    {
      label: "New Applications", // Weekly
      total: status?.chainsaw?.newApplications ?? "-",
      icon: <FilePlus2 />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "New applications, submitted in the past 7 days",
    },
    {
      label: "Pending", // All Time
      total: status?.chainsaw?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications, including unassigned.",
    },
    {
      label: "Approved", // Monthly
      total: status?.chainsaw?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications in the past 30 days",
    },
    {
      label: "Rejected", // Monthly
      total: status?.chainsaw?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications in the past 30 days",
    },
  ];
  const agri = [
    {
      label: "New Applications", // Weekly
      total: status?.agri?.newApplications ?? "-",
      icon: <FilePlus2 />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "New applications, submitted in the past 7 days",
    },
    {
      label: "Pending", // All Time
      total: status?.agri?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications, including unassigned.",
    },
    {
      label: "Approved", // Monthly
      total: status?.agri?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications in the past 30 days",
    },
    {
      label: "Rejected", // Monthly
      total: status?.agri?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications in the past 30 days",
    },
  ];
  const resi = [
    {
      label: "New Applications", // Weekly
      total: status?.resi?.newApplications ?? "-",
      icon: <FilePlus2 />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "New applications, submitted in the past 7 days",
    },
    {
      label: "Pending", // All Time
      total: status?.resi?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications, including unassigned.",
    },
    {
      label: "Approved", // Monthly
      total: status?.resi?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications in the past 30 days",
    },
    {
      label: "Rejected", // Monthly
      total: status?.resi?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications in the past 30 days",
    },
  ];
  return (
    <div>
      <Title
        title2="Dashboard"
        description="View an overview of applications."
      />

      <InfoCardContainer title="All Service Applications">
        {applications_data.map((d) => {
          return (
            <Tooltip key={d.label}>
              <TooltipTrigger
                render={
                  <InfoCard
                    key={d.label}
                    mainBg={d.mainBg}
                    icon={d.icon}
                    label={d.label}
                    total={d.total}
                    bg={d.bg}
                  />
                }
              ></TooltipTrigger>
              <TooltipContent>
                <p>{d.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </InfoCardContainer>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
        <div className="w-full">
          <InfoCardContainer title="Agricultural Free Patent">
            {agri.map((d) => {
              return (
                <Tooltip key={d.label}>
                  <TooltipTrigger
                    render={
                      <InfoCard
                        key={d.label}
                        mainBg={d.mainBg}
                        icon={d.icon}
                        label={d.label}
                        total={d.total}
                        bg={d.bg}
                      />
                    }
                  ></TooltipTrigger>
                  <TooltipContent>
                    <p>{d.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </InfoCardContainer>
        </div>
        <div className="w-full">
          <InfoCardContainer title="Residential Free Patent">
            {resi.map((d) => {
              return (
                <Tooltip key={d.label}>
                  <TooltipTrigger
                    render={
                      <InfoCard
                        key={d.label}
                        mainBg={d.mainBg}
                        icon={d.icon}
                        label={d.label}
                        total={d.total}
                        bg={d.bg}
                      />
                    }
                  ></TooltipTrigger>
                  <TooltipContent>
                    <p>{d.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </InfoCardContainer>
        </div>
        <div className="w-full">
          <InfoCardContainer title="Tree Cutting Permit">
            {tree.map((d) => {
              return (
                <Tooltip key={d.label}>
                  <TooltipTrigger
                    render={
                      <InfoCard
                        key={d.label}
                        mainBg={d.mainBg}
                        icon={d.icon}
                        label={d.label}
                        total={d.total}
                        bg={d.bg}
                      />
                    }
                  ></TooltipTrigger>
                  <TooltipContent>
                    <p>{d.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </InfoCardContainer>
        </div>
        <div className="w-full">
          <InfoCardContainer title="Chainsaw Registration">
            {chainsaw.map((d) => {
              return (
                <Tooltip key={d.label}>
                  <TooltipTrigger
                    render={
                      <InfoCard
                        key={d.label}
                        mainBg={d.mainBg}
                        icon={d.icon}
                        label={d.label}
                        total={d.total}
                        bg={d.bg}
                      />
                    }
                  ></TooltipTrigger>
                  <TooltipContent>
                    <p>{d.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </InfoCardContainer>
        </div>
      </div>
    </div>
  );
}
