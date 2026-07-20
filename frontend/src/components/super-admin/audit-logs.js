"use client";

import TableUI from "../ui/tables/table";
import Title from "../ui/title";
import FilterDropdown from "../ui/tables/tools/dropdown";
import Pagination from "../ui/tables/tools/pagination";
import { useDataTable } from "../ui/tables/tools/data-table";
import SortDropdown from "../ui/tables/tools/sort-dropdown";
import SearchInput from "../ui/tables/tools/search-input";

export default function AuditLogsUI() {
  const column = [
    {
      head: "Log ID",
      data: "id",
    },
    {
      head: "Date",
      data: "date",
    },
    {
      head: "Actor",
      data: "actor",
    },
    {
      head: "Role",
      data: "role",
    },
    {
      head: "Action",
      data: "actions",
    },
    {
      head: "Target",
      data: "target",
    },
    {
      head: "Details",
      data: "details",
    },
  ];

  const data = [
    {
      id: "1",
      date: "2026-07-01 09:15 AM",
      actor: "John Doe",
      role: "Applicant",
      actions: "Submitted",
      target: "AP-0001-2026",
      details: "Submitted a new application.",
    },
    {
      id: "2",
      date: "2026-07-02 11:20 AM",
      actor: "Jane Smith",
      role: "ApplicationAdmin",
      actions: "Reviewed",
      target: "AP-0001-2026",
      details: "Reviewed the submitted application.",
    },
    {
      id: "3",
      date: "2026-07-03 11:25 AM",
      actor: "Jane Smith",
      role: "ApplicationAdmin",
      actions: "Rejected",
      target: "AP-0001-2026",
      details: "Rejected the submitted application.",
    },
    {
      id: "4",
      date: "2026-07-04 08:45 AM",
      actor: "Michael Brown",
      role: "VehicleAdmin",
      actions: "Updated",
      target: "VHC-0001-2026",
      details: "Updated vehicle information.",
    },
    {
      id: "5",
      date: "2026-07-05 03:30 PM",
      actor: "Emily Davis",
      role: "SuperAdmin",
      actions: "Created",
      target: "NU-0001-2026",
      details: "Created a new user account.",
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
    data,
    searchableFields: ["actor", "target"],
    itemsPerPage: 8,
  });

  const roleOptions = [
    "Applicant",
    "ApplicantAdmin",
    "VehicleAdmin",
    "SuperAdmin",
  ];

  const sortOptions = [
    { label: "Actor", key: "actor" },
    { label: "Date Created", key: "date" },
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
          placeholder="Search by actor or target..."
        />
        <FilterDropdown
          value={filters.role}
          onChange={(value) => updateFilter("role", value)}
          options={roleOptions}
          label="Roles"
        />
        <SortDropdown
          sortConfig={sortConfig}
          onSort={updateSort}
          options={sortOptions}
        />
      </div>
      <div>
        <TableUI columns={column} rows={paginatedData} />
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
