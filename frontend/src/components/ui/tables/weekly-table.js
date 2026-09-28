import { getDayName } from "@/lib/date";
import { StatusColor } from "@/lib/status";

export default function VehicleSchedulesTableUI({ date, rows }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-[1090px]">
          <div className="grid grid-cols-[180px_repeat(7,minmax(130px,1fr))] border-b bg-gray-50">
            <div className="p-4 text-xs font-semibold text-gray-500">
              VEHICLE
            </div>

            {date.map((d) => (
              <div key={d} className="border-l p-3 text-center">
                <p className="text-xs text-gray-400">{getDayName(d)}</p>

                <p className="whitespace-nowrap text-sm font-bold">{d}</p>
              </div>
            ))}
          </div>

          {rows.map((vehicle) => (
            <div
              key={vehicle.id}
              className="grid min-h-24 grid-cols-[180px_repeat(7,minmax(130px,1fr))] border-b last:border-b-0"
            >
              <div className="sticky left-0 bg-white border-r p-4">
                <p className="text-sm font-bold text-gray-900">
                  {vehicle.brand} {vehicle.model}
                </p>

                <span className="mt-2 inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {vehicle.plateNumber}
                </span>
              </div>

              {date.map((d) => {
                const schedule = vehicle.vehicle_schedule?.find((s) => {
                  const start = s.startDate.split("T")[0];
                  const end = s.endDate.split("T")[0];

                  return d >= start && d <= end;
                });

                return (
                  <div key={d} className="border-r p-2">
                    {schedule && schedule.status !== "AVAILABLE" && (
                      <div
                        className={`${StatusColor(schedule.status)} whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold`}
                      >
                        {schedule.status}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
