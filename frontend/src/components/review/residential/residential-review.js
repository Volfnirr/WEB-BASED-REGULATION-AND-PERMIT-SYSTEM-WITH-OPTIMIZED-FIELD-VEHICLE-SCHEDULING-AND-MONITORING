"use client";

import React from "react";

export default function ReviewResidential({ data }) {
  const residential = data;

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
              Review Residential Free Patent
            </h1>
            <p className="text-sm text-gray-600">
              Application No.:{" "}
              <span className="font-medium text-gray-900">
                {residential?.applicationNo}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Date Submitted:{" "}
              <span className="font-medium text-gray-900">
                {residential?.dateSubmitted}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-sm rounded-full border border-yellow-200 shadow-sm">
            {residential?.status}
          </div>
        </div>

        <form className="space-y-8">
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800  mb-3">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={residential?.fullname}
                  className={readOnlyInputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Complete Address
                </label>
                <input
                  type="text"
                  defaultValue={residential?.comp_address}
                  className={readOnlyInputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Citizenship
                </label>
                <input
                  type="text"
                  defaultValue={residential?.citizenship}
                  className={readOnlyInputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Civil Status
                </label>
                <input
                  type="text"
                  defaultValue={residential?.civil_status}
                  className={readOnlyInputClass}
                  required
                ></input>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Date
                </label>
                <input
                  type="text"
                  defaultValue={residential?.date}
                  className={readOnlyInputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  PLACE OF BIRTH
                </label>
                <input
                  type="text"
                  defaultValue={residential?.pob}
                  className={readOnlyInputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  NAME OF SPOUSE
                </label>
                <input
                  type="text"
                  defaultValue={residential?.nameofSpouse}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Land Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800  mb-3">
              Land Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  defaultValue={residential?.province}
                  className={`${readOnlyInputClass} bg-gray-100 pointer-events-none`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Municipality
                </label>
                <input
                  type="text"
                  defaultValue={residential?.municipality}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  BARANGAY
                </label>
                <input
                  type="text"
                  defaultValue={residential?.barangay}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Specific Location
                </label>
                <input
                  type="text"
                  defaultValue={residential?.specific_loc}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1  ">
                  Lot No.
                </label>
                <input
                  type="text"
                  defaultValue={residential?.lot_no}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ">
                  Land Area (SQM)
                </label>
                <input
                  type="text"
                  defaultValue={residential?.land_area}
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
