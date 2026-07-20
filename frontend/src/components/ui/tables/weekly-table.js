import { getDayName } from "@/lib/date";
import { StatusColor } from "@/lib/status";

export default function VehicleSchedulesTableUI({ date, columns, rows, page }) {
  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg border">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="bg-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column.head}
                className="border-b px-4 py-3 text-left text-sm font-bold text-green-700"
              >
                {column.head}
              </th>
            ))}
            {date.map((d) => (
              <th
                key={d}
                className="border-b px-4 py-3 text-center text-sm font-bold text-green-700"
              >
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-green-700">
                    {getDayName(d)}
                  </span>
                  <span className="text-xs font-normal text-green-700">
                    ({d})
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + date.length}
                className="px-4 py-10 text-center text-sm text-gray-400"
              >
                No available data
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors border-b last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.data}
                    className="border-b px-4 py-2 text-sm text-gray-900"
                  >
                    {row[column.data]}
                  </td>
                ))}

                {date.map((d) => (
                  <td
                    key={d}
                    className="border-b px-4 py-2 text-center text-sm"
                  >
                    {(() => {
                      const schedule = row.vehicle_schedules?.find(
                        (s) => s.date === d,
                      );
                      const status = schedule?.status ?? "Available";

                      return (
                        <span
                          className={`${StatusColor(status)} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm font-medium`}
                        >
                          {status}
                        </span>
                      );
                    })()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
