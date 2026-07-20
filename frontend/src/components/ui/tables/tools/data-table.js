import { useState } from "react";

export function useDataTable({
  data,
  searchableFields = [],
  itemsPerPage = 9,
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const updateSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  const updateSort = (key, direction) => {
    if (direction) {
      setSortConfig({ key, direction });
    } else {
      setSortConfig((prev) => {
        if (prev.key === key) {
          return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
        }
        return { key, direction: "asc" };
      });
    }
  };
  const filteredData = data.filter((row) => {
    const matchesSearch =
      searchableFields.length === 0 ||
      searchableFields.some((field) =>
        String(row[field]).toLowerCase().includes(search.toLowerCase()),
      );

    const matchesFilters = Object.entries(filters).every(
      ([key, value]) => !value || value === "All" || row[key] === value,
    );

    return matchesSearch && matchesFilters;
  });
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  const totalPages = Math.max(Math.ceil(filteredData.length / itemsPerPage), 1);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return {
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
  };
}
