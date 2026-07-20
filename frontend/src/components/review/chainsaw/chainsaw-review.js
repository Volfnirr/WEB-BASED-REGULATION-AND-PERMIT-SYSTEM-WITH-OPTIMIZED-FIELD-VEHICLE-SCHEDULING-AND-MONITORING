"use client";

import React from "react";

export default function ReviewChainsawApp({ data }) {
  const chainsaw = data;
  const readOnlyInputClass =
    "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800 pointer-events-none";
  return (
    <div
      className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans rounded-lg"
      style={{ backgroundColor: "#4DAA74" }}
    >
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Review Chainsaw Registration
            </h1>
            <p className="text-sm text-gray-600">
              Application No.:{" "}
              <span className="font-medium text-gray-900">
                {chainsaw?.applicationNo}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Date Submitted:{" "}
              <span className="font-medium text-gray-900">
                {chainsaw?.dateSubmitted}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-sm rounded-full border border-yellow-200 shadow-sm">
            {chainsaw?.status}
          </div>
        </div>

        <form className="space-y-8">
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wide">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.fullname}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Contact Number
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.contact_no}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={chainsaw?.email}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Address
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.address}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Chainsaw Details */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wide">
              Chainsaw Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Registration Type
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.regtype}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Date of Acquisition
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.dataOfAcquisition}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Brand
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.brand}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Model
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.model}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                  Serial Number
                </label>
                <input
                  type="text"
                  defaultValue={chainsaw?.serNum}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons (for the Reviewer) */}
          <div className="border rounded-xl p-4 text-black ">
            <h3 className="font-bold mb-4">ACTION</h3>

            <div className="flex flex-col justify-center gap-4">
              <select id="status" className="border rounded-lg p-3">
                <option value="Approved">Approve</option>
                <option value="Rejected">Reject</option>
              </select>
              <div>
                <p className="font-semibold mb-2">Review</p>

                <textarea
                  id="comment"
                  rows="5"
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter comments here..."
                />
              </div>
              <button className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                Submit Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
