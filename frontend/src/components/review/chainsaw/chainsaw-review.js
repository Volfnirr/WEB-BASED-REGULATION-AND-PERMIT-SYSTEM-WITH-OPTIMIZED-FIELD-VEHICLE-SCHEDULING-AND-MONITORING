"use client";

import React from 'react';

export default function ReviewChainsawApp() {

  const readOnlyInputClass = "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800 pointer-events-none";

  return (
    <div className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans" style={{ backgroundColor: '#4DAA74' }}>
      
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Review Chainsaw Registration</h1>
            <p className="text-sm text-gray-600">Application No.: <span className="font-medium text-gray-900">CR-2026-00015</span></p>
            <p className="text-sm text-gray-600">Date Submitted: <span className="font-medium text-gray-900">July 3, 2026</span></p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-sm rounded-full border border-yellow-200 shadow-sm">
            Pending
          </div>
        </div>

        <form className="space-y-8">
          
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wide">Applicant Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
                <input type="text" defaultValue="Juan Dela Cruz" className={readOnlyInputClass} readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Contact Number</label>
                <input type="text" defaultValue="09123456789" className={readOnlyInputClass} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email</label>
                <input type="email" defaultValue="juan.delacruz@gmail.com" className={readOnlyInputClass} readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Address</label>
                <input type="text" defaultValue="Brgy. San Antonio, Guagua, Pampanga" className={readOnlyInputClass} readOnly />
              </div>
            </div>
          </div>

          {/* Section: Chainsaw Details */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wide">Chainsaw Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Registration Type</label>
                <input type="text" defaultValue="New Registration" className={readOnlyInputClass} readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Date of Acquisition</label>
                <input type="text" defaultValue="June 15, 2026" className={readOnlyInputClass} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Brand</label>
                <input type="text" defaultValue="Stihl" className={readOnlyInputClass} readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Model</label>
                <input type="text" defaultValue="MS 170" className={readOnlyInputClass} readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Serial Number</label>
                <input type="text" defaultValue="SN-987654321" className={readOnlyInputClass} readOnly />
              </div>
            </div>
          </div>

          {/* Section: Uploaded Requirements */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wide">Uploaded Requirements</h2>
            
            <div className="space-y-3">
              
              {/* Requirement 1 - Uploaded */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Official Receipt / Affidavit of Ownership</p>
                    <p className="text-xs font-medium text-green-600">Uploaded</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold rounded transition-colors shadow-sm">View</button>
                  <button type="button" className="px-4 py-1.5 bg-[#1a5632] hover:bg-[#124024] text-white text-xs font-bold rounded transition-colors shadow-sm">Download</button>
                </div>
              </div>

              {/* Requirement 2 - Uploaded */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Stencil Serial Number of Chainsaw</p>
                    <p className="text-xs font-medium text-green-600">Uploaded</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold rounded transition-colors shadow-sm">View</button>
                  <button type="button" className="px-4 py-1.5 bg-[#1a5632] hover:bg-[#124024] text-white text-xs font-bold rounded transition-colors shadow-sm">Download</button>
                </div>
              </div>

              {/* Requirement 3 - Uploaded */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Detailed Specification of Chainsaw</p>
                    <p className="text-xs font-medium text-green-600">Uploaded</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold rounded transition-colors shadow-sm">View</button>
                  <button type="button" className="px-4 py-1.5 bg-[#1a5632] hover:bg-[#124024] text-white text-xs font-bold rounded transition-colors shadow-sm">Download</button>
                </div>
              </div>

              {/* Requirement 4 - Missing */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Notarized Deed of Absolute Sale</p>
                    <p className="text-xs font-medium text-red-600">Missing</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-1.5 bg-gray-300 text-gray-500 text-xs font-bold rounded cursor-not-allowed shadow-sm" disabled>View</button>
                  <button type="button" className="px-4 py-1.5 bg-gray-300 text-gray-500 text-xs font-bold rounded cursor-not-allowed shadow-sm" disabled>Download</button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Action Buttons (for the Reviewer) */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition-colors">
              Reject Application
            </button>
            <button type="button" className="px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] transition-colors">
              Approve Application
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}