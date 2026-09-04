"use client";
import TableContainerUI from "@/components/ui/tables/table-container";
import VehicleSchedulesTableUI from "@/components/ui/tables/weekly-table";
import Title from "@/components/ui/title";
import { getNextDaysUtc8 } from "@/lib/date";
import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import { Wrench, CalendarCheck, CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { listVehiclesSchedules } from "@/lib/api/vehicle/manage-vehicles";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { localDate } from "@/lib/local-date";

export default function VehicleSchedulesTable() {
  // function groupSchedulesByVehicle(schedules) {
  //   const map = new Map();

  //   schedules.forEach((s) => {
  //     const vehicleId = s.vehicleId;
  //     if (!map.has(vehicleId)) {
  //       map.set(vehicleId, {
  //         id: vehicleId,
  //         vehicle: `${s.vehicle.brand} ${s.vehicle.model}`,
  //         vehicle_schedules: [],
  //       });
  //     }
  //     map.get(vehicleId).vehicle_schedules.push({
  //       date: s.startDate.split("T")[0], // "2026-08-01"
  //       status: s.status,
  //     });
  //   });

  //   return Array.from(map.values());
  // }
  // const today = new Date("2026-08-02");
  //   today.setDate(today.getDate() + 6);

  // const lastDay = today.toISOString().split("T")[0];

  // const custom = "2026-07-02";
  // const date = getNextDaysUtc8(7, today);
  const column = [
    {
      head: "Brand",
      data: "brand",
    },
    {
      head: "Model",
      data: "model",
    },
    {
      head: "Plate No.",
      data: "plateNumber",
    },
  ];
  const today = new Date();

  const [date, setDate] = useState(today);
  const [rowData, setRowData] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);

      const startDate = localDate(date);
      const endDate = localDate(
        new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000),
      );

      const { schedules } = await listVehiclesSchedules({
        startDate,
        endDate,
      });

      setRowData(schedules);
      setWeekDates(getNextDaysUtc8(7, date) ?? []);
      setIsLoading(false);
    };

    fetchSchedules();
  }, [date]);

  // const datas = [
  //   {
  //     id: "1",
  //     vehicle: "TOYOTA HIACE",
  //     vehicle_schedules: [
  //       {
  //         date: "2026-07-02",
  //         status: "AVAILABLE",
  //       },
  //       {
  //         date: "2026-07-03",
  //         status: "AVAILABLE",
  //       },
  //       {
  //         date: "2026-07-04",
  //         status: "MAINTENANCE",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     vehicle: "FORD RANGER",
  //     vehicle_schedules: [
  //       {
  //         date: "2026-07-02",
  //         status: "AVAILABLE",
  //       },
  //       {
  //         date: "2026-07-03",
  //         status: "AVAILABLE",
  //       },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     vehicle: "MITSUBISHI TRITON",
  //     vehicle_schedules: [
  //       {
  //         date: "2026-07-02",
  //         status: "AVAILABLE",
  //       },
  //       {
  //         date: "2026-07-03",
  //         status: "AVAILABLE",
  //       },
  //       {
  //         date: "2026-07-04",
  //         status: "MAINTENANCE",
  //       },
  //     ],
  //   },
  // ];

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
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          Select a start date to view the next 7 days
        </span>

        <Popover>
          <PopoverTrigger>
            <div className="cursor-pointer rounded-md border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
              {localDate(date)}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
      {isLoading ? (
        <div className="relative flex h-90 w-250 flex-col items-center justify-center gap-2">
          <Spinner />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      ) : (
        <TableContainerUI>
          <VehicleSchedulesTableUI
            date={weekDates}
            columns={column}
            rows={rowData}
          />
        </TableContainerUI>
      )}
      {/* {data.map((vehicle) => (
        <WeeklyScheduleCardInfo
          key={vehicle?.id}
          name={vehicle?.vehicle}
          // dates={vehicle?.date}
          schedules={vehicle?.vehicle_schedules}
        />
      ))} */}
    </div>
  );
}
