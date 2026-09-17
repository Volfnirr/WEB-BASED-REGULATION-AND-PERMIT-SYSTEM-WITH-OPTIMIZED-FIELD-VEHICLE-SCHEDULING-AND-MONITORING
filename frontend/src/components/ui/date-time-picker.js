"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateTimePicker({ value, onChange, placeholder = "Select date" }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : undefined);
  const [time, setTime] = useState(
    value ? format(new Date(value), "HH:mm:ss") : "00:00:00"
  );

  useEffect(() => {
    if (value) {
      setDate(new Date(value));
      setTime(format(new Date(value), "HH:mm:ss"));
    }
  }, [value]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setOpen(false);
    updateParent(selectedDate, time);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    updateParent(date, newTime);
  };

  const updateParent = (d, t) => {
    if (d && t) {
      const [hours, minutes, seconds] = t.split(":");
      const combined = new Date(d);
      combined.setHours(
        parseInt(hours || 0, 10),
        parseInt(minutes || 0, 10),
        parseInt(seconds || 0, 10),
        0
      );
      onChange(combined);
    }
  };

  return (
    <div className="flex flex-row gap-2 w-full">
      <div className="flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between font-normal px-3 h-10 border-gray-300 focus:ring-[#1a5632]"
              >
                {date ? format(date, "PPP") : placeholder}
                <ChevronDownIcon className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            }
          />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-32 shrink-0">
        <input
          type="time"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}