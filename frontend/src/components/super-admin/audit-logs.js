"use client";

import TableUI from "../ui/tables/table";
import Title from "../ui/title";
import FilterDropdown from "../ui/tables/tools/dropdown";
import Pagination from "../ui/tables/tools/pagination";
import { useDataTable } from "../ui/tables/tools/data-table";
import SearchInput from "../ui/tables/tools/search-input";
import SuperAdminTable from "../ui/tables/super-admin/audit-logs/super-admin-table";
import AuditLogsView from "@/components/ui/modal/super-admin/view-audit-logs";
export default function AuditLogsUI({ data }) {
  const column = [
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

  // const data = [
  //   {
  //     id: "1",
  //     date: "2026-07-01 09:15 AM",
  //     actor: "John Doe",
  //     role: "Applicant",
  //     actions: "Submitted",
  //     target: "AP-0001-2026",
  //     details: "Submitted a new application.",
  //   },
  //   {
  //     id: "2",
  //     date: "2026-07-02 11:20 AM",
  //     actor: "Jane Smith",
  //     role: "ApplicationAdmin",
  //     actions: "Reviewed",
  //     target: "AP-0001-2026",
  //     details: "Reviewed the submitted application.",
  //   },
  //   {
  //     id: "3",
  //     date: "2026-07-03 11:25 AM",
  //     actor: "Jane Smith",
  //     role: "ApplicationAdmin",
  //     actions: "Rejected",
  //     target: "AP-0001-2026",
  //     details: "Rejected the submitted application.",
  //   },
  //   {
  //     id: "4",
  //     date: "2026-07-04 08:45 AM",
  //     actor: "Michael Brown",
  //     role: "VehicleAdmin",
  //     actions: "Updated",
  //     target: "VHC-0001-2026",
  //     details: "Updated vehicle information.",
  //   },
  //   {
  //     id: "5",
  //     date: "2026-07-05 03:30 PM",
  //     actor: "Emily Davis",
  //     role: "SuperAdmin",
  //     actions: "Created",
  //     target: "NU-0001-2026",
  //     details: "Created a new user account.",
  //   },
  // ];
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
    data,
    searchableFields: ["action", "actorRole", "actorName", "target"],
    itemsPerPage: 8,
  });

  const roleOptions = [
    "USER",
    "APPLICATION_ADMIN",
    "VEHICLE_ADMIN",
    "SUPER_ADMIN",
  ];

  return (
    <div>
      <Title
        title="Audit"
        title2="Logs"
        description="Review a detailed history of user actions and system events."
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by actor, action or target..."
        />
        <FilterDropdown
          value={filters.data}
          onChange={(value) => updateFilter("actorRole", value)}
          options={roleOptions}
          label="Roles"
        />
      </div>
      <div>
        {/* <TableUI columns={column} rows={paginatedData} /> */}
        <SuperAdminTable
          columns={column}
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
      />
    </div>
  );
}
