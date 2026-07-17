"use client";

import React, { useState } from 'react';

export default function TreeCuttingForm() {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
    return (
    <div
      className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans"
      style={{ backgroundColor: "#4DAA74" }}
    >
      {/* Changed max-w-4xl to max-w-6xl to perfectly match the background proportions of the previous forms */}
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold text-gray-900">
            DENR Administrative Order No. 2026-06
          </h1>
          <p className="text-sm font-semibold text-gray-700 mt-2">
            Guideline in the Cutting, Gathering, Collection in/or Removal of
            Trees within Residential Lots
          </p>
          <h2 className="text-lg font-bold text-[#1a5632] mt-4 uppercase">
            Annex A
          </h2>
          <p className="text-md font-bold text-gray-800 mt-1">
            Notification for the Cutting and Removal of Trees within Residential
            Lot
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            Please complete all the details in the space provided. Indicate N/A
            if not applicable.
          </p>
        </div>

        <form
          action="/submit_tree_cutting.php"
          method="POST"
          className="space-y-8"
        >
          {/* Section I: Contact Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">
              Section I. Contact Information
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="ownerName"
                placeholder="*NAME OF RESIDENTIAL LOT OWNER"
                className={inputClass}
                required
              />
              <input
                type="text"
                name="mailingAddress"
                placeholder="*MAILING ADDRESS"
                className={inputClass}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="*EMAIL"
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  name="contactNo"
                  placeholder="*CONTACT NO."
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section II: Tree Cutting Activity Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">
              Section II. Tree Cutting Activity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="cuttingAddress"
                placeholder="*COMPLETE ADDRESS WHERE CUTTING/REMOVAL WILL BE CONDUCTED"
                className={inputClass}
                required
              />
              <input
                type="number"
                name="treeCount"
                min="1"
                placeholder="*NO. OF TREES TO BE CUT/REMOVED"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Signature Section */}
          <div className="flex flex-col items-center pt-8 mt-8">
            <input
              type="text"
              name="signature"
              placeholder="SIGNATURE OVER PRINTED NAME"
              className={`${inputClass} text-center border-t-0 border-r-0 border-l-0 rounded-none border-b-2 border-gray-800 w-64 md:w-80 shadow-none focus:ring-0`}
              required
            />
          </div>

          {/* DATA PRIVACY CONSENT SECTION */}
          <div className="bg-[#f0f7f3] border border-[#d1e5d8] rounded-lg p-4 text-sm text-gray-700">
            <h2 className="text-xs font-bold text-[#1a5632] uppercase tracking-wider mb-2">
              Data Privacy Consent
            </h2>
            <p className="text-xs leading-relaxed text-gray-600 mb-3">
              In compliance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>, 
              I hereby authorize the agency/local government unit to collect, process, 
              store, and evaluate my personal data and land information strictly for the 
              purpose of processing this Agricultural Free Patent Application. I understand 
              that my information will be protected and will not be shared with unauthorized 
              third parties without my express written consent.
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
                I have read and agree to the Data Privacy Consent statement above.*
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
             disabled={!agreedToPrivacy}
              className="px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Submit Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
