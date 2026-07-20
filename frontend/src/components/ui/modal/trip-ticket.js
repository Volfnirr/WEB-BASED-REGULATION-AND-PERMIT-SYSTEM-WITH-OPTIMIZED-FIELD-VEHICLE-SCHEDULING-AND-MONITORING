"use client";
import React, { useState } from "react";

export default function TripTicketModal({ isOpen, onClose }) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  const today = new Date().toISOString().split("T")[0];

  const [passengers, setPassengers] = useState([""]);

  const handlePassengerChange = (index, value) => {
    const updated = [...passengers];
    updated[index] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, ""]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
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
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Trip Ticket
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2"
          >
            &times;
          </button>
        </div>
        <hr className="border-gray-200 mb-8" />

        <form
          action="/submit_trip_ticket.php"
          method="POST"
          className="space-y-8"
        >
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Trip Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Trip Ticket No.*
                </label>
                <input
                  type="text"
                  name="tripTicketNo"
                  placeholder="*TRIP TICKET NO."
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date*
                </label>
                <input
                  type="date"
                  name="date"
                  max={today}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Vehicle Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name of Driver of the Vehicle*
                </label>
                <input
                  type="text"
                  name="driverName"
                  placeholder="*NAME OF DRIVER"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Government Vehicle to Be Used*
                </label>
                <input
                  type="text"
                  name="vehicleUsed"
                  placeholder="*e.g. TOYOTA HILUX"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Plate No.*
                </label>
                <input
                  type="text"
                  name="plateNo"
                  placeholder="*PLATE NO."
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Name of Authorized Passenger/s
            </h2>

            <div className="space-y-3">
              {passengers.map((passenger, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    name={`passenger_${index}`}
                    placeholder={`*PASSENGER ${index + 1} FULL NAME`}
                    value={passenger}
                    onChange={(e) =>
                      handlePassengerChange(index, e.target.value)
                    }
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    disabled={passengers.length === 1}
                    className="shrink-0 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPassenger}
              className="mt-3 px-4 py-2 text-sm font-semibold text-[#1a5632] border border-[#1a5632] rounded-md hover:bg-green-50 transition-colors"
            >
              + Add Passenger
            </button>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Purpose of Travel
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Place or Places to Be Visited/Inspected*
                </label>
                <textarea
                  name="placesVisited"
                  rows="3"
                  placeholder="*e.g. Barangay San Jose, City of San Fernando"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Purpose*
                </label>
                <textarea
                  name="purpose"
                  rows="3"
                  placeholder="*PURPOSE OF THE TRIP"
                  className={inputClass}
                  required
                />
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
              className="px-8 py-3 cursor-pointer bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] transition-colors"
            >
              Submit Trip Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
