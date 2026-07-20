"use client";
import TableUI from "../ui/tables/table";

import Title from "../ui/title";
import EditUser from "../ui/modal/editUser";
import { useState } from "react";
import { Plus } from "lucide-react";
import FilterDropdown from "@/components/ui/tables/tools/dropdown";
import SearchInput from "@/components/ui/tables/tools/search-input";
import SortDropdown from "@/components/ui/tables/tools/sort-dropdown";
import { useDataTable } from "@/components/ui/tables/tools/data-table";
import Pagination from "@/components/ui/tables/tools/pagination";
export default function ManageUsersUI({ data }) {
  const [isEditUserOpen, setisEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function openUserEdit(id) {
    const User = data.find((d) => d.id === id);

    setSelectedUser(User);
    setisEditUserOpen(true);
  }
  const column = [
    {
      head: "User ID",
      data: "id",
    },
    {
      head: "Name",
      data: "name",
    },
    {
      head: "Email",
      data: "email",
    },
    {
      head: "Role",
      data: "role",
    },
    {
      head: "Date Created",
      data: "createdAt",
    },
    {
      head: "Action",
      data: "action",
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
    searchableFields: ["name", "email"],
    itemsPerPage: 8,
  });

  const roleOptions = [
    "Applicant",
    "ApplicantAdmin",
    "VehicleAdmin",
    "SuperAdmin",
  ];

  const sortOptions = [
    { label: "Name", key: "name" },
    { label: "Date Created", key: "createdAt" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title
          title="Manage"
          title2="Users"
          description="View and manage all registered users."
        />
        <button
          onClick={() => setisEditUserOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#4DAA74] px-4 py-2.5 text-white font-medium cursor-pointer hover:bg-[#428f63] transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Add new user
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by name or email..."
        />
        <FilterDropdown
          value={filters.role}
          onChange={(value) => updateFilter("role", value)}
          options={roleOptions}
          label="Roles"
        />
        <SortDropdown
          sortConfig={sortConfig}
          onSort={updateSort}
          options={sortOptions}
        />
      </div>

      <TableUI columns={column} rows={paginatedData} onEdit={openUserEdit} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />

      {isEditUserOpen && (
        <EditUser
          open={isEditUserOpen}
          onClose={() => {
            setisEditUserOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </div>
  );
}
