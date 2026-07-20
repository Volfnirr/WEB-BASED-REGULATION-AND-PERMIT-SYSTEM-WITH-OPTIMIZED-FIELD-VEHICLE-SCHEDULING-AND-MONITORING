"use client";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import { StatusColor } from "@/lib/status";
export default function ApplicationStatusPage() {
  const data = [
    {
      id: "1",
      service: "Agricultural Free Patent",
      submission_date: "2026-07-01",
      status: "Accepted",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
    {
      id: "2",
      service: "Tree Cutting Permit",
      submission_date: "2026-07-02",
      status: "Rejected",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
    {
      id: "3",
      service: "Residential Free Patent",
      submission_date: "2026-07-03",
      status: "Accepted",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
    {
      id: "4",
      service: "Chainsaw Registration",
      submission_date: "2026-07-04",
      status: "Pending",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
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
    searchableFields: ["service", "status", "remarks"],
    itemsPerPage: 8,
  });

  const roleOptions = ["Pending", "Rejected", "Accepted"];

  const sortOptions = [
    { label: "Application Id", key: "id" },
    { label: "Service", key: "service" },
    { label: "Date Created", key: "submission_date" },
  ];

  return (
    <div>
      {/* Container */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by service, status or remarks..."
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
      <div className="flex flex-col gap-2">
        {paginatedData.map((d) => (
          <div
            key={d.id}
            className="flex flex-col gap-2  bg-white rounded-md px-5 py-5 text-black"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-md text-green-800">
                  {d.service}
                </span>
                <div className="flex flex-row items-center">
                  <span className="font-medium text-sm">{d.id}</span>
                  <span className="text-sm">•</span>
                  <span className="font-medium text-sm">
                    {d.submission_date}
                  </span>
                </div>
              </div>
              <span className={`${StatusColor(d.status)} rounded-sm px-2`}>
                {d.status}
              </span>
            </div>

            <hr />
            <span className="font-light text-sm">Remarks</span>
            <span>{d.remarks}</span>
          </div>
        ))}
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
