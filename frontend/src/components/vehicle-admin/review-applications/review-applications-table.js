import Table from "@/components/ui/tables/table";
import ScheduleCardInfo from "@/components/ui/card/card";
import CardContainer from "@/components/ui/card/card-container";

export default async function ReviewApplicationTable() {
  const page = "/vehicle/applications/";
  const column = [
    {
      head: "Trip ID",
      data: "id",
    },
    {
      head: "Requester Name",
      data: "requester_name",
    },

    {
      head: "Driver Name",
      data: "driver_name",
    },
    {
      head: "Plate No.",
      data: "plate_no",
    },
    {
      head: "Submission Date",
      data: "submission_date",
    },
    {
      head: "Status",
      data: "status",
    },

    {
      head: "Action",
      data: "action",
    },
  ];

  const data = [
    {
      id: "1",
      requester_name: "Luffy",
      driver_name: "Zora",
      plate_no: "ABC 1234",
      submission_date: "2026-07-01",
      status: "Pending",
      action: "View",
    },
    {
      id: "2",
      requester_name: "Luffy",
      driver_name: "Zora",
      plate_no: "ABC 1234",
      submission_date: "2026-07-01",
      status: "Rejected",
      action: "View",
    },
    {
      id: "3",
      requester_name: "Luffy",
      driver_name: "Zora",
      plate_no: "ABC 1234",
      submission_date: "2026-07-01",
      status: "Accepted",
      action: "View",
    },
    {
      id: "4",
      requester_name: "Luffy",
      driver_name: "Zora",
      plate_no: "ABC 1234",
      submission_date: "2026-07-01",
      status: "Revision",
      action: "View",
    },
  ];

  return (
    <div>
      <Table columns={column} rows={data} page={page} />
      <CardContainer title="Pending Applications">
        {data.map((data) => {
          return (
            <ScheduleCardInfo
              key={data.id}
              reqid={data.id}
              name={data.requester_name}
              serviceName={data.driver_name}
              plateno={data.plate_no}
              date={data.submission_date}
              status={data.status}
              link={page}
            />
          );
        })}
      </CardContainer>
    </div>
  );
}
