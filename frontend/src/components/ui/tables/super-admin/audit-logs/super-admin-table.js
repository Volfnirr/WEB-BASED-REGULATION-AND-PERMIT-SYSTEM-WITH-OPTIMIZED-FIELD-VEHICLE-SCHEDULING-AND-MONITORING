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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SuperAdminTable({ columns, rows, View }) {
  const [viewAuditLogs, setViewAuditLogs] = useState(null);

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <Table className="min-w-[960px]">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                className="h-11 px-4 text-xs font-semibold text-[#52657D]"
                key={column.head}
              >
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
                className="bg-white transition-colors hover:bg-[#F8FAF9] border-b border-[#E8EBEF] last:border-b-0"
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
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="cursor-pointer border border-gray-400"
                          render={<Button variant="outline">...</Button>}
                        />
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setViewAuditLogs(row)}
                            >
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
