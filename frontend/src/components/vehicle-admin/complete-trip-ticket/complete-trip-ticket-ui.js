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

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CompleteTripsTable({
  columns,
  rows,
  ViewTicket,
  EditTicket,
}) {
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
                  No completed trip tickets found
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
                    {column.data === "timeOfDeparture" ||
                    column.data === "timeOfArrivalBack" ? (
                      <div className="whitespace-nowrap">
                        {formatDateTime(row[column.data])}
                      </div>
                    ) : column.data === "approxDistanceTraveled" ? (
                      <span>
                        {row[column.data] != null
                          ? `${row[column.data]} km`
                          : "—"}
                      </span>
                    ) : column.data === "remarks" ||
                      column.data === "placesToVisit" ? (
                      <span className="block max-w-25 truncate">
                        {row[column.data] || "—"}
                      </span>
                    ) : (
                      <span>{row[column.data] ?? "—"}</span>
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
                        {EditTicket && (
                          <DropdownMenuItem
                            onClick={() => setEditingTrip(row)}
                          >
                            Edit
                          </DropdownMenuItem>
                        )}
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
          data={viewingTrip.raw}
        />
      )}
      {editingTrip && EditTicket && (
        <EditTicket
          isOpen={!!editingTrip}
          onClose={() => setEditingTrip(null)}
          tripTicket={editingTrip.raw}
        />
      )}
    </div>
  );
}