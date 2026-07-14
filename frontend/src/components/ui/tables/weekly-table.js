import { getDayName } from "@/lib/date";
import { StatusColor } from "@/lib/status";
export default function VehicleSchedulesTableUI({ date, columns, rows, page }) {
  console.log(rows);
  const a = rows[0].vehicle_schedules;
  console.log(a);
  console.log(date);
  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg border">
      <table className="min-w-full border-collapse">
        <thead className="bg-white">
          <tr>
            {columns.map((column) => {
              return (
                <th
                  key={column.head}
                  className="border-b px-4 py-2 text-left font-semibold"
                >
                  {column.head}
                </th>
              );
            })}
            {date.map((d) => {
              return (
                <th
                  key={d}
                  className="border-b px-4 py-2 text-center text-sm font-semibold"
                >
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold text-gray-800">
                      {getDayName(d)}
                    </span>
                    <span className="text-xs text-gray-500">{d}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.data} className="border-b px-4 py-2">
                  {row[column.data]}
                </td>
              ))}

              {date.map((date) => (
                <td key={date} className="border-b px-4 py-2">
                  {(() => {
                    const schedule = row.vehicle_schedules.find(
                      (s) => s.date === date,
                    );
                    const status = schedule?.status ?? "Available";

                    return (
                      <span
                        className={`${StatusColor(status)} text-white px-2 py-1 rounded`}
                      >
                        {status}
                      </span>
                    );
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
