"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import VehiclesList from "@/components/vehicle-admin/trip-ticket/vehicle-list";
import {
  listAvailableVehicles,
  scheduleVehicleMaintenance,
  submitTripAndSchedule,
  updateTripAndSchedule,
} from "@/lib/api/vehicle/manage-vehicles";
import { Button } from "@/components/ui/button";

import { X } from "lucide-react";

const vehicleMaintenaceSchema = z.object({
  scheduleDate: z.object(
    {
      from: z.coerce.date({ message: "Departure date is required" }),
      to: z.coerce.date().optional(),
    },
    { message: "Departure date is required" },
  ),
});

export default function VehicleMaintenance({ isOpen, onClose, vehicle }) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-xs font-medium";
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleMaintenaceSchema),
  });
  const onSubmit = async (data) => {
    console.log(data);
    const tripData = {};
    tripData.startDate = format(data.scheduleDate.from, "yyyy-MM-dd");
    tripData.endDate = format(
      data.scheduleDate.to ?? data.scheduleDate.from,
      "yyyy-MM-dd",
    );
    try {
      await scheduleVehicleMaintenance(vehicle.id, tripData);
      toast.success("Successfully scheduled vehicle for maintenance", {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong. Please try again later",
        {
          position: "top-center",
        },
      );
    }
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Schedule vehicle for maintenance
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2"
          >
            <X />
          </button>
        </div>
        <hr className="border-gray-200 mb-2" />
        <span className="text-sm font-bold text-gray-800 uppercase mb-2">
          {vehicle.model} {vehicle.brand} {vehicle.plateNumber}
        </span>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Schedule Maintenance
                </label>
                <Controller
                  name="scheduleDate"
                  control={control}
                  render={({ field }) => {
                    const range = field.value;
                    const isSingleDay =
                      range?.from &&
                      (!range.to ||
                        range.to.getTime() === range.from.getTime());

                    return (
                      <Popover>
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              id="scheduleDate"
                              className={`${inputClass} flex items-center justify-between`}
                            >
                              <span
                                className={
                                  range?.from
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }
                              >
                                {range?.from ? (
                                  isSingleDay ? (
                                    format(range.from, "LLL dd, y")
                                  ) : (
                                    <>
                                      {format(range.from, "LLL dd, y")} -{" "}
                                      {format(range.to, "LLL dd, y")}
                                    </>
                                  )
                                ) : (
                                  "Pick a date"
                                )}
                              </span>
                              <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                            </button>
                          }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            defaultMonth={range?.from}
                            selected={range}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
                {errors.scheduleDate && (
                  <div className={errorClass}>
                    {errors.scheduleDate.from?.message ||
                      errors.scheduleDate.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center justify-between w-full md:grid-cols-2">
            <div className="flex justify-start items-center w-full gap-2 min-h-10">
              <Button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-md min-h-9 max-h-md bg-red-700 hover:bg-red-800 transition-colors"
              >
                Cancel
              </Button>
            </div>
            <div className="flex justify-start items-center w-full gap-2 min-h-15 md:justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer text-md min-h-9 max-h-md bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Spinner data-icon />
                  </>
                ) : (
                  "Schedule Maintenance"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
