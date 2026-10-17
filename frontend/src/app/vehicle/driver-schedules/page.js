"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import Title from "@/components/ui/title";
import { Button } from "@/components/ui/button";
import BlockForm from "@/components/vehicle-admin/drivers/block-form";
import {
  driverSchedules,
  deleteDriverBlock,
  driverName,
} from "@/lib/api/vehicle/drivers";

function manilaToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (name) => parts.find((part) => part.type === name).value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}
export default function DriverSchedules() {
  const [startDate, setStartDate] = useState(manilaToday);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const client = useQueryClient();
  const days = Array.from({ length: 7 }, (_, index) =>
    format(addDays(new Date(`${startDate}T12:00:00`), index), "yyyy-MM-dd"),
  );
  const query = useQuery({
    queryKey: ["drivers", "schedules", startDate],
    queryFn: () => driverSchedules({ startDate, endDate: days[6] }),
  });
  const remove = useMutation({
    mutationFn: deleteDriverBlock,
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["drivers"] });
      toast.success(result.message);
      setRemoving(null);
    },
    onError: (error) => toast.error(error.message),
  });
  const drivers = query.data?.drivers ?? [];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Title
          title="Driver"
          title2="Schedules"
          description="View trip reservations and block dates for temporary absences."
        />
        <Button
          disabled={!drivers.some((driver) => driver.isActive)}
          onClick={() => setEditing({})}
          className="bg-[#4DAA74] text-white"
        >
          Block dates
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
        <p className="text-sm text-gray-600">
          Select a starting date to view the next seven days.
        </p>
        <label className="flex items-center gap-2 text-sm">
          Starting date
          <input
            type="date"
            value={startDate}
            className="rounded-md border px-3 py-2"
            onChange={(event) => {
              if (event.target.value) setStartDate(event.target.value);
            }}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
          Reserved for trip
        </span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">
          Unavailable
        </span>
        <span className="text-gray-500">
          Blank cells: no reservation or blocked dates. Inactive drivers cannot
          receive new assignments.
        </span>
      </div>
      {query.isPending ? (
        <p role="status" className="animate-pulse p-6">
          Loading schedules…
        </p>
      ) : query.isError ? (
        <p className="text-red-600">
          {query.error.message}{" "}
          <button className="underline" onClick={() => query.refetch()}>
            Retry
          </button>
        </p>
      ) : drivers.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-sm">
          No drivers yet.{" "}
          <Link
            href="/vehicle/manage-drivers"
            className="text-green-800 underline"
          >
            Add a driver
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[1090px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-52 p-4 text-left text-xs text-gray-500">
                  DRIVER
                </th>
                {days.map((day) => (
                  <th key={day} className="border-l p-3 text-center">
                    <span className="block text-xs text-gray-400">
                      {format(new Date(`${day}T12:00:00`), "EEE")}
                    </span>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-t align-top">
                  <th className="sticky left-0 border-r bg-white p-4 text-left">
                    <span className="block font-semibold">
                      {driverName(driver)}
                    </span>
                    <span className="block break-all text-xs font-normal text-gray-500">
                      {driver.email}
                    </span>
                    {!driver.isActive && (
                      <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                        Inactive
                      </span>
                    )}
                  </th>
                  {days.map((day) => (
                    <td key={day} className="h-24 min-w-32 border-r p-2">
                      {driver.driver_schedule
                        .filter(
                          (item) =>
                            day >= item.startDate.slice(0, 10) &&
                            day <= item.endDate.slice(0, 10),
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`mb-2 rounded-lg p-2 text-xs ${item.status === "RESERVED" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900"}`}
                          >
                            <p className="font-semibold">
                              {item.status === "RESERVED"
                                ? "Reserved"
                                : "Unavailable"}
                            </p>
                            <p className="mt-1 break-words">
                              {item.trip_ticket?.tripTicketNo ?? item.reason}
                            </p>
                            {item.status === "UNAVAILABLE" && (
                              <div className="mt-2 flex gap-2">
                                <button
                                  className="cursor-pointer underline"
                                  onClick={() => setEditing(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="cursor-pointer underline"
                                  onClick={() => setRemoving(item)}
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Older tickets without a registered driver are not included. Reassign
        them in Trip Ticket to reserve a driver.
      </p>
      {editing && (
        <BlockForm
          block={editing.id ? editing : null}
          drivers={drivers}
          startDate={startDate}
          onClose={() => setEditing(null)}
        />
      )}
      {removing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-block-title"
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6"
          >
            <h2 id="remove-block-title" className="font-bold">
              Remove these blocked dates?
            </h2>
            <p className="text-sm text-gray-600">
              {removing.startDate.slice(0, 10)} through{" "}
              {removing.endDate.slice(0, 10)}: {removing.reason}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                disabled={remove.isPending}
                onClick={() => setRemoving(null)}
              >
                Cancel
              </Button>
              <Button
                disabled={remove.isPending}
                onClick={() => remove.mutate(removing.id)}
              >
                {remove.isPending ? "Removing…" : "Remove"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
