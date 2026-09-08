"use client";
import Table from "@/components/ui/tables/table";
import ScheduleCardInfo from "@/components/ui/card/card";
import CardContainer from "@/components/ui/card/card-container";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import { useState } from "react";
import TripTicketView from "@/components/ui/modal/trip-ticket/trip-ticket-view";
import TripTicketModal from "@/components/ui/modal/trip-ticket/trip-ticket";
export default function TripApplicationTable({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const column = [
    {
      head: "Trip Ticket No.",
      data: "tripTicketNo",
    },
    {
      head: "Authorized Passenger",
      data: "authorizedPassengers",
    },
    {
      head: "Driver Name",
      data: "driverName",
    },
    {
      head: "Vehicle Plate no.",
      data: "plateNumber",
    },
    {
      head: "Place",
      data: "placesToVisit",
    },
    {
      head: "Departure Date",
      data: "startDate",
    },
    {
      head: "Purpose",
      data: "purpose",
    },
    {
      head: "View",
      data: "view",
    },
    {
      head: "Edit",
      data: "edit",
    },
  ];

  // const data = [
  //   {
  //     id: "1",
  //     passengerName: "John Smith",
  //     driver: "Adam Cruz",
  //     plateNo: "SJJ475",
  //     place: "Angeles,Arayat & Sta rita,Pampanga",
  //     date: "2026-07-09",
  //     purpose: "To attend meeting re DOTR's concern ",
  //   },
  //   {
  //     id: "2",
  //     passengerName: "John Doe",
  //     driver: "John Wick",
  //     plateNo: "SPP365",
  //     place: "Angeles,Arayat & Sta rita,Pampanga",
  //     date: "2026-07-10",
  //     purpose: "Land Inspection",
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
      "authorizedPassengers",
      "plateNumber",
      "driverName",
      "tripTicketNo",
    ],
    itemsPerPage: 8,
  });
  console.log("Paginated Data", paginatedData);
  const sortOptions = [
    { label: "Passenger Name", key: "authorizedPassengers" },
    { label: "Date", key: "startDate" },
  ];
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by name, plate no, driver..."
        />
        <SortDropdown
          sortConfig={sortConfig}
          onSort={updateSort}
          options={sortOptions}
        />
      </div>
      <Table
        columns={column}
        rows={paginatedData}
        ViewTicket={TripTicketView}
        EditTicket={TripTicketModal}
      />
      <CardContainer title="Pending Applications">
        {paginatedData.map((data) => {
          return (
            <ScheduleCardInfo
              key={data.id}
              reqid={data.id}
              name={data.passengerName}
              driverName={data.driver}
              plateNo={data.plateNo}
              place={data.place}
              date={data.date}
              purpose={data.purpose}
            />
          );
        })}
      </CardContainer>
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
