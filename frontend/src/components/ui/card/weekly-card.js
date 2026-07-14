import { StatusColor } from "@/lib/status";
import { getDayName } from "@/lib/date";
export default function WeeklyScheduleCardInfo({ name, dates, schedules }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm mb-2 lg:hidden">
      <div className="border-b px-4 py-3 font-semibold">{name}</div>

      <div className="divide-y">
        {dates.map((day) => {
          const schedule = schedules.find((s) => s.date === day);
          const status = schedule?.status ?? "Available";

          return (
            <div
              key={day}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="font-medium">{getDayName(day)}</p>
                <p className="text-xs text-gray-500">{day}</p>
              </div>

              <span
                className={`${StatusColor(
                  status,
                )} inline-flex rounded-md px-3 py-1 text-xs font-semibold text-white`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
