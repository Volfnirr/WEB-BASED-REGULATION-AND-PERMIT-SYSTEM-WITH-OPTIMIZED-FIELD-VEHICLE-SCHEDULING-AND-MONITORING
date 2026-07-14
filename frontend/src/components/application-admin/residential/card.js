import ScheduleCardInfo from "@/components/ui/card/card";
import CardContainer from "@/components/ui/card/card-container";

export default function ScheduleCardValue() {
  const page = "/application-admin/residential/";

  const data = [
    {
      id: "1",
      requester_name: "John Doe",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Pending",
      action: "View",
    },
    {
      id: "2",
      requester_name: "John Smith",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Rejected",
      action: "View",
    },
    {
      id: "3",
      requester_name: "Mia Cruz",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Accepted",
      action: "View",
    },
    {
      id: "4",
      requester_name: "Juan Cruz",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Revision",
      action: "View",
    },
  ];

  return (
    <div>
      <CardContainer title="Pending Applications">
        {data.map((data) => {
          return (
            <ScheduleCardInfo
              key={data.id}
              name={data.requester_name}
              reqid={data.id}
              date={data.submission_date}
              status={data.status}
              serviceName={data.service_name}
              link={page}
            />
          );
        })}
      </CardContainer>
    </div>
  );
}
