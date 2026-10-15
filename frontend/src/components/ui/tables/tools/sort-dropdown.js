"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SortDropdown({
  sortConfig,
  onSort,
  options,
  className,
  triggerClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
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
    <div className={cn("relative min-w-48", className)} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-[#172033] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005221]/30",
          triggerClassName,
        )}
      >
        {buttonLabel}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-[#64748B]"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-1 max-h-72 w-full min-w-48 overflow-y-auto rounded-md border border-[#E1E5E9] bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => handleSelect(null, null)}
            className="flex min-h-9 w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#F5F6F7] focus-visible:bg-[#F5F6F7] focus-visible:outline-none"
          >
            Sort by...
            {!sortConfig.key && (
              <Check aria-hidden="true" className="size-4 text-[#005221]" />
            )}
          </button>

          {options.map((opt) => (
            <div
              key={opt.key}
              className="border-t border-[#EEF0F2] first:border-t-0"
            >
              <div className="px-3 pb-1 pt-2 text-xs font-medium text-[#64748B]">
                {opt.label}
              </div>
              <button
                type="button"
                onClick={() => handleSelect(opt.key, "asc")}
                className="flex min-h-9 w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#F5F6F7] focus-visible:bg-[#F5F6F7] focus-visible:outline-none"
              >
                A–Z / Oldest
                {sortConfig.key === opt.key &&
                  sortConfig.direction === "asc" && (
                    <Check
                      aria-hidden="true"
                      className="size-4 text-[#005221]"
                    />
                  )}
              </button>
              <button
                type="button"
                onClick={() => handleSelect(opt.key, "desc")}
                className="flex min-h-9 w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#F5F6F7] focus-visible:bg-[#F5F6F7] focus-visible:outline-none"
              >
                Z–A / Newest
                {sortConfig.key === opt.key &&
                  sortConfig.direction === "desc" && (
                    <Check
                      aria-hidden="true"
                      className="size-4 text-[#005221]"
                    />
                  )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
