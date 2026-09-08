"use client";

import { X } from "lucide-react";
import { localDateFormat } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";

export default function TripTicketView({ isOpen, onClose, data }) {
  if (!isOpen) return null;

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Trip Ticket
              </h1>
              {data?.status && (
                <span
                  className={`${StatusColor(data.status)} inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-bold bg-green-100 text-green-800`}
                >
                  {data?.status}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              A. To be filled by the Administrative Official Authorizing
              Official Travel
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

        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-2">
              Trip Details
            </h2>

            <div
              className={`grid grid-cols-1 ${data?.startDate === data?.endDate ? "md:grid-cols-2" : "md:grid-cols-3"} gap-2`}
            >
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Trip Ticket No.
                </label>
                <div className={fieldClass}>{data?.tripTicketNo || "—"}</div>
              </div>

              {data?.startDate === data?.endDate ? (
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Schedule Departure/Return
                  </label>
                  <div className={fieldClass}>
                    {localDateFormat(data?.startDate)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Schedule Departure
                    </label>
                    <div className={fieldClass}>
                      {localDateFormat(data?.startDate)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Schedule Return
                    </label>
                    <div className={fieldClass}>
                      {localDateFormat(data?.endDate)}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-2">
              <div className="grid grid-cols-1 gap-2 mb-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Name of Driver of the Vehicle
                  </label>
                  <div className={fieldClass}>{data?.driverName || "—"}</div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Government Vehicle Used, Plate No.
                  </label>
                  <div className={fieldClass}>{data?.plateNumber || "—"}</div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name of Authorized Passenger/s
                </label>
                <div className={fieldClass}>
                  {data?.authorizedPassengers || "—"}
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="grid grid-cols-1 gap-2 mb-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Place or Places Visited/Inspected
                  </label>
                  <div className={fieldClass}>{data?.placesToVisit || "—"}</div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Purpose
                  </label>
                  <span className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 min-h-20 whitespace-pre-wrap wrap-break-word">
                    {data?.purpose || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 cursor-pointer bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
