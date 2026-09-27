"use client";
import { useState } from "react";
import Link from "next/link";
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
import { localDateTime, localDateFormat } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import AssignApplication from "@/components/ui/modal/applications/assign-confirm-modal";
import { useUser } from "@/lib/context/account-info-context";
import { useServices } from "@/lib/context/service-context";

export default function TableUI({ columns, rows, ViewTicket, EditTicket }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewingTrip, setViewingTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  const { user } = useUser();
  const { assignedServices } = useServices();

  const hasView = columns.some((c) => c.data === "VIEW");
  const hasEdit = columns.some((c) => c.data === "EDIT");

  const isSelfAssign = (row) =>
    columns.some((c) => row[c.data] === "SELF_ASSIGN");
  const hasSelfAssign = rows.some(isSelfAssign);

  const hasActions = hasView || hasEdit || hasSelfAssign;

  const dataColumns = columns.filter(
    (c) =>
      c.data !== "VIEW" &&
      c.data !== "EDIT" &&
      !rows.some((r) => r[c.data] === "SELF_ASSIGN"),
  );

  const colSpan = dataColumns.length + (hasActions ? 1 : 0);

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {dataColumns.map((column) => (
              <TableHead
                className="text-green-700 font-bold whitespace-nowrap"
                key={column.head}
              >
                {column.head}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="text-green-700 font-bold">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={colSpan}
                className="py-10 text-center text-sm text-gray-400"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileSearchCorner size={60} />
                  No applications found
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors border-b last:border-b-0"
                key={row.id}
              >
                {dataColumns.map((column) => (
                  <TableCell className="text-sm" key={column.data}>
                    {column.data === "status" ? (
                      <span
                        className={`${StatusColor(row[column.data])} inline-flex h-7 min-w-22.5 items-center justify-center rounded-md px-3 text-sm`}
                      >
                        {row[column.data]}
                      </span>
                    ) : column.data === "submittedAt" ||
                      column.data === "reviewedAt" ? (
                      localDateTime(row[column.data])
                    ) : column.data === "startDate" ||
                      column.data === "endDate" ? (
                      <div className="whitespace-nowrap">
                        {localDateFormat(row[column.data])}
                      </div>
                    ) : column.data === "purpose" ||
                      column.data === "placesToVisit" ||
                      column.data === "authorizedPassengers" ||
                      column.data === "driverName" ? (
                      <span className="block max-w-25 truncate">
                        {row[column.data]}
                      </span>
                    ) : column.data === "userAccName" ||
                      column.data === "userAccEmail" ? (
                      <span className="block max-w-40 truncate">
                        {row[column.data]}
                      </span>
                    ) : (
                      <span>{row[column.data]}</span>
                    )}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="border border-gray-400"
                        render={<Button variant="outline">...</Button>}
                      />
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          {hasView &&
                            (ViewTicket ? (
                              <DropdownMenuItem
                                onClick={() => setViewingTrip(row)}
                              >
                                View
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                render={<Link href={`${row.page}`} />}
                              >
                                View
                              </DropdownMenuItem>
                            ))}

                          {hasEdit &&
                            (EditTicket ? (
                              <DropdownMenuItem
                                onClick={() => setEditingTrip(row)}
                              >
                                Edit
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                render={<Link href={`${row.page}`} />}
                              >
                                Edit
                              </DropdownMenuItem>
                            ))}

                          {isSelfAssign(row) && (
                            <DropdownMenuItem
                              onClick={() => setSelectedRow(row)}
                            >
                              Self Assign
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
