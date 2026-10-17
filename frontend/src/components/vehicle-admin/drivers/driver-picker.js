"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { availableDrivers, driverName } from "@/lib/api/vehicle/drivers";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function DriverPicker({
  value,
  onChange,
  scheduleDate,
  tripTicket,
}) {
  const startDate = scheduleDate?.from
    ? format(scheduleDate.from, "yyyy-MM-dd")
    : "";
  const endDate = scheduleDate?.from
    ? format(scheduleDate.to ?? scheduleDate.from, "yyyy-MM-dd")
    : "";
  const datesUnchanged =
    !!tripTicket &&
    startDate === tripTicket.startDate?.slice(0, 10) &&
    endDate === tripTicket.endDate?.slice(0, 10);
  const query = useQuery({
    queryKey: ["drivers", "available", startDate, endDate, tripTicket?.id],
    queryFn: () =>
      availableDrivers({
        startDate,
        endDate,
        ...(tripTicket?.id ? { excludeTripTicketId: tripTicket.id } : {}),
      }),
    enabled: !!startDate && endDate >= startDate,
    staleTime: 0,
  });
  const drivers = query.data?.drivers;
  useEffect(() => {
    if (
      drivers &&
      value &&
      !drivers.some((driver) => String(driver.id) === String(value)) &&
      !(datesUnchanged && String(value) === String(tripTicket?.driverId))
    )
      onChange(undefined);
  }, [drivers, value, datesUnchanged, tripTicket?.driverId, onChange]);
  const retained =
    value &&
    !drivers?.some((driver) => String(driver.id) === String(value)) &&
    String(value) === String(tripTicket?.driverId) &&
    datesUnchanged;
  const selectedDriver = drivers?.find(
    (driver) => String(driver.id) === String(value),
  );
  const selectedLabel = selectedDriver
    ? driverName(selectedDriver)
    : retained
      ? tripTicket?.driverName
      : null;
  return (
    <div className="space-y-1">
      <Select
        value={value ? String(value) : ""}
        onValueChange={(selected) => onChange(Number(selected))}
        disabled={!startDate || query.isPending || query.isError}
      >
        <SelectTrigger className="w-full cursor-pointer border-gray-300 bg-white text-sm">
          {selectedLabel ? (
            <span className="min-w-0 flex-1 truncate text-left">
              {selectedLabel}
            </span>
          ) : (
            <SelectValue
              placeholder={
                !startDate
                  ? "Select trip dates first"
                  : query.isPending
                    ? "Loading drivers…"
                    : "Select an available driver"
              }
            />
          )}
        </SelectTrigger>
        <SelectContent>
          {retained && (
            <SelectItem value={String(value)}>
              {tripTicket.driverName} (current assignment)
            </SelectItem>
          )}
          {drivers?.map((driver) => (
            <SelectItem key={driver.id} value={String(driver.id)}>
              {driverName(driver)} — {driver.email}
            </SelectItem>
          ))}
          {drivers?.length === 0 && !retained && (
            <p className="p-3 text-sm text-gray-500">
              No drivers available for these dates.
            </p>
          )}
        </SelectContent>
      </Select>
      {!tripTicket?.driverId && tripTicket?.driverName && (
        <p className="text-xs text-amber-700">
          Saved driver: {tripTicket.driverName}. Select a registered driver to
          change the driver or trip dates.
        </p>
      )}
      {query.isError && (
        <p className="text-xs text-red-600">
          {query.error.message}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => query.refetch()}
          >
            Retry
          </button>
        </p>
      )}
      {startDate && drivers?.length === 0 && (
        <p className="text-xs text-gray-500">
          Add an active driver in Manage Drivers or choose different dates.
        </p>
      )}
    </div>
  );
}
