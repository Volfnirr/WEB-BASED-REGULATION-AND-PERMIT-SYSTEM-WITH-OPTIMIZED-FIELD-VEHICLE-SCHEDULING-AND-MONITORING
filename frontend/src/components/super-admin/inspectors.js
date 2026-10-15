"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddInspector from "../ui/modal/super-admin/inspectors/add-inspector";
import InspectorTableUI from "../ui/tables/super-admin/inspectors/inspector-table";
import SearchInput from "@/components/ui/tables/tools/search-input";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";

export default function InspectorsUI({ data = [] }) {
  const [isAddInspectorsOpen, setIsAddInspectorsOpen] = useState(false);

  const columns = [
    {
      head: "Email",
      data: "email",
    },
    {
      head: "First Name",
      data: "firstName",
    },
    {
      head: "Middle Name",
      data: "middleName",
    },
    {
      head: "Last Name",
      data: "lastName",
    },
    {
      head: "Extension Name",
      data: "extensionName",
    },
    {
      head: "Available",
      data: "isAvailable",
    },
    {
      head: "Created",
      data: "createdAt",
    },
  ];

  const {
    search,
    updateSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    paginatedData,
    itemsPerPage,
  } = useDataTable({
    data: Array.isArray(data) ? data : [],
    searchableFields: ["email"],
    itemsPerPage: 8,
  });

  return (
    <div className="w-full min-w-0 space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
            Administration
          </p>

          <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.02em] text-[#172033]">
            Manage Inspectors
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-5 text-[#64748B]">
            Add and manage inspectors, including their availability status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddInspectorsOpen(true)}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#005221] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#06451F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005221] focus-visible:ring-offset-2"
        >
          <Plus className="size-4" />
          Add Inspector
        </button>
      </div>

      <section className="min-w-0 overflow-hidden rounded-lg border border-[#E1E5E9] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E1E5E9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[#172033]">
              All inspectors
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#64748B]">
              View inspector details and availability.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={updateSearch}
              placeholder="Search by email"
              className="min-w-0"
              inputClassName="h-9 rounded-md border-[#DCE2E8] pl-9 focus-visible:ring-[#005221]/25"
            />
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <InspectorTableUI columns={columns} rows={paginatedData} />
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

      {isAddInspectorsOpen && (
        <AddInspector
          open={isAddInspectorsOpen}
          onClose={() => {
            setIsAddInspectorsOpen(false);
          }}
        />
      )}
    </div>
  );
}
