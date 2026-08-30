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
import { useState } from "react";
import VehiclesList from "@/components/vehicle-admin/review-applications/vehicle-list";
import {
  listAvailableVehicles,
  submitTripAndSchedule,
} from "@/lib/api/vehicle/manage-vehicles";

const tripTicketFormSchema = z.object({
  tripTicketNo: z.string().trim().min(1, "Trip Ticket is Required"),
  scheduleDate: z.object(
    {
      from: z.coerce.date({ message: "Departure date is required" }),
      to: z.coerce.date().optional(),
    },
    { message: "Departure date is required" },
  ),
  driverName: z.string().trim().min(1, "Driver name is Required"),
  authorizedPassengers: z
    .string()
    .trim()
    .min(1, "Authorized Passengers is Required"),
  placesToVisit: z.string().trim().min(1, "Place to visit is Required"),
  purpose: z.string().trim().min(1, "Purpose is Required"),
  vehicleId: z.coerce
    .number({ message: "Plate Number is Required" })
    .positive(), //2. Government vehicle to be used, Plate No.
});

export default function TripTicketModal({ isOpen, onClose }) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-xs font-medium";
  const [vehicles, setVehicles] = useState();
  const [showVehicles, setShowVehicles] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripTicketFormSchema),
  });

  const availableVehiclesButton = async () => {
    const scheduleDate = getValues("scheduleDate");

    if (!scheduleDate?.from) {
      toast.error("Please select a departure date", {
        position: "top-center",
      });
      return;
    }

    const startDate = format(scheduleDate.from, "yyyy-MM-dd");
    const endDate = format(scheduleDate.to ?? scheduleDate.from, "yyyy-MM-dd");

    try {
      setLoadingVehicles(true);
      setShowVehicles(true);

      const { availableVehicles } = await listAvailableVehicles({
        startDate,
        endDate,
      });

      setVehicles(availableVehicles ?? []);
    } catch (error) {
      console.error("Failed to load available vehicles:", error);

      toast.error(
        `Unable to load available vehicles. ${error?.message || ""}`,
        {
          position: "top-center",
        },
      );

      setVehicles([]);
      setShowVehicles(false);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const onSubmit = async (data) => {
    const { scheduleDate, ...rest } = data;
    const formData = {
      ...rest,
      startDate: format(data.scheduleDate.from, "yyyy-MM-dd"),
      endDate: format(
        data.scheduleDate.to ?? data.scheduleDate.from,
        "yyyy-MM-dd",
      ),
    };
    console.log(formData);
    try {
      const { message } = await submitTripAndSchedule(formData);
      reset();
      toast.success(message, {
        position: "top-center",
      });
    } catch (err) {
      toast.error(
        err.message || "Something went wrong submitting your application.",
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
              Trip Ticket
            </h1>
            <p className="text-gray-500 text-sm">
              A. To be filled by the Admistrative Official Authorizing Official
              Travel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2"
          >
            &times;
          </button>
        </div>
        <hr className="border-gray-200 mb-8" />

        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Trip Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Trip Ticket No.*
                  </label>
                  <input
                    {...register("tripTicketNo")}
                    type="text"
                    placeholder="*Trip Ticket No"
                    className={inputClass}
                  />
                  {errors.tripTicketNo && (
                    <div className={errorClass}>
                      {errors.tripTicketNo.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Departure Date*
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
                            numberOfMonths={2}
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

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Vehicle Information
            </h2>

            <div className="grid grid-cols-1 gap-2 mb-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name of Driver of the Vehicle*
                </label>
                <input
                  {...register("driverName")}
                  type="text"
                  placeholder="*NAME OF DRIVER"
                  className={inputClass}
                />
                {errors.driverName && (
                  <div className={errorClass}>{errors.driverName.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Government Vehicle to Be Used, Plate no*
                </label>
                <button
                  type="button"
                  onClick={availableVehiclesButton}
                  className={inputClass}
                >
                  {selectedVehicle
                    ? `Plate number: ${selectedVehicle?.plateNumber}`
                    : "Select a vehicle"}
                </button>

                {errors.vehicleId && (
                  <div className={errorClass}>{errors.vehicleId.message}</div>
                )}
                {showVehicles && (
                  <>
                    {loadingVehicles ? (
                      <div className="flex justify-center py-4">
                        <Spinner data-icon />
                      </div>
                    ) : (
                      <VehiclesList
                        vehicles={vehicles}
                        onAssign={(vehicle) => {
                          setSelectedVehicle(vehicle);

                          setValue("vehicleId", vehicle?.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });

                          setShowVehicles(false);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-1 text-left">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Name of Authorized Passenger/s
              </label>
              <input
                {...register("authorizedPassengers")}
                type="text"
                placeholder="*Name of Authorized Passenger/s"
                className={inputClass}
              />
              {errors.authorizedPassengers && (
                <div className={errorClass}>
                  {errors.authorizedPassengers.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 gap-2 mb-2">
              <div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Place or Places to Be Visited/Inspected*
                  </label>
                  <input
                    {...register("placesToVisit")}
                    type="text"
                    placeholder="*e.g. ANGELES,ARAYAT & STA. RITA, PAMPANGA"
                    className={inputClass}
                  />
                  {errors.placesToVisit && (
                    <div className={errorClass}>
                      {errors.placesToVisit.message}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Purpose*
                  </label>
                  <textarea
                    {...register("purpose")}
                    type="text"
                    placeholder="*PURPOSE OF THE TRIP"
                    className={inputClass}
                  />
                  {errors.purpose && (
                    <div className={errorClass}>{errors.purpose.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 cursor-pointer bg-red-500 text-white font-bold rounded-lg hover:bg-red-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 cursor-pointer bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon />
                </>
              ) : (
                " Submit Trip Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
