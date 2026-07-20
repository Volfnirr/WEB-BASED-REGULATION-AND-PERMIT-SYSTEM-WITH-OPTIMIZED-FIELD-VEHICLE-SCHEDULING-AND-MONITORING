import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import {
  BadgeCheck,
  CircleX,
  AlertCircle,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
export default async function ChainsawInfo() {
  const infocardstatus = [
    {
      label: "Approved",
      total: "120",
      icon: <BadgeCheck />,
      bg: "bg-green-100 text-green-600",
    },
    {
      label: "Rejected",
      total: "18",
      icon: <CircleX />,
      bg: "bg-red-100 text-red-600",
    },
  ];

  const infocarddeadline = [
    {
      label: "Due Today",
      total: "4",
      icon: <AlertCircle />,
      bg: "bg-red-100 text-red-600",
    },
    {
      label: "Due This Week",
      total: "12",
      icon: <CalendarClock />,
      bg: "bg-amber-100 text-amber-600",
    },
    {
      label: "Upcoming",
      total: "28",
      icon: <CalendarDays />,
      bg: "bg-blue-100 text-blue-600",
    },
    {
      label: "Completed",
      total: "112",
      icon: <CheckCircle2 />,
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

      <InfoCardContainer title="Deadline">
        {infocarddeadline.map((deadline) => {
          return (
            <InfoCard
              key={deadline.label}
              icon={deadline.icon}
              label={deadline.label}
              total={deadline.total}
              bg={deadline.bg}
            />
          );
        })}
      </InfoCardContainer>
    </div>
  );
}
