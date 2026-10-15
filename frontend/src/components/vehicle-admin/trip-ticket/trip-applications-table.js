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
import TripsTable from "./trip-table-ui";
import TableContainerUI from "@/components/ui/tables/table-container";

export default function TripApplicationTable({ initialData }) {
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
      head: "Created at",
      data: "createdAt",
    },
    {
      head: "Purpose",
      data: "purpose",
    },
    // {
    //   head: "View",
    //   data: "VIEW",
    // },
    // {
    //   head: "Edit",
    //   data: "EDIT",
    // },
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
    data: initialData,
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
    {
      label: "Passenger Name",
      key: "authorizedPassengers",
    },
    {
      label: "Date",
      key: "startDate",
    },
  ];

  return (
    <div className="w-full min-w-0">
      <TableContainerUI
        title="All trip tickets"
        description="Review trip assignments and scheduled journeys."
        toolbar={
          <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(132px,auto)] lg:w-[min(100%,520px)]">
            <SearchInput
              value={search}
              onChange={updateSearch}
              placeholder="Search by name, plate no, driver..."
              className="w-full sm:min-w-64"
            />

            <SortDropdown
              sortConfig={sortConfig}
              onSort={updateSort}
              options={sortOptions}
              className="w-full sm:w-40"
            />
          </div>
        }
        footer={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            className="m-0 rounded-none border-0 bg-transparent px-0 py-2 text-xs"
          />
        }
      >
        <TripsTable
          columns={column}
          rows={paginatedData}
          ViewTicket={TripTicketView}
          EditTicket={TripTicketModal}
        />

        {/* <CardContainer title="Pending Applications">
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
        </CardContainer> */}
      </TableContainerUI>
    </div>
  );
}
