"use client";
import { useState } from "react";
import { localDate } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import Link from "next/link";
import AssignApplication from "@/components/ui/modal/applications/assign-confirm-modal";
import { useUser } from "@/lib/context/account-info-context";
import { useServices } from "@/lib/context/service-context";

export default function TableUI({ columns, rows, onEdit, page }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const { user } = useUser();
  const { assignedServices } = useServices();
  return (
    <div className=" overflow-hidden rounded-lg border lg:block">
      <table className="min-w-full border-collapse">
        <thead className="bg-white">
          <tr>
            {columns.map((column) => {
              return (
                <th
                  key={column.head}
                  className="border-b px-4 py-3 text-left text-sm font-bold text-green-700"
                >
                  {column.head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-gray-400"
              >
                No available data
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors border-b last:border-b-0 "
              >
                {columns.map((column) => (
                  <td
                    key={column.data}
                    className="border-b px-4 py-2 text-sm text-gray-900"
                  >
                    {column.data === "status" ? (
                      <span
                        className={`${StatusColor(row[column.data])} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm font-medium`}
                      >
                        {row[column.data]}
                      </span>
                    ) : column.data === "submittedAt" ? (
                      localDate(row[column.data])
                    ) : row[column.data] === "Assign" ? (
                      <button
                        onClick={() => setSelectedRow(row)}
                        className="bg-blue-500 cursor-pointer text-white inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Assign
                      </button>
                    ) : column.data === "action" ? (
                      page ? (
                        <Link
                          href={`${page}${row.id}`}
                          className="bg-blue-500 text-white inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          {row[column.data]}
                        </Link>
                      ) : (
                        <button
                          onClick={() => onEdit(row.id)}
                          className="bg-blue-500 text-white inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          {row[column.data]}
                        </button>
                      )
                    ) : (
                      row[column.data]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedRow && (
        <AssignApplication
          onClose={() => setSelectedRow(null)}
          refNo={selectedRow.referenceNo}
          accountName={selectedRow.userAccName}
          email={selectedRow.userAccEmail}
          serviceId={selectedRow.id}
          userName={user?.name}
          assignedRole={user?.role}
          assignedService={assignedServices?.name}
        />
      )}
    </div>
  );
}
