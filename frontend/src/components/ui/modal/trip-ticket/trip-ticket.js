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
import { useEffect, useState, useRef } from "react";
import VehiclesList from "@/components/vehicle-admin/trip-ticket/vehicle-list";
import {
  listAvailableVehicles,
  submitTripAndSchedule,
  updateTripAndSchedule,
} from "@/lib/api/vehicle/manage-vehicles";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TripTicketResult from "@/components/vehicle-admin/trip-ticket/trip-ticket-result";
import { useQueryClient } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const tripTicketFormSchema = z.object({
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

export default function TripTicketModal({ isOpen, onClose, tripTicket }) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-xs font-medium";
  const [vehicles, setVehicles] = useState([]);
  const [showVehicles, setShowVehicles] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [submittedTrip, setSubmittedTrip] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hasFetchedVehicles, setHasFetchedVehicles] = useState(false);
  const isInitializingEdit = useRef(false);

  const queryClient = useQueryClient();
  const refreshTripData = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["trip-ticket-list"] }),
      queryClient.invalidateQueries({ queryKey: ["trip-ticket-status"] }),
      queryClient.invalidateQueries({ queryKey: ["vehicle-dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["vehicle-schedules"] }),
    ]);
  // const router = useRouter();

  const resetVehiclePicker = () => {
    setVehicles([]);
    setSelectedVehicle(null);
    setHasFetchedVehicles(false);
    setLoadingVehicles(false);
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripTicketFormSchema),
  });
  const scheduleDate = watch("scheduleDate");

  useEffect(() => {
    console.log("use effect running");
    if (!isOpen) return;

    if (tripTicket?.id) {
      isInitializingEdit.current = true;

      const from = new Date(tripTicket.startDate);
      const to = tripTicket.endDate ? new Date(tripTicket.endDate) : from;

      reset({
        tripTicketNo: tripTicket.tripTicketNo,
        scheduleDate: { from, to },
        driverName: tripTicket.driverName,
        authorizedPassengers: tripTicket.authorizedPassengers,
        placesToVisit: tripTicket.placesToVisit,
        purpose: tripTicket.purpose,
        vehicleId: tripTicket.vehicleId,
      });
      setTimeout(() => {
        ["placesToVisit", "purpose"].forEach((id) => {
          const textarea = document.getElementById(id);

          if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }
        });
      }, 0);
      setSelectedVehicle({
        id: tripTicket.vehicleId,
        plateNumber: tripTicket.plateNumber ?? null,
      });
    }
  }, [tripTicket?.id, isOpen]);

  useEffect(() => {
    if (!scheduleDate?.from) return;
    if (isInitializingEdit.current) {
      isInitializingEdit.current = false;
      return;
    }
    setValue("vehicleId", undefined, { shouldValidate: false });
    setSelectedVehicle(null);
    setVehicles([]);
    setHasFetchedVehicles(false);
  }, [scheduleDate?.from, scheduleDate?.to]);
  console.log("VEHICLE PLATE NUMBERT", selectedVehicle);

  const fetchAvailableVehicles = async () => {
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

      const { availableVehicles } = await listAvailableVehicles({
        startDate,
        endDate,
      });

      setVehicles(availableVehicles ?? []);
    } catch (error) {
      console.error("Failed to load available vehicles:", error);
      toast.error(`${error?.message || "Unable to load available vehicles."}`, {
        position: "top-center",
      });
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
      setHasFetchedVehicles(true);
    }
  };

  const onSubmit = async (data) => {
    console.log("Data", data);
    console.log("TRIP TICKET DATA", tripTicket);

    const tripData = {};

    if (tripTicket) {
      if (data.authorizedPassengers !== tripTicket.authorizedPassengers)
        tripData.authorizedPassengers = data.authorizedPassengers;
      if (data.driverName !== tripTicket.driverName)
        tripData.driverName = data.driverName;
      if (data.purpose !== tripTicket.purpose) tripData.purpose = data.purpose;
      if (data.placesToVisit !== tripTicket.placesToVisit)
        tripData.placesToVisit = data.placesToVisit;
      if (data.vehicleId !== tripTicket.vehicleId)
        tripData.vehicleId = data.vehicleId;
      if (data.scheduleDate.from.toISOString() !== tripTicket.startDate)
        tripData.startDate = format(data.scheduleDate.from, "yyyy-MM-dd");
      if (
        (data.scheduleDate.to ?? data.scheduleDate.from).toISOString() !==
        tripTicket.endDate
      )
        tripData.endDate = format(
          data.scheduleDate.to ?? data.scheduleDate.from,
          "yyyy-MM-dd",
        );
    } else {
      tripData.authorizedPassengers = data.authorizedPassengers;
      tripData.driverName = data.driverName;
      tripData.purpose = data.purpose;
      tripData.placesToVisit = data.placesToVisit;
      tripData.vehicleId = data.vehicleId;
      tripData.startDate = format(data.scheduleDate.from, "yyyy-MM-dd");
      tripData.endDate = format(
        data.scheduleDate.to ?? data.scheduleDate.from,
        "yyyy-MM-dd",
      );
    }

    try {
      if (tripTicket?.id) {
        if (Object.keys(tripData).length === 0) {
          toast.error("Please make your changes before submitting the form.", {
            position: "top-center",
          });
          return;
        }
        console.log("Update Details", tripData, tripTicket.id);
        const { message } = await updateTripAndSchedule({
          id: tripTicket.id,
          data: tripData,
        });
        toast.success(message ?? "Trip ticket updated", {
          position: "top-center",
        });
        await refreshTripData();
        onClose();
      } else {
        console.log("Submit Details", tripData);

        const response = await submitTripAndSchedule(tripData);

        await refreshTripData();
        toast.success(response.message, {
          position: "top-center",
        });
        setSubmittedTrip(response.trip);

        setShowResult(true);
      }
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
              {tripTicket ? "Edit Trip Ticket" : " Create Trip Ticket"}
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
            <X />
          </button>
        </div>
        <hr className="border-gray-200 mb-8" />

        {showResult ? (
          <TripTicketResult
            trip={submittedTrip}
            onClose={() => {
              setSubmittedTrip(null);
              setShowResult(false);
              reset();
              resetVehiclePicker();
              onClose();
            }}
          />
        ) : (
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
                Trip Details
              </h2>

              <div
                className={
                  tripTicket
                    ? "grid grid-cols-1 md:grid-cols-2 gap-2"
                    : "grid grid-cols-1"
                }
              >
                <div>
                  {tripTicket?.tripTicketNo && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Trip Ticket No.*
                      </label>
                      <input
                        value={tripTicket?.tripTicketNo}
                        readOnly
                        className={inputClass}
                      />
                      {errors.tripTicketNo && (
                        <div className={errorClass}>
                          {errors.tripTicketNo.message}
                        </div>
                      )}
                    </div>
                  )}
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

            <div>
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
                    <div className={errorClass}>
                      {errors.driverName.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Government Vehicle to Be Used, Plate no*
                  </label>

                  <Controller
                    name="vehicleId"
                    control={control}
                    render={({ field }) => {
                      const getVehicleLabel = (v) =>
                        `${v.brand} ${v.model} (${v.plateNumber})`;

                      const matchedVehicle = vehicles.find(
                        (v) => v.id === field.value,
                      );

                      let displayLabel = null;
                      if (matchedVehicle) {
                        displayLabel = getVehicleLabel(matchedVehicle);
                      } else if (selectedVehicle?.plateNumber) {
                        // edit mode: vehicle list not loaded yet, only know the plate number
                        displayLabel = `Plate number: ${selectedVehicle.plateNumber}`;
                      }

                      return (
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            const chosen = vehicles.find(
                              (v) => v.id === Number(value),
                            );
                            setSelectedVehicle(chosen ?? null);
                          }}
                          onOpenChange={(open) => {
                            if (
                              open &&
                              vehicles.length === 0 &&
                              !loadingVehicles
                            ) {
                              fetchAvailableVehicles();
                            }
                          }}
                        >
                          <SelectTrigger
                            className={`${inputClass} cursor-pointer`}
                          >
                            {displayLabel ? (
                              <span className="font-semibold text-gray-800 truncate">
                                {displayLabel}
                              </span>
                            ) : (
                              <SelectValue placeholder="Select a vehicle" />
                            )}
                          </SelectTrigger>

                          <SelectContent className="max-h-80">
                            {loadingVehicles ? (
                              <div className="flex justify-center py-4">
                                <Spinner data-icon />
                              </div>
                            ) : !hasFetchedVehicles ? (
                              <div className="px-3 py-2 text-sm text-gray-400">
                                Pick a departure date first.
                              </div>
                            ) : vehicles.length === 0 ? (
                              <div className="px-3 py-2 text-sm text-gray-400">
                                No vehicles are available for the selected
                                dates.
                              </div>
                            ) : (
                              <SelectGroup>
                                {vehicles.map((v) => (
                                  <SelectItem
                                    key={v.id}
                                    value={String(v.id)}
                                    className="cursor-pointer"
                                  >
                                    <span className="font-semibold text-green-800 truncate ">
                                      {getVehicleLabel(v)}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  {errors.vehicleId && (
                    <div className={errorClass}>{errors.vehicleId.message}</div>
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
                    <textarea
                      {...register("placesToVisit")}
                      id="placesToVisit"
                      type="text"
                      placeholder="*e.g. ANGELES,ARAYAT & STA. RITA, PAMPANGA"
                      className={`h-auto max-h-80 ${inputClass} resize-none overflow-hidden `}
                      onInput={(e) => {
                        e.currentTarget.style.height = "auto";
                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                      }}
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
                      id="purpose"
                      type="text"
                      placeholder="*PURPOSE OF THE TRIP"
                      className={`h-auto ${inputClass} resize-none overflow-hidden `}
                      onInput={(e) => {
                        e.currentTarget.style.height = "auto";
                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                      }}
                    />
                    {errors.purpose && (
                      <div className={errorClass}>{errors.purpose.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={() => {
                  reset();
                  resetVehiclePicker();
                  onClose();
                }}
                variant="destructive"
                className="w-full cursor-pointer sm:w-auto px-8 py-3 font-bold rounded-lg"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer sm:w-auto px-8 py-3 font-bold rounded-lg bg-[#1a5632] text-white shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Spinner data-icon />
                ) : tripTicket?.id ? (
                  "Update"
                ) : (
                  "Submit Trip Ticket"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
