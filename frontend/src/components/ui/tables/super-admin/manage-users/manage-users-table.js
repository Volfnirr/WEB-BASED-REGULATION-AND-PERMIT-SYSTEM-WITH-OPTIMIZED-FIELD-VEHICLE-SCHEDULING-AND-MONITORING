"use client";

import { useState } from "react";
import { FileSearchCorner, MoreHorizontal } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditUser from "@/components/ui/modal/super-admin/actions/edit-user";
import BanUser from "@/components/ui/modal/super-admin/actions/ban-user";
import UnBanUser from "@/components/ui/modal/super-admin/actions/unban-user";
import ChangeUserPassword from "@/components/ui/modal/super-admin/actions/change-pass-user";
import SetUserRole from "@/components/ui/modal/super-admin/actions/change-role-user";

const roleLabels = {
  USER: "User",
  APPLICATION_ADMIN: "Application Admin",
  VEHICLE_ADMIN: "Vehicle Admin",
  SUPER_ADMIN: "Super Admin",
};

function getUserStatus(user) {
  const banHasExpired =
    user.banExpires && new Date(user.banExpires).getTime() <= Date.now();
  return user.banned && !banHasExpired ? "BANNED" : "ACTIVE";
}

function getRoleLabel(role) {
  return roleLabels[role] || role || "—";
}

export default function SuperAdminTable({ columns, rows = [] }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBanUser, setSelectedBanUser] = useState(null);
  const [selectedUnBanUser, setSelectedUnBanUser] = useState(null);
  const [selectedPasswordUser, setSelectedPasswordUser] = useState(null);
  const [selectedRoleUser, setSelectedRoleUser] = useState(null);

  return (
    <>
      <Table className="min-w-[700px] border-collapse">
        <TableHeader>
          <TableRow className="h-10 bg-[#FAFBFC] hover:bg-[#FAFBFC]">
            {columns.map((column) => (
              <TableHead
                className="h-10 px-5 text-xs font-semibold text-[#52657D]"
                key={column.head}
              >
                {column.head}
              </TableHead>
            ))}
            <TableHead className="h-10 w-16 px-5 text-right text-xs font-semibold text-[#52657D]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length + 1} className="h-52 px-5">
                <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-[#64748B]">
                  <FileSearchCorner
                    aria-hidden="true"
                    className="size-9 text-[#94A3B8]"
                  />
                  <span className="font-medium text-[#334155]">
                    No users found
                  </span>
                  <span className="text-xs">
                    Try another search or role filter.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const status = getUserStatus(row);
              const isBanned = status === "BANNED";

              return (
                <TableRow
                  className="h-[58px] border-b border-[#E8EBEF] bg-white transition-colors hover:bg-[#F8FAF9]"
                  key={row.id || row.email}
                >
                  {columns.map((column) => {
                    let value = row[column.data];
                    if (column.data === "role") value = getRoleLabel(value);
                    if (column.data === "status") value = status;

                    return (
                      <TableCell
                        className="max-w-0 px-5 py-3 text-sm text-[#334155]"
                        key={column.data}
                      >
                        {column.data === "name" ? (
                          <span className="block truncate font-medium text-[#172033]">
                            {value || "—"}
                          </span>
                        ) : column.data === "email" ? (
                          <span className="block truncate text-[#52657D]">
                            {value || "—"}
                          </span>
                        ) : column.data === "status" ? (
                          <span
                            className={`inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-bold ${
                              isBanned
                                ? "bg-[#FFF2E6] text-[#8A4B0F]"
                                : "bg-[#E8F3EC] text-[#17653A]"
                            }`}
                          >
                            {value}
                          </span>
                        ) : (
                          <span className="block truncate">{value || "—"}</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="px-4 py-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${row.name || row.email}`}
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-[#52657D] hover:bg-[#F1F5F9] hover:text-[#172033]"
                          />
                        }
                      >
                        <MoreHorizontal aria-hidden="true" className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Manage user</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setSelectedUser(row)}
                          >
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedRoleUser(row)}
                          >
                            Change role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedPasswordUser(row)}
                          >
                            Set password
                          </DropdownMenuItem>
                          {row.role === "APPLICATION_ADMIN" && (
                            <DropdownMenuItem>Assign services</DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        {isBanned ? (
                          <DropdownMenuItem
                            onClick={() => setSelectedUnBanUser(row)}
                            className="text-[#17653A] focus:text-[#17653A]"
                          >
                            Unban user
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => setSelectedBanUser(row)}
                            variant="destructive"
                          >
                            Ban user
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

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
    </>
  );
}
