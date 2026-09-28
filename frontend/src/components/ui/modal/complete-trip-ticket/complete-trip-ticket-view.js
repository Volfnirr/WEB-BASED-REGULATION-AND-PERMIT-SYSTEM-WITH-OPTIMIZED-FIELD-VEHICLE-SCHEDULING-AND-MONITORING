"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CompleteTripTicketView({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const completion = data?.trip_ticket_completion;
  const places = data?.trip_ticket_place ?? [];
  const passengers = data?.trip_ticket_passenger ?? [];

  const fieldClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 min-h-[2.5rem] flex items-center";

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
              Complete Trip Ticket
            </h1>
            <p className="text-gray-500 text-sm">
              B. To be filled by the Driver
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

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Trip Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Trip Ticket No.
                </label>
                <div className={fieldClass}>{data?.tripTicketNo || "—"}</div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Driver
                </label>
                <div className={fieldClass}>{data?.driverName || "—"}</div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Vehicle Plate No.
                </label>
                <div className={fieldClass}>
                  {data?.vehicle?.plateNumber || "—"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Departure from Office
                </label>
                <div className={fieldClass}>
                  {formatDateTime(completion?.timeOfDeparture)}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Arrival Back
                </label>
                <div className={fieldClass}>
                  {formatDateTime(completion?.timeOfArrivalBack)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Places Visited
            </h2>
            {places.length === 0 ? (
              <div className={fieldClass}>{data?.placesToVisit || "—"}</div>
            ) : (
              <div className="space-y-2">
                {places.map((place, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
                  >
                    <div className="text-sm font-semibold text-gray-800">
                      {place.placeName}
                    </div>
                    <div className="text-xs text-gray-600">
                      Arrival: {formatDateTime(place.timeOfArrival)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Departure: {formatDateTime(place.timeOfDeparture)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Fuel &amp; Lubricants (Liters)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Balance in Tank
                </label>
                <div className={fieldClass}>
                  {completion?.fuelBalanceInTank ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Issued by Office
                </label>
                <div className={fieldClass}>
                  {completion?.fuelIssuedByOfficeStock ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Purchased During Trip
                </label>
                <div className={fieldClass}>
                  {completion?.fuelAddPurchasedTrip ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Distance Traveled
                </label>
                <div className={fieldClass}>
                  {completion?.approxDistanceTraveled ??
                    completion?.speedometerDistance ??
                    "—"}{" "}
                  km
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Passengers
            </h2>
            {passengers.length === 0 ? (
              <div className={fieldClass}>
                {data?.authorizedPassengers || "—"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {passengers.map((p, i) => (
                  <div key={i} className={fieldClass}>
                    {p.passengerName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Remarks
            </h2>
            <span className="w-full block rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 min-h-20 whitespace-pre-wrap wrap-break-word">
              {completion?.remarks || "—"}
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-md min-h-9 max-h-md bg-green-700 hover:bg-green-800 transition-colors"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
