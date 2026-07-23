"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import React, { useState } from "react";

export default function ChainsawForm() {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger modal upon form submission
    setShowModal(true);
  };

  return (
    <div
      className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans relative"
      style={{ backgroundColor: "#4DAA74" }}
    >
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            CHAINSAW REGISTRATION
          </h1>
        </div>

        {/* Helper Texts from the Image */}
        <div className="text-sm mb-6 space-y-1">
          <p className="text-green-600 font-medium">
            Asterisk(<span className="text-red-500">*</span>) = Required Fields/
            Kailangan lagyan ng impormasyon.
          </p>
        </div>

        <hr className="border-gray-200 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Registration Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Registration Type<span className="text-red-500">*</span>
            </label>
            <select
              name="registrationType"
              defaultValue=""
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select an Registration Type
              </option>
              <option value="New">New</option>
              <option value="Renewal">Renewal</option>
            </select>
          </div>

          {/* Section: Applicant Details */}
          <div>
            <h2 className="text-md font-bold text-green-700 mb-4">
              Applicant Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Last name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  First name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Middle name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="middlename"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Extension
                </label>
                <input type="text" name="extension" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  defaultValue="Pampanga"
                  className={`${inputClass} bg-gray-100 pointer-events-none`}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Municipality
                </label>
                <input
                  type="text"
                  name="municipality"
                  placeholder="Select Municipality"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Barangay
                </label>
                <input
                  type="text"
                  name="barangay"
                  placeholder="Select Barangay"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Complete Address<span className="text-red-500">*</span>
              </label>
              <textarea
                name="completeAddress"
                rows="3"
                className={inputClass}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contact Number:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Chainsaw Specifications */}
          <div>
            <h2 className="text-md font-bold text-green-700 mb-4">
              Chainsaw Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brand:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Model:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date of Acquisition:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dateAcquisition"
                  placeholder="*MM/DD/YYYY"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Serial Number:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Horse Power:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="horsePower"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Max. Length of Guide Bar:
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guideBarLength"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* DATA PRIVACY CONSENT SECTION */}
          <div className="bg-[#f0f7f3] border border-[#d1e5d8] rounded-lg p-4 text-sm text-gray-700">
            <h2 className="text-xs font-bold text-[#1a5632] uppercase tracking-wider mb-2">
              Data Privacy Consent
            </h2>
            <p className="text-xs leading-relaxed text-gray-600 mb-3">
              In compliance with the{" "}
              <strong>Data Privacy Act of 2012 (RA 10173)</strong>, I hereby
              authorize the agency/local government unit to collect, process,
              store, and evaluate my personal data and land information strictly
              for the purpose of processing this Chainsaw Registration
              Application. I understand that my information will be protected
              and will not be shared with unauthorized third parties without my
              express written consent.
            </p>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="privacy_consent"
                value="agreed"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#1a5632] border-gray-300 rounded focus:ring-2 focus:ring-[#1a5632] cursor-pointer"
                required
              />
              <span className="font-semibold text-gray-800 text-xs md:text-sm">
                I have read and agree to the Data Privacy Consent statement
                above.*
              </span>
            </label>
          </div>

          {/* Form Submission Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!agreedToPrivacy}
              className="px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>

      {showModal && <ThankYouModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
