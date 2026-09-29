"use client";
import { useState } from "react";
import { FileSearchCorner } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localDateFormat, localDateTime } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";

export default function TripsTable({ columns, rows, ViewTicket, EditTicket }) {
  const [viewingTrip, setViewingTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                className="text-green-700 font-bold whitespace-nowrap"
                key={column.head}
              >
                {column.head}
              </TableHead>
            ))}
            <TableHead className="text-green-700 font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length + 1}
                className="py-10 text-center text-sm text-gray-400"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileSearchCorner size={60} />
                  No trip tickets found
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                key={row.id}
              >
                {columns.map((column) => (
                  <TableCell className="text-sm" key={column.data}>
                    {column.data === "status" ? (
                      <span
                        className={`${StatusColor(row[column.data])} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm`}
                      >
                        {row[column.data]}
                      </span>
                    ) : column.data === "startDate" ||
                      column.data === "endDate" ? (
                      <div className="whitespace-nowrap">
                        {localDateFormat(row[column.data])}
                      </div>
                    ) : column.data === "createdAt" ? (
                      localDateTime(row[column.data])
                    ) : column.data === "purpose" ||
                      column.data === "placesToVisit" ||
                      column.data === "authorizedPassengers" ||
                      column.data === "driverName" ? (
                      <span className="block max-w-25 truncate">
                        {row[column.data]}
                      </span>
                    ) : (
                      <span>{row[column.data]}</span>
                    )}
                  </TableCell>
                ))}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="border border-gray-400"
                      render={<Button variant="outline">...</Button>}
                    />
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setViewingTrip(row)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingTrip(row)}>
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

      {viewingTrip && ViewTicket && (
        <ViewTicket
          isOpen={!!viewingTrip}
          onClose={() => setViewingTrip(null)}
          data={viewingTrip}
        />
      )}
      {editingTrip && EditTicket && (
        <EditTicket
          isOpen={!!editingTrip}
          onClose={() => setEditingTrip(null)}
          tripTicket={editingTrip}
        />
      )}
    </div>
  );
}
