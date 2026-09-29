"use client";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import CompleteTripTicketView from "@/components/ui/modal/complete-trip-ticket/complete-trip-ticket-view";
import CompleteTripTicketEditModal from "@/components/ui/modal/complete-trip-ticket/complete-trip-ticket-edit";
import CompleteTripsTable from "./complete-trip-ticket-ui";

function flattenCompletedTrip(row) {
  const completion = row.trip_ticket_completion;

  return {
    id: row.id,
    tripTicketNo: row.tripTicketNo,
    driverName: row.driverName,
    plateNumber: row.vehicle?.plateNumber,
    placesToVisit:
      row.trip_ticket_place?.length > 0
        ? row.trip_ticket_place.map((p) => p.placeName).join(", ")
        : row.placesToVisit,
    timeOfDeparture: completion?.timeOfDeparture,
    timeOfArrivalBack: completion?.timeOfArrivalBack,
    approxDistanceTraveled:
      completion?.approxDistanceTraveled ?? completion?.speedometerDistance,
    remarks: completion?.remarks,
    raw: row,
  };
}

export default function CompleteTripApplicationTable({ initialData }) {
  const column = [
    { head: "Trip Ticket No.", data: "tripTicketNo" },
    { head: "Driver Name", data: "driverName" },
    { head: "Vehicle Plate No.", data: "plateNumber" },
    { head: "Place(s) Visited", data: "placesToVisit" },
    { head: "Departure", data: "timeOfDeparture" },
    { head: "Arrival", data: "timeOfArrivalBack" },
    { head: "Distance", data: "approxDistanceTraveled" },
    { head: "Remarks", data: "remarks" },
  ];

  const flattenedData = (initialData ?? []).map(flattenCompletedTrip);

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
    data: flattenedData,
    searchableFields: [
      "tripTicketNo",
      "driverName",
      "plateNumber",
      "placesToVisit",
    ],
    itemsPerPage: 8,
  });

  const sortOptions = [
    { label: "Driver Name", key: "driverName" },
    { label: "Departure", key: "timeOfDeparture" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by ticket no, driver, plate no..."
        />
        <SortDropdown
          sortConfig={sortConfig}
          onSort={updateSort}
          options={sortOptions}
        />
      </div>
      <CompleteTripsTable
        columns={column}
        rows={paginatedData}
        ViewTicket={CompleteTripTicketView}
        EditTicket={CompleteTripTicketEditModal}
      />
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