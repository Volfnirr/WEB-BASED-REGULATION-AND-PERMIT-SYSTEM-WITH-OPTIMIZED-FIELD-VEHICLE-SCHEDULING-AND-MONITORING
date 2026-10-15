"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterDropdown({
  value,
  onChange,
  options,
  label,
  className,
  triggerClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = value === "All" || !value ? `All ${label}` : value;

  return (
    <div className={cn("relative min-w-40", className)} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-[#172033] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005221]/30",
          triggerClassName,
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-[#64748B]"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-30 mt-1 max-h-72 w-full min-w-44 overflow-y-auto rounded-md border border-[#E1E5E9] bg-white py-1 shadow-lg"
          role="listbox"
          aria-label={`${label} filter options`}
        >
          {["All", ...options].map((option) => {
            const isSelected =
              option === "All" ? !value || value === "All" : value === option;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className="flex min-h-9 w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#F5F6F7] focus-visible:bg-[#F5F6F7] focus-visible:outline-none"
              >
                <span className="truncate">
                  {option === "All" ? `All ${label}` : option}
                </span>
                {isSelected && (
                  <Check
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[#005221]"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
