"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";
import TableContainerUI from "@/components/ui/tables/table-container";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import Title from "@/components/ui/title";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import SearchInput from "@/components/ui/tables/tools/search-input";
import Pagination from "@/components/ui/tables/tools/pagination";
import DriverForm from "@/components/vehicle-admin/drivers/driver-form";
import {
  listDrivers,
  updateDriver,
  driverName,
} from "@/lib/api/vehicle/drivers";

export default function ManageDrivers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [confirmDriver, setConfirmDriver] = useState(null);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["drivers", "list"],
    queryFn: listDrivers,
  });
  const toggle = useMutation({
    mutationFn: (driver) =>
      updateDriver(driver.id, { isActive: !driver.isActive }),
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: ["drivers"] });
      toast.success(data.message);
      setConfirmDriver(null);
    },
    onError: (error) => toast.error(error.message),
  });
  const rows = useMemo(
    () =>
      (query.data?.drivers ?? []).filter(
        (driver) =>
          `${driverName(driver)} ${driver.email}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (status === "all" || driver.isActive === (status === "active")),
      ),
    [query.data, search, status],
  );
  const totalPages = Math.max(1, Math.ceil(rows.length / 8));
  const currentPage = Math.min(page, totalPages);
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="mb-2 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <Title
          title="Manage"
          title2="Drivers"
          description="Manage drivers available for trip-ticket assignments."
        />
        <Button
          onClick={() => setEditing({})}
          className="h-auto gap-1.5 rounded-lg bg-[#4DAA74] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#428f63] hover:text-white focus-visible:ring-[#4DAA74]/30"
        >
          <Plus className="size-4" />
          Add driver
        </Button>
      </div>
      <TableContainerUI
        title="All drivers"
        description="Review driver records and manage assignment availability."
        toolbar={
          <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(220px,1fr)_160px] lg:w-[min(100%,560px)]">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by name or email…"
              className="w-full min-w-0"
            />
            <FilterDropdown
              value={
                status === "all"
                  ? "All"
                  : status === "active"
                    ? "Active"
                    : "Inactive"
              }
              onChange={(value) => {
                setStatus(value === "All" ? "all" : value.toLowerCase());
                setPage(1);
              }}
              options={["Active", "Inactive"]}
              label="drivers"
              className="w-full min-w-0"
            />
          </div>
        }
        footer={
          !query.isPending && !query.isError ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={rows.length}
              itemsPerPage={8}
              className="m-0 rounded-none border-0 bg-transparent px-0 py-2 text-xs"
            />
          ) : null
        }
      >
        {query.isPending ? (
          <p role="status" className="animate-pulse p-6">
            Loading drivers…
          </p>
        ) : query.isError ? (
          <p className="text-red-600">
            {query.error.message}{" "}
            <button className="underline" onClick={() => query.refetch()}>
              Retry
            </button>
          </p>
        ) : (
          <>
            <div className="w-full min-w-0 overflow-hidden">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    {["Name", "Email", "Status", "Actions"].map((label) => (
                      <TableHead key={label}>{label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={48} className="text-gray-300" />
                          <span>No drivers found.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows
                      .slice((currentPage - 1) * 8, currentPage * 8)
                      .map((driver) => (
                        <TableRow
                          key={driver.id}
                          className="bg-white transition-colors hover:bg-[#F8FAF9]"
                        >
                          <TableCell className="font-medium">
                            {driverName(driver)}
                          </TableCell>
                          <TableCell>{driver.email}</TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${driver.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                            >
                              {driver.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="border-[#D9E1E8] bg-white text-[#52657D] hover:border-[#4DAA74] hover:bg-green-50 hover:text-[#005221]"
                                onClick={() => setEditing(driver)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[#D9E1E8] bg-white text-[#52657D] hover:border-[#4DAA74] hover:bg-green-50 hover:text-[#005221]"
                                onClick={() => setConfirmDriver(driver)}
                              >
                                {driver.isActive ? "Deactivate" : "Reactivate"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </TableContainerUI>
      {editing && (
        <DriverForm driver={editing} onClose={() => setEditing(null)} />
      )}
      {confirmDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="driver-status-title"
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6"
          >
            <h2 id="driver-status-title" className="font-bold">
              {confirmDriver.isActive ? "Deactivate" : "Reactivate"}{" "}
              {driverName(confirmDriver)}?
            </h2>
            <p className="text-sm text-gray-600">
              {confirmDriver.isActive
                ? "Existing trips and history will be kept. This driver will no longer appear for new assignments."
                : "This driver will be available for assignments outside reserved or blocked dates."}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-[#D9E1E8] bg-white text-[#52657D] hover:border-[#4DAA74] hover:bg-green-50 hover:text-[#005221]"
                disabled={toggle.isPending}
                onClick={() => setConfirmDriver(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#4DAA74] text-white hover:bg-[#428f63] hover:text-white"
                disabled={toggle.isPending}
                onClick={() => toggle.mutate(confirmDriver)}
              >
                {toggle.isPending ? "Saving…" : "Confirm"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
