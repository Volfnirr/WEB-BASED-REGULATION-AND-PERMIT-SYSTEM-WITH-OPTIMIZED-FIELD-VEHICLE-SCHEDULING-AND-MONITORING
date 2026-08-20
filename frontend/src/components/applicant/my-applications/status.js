"use client";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
import { useState, useEffect } from "react";
import { StatusColor } from "@/lib/status";
// import { userApplicationsStatus } from "@/lib/api/applications/user-applications-status";
import { toast } from "sonner";
import { Dot } from "lucide-react";
import { ScrollText, SquarePlus } from "lucide-react";
import Link from "next/link";

export default function ApplicationStatusPage({ initialData }) {
  const [data, setData] = useState(initialData);

  // useEffect(() => {
  //   async function loadApplications() {
  //     try {
  //       const userData = await userApplicationsStatus();
  //       setData(userData.application);
  //     } catch (err) {
  //       toast.error(err.message, {
  //         position: "top-center",
  //       });
  //     }
  //   }

  //   loadApplications();
  // }, []);
  // data = [
  //   {
  //     id: "1",
  //     service: "Agricultural Free Patent",
  //     submission_date: "2026-07-01",
  //     status: "Accepted",
  //     remarks:
  //       "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
  //   },
  //   {
  //     id: "2",
  //     service: "Tree Cutting Permit",
  //     submission_date: "2026-07-02",
  //     status: "Rejected",
  //     remarks:
  //       "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
  //   },
  //   {
  //     id: "3",
  //     service: "Residential Free Patent",
  //     submission_date: "2026-07-03",
  //     status: "Accepted",
  //     remarks:
  //       "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
  //   },
  //   {
  //     id: "4",
  //     service: "Chainsaw Registration",
  //     submission_date: "2026-07-04",
  //     status: "Pending",
  //     remarks:
  //       "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
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
    searchableFields: ["service?.name", "status", "remarks"],
    itemsPerPage: 8,
  });

  const roleOptions = ["PENDING", "REJECTED", "ACCEPTED"];

  const sortOptions = [
    { label: "Application Id", key: "id" },
    { label: "Service", key: "service?.name" },
    { label: "Date Created", key: "submittedAt" },
  ];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-lg border-3 border-gray-300">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
          <SquarePlus className="h-7 w-7 text-green-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">New here?</h3>

        <p className="mt-1 text-sm text-gray-500">
          Choose an application to get started.
        </p>

        <div className="mt-6 grid w-full max-w-md gap-3 sm:grid-cols-2">
          <Link
            href="/applicant/agricultural"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Agricultural Free Patent
          </Link>

          <Link
            href="/applicant/residential"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Residential Free Patent
          </Link>

          <Link
            href="/applicant/chainsaw"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Chainsaw Registration
          </Link>

          <Link
            href="/applicant/tree-cutting"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Tree Cutting Permit
          </Link>
        </div>
      </div>
    );
  }

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
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <SquarePlus className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Can't find your application?
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No worries! You can start a new application here.
            </p>

            <div className="mt-6 grid w-full max-w-md gap-3 sm:grid-cols-2">
              <Link
                href="/applicant/agricultural"
                className=" rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Agricultural Free Patent
              </Link>

              <Link
                href="/applicant/residential"
                className=" rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Residential Free Patent
              </Link>

              <Link
                href="/applicant/chainsaw"
                className=" rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Chainsaw Registration
              </Link>

              <Link
                href="/applicant/tree-cutting"
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Tree Cutting Permit
              </Link>
            </div>
          </div>
        ) : (
          paginatedData.flatMap((d) => (
            <div
              key={d?.id}
              className="flex flex-col gap-2  bg-white rounded-md px-5 py-5 text-black"
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-md text-green-800">
                    {d?.service?.name}
                  </span>
                  <div className="flex flex-row items-center">
                    <span className="font-medium text-sm">
                      {d?.referenceNo}
                    </span>
                    <span className="text-sm">
                      <Dot size={25} />
                    </span>
                    <span className="font-medium text-sm">
                      {new Date(d?.submittedAt).toLocaleDateString()}{" "}
                    </span>
                  </div>
                </div>
                <span className={`${StatusColor(d?.status)} rounded-sm px-2`}>
                  {d?.status}
                </span>
              </div>

              <hr />
              <span className="font-light text-sm">Remarks</span>

              {d?.remarks === null ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ScrollText className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No remarks yet</p>
                </div>
              ) : (
                <span>{d?.remarks}</span>
              )}
            </div>
          ))
        )}
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
