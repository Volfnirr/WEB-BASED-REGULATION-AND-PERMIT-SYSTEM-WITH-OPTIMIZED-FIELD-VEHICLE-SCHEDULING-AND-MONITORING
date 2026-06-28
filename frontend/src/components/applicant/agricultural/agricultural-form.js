"use client";
import React, { useState } from "react";
export default function AgriculturalForm() {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  // Get today's date to prevent future dates in calendar inputs
  const today = new Date().toISOString().split("T")[0];

  // Cascading location data (Replace with your actual data)
  const locations = {
    "City of San Fernando": [
      "Barangay San Jose",
      "Barangay Dolores",
      "Barangay Sindalan",
    ],
    "Angeles City": [
      "Barangay Balibago",
      "Barangay Malabanias",
      "Barangay Pulung Maragul",
    ],
    Mabalacat: ["Barangay Dau", "Barangay Mamatitang", "Barangay Mabiga"],
  };

  const [municipality, setMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  return (
    <div
      className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans"
      style={{ backgroundColor: "#4DAA74" }}
    >
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
          Agricultural Free Patent
        </h1>
        <hr className="border-gray-200 mb-8" />

        <form
          action="/submit_appointment.php"
          method="POST"
          className="space-y-8"
        >
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Applicant's Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="lastName"
                placeholder="*LAST NAME"
                className={inputClass}
                required
              />
              <input
                type="text"
                name="firstName"
                placeholder="*FIRST NAME"
                className={inputClass}
                required
              />
              <input
                type="text"
                name="middleName"
                placeholder="*MIDDLE NAME"
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  MOBILE NUMBER*
                </label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="*09XXXXXXXXX"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  EMAIL ADDRESS*
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="*EMAIL ADDRESS"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  DATE OF BIRTH*
                </label>
                <input
                  type="date"
                  name="birthday"
                  max={today}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  AGE*
                </label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  SEX*
                </label>
                <select
                  name="sex"
                  defaultValue=""
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    SELECT SEX
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  CITIZENSHIP*
                </label>
                <input
                  type="text"
                  name="citizenship"
                  placeholder="*CITIZENSHIP"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  NATURAL BORN?*
                </label>
                <select
                  name="naturalBorn"
                  defaultValue=""
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    SELECT
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  CIVIL STATUS*
                </label>
                <select
                  name="civilStatus"
                  defaultValue=""
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    SELECT STATUS
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                name="spouse"
                placeholder="NAME OF SPOUSE (IF MARRIED)"
                className={inputClass}
              />
              <input
                type="text"
                name="mailingAddress"
                placeholder="*FULL MAILING ADDRESS"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Location of Agricultural Land Applied For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="province"
                className={`${inputClass} bg-gray-100 pointer-events-none`}
                defaultValue="Pampanga"
                required
              >
                <option value="Pampanga">Pampanga</option>
              </select>
              <select
                name="municipality"
                className={inputClass}
                defaultValue=""
                required
                onChange={(e) => {
                  setMunicipality(e.target.value);
                  setBarangay("");
                }}
              >
                <option value="" disabled>
                  *SELECT MUNICIPALITY
                </option>
                {Object.keys(locations).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="barangay"
                className={inputClass}
                value={barangay}
                required
                onChange={(e) => setBarangay(e.target.value)}
              >
                <option value="" disabled>
                  *SELECT BARANGAY
                </option>
                {(locations[municipality] || []).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="location"
                placeholder="SPECIFIC LOCATION / SITIO"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="lotNo"
                placeholder="*LOT NO."
                className={inputClass}
                required
              />
              <input
                type="text"
                name="surveyNo"
                placeholder="*SURVEY NO."
                className={inputClass}
                required
              />
              <input
                type="text"
                name="area"
                placeholder="*LAND AREA (SQM)"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Declarations
            </h2>
            <div className="text-sm text-gray-700 space-y-3 bg-[#fdfdfd] p-5 border border-gray-200 rounded-lg shadow-inner">
              <p>1. I am not an owner of more than 12 hectares of land.</p>
              <p>
                2. I have not filed any petition for judicial titling on the
                same subject lot.
              </p>

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  3. I entered upon and began cultivation of the same on:
                </label>
                <input
                  type="date"
                  name="cultivationDate"
                  max={today}
                  className={`${inputClass} w-full md:w-64 mb-3`}
                />
                <textarea
                  name="improvements"
                  rows="2"
                  placeholder="Improvements made..."
                  className={inputClass}
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  4. (Optional, if applicant is a transferee)
                </label>
                <textarea
                  name="transferee_info"
                  rows="2"
                  placeholder="State public land origin, date of first cultivation, etc."
                  className={inputClass}
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  5. (Optional, if applicant is an heir)
                </label>
                <textarea
                  name="heir_info"
                  rows="2"
                  placeholder="State previous cultivator, date of death, improvements, etc."
                  className={`${inputClass} mb-3`}
                ></textarea>
                <textarea
                  name="evidence"
                  rows="2"
                  placeholder="Evidence of relationship, death, burial, and heirship is attached and consists of:"
                  className={inputClass}
                ></textarea>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Heir Declaration & Witnesses
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Names and addresses of the heirs of my ancestors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="heir1_name"
                  placeholder="HEIR 1 NAME"
                  className={inputClass}
                />
                <input
                  type="text"
                  name="heir1_address"
                  placeholder="HEIR 1 ADDRESS"
                  className={inputClass}
                />
                <input
                  type="text"
                  name="heir2_name"
                  placeholder="HEIR 2 NAME"
                  className={inputClass}
                />
                <input
                  type="text"
                  name="heir2_address"
                  placeholder="HEIR 2 ADDRESS"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-4">
                <span>6. I am</span>
                <input
                  type="text"
                  name="heir_rep_name"
                  placeholder="NAME"
                  className={`${inputClass} w-48`}
                />
                <span>, the only heir/representative of the heirs of</span>
                <input
                  type="text"
                  name="heirs_of"
                  placeholder="ANCESTOR NAME"
                  className={`${inputClass} w-48`}
                />
              </div>

              <p className="text-sm text-gray-700 mt-6 font-medium">
                Witnesses to this application residing in the neighborhood:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="witness1_name"
                  placeholder="WITNESS 1 NAME"
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  name="witness1_address"
                  placeholder="WITNESS 1 ADDRESS"
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  name="witness2_name"
                  placeholder="WITNESS 2 NAME"
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  name="witness2_address"
                  placeholder="WITNESS 2 ADDRESS"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Sworn Statement
            </h2>
            <p className="text-sm text-gray-700 mb-4 italic border-l-4 border-[#4DAA74] pl-3 py-1">
              I hereby certify under oath that the foregoing is true and correct
              to the best of my knowledge and belief.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  DATE FILED
                </label>
                <input
                  type="date"
                  name="date_filed"
                  max={today}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  APPLICANT'S SIGNATURE (E-Sign/Print)
                </label>
                <input
                  type="text"
                  name="applicant_signature"
                  placeholder="TYPE FULL NAME AS SIGNATURE"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
