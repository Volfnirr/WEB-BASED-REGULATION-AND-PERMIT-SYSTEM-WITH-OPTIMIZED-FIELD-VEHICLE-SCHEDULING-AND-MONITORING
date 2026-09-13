"use client";
import { useState } from "react";
import Title from "../ui/title";
import { Plus } from "lucide-react";
import AddInspector from "../ui/modal/super-admin/inspectors/add-inspector";
import InspectorTableUI from "../ui/tables/super-admin/inspectors/inspector-table";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";

export default function InspectorsUI({ data }) {
  const [isAddInspectorsOpen, setIsAddInspectorsOpen] = useState(false);
  const column = [
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
    searchableFields: ["email"],
    itemsPerPage: 8,
  });

  return (
    <div>
      <div className="flex justify-between items-start flex-col md:flex-row md:items-center mb-2">
        <Title
          title="Manage"
          title2="Inspectors"
          description="Add and manage inspectors, including their availability status."
        />
        <button
          onClick={() => setIsAddInspectorsOpen(true)}
          className="flex items-center gap-1.5 text-sm whitespace-nowrap rounded-lg bg-[#4DAA74] px-4 py-2.5 text-white font-medium cursor-pointer hover:bg-[#428f63] transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Add new inspector
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by email..."
        />
        {/* <FilterDropdown
                  value={filters.role}
                  onChange={(value) => updateFilter("role", value)}
                  options={roleOptions}
                  label="Roles"
                />
                <SortDropdown
                  sortConfig={sortConfig}
                  onSort={updateSort}
                  options={sortOptions}
                /> */}
      </div>

      <InspectorTableUI columns={column} rows={paginatedData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />

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
