"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ApplicationExportFormat({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label="Download file format"
        className="h-11 min-h-11 w-40 shrink-0 rounded-lg border-[#D9E1E8] bg-white px-3 text-sm"
      >
        <SelectValue>
          {value === "pdf" ? "PDF (.pdf)" : "Word (.docx)"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
        <SelectItem value="docx">Word (.docx)</SelectItem>
      </SelectContent>
    </Select>
  );
}
