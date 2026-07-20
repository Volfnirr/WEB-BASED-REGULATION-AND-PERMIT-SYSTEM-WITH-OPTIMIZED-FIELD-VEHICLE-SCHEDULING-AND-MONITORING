"use client";

import React from "react";

export default function ReviewAgricultural({ data }) {
  const agricultural = data;

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
              Review Agricultural Free Patent
            </h1>
            <p className="text-sm text-gray-600">
              Application No.:{" "}
              <span className="font-medium text-gray-900">
                {agricultural?.applicationNo}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Date Submitted:{" "}
              <span className="font-medium text-gray-900">
                {agricultural?.dateSubmitted}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-sm rounded-full border border-yellow-200 shadow-sm">
            {agricultural?.status}
          </div>
        </div>

        <form className="space-y-8">
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.fullname}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Mailing Address
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.mailing_address}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.contact_no}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.email}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.birthday}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.age}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sex
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.sex}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Citizenship
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.citizenship}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Natural Born?
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.natural_born}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Civil Status
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.civil_status}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name of Spouse
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.spouse}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Land Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Location of Agricultural Land Applied For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.province}
                  className={`${readOnlyInputClass} bg-gray-100 pointer-events-none`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Municipality
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.municipality}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Barangay
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.barangay}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specific Location / Sitio
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.specific_loc}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Lot No.
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.lot_no}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Survey No.
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.survey_no}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Land Area (SQM)
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.land_area}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Declarations */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Declarations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cultivation Start Date
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.cultivation_date}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Improvements Made
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.improvements}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Transferee Information (if applicable)
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.transferee_info}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Heir Information (if applicable)
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.heir_info}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Evidence of Relationship / Heirship
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.evidence}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Heirs & Witnesses */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Heir Declaration & Witnesses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                defaultValue={agricultural?.heir1_name}
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                defaultValue={agricultural?.heir1_address}
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                defaultValue={agricultural?.heir2_name}
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                defaultValue={agricultural?.heir2_address}
                className={readOnlyInputClass}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Heir/Representative Name
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.heir_rep_name}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Heir(s) Of
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.heirs_of}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <p className="text-xs font-bold text-gray-700 mb-1 mt-4">
              Witnesses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                defaultValue={agricultural?.witness1_name}
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                defaultValue={agricultural?.witness1_address}
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                defaultValue={agricultural?.witness2_name}
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                defaultValue={agricultural?.witness2_address}
                className={readOnlyInputClass}
                readOnly
              />
            </div>
          </div>

          {/* Section: Sworn Statement */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Sworn Statement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date Filed
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.date_filed}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Applicant's Signature
                </label>
                <input
                  type="text"
                  defaultValue={agricultural?.applicant_signature}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons (for the Reviewer) */}
          <div className="border rounded-xl p-4 text-black">
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
