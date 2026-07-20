import Table from "@/components/ui/tables/table";
import ScheduleCardInfo from "@/components/ui/card/card";
import CardContainer from "@/components/ui/card/card-container";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";

export default function TripApplicationTable() {
  const column = [
    {
      head: "Trip History ID",
      data: "id",
    },
    {
      head: "Authorized Passenger",
      data: "passengerName",
    },
    {
      head: "Driver",
      data: "driver",
    },
    {
      head: "Vehicle Plate no.",
      data: "plateNo",
    },
    {
      head: "Place",
      data: "place",
    },
    {
      head: "Date",
      data: "date",
    },

    {
      head: "Purpose",
      data: "purpose",
    },
  ];

  const data = [
    {
      id: "1",
      passengerName: "John Smith",
      driver: "Adam Cruz",
      plateNo: "SJJ475",
      place: "Angeles,Arayat & Sta rita,Pampanga",
      date: "2026-07-09",
      purpose: "To attend meeting re DOTR's concern ",
    },
    {
      id: "2",
      passengerName: "John Doe",
      driver: "John Wick",
      plateNo: "SPP365",
      place: "Angeles,Arayat & Sta rita,Pampanga",
      date: "2026-07-10",
      purpose: "Land Inspection",
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
    searchableFields: ["passengerName", "plateNo", "driver"],
    itemsPerPage: 8,
  });

  const sortOptions = [
    { label: "Passenger Name", key: "passengerName" },
    { label: "Date", key: "date" },
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
      <Table columns={column} rows={paginatedData} />
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
