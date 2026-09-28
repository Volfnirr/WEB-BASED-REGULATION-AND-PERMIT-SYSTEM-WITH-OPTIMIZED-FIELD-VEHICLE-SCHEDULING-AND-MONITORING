"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TableContainerUI from "@/components/ui/tables/table-container";
import VehicleSchedulesTableUI from "@/components/ui/tables/weekly-table";
import VehicleSchedulesTableSkeleton from "./schedules-table-skele";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { listVehiclesSchedules } from "@/lib/api/vehicle/manage-vehicles";
import { getNextDaysUtc8 } from "@/lib/date";
import { localDate } from "@/lib/local-date";

export default function VehicleSchedulesTable() {
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

  const [date, setDate] = useState(null);

  // const [rowData, setRowData] = useState([]);

  // const [weekDates, setWeekDates] = useState([]);

  // const [isLoading, setIsLoading] = useState(true);

  // Set current date only on client
  useEffect(() => {
    setDate(new Date());
  }, []);

  // useEffect(() => {
  //   if (!date) return;

  //   const fetchSchedules = async () => {
  //     setIsLoading(true);

  //     const startDate = localDate(date);

  //     const endDate = localDate(
  //       new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000),
  //     );

  //     const { schedules } = await listVehiclesSchedules({
  //       startDate,
  //       endDate,
  //     });

  //     setRowData(schedules ?? []);

  //     setWeekDates(getNextDaysUtc8(7, date) ?? []);

  //     setIsLoading(false);
  //   };

  //   fetchSchedules();
  // }, [date]);
  const startDate = date ? localDate(date) : null;
  const endDate = date
    ? localDate(new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000))
    : null;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["vehicle-schedules", startDate, endDate],
    queryFn: () => listVehiclesSchedules({ startDate, endDate }),
    enabled: !!date,
  });

  const rowData = data?.schedules ?? [];

  const weekDates = useMemo(
    () => (date ? (getNextDaysUtc8(7, date) ?? []) : []),
    [date],
  );
  return (
    <div className="mb-4">
      <div className="mb-5 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm ">
        <div>
          <h2 className=" text-lg font-bold text-gray-900">Vehicle Schedule</h2>

          <p className=" text-sm  text-gray-500 ">
            Select a starting date to view the next 7 days
          </p>
        </div>

        {date && (
          <Popover>
            <PopoverTrigger className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
              {localDate(date)}
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(value) => {
                  if (value) {
                    setDate(value);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      {isPending ? (
        <VehicleSchedulesTableSkeleton days={7} rows={5} />
      ) : isError ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : (
        <VehicleSchedulesTableUI
          date={weekDates}
          columns={column}
          rows={rowData}
        />
      )}{" "}
      {/* New */}
    </div>
  );
}
