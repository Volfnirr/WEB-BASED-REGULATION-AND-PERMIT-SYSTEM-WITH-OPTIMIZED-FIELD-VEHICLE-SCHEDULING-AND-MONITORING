"use client";
import { useState } from "react";
import { localDateTime } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import Link from "next/link";
import AssignApplication from "@/components/ui/modal/applications/assign-confirm-modal";
import { useUser } from "@/lib/context/account-info-context";
import { useServices } from "@/lib/context/service-context";
import { FileExclamationPoint } from "lucide-react";

export default function TableUI({ columns, rows }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const { user } = useUser();
  const { assignedServices } = useServices();
  return (
    <div className="overflow-x-auto rounded-lg border lg:block">
      <table className="min-w-full border-collapse ">
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
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileExclamationPoint size={60} />
                  No available applications
                </div>
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
                        className={`${StatusColor(row[column.data])} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm `}
                      >
                        {row[column.data]}
                      </span>
                    ) : column.data === "submittedAt" ? (
                      localDateTime(row[column.data])
                    ) : row[column.data] === "VIEW" ? (
                      <Link
                        href={`${row.page}`}
                        className={`${StatusColor(row[column.data])} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm  transition-colors`}
                      >
                        {row[column.data]}
                      </Link>
                    ) : row[column.data] === "SELF_ASSIGN" ? (
                      <button
                        onClick={() => setSelectedRow(row)}
                        className={`${StatusColor(row[column.data])} inline-flex h-7 min-w-2.5 items-center justify-center rounded-md px-3 text-sm  cursor-pointer  transition-colors`}
                      >
                        SELF ASSIGN
                      </button>
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
          assignedService={
            assignedServices?.services?.find(
              (s) => s.service.name === selectedRow.serviceName,
            )?.service?.name
          }
        />
      )}
    </div>
  );
}
