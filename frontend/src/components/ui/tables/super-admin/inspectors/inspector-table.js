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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { localDateTime } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import { FileSearchCorner } from "lucide-react";
import { useState } from "react";

export default function InspectorTableUI({ columns, rows, View }) {
  const [viewAuditLogs, setViewAuditLogs] = useState(null);

  return (
    <div className="bg-white rounded">
      <Table className="rounded">
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
                  No users found
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <TableRow
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors border-b last:border-b-0"
                key={row.email}
              >
                {columns.map((column) => (
                  <TableCell
                    className="text-sm max-w-60 truncate"
                    key={column.data}
                  >
                    {column.data === "middleName" ||
                    column.data === "extensionName" ? (
                      <span>{row[column.data] ? row[column.data] : "N/A"}</span>
                    ) : column.data === "isAvailable" ? (
                      row[column.data] === true ? (
                        <span
                          className={`${StatusColor("AVAILABLE")} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm  transition-colors`}
                        >
                          AVAILABLE
                        </span>
                      ) : (
                        <span
                          className={`${StatusColor("NOT_AVAILABLE")} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm  transition-colors`}
                        >
                          NOT AVAILABLE
                        </span>
                      )
                    ) : column.data === "createdAt" ? (
                      <span>{localDateTime(row[column.data])}</span>
                    ) : (
                      <span>{row[column.data]}</span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="border border-gray-400 cursor-pointer"
                      render={<Button variant="outline">...</Button>}
                    />
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className=" cursor-pointer">
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* {viewAuditLogs && View && (
        <View
          isOpen={!!viewAuditLogs}
          onClose={() => setViewAuditLogs(null)}
          data={viewAuditLogs}
        />
      )} */}
    </div>
  );
}
