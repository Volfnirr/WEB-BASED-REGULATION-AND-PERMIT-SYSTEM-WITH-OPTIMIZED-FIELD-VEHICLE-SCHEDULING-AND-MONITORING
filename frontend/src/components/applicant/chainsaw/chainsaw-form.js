"use client";

import React from 'react';

export default function ChainsawForm() {
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  // Get today's date to prevent future dates in the Date of Acquisition field
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans" style={{ backgroundColor: '#4DAA74' }}>
      
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CHAINSAW REGISTRATION</h1>
        </div>
        
        {/* Helper Texts from the Image */}
        <div className="text-sm mb-6 space-y-1">
          <p className="text-green-600 font-medium">
            Asterisk(<span className="text-red-500">*</span>) = Required Fields/ Kailangan lagyan ng impormasyon.
          </p>
        </div>
        
        <hr className="border-gray-200 mb-8" />

        <form action="/submit_chainsaw.php" method="POST" className="space-y-8">
          
          {/* Section: Registration Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Registration Type<span className="text-red-500">*</span>
            </label>
            <select name="registrationType" defaultValue="" className={inputClass} required>
              <option value="" disabled>Select an Registration Type</option>
              <option value="New">New</option>
              <option value="Renewal">Renewal</option>
            </select>
          </div>

          {/* Section: Applicant Details */}
          <div>
            <h2 className="text-md font-bold text-green-700 mb-4">Applicant Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Last name<span className="text-red-500">*</span></label>
                <input type="text" name="lastname" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">First name<span className="text-red-500">*</span></label>
                <input type="text" name="firstname" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Middle name<span className="text-red-500">*</span></label>
                <input type="text" name="middlename" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Extension</label>
                <input type="text" name="extension" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Province</label>
                <input 
                  type="text" 
                  name="province" 
                  defaultValue="Pampanga" 
                  className={`${inputClass} bg-gray-100 pointer-events-none`} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Municipality</label>
                <input type="text" name="municipality" placeholder="Select Municipality" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Barangay</label>
                <input type="text" name="barangay" placeholder="Select Barangay" className={inputClass} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Complete Address<span className="text-red-500">*</span></label>
              <textarea name="completeAddress" rows="3" className={inputClass} required></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
                <input type="email" name="email" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Number:<span className="text-red-500">*</span></label>
                <input type="text" name="contactNumber" className={inputClass} required />
              </div>
            </div>
          </div>

          {/* Section: Chainsaw Specifications */}
          <div>
            <h2 className="text-md font-bold text-green-700 mb-4">Chainsaw Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Brand:<span className="text-red-500">*</span></label>
                <input type="text" name="brand" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Model:<span className="text-red-500">*</span></label>
                <input type="text" name="model" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Date of Acquisition:<span className="text-red-500">*</span></label>
                <input type="date" name="dateAcquisition" max={today} className={inputClass} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Serial Number:<span className="text-red-500">*</span></label>
                <input type="text" name="serialNumber" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Horse Power:<span className="text-red-500">*</span></label>
                <input type="text" name="horsePower" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Max. Length of Guide Bar:<span className="text-red-500">*</span></label>
                <input type="text" name="guideBarLength" className={inputClass} required />
              </div>
            </div>
          </div>

          {/* Form Submission Action */}
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