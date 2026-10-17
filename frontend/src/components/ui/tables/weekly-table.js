import { getDayName } from "@/lib/date";

export default function VehicleSchedulesTableUI({ date = [], rows = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
          Reserved for trip
        </span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">
          Maintenance
        </span>
        <span className="text-gray-500">
          Blank cells: no reservation or maintenance scheduled.
        </span>
      </div>
      <div className="w-full min-w-0 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1090px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 w-52 bg-gray-50 p-4 text-left text-xs text-gray-500"
              >
                VEHICLE
              </th>
              {date.map((day) => (
                <th scope="col" key={day} className="border-l p-3 text-center">
                  <span className="block text-xs text-gray-400">
                    {getDayName(day)}
                  </span>
                  <span className="whitespace-nowrap">{day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={date.length + 1}
                  className="p-8 text-center text-sm text-gray-500"
                >
                  No vehicles found.
                </td>
              </tr>
            ) : (
              rows.map((vehicle) => (
                <tr key={vehicle.id} className="border-t align-top">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r bg-white p-4 text-left"
                  >
                    <span className="block font-semibold">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="block text-xs font-normal text-gray-500">
                      {vehicle.plateNumber}
                    </span>
                    {vehicle.isUsable === false && (
                      <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-normal text-gray-500">
                        Unavailable
                      </span>
                    )}
                  </th>
                  {date.map((day) => {
                    const schedules = (vehicle.vehicle_schedule ?? []).filter(
                      (item) =>
                        item.status !== "AVAILABLE" &&
                        item.startDate &&
                        item.endDate &&
                        day >= String(item.startDate).slice(0, 10) &&
                        day <= String(item.endDate).slice(0, 10),
                    );
                    return (
                      <td
                        key={day}
                        className="h-24 min-w-32 border-r p-2 last:border-r-0"
                      >
                        {schedules.map((item) => (
                          <div
                            key={item.id}
                            className={`mb-2 rounded-lg p-2 text-xs ${item.status === "RESERVED" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900"}`}
                          >
                            <p className="font-semibold">
                              {item.status === "RESERVED"
                                ? "Reserved"
                                : "Maintenance"}
                            </p>
                            <p className="mt-1 break-words">
                              {item.status === "RESERVED"
                                ? item.trip_ticket?.tripTicketNo ||
                                  "Trip reference unavailable"
                                : "Scheduled maintenance"}
                            </p>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
