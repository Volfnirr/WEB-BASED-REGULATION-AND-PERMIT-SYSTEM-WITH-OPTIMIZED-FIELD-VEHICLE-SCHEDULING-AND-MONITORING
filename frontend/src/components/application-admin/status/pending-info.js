import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import { BadgeCheck, CircleX, ClipboardCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default async function PendingInfo({ status }) {
  const info = [
    {
      label: "Approved",
      total: status.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "All Approved applications assigned to you",
    },
    {
      label: "Rejected",
      total: status?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "All Rejected applications assigned to you",
    },
    {
      label: "Pending",
      total: status?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications assigned to you",
    },
  ];
  return (
    <div>
      <InfoCardContainer title="Assigned Applications Status">
        {info.map((d) => {
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
  );
}
