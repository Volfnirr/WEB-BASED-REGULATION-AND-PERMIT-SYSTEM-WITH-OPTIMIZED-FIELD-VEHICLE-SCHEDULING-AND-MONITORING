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
  // const [data, setData] = useState(initialData);

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
    searchableFields: ["service?.name", "status", "remarks"],
    itemsPerPage: 8,
  });

  const roleOptions = ["PENDING", "REJECTED", "APPROVED"];

  const sortOptions = [
    {
      label: "Date Submitted",
      key: "submittedAt",
    },
  ];

  if (initialData.length === 0) {
    return (
      <div className="flex w-full min-w-0 flex-col items-center justify-center rounded-lg border border-[#E1E5E9] bg-white px-6 py-16 text-center">
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
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Agricultural Free Patent
          </Link>

          <Link
            href="/applicant/residential"
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Residential Free Patent
          </Link>

          <Link
            href="/applicant/chainsaw"
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Chainsaw Registration
          </Link>

          <Link
            href="/applicant/tree-cutting"
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
          >
            Tree Cutting Permit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-4 rounded-lg border border-[#E1E5E9] bg-white px-4 py-4 sm:px-5">
        <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(220px,1fr)_160px_160px]">
          <SearchInput
            value={search}
            onChange={updateSearch}
            placeholder="Search by service, status or remarks..."
            className="w-full min-w-0"
          />

          <FilterDropdown
            value={filters.status}
            onChange={(value) => updateFilter("status", value)}
            options={roleOptions}
            label="Status"
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

      <div className="flex min-w-0 flex-col gap-3">
        {paginatedData.length === 0 ? (
          <div className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-[#E1E5E9] bg-white px-6 py-16 text-center">
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
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Agricultural Free Patent
              </Link>

              <Link
                href="/applicant/residential"
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Residential Free Patent
              </Link>

              <Link
                href="/applicant/chainsaw"
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Chainsaw Registration
              </Link>

              <Link
                href="/applicant/tree-cutting"
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                Tree Cutting Permit
              </Link>
            </div>
          </div>
        ) : (
          paginatedData.flatMap((d) => (
            <div
              key={d?.id}
              className="flex min-w-0 flex-col gap-3 rounded-lg border border-[#E1E5E9] bg-white px-4 py-4 text-[#172033] sm:px-5 sm:py-5"
            >
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="break-words text-base font-semibold leading-6 text-[#005221]">
                    {d?.service?.name}
                  </span>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#52657D]">
                    <span className="text-sm font-medium">
                      {d?.referenceNo}
                    </span>

                    <span className="hidden text-sm sm:inline-flex">
                      <Dot size={25} />
                    </span>

                    <span className="text-sm font-medium">
                      {new Date(d?.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span
                  className={`${StatusColor(
                    d?.status,
                  )} inline-flex min-h-6 shrink-0 items-center self-start rounded-full px-2.5 py-1 text-xs font-medium sm:self-auto`}
                >
                  {d?.status}
                </span>
              </div>

              <hr />

              <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                Remarks
              </span>

              {d?.remarks === null ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ScrollText className="mb-3 h-10 w-10 text-gray-300" />
                  <p className="font-medium text-gray-500">No remarks yet</p>
                </div>
              ) : (
                <span className="min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-[#52657D]">
                  {d?.remarks}
                </span>
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
        className="m-0 mt-3 rounded-none border-0 bg-transparent px-0 py-2 text-xs"
      />
    </div>
  );
}
