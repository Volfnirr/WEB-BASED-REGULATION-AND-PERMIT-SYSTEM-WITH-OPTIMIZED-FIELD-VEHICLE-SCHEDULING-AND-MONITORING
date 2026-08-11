"use client";
import Table from "@/components/ui/tables/table";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import { useState } from "react";

export default function TreeCuttingTable({ initialData }) {
  const page = "/application-admin/tree-cutting/";
  const [data, setData] = useState(initialData);

  const column = [
    {
      head: "ID",
      data: "id",
    },
    {
      head: "REF-NO",
      data: "referenceNo",
    },
    {
      head: "Account Name",
      data: "userAccName",
    },
    {
      head: "Account Email",
      data: "userAccEmail",
    },
    {
      head: "Service Name",
      data: "serviceName",
    },
    {
      head: "Submission Date",
      data: "submittedAt",
    },
    {
      head: "Status",
      data: "status",
    },
    {
      head: "Action",
      data: "action",
    },
  ];

  // const data = [
  //   {
  //     id: "1",
  //     requester_name: "John Smith",
  //     email: "johnsmith@gmail.com",
  //     service_name: "Tree cutting permit",
  //     submission_date: "2026-07-09",
  //     status: "Accepted",
  //     action: "View",
  //   },
  //   {
  //     id: "2",
  //     requester_name: "Mia Cruz",
  //     email: "cruz@gmail.com",
  //     service_name: "Tree cutting permit",
  //     submission_date: "2026-07-10",
  //     status: "Rejected",
  //     action: "View",
  //   },
  //   {
  //     id: "3",
  //     requester_name: "Timothy Saph",
  //     email: "timothy@gmail.com",
  //     service_name: "Tree cutting permit",
  //     submission_date: "2026-07-11",
  //     status: "Pending",
  //     action: "View",
  //   },
  //   {
  //     id: "4",
  //     requester_name: "Roberto Ignacio",
  //     email: "robertoignacio@gmail.com",
  //     service_name: "Tree cutting permit",
  //     submission_date: "2026-07-12",
  //     status: "Pending",
  //     action: "View",
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
    searchableFields: [
      "requester_name",
      "status",
      "referenceNo",
      "submission_date",
    ],
    itemsPerPage: 8,
  });

  const roleOptions = ["PENDING", "REJECTED", "ACCEPTED"];

  const sortOptions = [
    { label: "Request ID", key: "referenceNo" },
    { label: "Name", key: "requester_name" },
    { label: "Submission Date", key: "submission_date" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by name or email..."
        />
        <FilterDropdown
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={roleOptions}
          label="Status"
        />
        <SortDropdown
          sortConfig={sortConfig}
          onSort={updateSort}
          options={sortOptions}
        />
      </div>

      <Table columns={column} rows={paginatedData} page={page} />

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
