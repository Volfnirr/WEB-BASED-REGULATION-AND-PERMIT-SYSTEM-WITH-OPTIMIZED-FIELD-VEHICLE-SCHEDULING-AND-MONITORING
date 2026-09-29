"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { X, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateCompleteTripTicket } from "@/lib/api/vehicle/manage-vehicles";
import { Spinner } from "@/components/ui/spinner";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const completeTripTicketEditSchema = z.object({
  timeOfDeparture: z.coerce.date({
    required_error: "Departure time is required",
    invalid_type_error: "Departure time is required",
  }),
  placesVisited: z
    .array(
      z.object({
        place: z.string().trim().min(1, "Place name is required"),
        timeOfArrival: z.coerce.date().optional().nullable(),
        timeOfDeparture: z.coerce.date().optional().nullable(),
      }),
    )
    .min(1, "At least one place log is required"),
  timeOfArrivalBack: z.coerce.date({
    required_error: "Arrival time is required",
    invalid_type_error: "Arrival time is required",
  }),
  approxDistance: z.coerce
    .number({
      required_error: "Distance is required",
      invalid_type_error: "Must be a valid number",
    })
    .min(0, "Cannot be negative")
    .max(500, "Distance exceeds typical provincial routes"),
  fuelBalance: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(100, "Exceeds standard tank capacity"),
  fuelIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(100, "Exceeds standard tank capacity"),
  fuelPurchased: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(100, "Exceeds standard tank capacity"),
  gearOilIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(10, "Amount too high"),
  lubOilIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(10, "Amount too high"),
  greaseIssued: z.coerce
    .number({ required_error: "Required", invalid_type_error: "Required" })
    .min(0, "Min 0")
    .max(10, "Amount too high"),
  speedometerStart: z.coerce.number().optional().nullable(),
  speedometerEnd: z.coerce.number().optional().nullable(),
  remarks: z.string().trim().min(1, "Remarks are required"),
  passengers: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Passenger name is required"),
      }),
    )
    .optional(),
});

// tripTicket here is a completed-trip row: it must carry the raw nested
// relations (trip_ticket_completion, trip_ticket_place, trip_ticket_passenger)
// alongside the base trip_ticket fields — i.e. pass the `raw` row from
// complete-trip-applications-table.js, not the flattened one.
export default function CompleteTripTicketEditModal({
  isOpen,
  onClose,
  tripTicket,
}) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-[10px] font-bold mt-1";
  const router = useRouter();

  const [places, setPlaces] = useState([
    { place: "", timeOfArrival: undefined, timeOfDeparture: undefined },
  ]);
  const [passengers, setPassengers] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(completeTripTicketEditSchema),
  });
  console.log("Edit modal validation errors:", errors);

  const fuelBalance = Number(watch("fuelBalance")) || 0;
  const fuelIssued = Number(watch("fuelIssued")) || 0;
  const fuelPurchased = Number(watch("fuelPurchased")) || 0;
  const totalFuel = fuelBalance + fuelIssued + fuelPurchased;

  const speedometerStart = Number(watch("speedometerStart")) || 0;
  const speedometerEnd = Number(watch("speedometerEnd")) || 0;
  const computedDistance = Math.max(0, speedometerEnd - speedometerStart);

  useEffect(() => {
    if (!isOpen || !tripTicket) return;

    const completion = tripTicket.trip_ticket_completion;
    const existingPlaces = tripTicket.trip_ticket_place ?? [];
    const existingPassengers = tripTicket.trip_ticket_passenger ?? [];

    const initialPlaces =
      existingPlaces.length > 0
        ? existingPlaces.map((p) => ({
            place: p.placeName,
            timeOfArrival: p.timeOfArrival ? new Date(p.timeOfArrival) : null,
            timeOfDeparture: p.timeOfDeparture
              ? new Date(p.timeOfDeparture)
              : null,
          }))
        : [{ place: "", timeOfArrival: undefined, timeOfDeparture: undefined }];

    reset({
      timeOfDeparture: completion?.timeOfDeparture
        ? new Date(completion.timeOfDeparture)
        : undefined,
      timeOfArrivalBack: completion?.timeOfArrivalBack
        ? new Date(completion.timeOfArrivalBack)
        : undefined,
      approxDistance: completion?.approxDistanceTraveled ?? undefined,
      fuelBalance: completion?.fuelBalanceInTank ?? undefined,
      fuelIssued: completion?.fuelIssuedByOfficeStock ?? undefined,
      fuelPurchased: completion?.fuelAddPurchasedTrip ?? undefined,
      gearOilIssued: completion?.gearOilIssued ?? undefined,
      lubOilIssued: completion?.lubOilIssued ?? undefined,
      greaseIssued: completion?.greaseIssued ?? undefined,
      speedometerStart: completion?.speedometerStart ?? undefined,
      speedometerEnd: completion?.speedometerEnd ?? undefined,
      remarks: completion?.remarks ?? "",
      placesVisited: initialPlaces,
      passengers: existingPassengers.map((p) => ({ name: p.passengerName })),
    });

    setPlaces(initialPlaces);
    setPassengers(existingPassengers.map((p) => ({ name: p.passengerName })));
  }, [tripTicket, isOpen, reset]);

  const handlePlaceChange = (index, field, value) => {
    const updatedPlaces = [...places];
    updatedPlaces[index][field] = value;
    setPlaces(updatedPlaces);
    setValue("placesVisited", updatedPlaces, { shouldValidate: true });
  };

  const addPlace = () => {
    const updatedPlaces = [
      ...places,
      { place: "", timeOfArrival: undefined, timeOfDeparture: undefined },
    ];
    setPlaces(updatedPlaces);
    setValue("placesVisited", updatedPlaces, { shouldValidate: true });
  };

  const removePlace = (indexToRemove) => {
    if (places.length <= 1) return;
    const updatedPlaces = places.filter((_, index) => index !== indexToRemove);
    setPlaces(updatedPlaces);
    setValue("placesVisited", updatedPlaces, { shouldValidate: true });
  };

  const addPassenger = () => {
    const updatedPassengers = [...passengers, { name: "" }];
    setPassengers(updatedPassengers);
    setValue("passengers", updatedPassengers, { shouldValidate: true });
  };

  const removePassenger = (indexToRemove) => {
    const updatedPassengers = passengers.filter(
      (_, index) => index !== indexToRemove,
    );
    setPassengers(updatedPassengers);
    setValue("passengers", updatedPassengers, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (!tripTicket?.id) {
      toast.error("Error: Trip Ticket ID is missing.", {
        position: "top-center",
      });
      return;
    }

    const cleanedPassengers =
      data.passengers?.filter((p) => p.name && p.name.trim() !== "") || [];

    const payload = {
      ...data,
      passengers: cleanedPassengers,
      totalFuel,
      computedDistance,
    };

    try {
      const { message } = await updateCompleteTripTicket({
        id: tripTicket.id,
        data: payload,
      });

      toast.success(message ?? "Driver ticket details updated successfully", {
        position: "top-center",
      });

      router.refresh();
      onClose();
    } catch (err) {
      toast.error(
        err.message || "Something went wrong submitting your report.",
        { position: "top-center" },
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
              Edit Complete Trip Ticket
            </h1>
            <p className="text-gray-500 text-sm">
              B. To be filled by the Driver — Trip Ticket No.{" "}
              {tripTicket?.tripTicketNo}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2 cursor-pointer"
          >
            <X />
          </button>
        </div>
        <hr className="border-gray-200 mb-8" />

        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Schedule Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Departure from Office
                </label>
                <Controller
                  name="timeOfDeparture"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select Departure Date"
                    />
                  )}
                />
                {errors.timeOfDeparture && (
                  <div className={errorClass}>
                    {errors.timeOfDeparture.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Arrival Back
                </label>
                <Controller
                  name="timeOfArrivalBack"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select Arrival Date"
                    />
                  )}
                />
                {errors.timeOfArrivalBack && (
                  <div className={errorClass}>
                    {errors.timeOfArrivalBack.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 mt-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
                Places Visited
              </h2>
              <button
                type="button"
                onClick={addPlace}
                className="flex items-center gap-1 text-xs font-bold text-[#1a5632] hover:underline"
              >
                <Plus size={14} /> Add Place Log
              </button>
            </div>
            {errors.placesVisited?.message && (
              <div className="text-red-600 text-xs font-bold mb-2">
                {errors.placesVisited.message}
              </div>
            )}
            <div className="space-y-2">
              {places.map((placeItem, index) => (
                <div
                  key={index}
                  className="flex flex-col xl:flex-row gap-2 items-start"
                >
                  <div className="w-full xl:w-1/3 flex flex-col gap-1 text-left">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      value={placeItem.place}
                      onChange={(e) =>
                        handlePlaceChange(index, "place", e.target.value)
                      }
                      placeholder="Place"
                      className={inputClass}
                    />
                    {errors.placesVisited?.[index]?.place && (
                      <div className={errorClass}>
                        {errors.placesVisited[index].place.message}
                      </div>
                    )}
                  </div>
                  <div className="w-full xl:flex-1 flex flex-col gap-1 text-left">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Arrival
                    </label>
                    <DateTimePicker
                      value={placeItem.timeOfArrival}
                      onChange={(value) =>
                        handlePlaceChange(index, "timeOfArrival", value)
                      }
                      placeholder="Arrival time"
                    />
                  </div>
                  <div className="w-full xl:flex-1 flex flex-col gap-1 text-left">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Departure
                    </label>
                    <DateTimePicker
                      value={placeItem.timeOfDeparture}
                      onChange={(value) =>
                        handlePlaceChange(index, "timeOfDeparture", value)
                      }
                      placeholder="Departure time"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlace(index)}
                    disabled={places.length <= 1}
                    className="mt-1 xl:mt-6 px-3 py-2 h-10 text-[10px] uppercase font-bold text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
                Fuel &amp; Lubricants (Liters)
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Balance in Tank
                  </label>
                  <input
                    {...register("fuelBalance")}
                    type="number"
                    step="0.1"
                    placeholder="Liters"
                    className={inputClass}
                  />
                  {errors.fuelBalance && (
                    <div className={errorClass}>
                      {errors.fuelBalance.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Issued by Office
                  </label>
                  <input
                    {...register("fuelIssued")}
                    type="number"
                    step="0.1"
                    placeholder="Liters"
                    className={inputClass}
                  />
                  {errors.fuelIssued && (
                    <div className={errorClass}>
                      {errors.fuelIssued.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Purchased During Trip
                  </label>
                  <input
                    {...register("fuelPurchased")}
                    type="number"
                    step="0.1"
                    placeholder="Liters"
                    className={inputClass}
                  />
                  {errors.fuelPurchased && (
                    <div className={errorClass}>
                      {errors.fuelPurchased.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Total Fuel
                  </label>
                  <div
                    className={`${inputClass} flex items-center bg-gray-50`}
                  >
                    <span className="font-mono font-bold text-[#1a5632]">
                      {Number.isNaN(totalFuel) ? "0.0" : totalFuel.toFixed(1)}{" "}
                      L
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Gear Oil Issued
                  </label>
                  <input
                    {...register("gearOilIssued")}
                    type="number"
                    step="0.1"
                    placeholder="Liters"
                    className={inputClass}
                  />
                  {errors.gearOilIssued && (
                    <div className={errorClass}>
                      {errors.gearOilIssued.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Lub. Oil Issued
                  </label>
                  <input
                    {...register("lubOilIssued")}
                    type="number"
                    step="0.1"
                    placeholder="Liters"
                    className={inputClass}
                  />
                  {errors.lubOilIssued && (
                    <div className={errorClass}>
                      {errors.lubOilIssued.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left col-span-2">
                  <label className="text-[10px] font-bold text-gray-700 uppercase">
                    Grease Issued
                  </label>
                  <input
                    {...register("greaseIssued")}
                    type="number"
                    step="0.1"
                    placeholder="Liters"
                    className={inputClass}
                  />
                  {errors.greaseIssued && (
                    <div className={errorClass}>
                      {errors.greaseIssued.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
                Speedometer Readings
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Beginning:
                  </label>
                  <input
                    {...register("speedometerStart")}
                    type="number"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    End:
                  </label>
                  <input
                    {...register("speedometerEnd")}
                    type="number"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1 text-left mt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Distance:
                  </label>
                  <div
                    className={`${inputClass} flex items-center bg-gray-50`}
                  >
                    <span className="font-mono font-bold text-[#1a5632]">
                      {Number.isNaN(computedDistance) ? 0 : computedDistance}{" "}
                      kms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 mt-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
                Passengers
              </h2>
              <button
                type="button"
                onClick={addPassenger}
                className="flex items-center gap-1 text-xs font-bold text-[#1a5632] hover:underline"
              >
                <Plus size={14} /> Add Passenger
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {passengers.map((passenger, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      {...register(`passengers.${index}.name`)}
                      type="text"
                      placeholder={`Passenger ${index + 1} Name`}
                      className={inputClass}
                    />
                    {errors.passengers?.[index]?.name && (
                      <div className={errorClass}>
                        {errors.passengers[index].name.message}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    className="px-3 py-2 h-10 text-[10px] uppercase font-bold text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2 mt-4">
              Remarks
            </h2>
            <div className="flex flex-col gap-1 text-left mb-4">
              <textarea
                {...register("remarks")}
                className={`h-9 ${inputClass} resize-none overflow-hidden `}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
                placeholder="Add remarks here..."
              />
              {errors.remarks && (
                <div className={errorClass}>{errors.remarks.message}</div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
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
              {isSubmitting ? <Spinner data-icon /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}