import ResidentialTableUI from "@/components/ui/tables/residential-table";

export default async function ResidentialTable() {
  const column = [
    {
      head: "Requester Name",
      data: "requester_name",
    },
    {
      head: "Request ID",
      data: "request_id",
    },
    {
      head: "Service Name",
      data: "service_name",
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
      requester_name: "Luffy",
      request_id: "1",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Pending",
      action: "View",
    },
    {
      requester_name: "Luffy 2",
      request_id: "2",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Pending",
      action: "View",
    },
    {
      requester_name: "Luffy 3",
      request_id: "3",
      service_name: "AGRICULTURAL FREE PATENT",
      submission_date: "2026-07-01",
      status: "Pending",
      action: "View",
    },
  ];

  return (
    <div>
      <ResidentialTableUI columns={column} rows={data} />
    </div>
  );
}
