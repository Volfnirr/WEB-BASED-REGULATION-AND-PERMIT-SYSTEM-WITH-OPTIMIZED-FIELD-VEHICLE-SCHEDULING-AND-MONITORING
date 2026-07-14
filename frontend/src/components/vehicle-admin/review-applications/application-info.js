import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";

export default async function ApplicationInfo() {
  const infocardstatus = [
    {
      label: "In Review",
      total: "1",
      bg: "bg-amber-500",
    },
    {
      label: "Approved",
      total: "2",
      bg: "bg-green-500",
    },
    {
      label: "Rejected",
      total: "3",
      bg: "bg-red-500",
    },
  ];
  const infocarddeadline = [
    {
      label: "Due Today",
      total: "1",
      bg: "bg-amber-500",
    },
    {
      label: "Upcoming",
      total: "2",
      bg: "bg-amber-500",
    },
  ];
  return (
    <div>
      <InfoCardContainer title="Status">
        {infocardstatus.map((status) => {
          return (
            <InfoCard
              key={status.label}
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
