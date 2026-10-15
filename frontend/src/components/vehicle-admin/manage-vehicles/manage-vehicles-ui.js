"use client";

import Image from "next/image";
import { useState } from "react";
import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import {
  Plus,
  IdCard,
  Fuel,
  Users,
  CalendarDays,
  Pencil,
  Trash,
  CarFront,
  CircleCheck,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteModal from "@/components/ui/modal/delete";
import AddEditVehicleModal from "@/components/ui/modal/addEditVehicle";
import Title from "@/components/ui/title";
import { localDateTime } from "@/lib/local-date";
import VehicleMaintenance from "@/components/ui/modal/vehicle/set-vehicle-maintenance";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageVehicleUI({ children, initialData }) {
  // const [data, setData] = useState(initialData);

  const [isVehicleMaintenanceOpen, setIsVehicleMaintenanceOpen] =
    useState(false);

  const [isAddEditVehicleOpen, setisAddEditVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // useEffect(() => {
  //   setData(initialData);
  // }, [initialData]);

  function openVehicleMaintenance(id) {
    const vehicle = initialData.find((d) => d.id === id);

    setSelectedVehicle(vehicle);
    setIsVehicleMaintenanceOpen(true);
  }

  function openVehicleEdit(id) {
    const vehicle = initialData.find((d) => d.id === id);

    setSelectedVehicle(vehicle);
    setisAddEditVehicleOpen(true);
  }

  // const data = [
  //   {
  //     id: "1",
  //     brand: "Ford",
  //     model: "Ranger",
  //     imageUrl: "/vehicles/ford_ranger.png",
  //     plateNumber: "ABCD-1234",
  //     fuelType: "Diesel",
  //     seatCapacity: "6",
  //     lastMaintenance: "2025-06-06",
  //   },
  //   {
  //     id: "2",
  //     brand: "Mitsubishi",
  //     model: "Triton",
  //     imageUrl: "/vehicles/mitsubishi_triton.png",
  //     plateNumber: "ABCD-5678",
  //     fuelType: "Diesel",
  //     seatCapacity: "6",
  //     lastMaintenance: "2025-06-07",
  //   },
  //   {
  //     id: "3",
  //     brand: "Toyota",
  //     model: "Hiace",
  //     imageUrl: "/vehicles/toyota_hiace.png",
  //     plateNumber: "ABCD-8976",
  //     fuelType: "Diesel",
  //     seatCapacity: "6",
  //     lastMaintenance: "2025-06-08",
  //   },
  // ];

  // {
  //   label: "New Applications",
  //   total: status.today.newApplications ?? "-",
  //   icon: <FilePlus2 />,
  //   bg: "bg-blue-100 text-blue-600",
  //   mainBg: "bg-blue-100",
  //   tooltip: "New applications today",
  // },
  // {
  //   label: "Unassigned",
  //   total: status.today.awaitingAssignment ?? "-",
  //   icon: <UserX />,
  //   bg: "bg-amber-100 text-amber-600",
  //   mainBg: "bg-amber-100",
  //   tooltip: "Applications awaiting assignment (all time)",
  // },

  // const vehiclesInfo = [
  //   {
  //     label: "All Vehicle",
  //     total: vehiclesData?.allVehicles ?? "-",
  //     icon: <CarFront />,
  //     bg: "bg-blue-100 text-blue-600",
  //     mainBg: "bg-blue-100",
  //     tooltip: "All Vehicles",
  //   },
  //   {
  //     label: "New Vehicles",
  //     total: vehiclesData?.newVehicles ?? "-",
  //     icon: <CircleCheck />,
  //     bg: "bg-green-100 text-green-600",
  //     mainBg: "bg-green-100",
  //     tooltip: "New vehicles in the past 7 days",
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
    data: initialData,
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

  const sortOptions = [
    { label: "Updated at", key: "updatedAt" },
    { label: "Created at", key: "createdAt" },
  ];

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div className="mb-2 flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
        <Title
          title="Manage"
          title2="Vehicles"
          description="View and manage all vehicles."
        />

        <button
          onClick={() => setisAddEditVehicleOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#4DAA74] px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-[#428f63]"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {children}

      <div className="flex w-full min-w-0 flex-col gap-2">
        <div className="rounded-lg border border-[#E1E5E9] bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#172033]">
                All vehicles
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Search, filter, and manage registered vehicles.
              </p>
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(220px,1fr)_165px_165px] lg:w-[min(100%,775px)]">
              <SearchInput
                value={search}
                onChange={updateSearch}
                placeholder="Search vehicles"
                className="w-full min-w-0"
              />

              <FilterDropdown
                value={filters.fuelType}
                onChange={(value) => updateFilter("fuelType", value)}
                options={roleOptions}
                label="All Fuel Types"
                className="w-full min-w-0"
              />

              <SortDropdown
                sortConfig={sortConfig}
                onSort={updateSort}
                options={sortOptions}
                className="w-full min-w-0"
              />
            </div>
          </div>
        </div>

        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CarFront className="mb-3 h-10 w-10 text-gray-300" />

            <p className="font-medium text-gray-500">No vehicles available</p>

            <p className="text-sm text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((d) => (
              <div
                key={d?.id}
                className="flex w-full flex-col rounded-lg bg-[#4DAA74] pb-1"
              >
                <div className="flex h-56 w-full justify-center">
                  <Image
                    src={d?.imageUrl}
                    alt={`${d?.brand} ${d?.model}`}
                    width={280}
                    height={250}
                    className="h-auto w-full rounded-t-md bg-white object-contain drop-shadow-md"
                  />
                </div>

                <div className="flex-col justify-center px-2 py-2">
                  <span className="flex justify-center px-2 py-1 text-lg font-bold text-white">
                    {d?.brand} {d?.model}
                  </span>

                  <div className="mb-2 flex flex-row flex-wrap items-center justify-center gap-2 rounded-md border border-green-200 bg-green-50 px-0.5 py-2.5 text-sm font-medium text-green-900 shadow-sm">
                    <span className="flex flex-row items-center gap-1.5 border-r-3 border-green-300 pr-2 text-xs md:text-sm">
                      <IdCard className="h-4 w-4 text-green-700" />
                      {d?.plateNumber}
                    </span>

                    <span className="flex flex-row items-center gap-1.5 border-r-3 border-green-300 pr-2 text-xs md:text-sm">
                      <Fuel className="h-4 w-4 text-green-700" />
                      {d?.fuelType}
                    </span>

                    <span className="flex flex-row items-center gap-1.5 text-xs md:text-sm">
                      <Users className="h-4 w-4 text-green-700" />
                      {d?.seatCapacity}
                    </span>
                  </div>

                  <div className="flex w-full flex-col gap-2 pb-2">
                    <div className="flex w-full items-center text-xs text-white">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>Last Maintenance:</span>
                      </div>

                      <span className="ml-auto whitespace-nowrap">
                        {d?.lastMaintenanceDate
                          ? localDateTime(d?.lastMaintenanceDate)
                          : "-"}
                      </span>
                    </div>

                    <div className="flex w-full items-center text-xs text-white">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>Registration Date:</span>
                      </div>

                      <span className="ml-auto whitespace-nowrap">
                        {d?.lastRegistrationDate
                          ? localDateTime(d?.lastRegistrationDate)
                          : "-"}
                      </span>
                    </div>

                    <div className="flex w-full items-center text-xs text-white">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>Registration Expiration:</span>
                      </div>

                      <span className="ml-auto whitespace-nowrap">
                        {d?.registrationExpiration
                          ? localDateTime(d?.registrationExpiration)
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-1 items-center justify-between">
                    <div className="flex min-h-10 w-full items-center justify-start gap-2">
                      <Button
                        onClick={() => {
                          setIsVehicleMaintenanceOpen(true);
                          openVehicleMaintenance(d.id);
                        }}
                        className="flex min-h-9 max-h-md flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-500 px-2 py-2 text-sm transition-colors duration-200 hover:bg-red-800"
                      >
                        <Wrench className="h-4 w-4 text-white" />
                        <span>Set Maintenance</span>
                      </Button>
                    </div>

                    <div className="flex min-h-15 w-full items-center justify-start gap-2 md:justify-end">
                      <Button
                        onClick={() => {
                          setisAddEditVehicleOpen(true);
                          openVehicleEdit(d.id);
                        }}
                        className="flex min-h-9 max-h-md flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-green-500 px-2 py-2 text-sm transition-colors duration-200 hover:bg-green-600"
                      >
                        <Pencil className="h-4 w-4 text-white" />
                        <span>Edit</span>
                      </Button>
                    </div>
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

        {isAddEditVehicleOpen && (
          <AddEditVehicleModal
            open={isAddEditVehicleOpen}
            onClose={() => {
              setisAddEditVehicleOpen(false);
              setSelectedVehicle(null);
            }}
            vehicle={selectedVehicle}
          />
        )}

        {isVehicleMaintenanceOpen && (
          <VehicleMaintenance
            isOpen={isVehicleMaintenanceOpen}
            onClose={() => {
              setIsVehicleMaintenanceOpen(false);
              setSelectedVehicle(null);
            }}
            vehicle={selectedVehicle}
          />
        )}
      </div>
    </div>
  );
}
