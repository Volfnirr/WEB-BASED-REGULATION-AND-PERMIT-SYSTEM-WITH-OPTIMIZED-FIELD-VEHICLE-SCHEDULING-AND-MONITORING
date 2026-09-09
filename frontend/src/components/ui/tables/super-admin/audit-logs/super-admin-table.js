"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { localDateTime } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import { FileSearchCorner } from "lucide-react";
import { useState } from "react";

export default function SuperAdminTable({ columns, rows, View }) {
  const [viewAuditLogs, setViewAuditLogs] = useState(null);

  return (
    <div className="bg-white rounded">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead className="text-green-700 font-bold" key={column.head}>
                {column.head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-gray-400"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileSearchCorner size={60} />
                  No log found
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <TableRow
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors border-b last:border-b-0 "
                key={row.logId}
              >
                {columns.map((column) => (
                  <TableCell className="text-sm" key={column.data}>
                    {column.data === "details" ? (
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <span className="block max-w-25 truncate">
                              {row[column.data]}
                            </span>
                          }
                        />
                        <TooltipContent>{row[column.data]}</TooltipContent>
                      </Tooltip>
                    ) : column.data === "VIEW" ? (
                      <button
                        onClick={() => setViewAuditLogs(row)}
                        className={`block cursor-pointer ${StatusColor(column.data)} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm transition-colors`}
                      >
                        VIEW
                      </button>
                    ) : column.data === "logDate" ? (
                      <span>{localDateTime(row[column.data])}</span>
                    ) : column.data === "target" || column.data === "action" ? (
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <span className="block max-w-50 truncate">
                              {row[column.data]}
                            </span>
                          }
                        />
                        <TooltipContent>{row[column.data]}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span>{row[column.data]}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {viewAuditLogs && View && (
        <View
          isOpen={!!viewAuditLogs}
          onClose={() => setViewAuditLogs(null)}
          data={viewAuditLogs}
        />
      )}
    </div>
  );
}
