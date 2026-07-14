import WeeklyScheduleCardInfo from "@/components/ui/card/weekly-card";
import TableContainerUI from "@/components/ui/tables/table-container";
import VehicleSchedulesTableUI from "@/components/ui/tables/weekly-table";
import { getUtcOffsetDate, getNextDaysUtc8 } from "@/lib/date";

export default function VehicleSchedulesTable() {
  const page = "/vehicle/vehicles-schedules/";

  const custom = "2026-07-02";
  const date = getNextDaysUtc8(7, custom);
  const column = [
    {
      head: "Vehicle Name",
      data: "vehicle",
    },
  ];
  // const today = getUtcOffsetDate();

  const data = [
    {
      id: "1",
      vehicle: "TOYOTA HIACE",
      vehicle_schedules: [
        {
          date: "2026-07-02",
          status: "Available",
        },
        {
          date: "2026-07-03",
          status: "Available",
        },
        {
          date: "2026-07-04",
          status: "Maintenance",
        },
      ],
    },
    {
      id: "2",
      vehicle: "FORD RANGER",
      vehicle_schedules: [
        {
          date: "2026-07-02",
          status: "Available",
        },
        {
          date: "2026-07-03",
          status: "Available",
        },
      ],
    },
    {
      id: "3",
      vehicle: "MITSUBISHI TRITON",
      vehicle_schedules: [
        {
          date: "2026-07-02",
          status: "Available",
        },
        {
          date: "2026-07-03",
          status: "Available",
        },
        {
          date: "2026-07-04",
          status: "Maintenance",
        },
      ],
    },
  ];

  return (
    <div>
      <TableContainerUI title="Weekly Vehicle Schedule">
        <VehicleSchedulesTableUI
          date={date}
          columns={column}
          rows={data}
          page={page}
        />
      </TableContainerUI>
      {data.map((vehicle) => (
        <WeeklyScheduleCardInfo
          key={vehicle.id}
          name={vehicle.vehicle}
          dates={date}
          schedules={vehicle.vehicle_schedules}
        />
      ))}
    </div>
  );
}
