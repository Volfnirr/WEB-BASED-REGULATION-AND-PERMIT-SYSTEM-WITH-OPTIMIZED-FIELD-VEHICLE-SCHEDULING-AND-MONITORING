"use client";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import Image from "next/image";
import { useState } from "react";
import { IdCard, Fuel, Users, Check, CarFront } from "lucide-react";

export default function VehiclesList({ vehicles, onAssign }) {
  const [data, setData] = useState(vehicles);

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
      "brand",
      "model",
      "seatCapacity",
      "fuelType",
      "plateNumber",
    ],
    itemsPerPage: 8,
  });

  const roleOptions = ["DIESEL", "GASOLINE", "ELECTRIC"];

  const sortOptions = [{ label: "Brand", key: "brand" }];

  return (
    <div className="flex flex-col gap-2 border-3 border-green-800 rounded-md px-2 py-2">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by brand, model, seat capacity, fuel type or plate no..."
        />
        <FilterDropdown
          value={filters.fuelType}
          onChange={(value) => updateFilter("fuelType", value)}
          options={roleOptions}
          label="Fuel Type"
        />
        <SortDropdown
          sortConfig={sortConfig}
          onSort={updateSort}
          options={sortOptions}
        />
      </div>
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CarFront className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No vehicles available</p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {paginatedData.map((d) => (
            <div
              key={d?.id}
              className="flex flex-col w-full rounded-lg pb-1 bg-[#4DAA74]"
            >
              <div className="flex justify-center w-full h-56">
                <Image
                  src={d?.imageUrl}
                  alt={`${d?.brand} ${d?.model}`}
                  width={280}
                  height={250}
                  className="drop-shadow-md w-full rounded-t-md h-auto object-contain bg-white"
                />
              </div>

              <div className="px-2 py-2 flex-col justify-center">
                <span className="flex justify-center font-bold text-lg px-2 py-1 text-white">
                  {d?.brand} {d?.model}
                </span>

                <div className="flex flex-row flex-wrap items-center justify-center gap-2 px-0.5 py-2.5 rounded-md mb-2 bg-green-50 border border-green-200 shadow-sm text-sm font-medium text-green-900">
                  <span className="flex flex-row gap-1.5 items-center pr-2 border-r-3 border-green-300 text-xs md:text-sm">
                    <IdCard className="w-4 h-4 text-green-700" />
                    {d?.plateNumber}
                  </span>

                  <span className="flex flex-row gap-1.5 items-center pr-2 border-r-3 border-green-300 text-xs md:text-sm">
                    <Fuel className="w-4 h-4 text-green-700" />
                    {d?.fuelType}
                  </span>

                  <span className="flex flex-row gap-1.5 items-center text-xs md:text-sm">
                    <Users className="w-4 h-4 text-green-700" />
                    {d?.seatCapacity}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-white">
                  <button
                    type="button"
                    onClick={() => onAssign(d)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-500 px-2 py-2 cursor-pointer hover:bg-green-600 transition-colors duration-200"
                  >
                    <Check className="h-4 w-4 text-white" />
                    <span>Assign</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
