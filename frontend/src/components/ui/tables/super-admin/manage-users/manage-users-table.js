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
import EditUser from "@/components/ui/modal/super-admin/actions/edit-user";
import BanUser from "@/components/ui/modal/super-admin/actions/ban-user";
import UnBanUser from "@/components/ui/modal/super-admin/actions/unban-user";
import ChangeUserPassword from "@/components/ui/modal/super-admin/actions/change-pass-user";
import SetUserRole from "@/components/ui/modal/super-admin/actions/change-role-user";

export default function SuperAdminTable({ columns, rows, View }) {
  const [viewAuditLogs, setViewAuditLogs] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBanUser, setSelectedBanUser] = useState(null);
  const [selectedUnBanUser, setSelectedUnBanUser] = useState(null);
  const [selectedPasswordUser, setSelectedPasswordUser] = useState(null);
  const [selectedRoleUser, setSelectedRoleUser] = useState(null);
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
                  No users found
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <TableRow
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors border-b last:border-b-0 "
                key={row.email}
              >
                {columns.map((column) => (
                  <TableCell className="text-sm " key={column.data}>
                    {column.data === "createdAt" ||
                    column.data === "updatedAt" ? (
                      <span>{localDateTime(row[column.data])}</span>
                    ) : column.data === "email" || column.data === "name" ? (
                      <span className="block max-w-60 truncate">
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
                        <DropdownMenuItem onClick={() => setSelectedUser(row)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRoleUser(row)}
                        >
                          Set User Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedPasswordUser(row)}
                        >
                          Set User Password
                        </DropdownMenuItem>
                        {row.role === "APPLICATION_ADMIN" ? (
                          <DropdownMenuItem>Assign Services</DropdownMenuItem>
                        ) : null}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSelectedBanUser(row)}
                        variant="destructive"
                      >
                        Ban User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedUnBanUser(row)}
                        variant="destructive"
                      >
                        Unban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
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
      {selectedUser && (
        <EditUser
          isOpen={!!selectedUser}
          userData={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {selectedBanUser && (
        <BanUser
          isOpen={!!selectedBanUser}
          userData={selectedBanUser}
          onClose={() => setSelectedBanUser(null)}
        />
      )}
      {selectedUnBanUser && (
        <UnBanUser
          isOpen={!!selectedUnBanUser}
          userData={selectedUnBanUser}
          onClose={() => setSelectedUnBanUser(null)}
        />
      )}
      {selectedPasswordUser && (
        <ChangeUserPassword
          isOpen={!!selectedPasswordUser}
          userData={selectedPasswordUser}
          onClose={() => setSelectedPasswordUser(null)}
        />
      )}
      {selectedRoleUser && (
        <SetUserRole
          isOpen={!!selectedRoleUser}
          userData={selectedRoleUser}
          onClose={() => setSelectedRoleUser(null)}
        />
      )}
    </div>
  );
}
