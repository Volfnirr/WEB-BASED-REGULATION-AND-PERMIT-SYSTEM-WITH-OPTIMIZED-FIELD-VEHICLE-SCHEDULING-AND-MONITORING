import WeeklyScheduleCardInfo from "@/components/ui/card/weekly-card";
import TableContainerUI from "@/components/ui/tables/table-container";
import VehicleSchedulesTableUI from "@/components/ui/tables/weekly-table";
import Title from "@/components/ui/title";
import { getUtcOffsetDate, getNextDaysUtc8 } from "@/lib/date";
import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import {
  Route,
  CirclePlus,
  CarFront,
  Wrench,
  CalendarCheck,
  CircleCheck,
} from "lucide-react";
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
  const vehicles_data = [
    {
      id: "2",
      icon: <Wrench />,
      label: "Under Maintenance",
      total: "2",
      bg: "bg-amber-100 text-amber-600",
    },
    {
      id: "3",
      icon: <CalendarCheck />,
      label: "Scheduled This Week",
      total: "0",
      bg: "bg-purple-100 text-purple-600",
    },
    {
      id: "4",
      icon: <CircleCheck />,
      label: "Available This Week",
      total: "19",
      bg: "bg-green-100 text-green-600",
    },
  ];
  return (
    <div>
      <Title
        title="Vehicle"
        title2="Schedules"
        description="View all vehicle schedules."
      />
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
      <TableContainerUI>
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
