import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  inputClassName,
}) {
  return (
    <div className={cn("relative min-w-0 flex-1 bg-white", className)}>
      <Search
        aria-hidden="true"
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748B]"
      />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-[#172033] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-green-500",
          inputClassName,
        )}
      />
    </div>
  );
}
