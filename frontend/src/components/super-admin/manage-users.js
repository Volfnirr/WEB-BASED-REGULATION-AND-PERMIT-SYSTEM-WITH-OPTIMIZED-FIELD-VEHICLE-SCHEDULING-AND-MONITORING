"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import AddUser from "../ui/modal/super-admin/add-user";
import SuperAdminTable from "../ui/tables/super-admin/manage-users/manage-users-table";

export default function ManageUsersUI({ data = [] }) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    { head: "Name", data: "name" },
    { head: "Email", data: "email" },
    { head: "Role", data: "role" },
    { head: "Status", data: "status" },
  ];

  const {
    search,
    updateSearch,
    filters,
    updateFilter,
    sortConfig,
    updateSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    paginatedData,
    itemsPerPage,
  } = useDataTable({
    data: Array.isArray(data) ? data : [],
    searchableFields: ["name", "email"],
    itemsPerPage: 8,
  });

  const roleOptions = [
    "USER",
    "APPLICATION_ADMIN",
    "VEHICLE_ADMIN",
    "SUPER_ADMIN",
  ];
  const sortOptions = [
    { label: "Name", key: "name" },
    { label: "Date Created", key: "createdAt" },
  ];

  return (
    <div className="w-full min-w-0 space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
            Administration
          </p>
          <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.02em] text-[#172033]">
            Manage Users
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-5 text-[#64748B]">
            View and manage all registered users.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="inline-flex cursor-pointer h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#005221] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#06451F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005221] focus-visible:ring-offset-2"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add User
        </button>
      </div>

      <section
        aria-labelledby="users-table-title"
        className="min-w-0 overflow-hidden rounded-lg border border-[#E1E5E9] bg-white"
      >
        <div className="flex flex-col gap-4 border-b border-[#E1E5E9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2
              id="users-table-title"
              className="text-sm font-semibold text-[#172033]"
            >
              All users
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#64748B]">
              Search, filter, and manage registered accounts.
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(132px,auto)_minmax(132px,auto)] lg:w-[min(100%,620px)]">
            <SearchInput
              value={search}
              onChange={updateSearch}
              placeholder="Search users"
              className="min-w-0"
              inputClassName="h-9 rounded-md border-[#DCE2E8] pl-9 focus-visible:ring-[#005221]/25"
            />
            <FilterDropdown
              value={filters.role}
              onChange={(value) => updateFilter("role", value)}
              options={roleOptions}
              label="Roles"
              className="min-w-0"
              triggerClassName="h-9 rounded-md border-[#DCE2E8]"
            />
            <SortDropdown
              sortConfig={sortConfig}
              onSort={updateSort}
              options={sortOptions}
              className="min-w-0"
              triggerClassName="h-9 rounded-md border-[#DCE2E8]"
            />
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <SuperAdminTable columns={columns} rows={paginatedData} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          className="m-0 rounded-none border-0 border-t border-[#E1E5E9] px-5 py-3 text-xs"
        />
      </section>

      {isAddUserOpen && (
        <AddUser
          open={isAddUserOpen}
          onClose={() => {
            setIsAddUserOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </div>
  );
}
