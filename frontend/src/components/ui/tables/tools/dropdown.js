import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function FilterDropdown({ value, onChange, options, label }) {
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

  const handleSelect = (opt) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-40" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {value === "All" || !value ? `All ${label}` : value}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute  z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleSelect("All")}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
          >
            All {label}
            {(!value || value === "All") && (
              <Check className="w-4 h-4 text-green-600" />
            )}
          </button>

          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
            >
              {opt}
              {value === opt && <Check className="w-4 h-4 text-green-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
