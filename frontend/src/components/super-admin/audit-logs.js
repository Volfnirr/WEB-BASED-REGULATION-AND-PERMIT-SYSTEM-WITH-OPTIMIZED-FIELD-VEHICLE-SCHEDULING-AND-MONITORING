"use client";

import FilterDropdown from "../ui/tables/tools/dropdown";
import Pagination from "../ui/tables/tools/pagination";
import { useDataTable } from "../ui/tables/tools/data-table";
import SearchInput from "../ui/tables/tools/search-input";
import SuperAdminTable from "../ui/tables/super-admin/audit-logs/super-admin-table";
import AuditLogsView from "@/components/ui/modal/super-admin/view-audit-logs";
import SortDropdown from "../ui/tables/tools/sort-dropdown";

export default function AuditLogsUI({ data = [] }) {
  const columns = [
    {
      head: "Actor",
      data: "actorName",
    },
    {
      head: "Role",
      data: "actorRole",
    },
    {
      head: "User Action",
      data: "action",
    },
    {
      head: "Target",
      data: "target",
    },
    {
      head: "Details",
      data: "details",
    },
    {
      head: "Date",
      data: "logDate",
    },
    {
      head: "Action",
      data: "VIEW",
    },
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
    searchableFields: ["action", "actorRole", "actorName", "target", "details"],
    itemsPerPage: 8,
  });

  const roleOptions = [
    "USER",
    "APPLICATION_ADMIN",
    "VEHICLE_ADMIN",
    "SUPER_ADMIN",
  ];

  const sortOptions = [
    {
      label: "Date",
      key: "logDate",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-7">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
          Administration
        </p>

        <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.02em] text-[#172033]">
          Audit Logs
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-5 text-[#64748B]">
          Review a detailed history of user actions and system events.
        </p>
      </div>

      <section className="min-w-0 overflow-hidden rounded-lg border border-[#E1E5E9] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E1E5E9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2
              id="audit-table-title"
              className="text-sm font-semibold text-[#172033]"
            >
              All activity
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#64748B]">
              Search, filter, and review system activity.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(132px,auto)_minmax(132px,auto)] lg:w-[min(100%,620px)]">
            <SearchInput
              value={search}
              onChange={updateSearch}
              placeholder="Search logs"
              className="min-w-0"
              inputClassName="h-9 rounded-md border-[#DCE2E8] pl-9 focus-visible:ring-[#005221]/25"
            />

            <FilterDropdown
              value={filters.actorRole}
              onChange={(value) => updateFilter("actorRole", value)}
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
          <SuperAdminTable
            columns={columns}
            rows={paginatedData}
            View={AuditLogsView}
          />
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
    </div>
  );
}
