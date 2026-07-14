import { StatusColor } from "@/lib/status";
import Link from "next/link";
export default function TableUI({ columns, rows, page }) {
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
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.data} className="border-b px-4 py-2">
                  {column.data === "status" ? (
                    <span
                      className={`${StatusColor(row[column.data])} text-black font-semibold px-2 py-1 rounded`}
                    >
                      {row[column.data]}
                    </span>
                  ) : column.data === "action" ? (
                    <Link
                      href={`${page + row.id}`}
                      className="bg-blue-500 font-semibold px-2 py-1 rounded hover:bg-blue-400"
                    >
                      View
                    </Link>
                  ) : (
                    row[column.data]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
