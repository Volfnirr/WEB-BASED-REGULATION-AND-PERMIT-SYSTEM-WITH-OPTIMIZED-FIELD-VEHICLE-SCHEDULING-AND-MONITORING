"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function SortDropdown({ sortConfig, onSort, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key, direction) => {
    onSort(key, direction);
    setIsOpen(false);
  };

  const activeOption = options.find((opt) => opt.key === sortConfig.key);
  const buttonLabel = activeOption
    ? `${activeOption.label} (${sortConfig.direction === "asc" ? "A–Z" : "Z–A"})`
    : "Sort by...";

  return (
    <div className="relative min-w-48" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {buttonLabel}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleSelect(null, null)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50 border-b border-gray-100"
          >
            Sort by...
            {!sortConfig.key && <Check className="w-4 h-4 text-green-600" />}
          </button>

          {options.map((opt) => (
            <div
              key={opt.key}
              className="border-b border-gray-100 last:border-b-0"
            >
              <div className="px-3 pt-2 pb-1 text-xs font-medium text-gray-400">
                {opt.label}
              </div>
              <button
                type="button"
                onClick={() => handleSelect(opt.key, "asc")}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
              >
                A–Z / Oldest
                {sortConfig.key === opt.key &&
                  sortConfig.direction === "asc" && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
              </button>
              <button
                type="button"
                onClick={() => handleSelect(opt.key, "desc")}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
              >
                Z–A / Newest
                {sortConfig.key === opt.key &&
                  sortConfig.direction === "desc" && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
