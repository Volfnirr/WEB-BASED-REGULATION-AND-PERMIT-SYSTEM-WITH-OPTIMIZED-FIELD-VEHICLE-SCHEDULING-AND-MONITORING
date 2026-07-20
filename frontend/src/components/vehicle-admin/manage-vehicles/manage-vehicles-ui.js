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
  Route,
  CirclePlus,
  CarFront,
  Wrench,
  CalendarCheck,
  CircleCheck,
} from "lucide-react";
import DeleteModal from "@/components/ui/modal/delete";
import AddEditVehicleModal from "@/components/ui/modal/addEditVehicle";
import Title from "@/components/ui/title";

export default function ManageVehicleUI() {
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const [isAddEditVehicleOpen, setisAddEditVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  function openVehicle(id) {
    const vehicle = data.find((d) => d.id === id);

    setSelectedVehicle(vehicle);
    setisDeleteOpen(true);
  }
  function openVehicleEdit(id) {
    const vehicle = data.find((d) => d.id === id);

    setSelectedVehicle(vehicle);
    setisAddEditVehicleOpen(true);
  }

  const data = [
    {
      id: "1",
      brand: "Ford",
      model: "Ranger",
      link: "/vehicles/ford_ranger.png",
      plateNo: "ABCD-1234",
      fuelType: "Diesel",
      seatCapacity: "6",
      lastMaintenance: "2025-06-06",
    },
    {
      id: "2",
      brand: "Mitsubishi",
      model: "Triton",
      link: "/vehicles/mitsubishi_triton.png",
      plateNo: "ABCD-5678",
      fuelType: "Diesel",
      seatCapacity: "6",
      lastMaintenance: "2025-06-07",
    },
    {
      id: "3",
      brand: "Toyota",
      model: "Hiace",
      link: "/vehicles/toyota_hiace.png",
      plateNo: "ABCD-8976",
      fuelType: "Diesel",
      seatCapacity: "6",
      lastMaintenance: "2025-06-08",
    },
  ];

  const vehicles_data = [
    {
      id: "1",
      icon: <CarFront />,
      label: "All Vehicle",
      total: "4",
      bg: "bg-blue-100 text-blue-600",
    },
    {
      id: "2",
      icon: <CircleCheck />,
      label: "New Vehicles",
      total: "2",
      bg: "bg-green-100 text-green-600",
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
    searchableFields: ["brand", "model", "seatCapacity", "fuelType", "plateNo"],
    itemsPerPage: 8,
  });

  const roleOptions = ["Diesel", "Gasoline", "Electric"];

  const sortOptions = [
    { label: "Brand", key: "brand" },
    { label: "Last Maintenance", key: "lastMaintenance" },
  ];

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <Title
          title="Manage"
          title2="Vehicles"
          description="View and manage all vehicles."
        />
        <button
          onClick={() => setisAddEditVehicleOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#4DAA74] px-4 py-2.5 text-white font-medium cursor-pointer hover:bg-[#428f63] transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      <InfoCardContainer title="Vehicles">
        {vehicles_data.map((d) => (
          <InfoCard
            key={d.id}
            icon={d.icon}
            label={d.label}
            total={d.total}
            bg={d.bg}
          />
        ))}
      </InfoCardContainer>

      <div className="flex flex-col gap-6">
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
                key={d.id}
                className="flex flex-col w-full rounded-lg pb-1 bg-[#4DAA74]"
              >
                <div className="flex justify-center w-full h-56">
                  <Image
                    src={d.link}
                    alt="Ford Ranger"
                    width={280}
                    height={250}
                    className="drop-shadow-md w-full rounded-t-md  h-auto object-contain bg-white"
                  />
                </div>
                <div className="px-2 py-2 flex-col justify-center">
                  <span className="flex justify-center font-bold text-lg px-2 py-1 text-white">
                    {d.brand} {d.model}
                  </span>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-2 px-0.5 py-2.5 rounded-md mb-2 bg-green-50 border border-green-200 shadow-sm text-sm font-medium text-green-900">
                    <span className="flex flex-row gap-1.5 items-center pr-2 border-r-3 border-green-300  text-xs md:text-sm">
                      <IdCard className="w-4 h-4 text-green-700" />
                      {d.plateNo}
                    </span>
                    <span className="flex flex-row gap-1.5 items-center pr-2 border-r-3 border-green-300 text-xs md:text-sm">
                      <Fuel className="w-4 h-4 text-green-700" /> {d.fuelType}
                    </span>
                    <span className="flex flex-row gap-1.5 items-center  text-xs md:text-sm">
                      <Users className="w-4 h-4 text-green-700" />{" "}
                      {d.seatCapacity}
                    </span>
                  </div>
                  <span className="flex items-center justify-center gap-2 mb-2 text-white text-xs">
                    <CalendarDays className="w-4 h-4 " />
                    Last Maintenance: {d.lastMaintenance}
                  </span>
                  <div className="flex items-center justify-between gap-2 text-white">
                    <button
                      onClick={() => openVehicle(d.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500 px-2 py-2 cursor-pointer  hover:bg-red-800 transition-colors duration-200"
                    >
                      <Trash className="h-4 w-4 text-white" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => {
                        setisAddEditVehicleOpen(true);
                        openVehicleEdit(d.id);
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 px-2 py-2 cursor-pointer  hover:bg-green-600 transition-colors duration-200"
                    >
                      <Pencil className="h-4 w-4 text-white" />
                      <span>Edit</span>
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

        {isDeleteOpen && (
          <DeleteModal
            data={selectedVehicle}
            onClose={() => setisDeleteOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
