"use client" ;

import React from 'react';

export default function ResidentialApplication() {
  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  // Get today's date to prevent future dates in calendar inputs
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans" style={{ backgroundColor: '#4DAA74' }}>
      
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Application for Residential Free Patent</h1>
        <hr className="border-gray-200 mb-8" />

        <form action="/submit_appointment.php" method="POST" className="space-y-8">
          
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">Applicant Information</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input type="text" name="applicant_name" placeholder="*FULL NAME" className={inputClass} required />
              <input type="text" name="address" placeholder="*COMPLETE ADDRESS" className={inputClass} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" name="citizenship" placeholder="*CITIZENSHIP" className={inputClass} required />
              <select name="civil_status" defaultValue="" className={inputClass} required>
                <option value="" disabled>*SELECT CIVIL STATUS</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Legally Separated">Legally Separated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">DATE OF BIRTH*</label>
                <input type="date" name="dob" max={today} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PLACE OF BIRTH*</label>
                <input type="text" name="pob" placeholder="*PLACE OF BIRTH" className={inputClass} required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <input type="text" name="spouse" placeholder="NAME OF SPOUSE (IF MARRIED)" className={inputClass} />
            </div>
          </div>

          {/* Section: Land Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">Land Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                name="province" 
                placeholder="*PROVINCE" 
                defaultValue="Pampanga" 
                className={`${inputClass} bg-gray-100 pointer-events-none`} 
                required 
              />
              <input 
                type="text" 
                name="municipality" 
                placeholder="*MUNICIPALITY" 
                className={inputClass} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                name="barangay" 
                placeholder="*BARANGAY" 
                className={inputClass} 
                required 
              />
              <input 
                type="text" 
                name="specific_location" 
                placeholder="SPECIFIC LOCATION / SITIO" 
                className={inputClass} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" name="lot_no" placeholder="*LOT NO." className={inputClass} required />
              <input type="text" name="land_area" placeholder="*LAND AREA (SQM)" className={inputClass} required />
            </div>
          </div>

          {/* Section: Affidavit */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">Affidavit Support</h2>
            
            <div className="text-sm text-gray-700 space-y-4 bg-[#fdfdfd] p-5 border border-gray-200 rounded-lg shadow-inner">
              
              {/* Jurisdiction Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-bold uppercase text-gray-900 w-full md:w-auto">Republic of the Philippines</span>
                <span className="hidden md:inline">|</span>
                <span>Province of</span>
                <input 
                  type="text" 
                  name="affidavit_province" 
                  defaultValue="Pampanga" 
                  placeholder="PROVINCE" 
                  className={`${inputClass} w-full md:w-48 bg-gray-100 pointer-events-none`} 
                  required 
                />
                <span>City/Municipality of</span>
                <input type="text" name="city" placeholder="CITY/MUNICIPALITY" className={`${inputClass} w-full md:w-48`} required />
              </div>

              <hr className="border-gray-200" />

              {/* Affiant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input type="text" name="affiant_name" placeholder="*AFFIANT'S NAME" className={inputClass} required />
                <input type="text" name="affiant_address" placeholder="*AFFIANT'S ADDRESS" className={inputClass} required />
                <input type="text" name="affiant_land_location" placeholder="*LAND LOCATION" className={inputClass} required />
                <input type="text" name="affiant_applicant_name" placeholder="*APPLICANT'S NAME (SAME AS ABOVE)" className={inputClass} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">YEARS IN POSSESSION*</label>
                  <input type="number" name="affiant_years" min="0" placeholder="*NO. OF YEARS" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PURPOSE OF USE*</label>
                  <input type="text" name="affiant_use" placeholder="*PURPOSE OF USE" className={inputClass} required />
                </div>
              </div>

              {/* Sworn Deposition Text */}
              <div className="bg-white p-4 border border-gray-200 rounded my-4">
                <p className="mb-2 font-medium italic">I, the Affiant, residing at the address provided, hereby depose:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                  <li>I am familiar with the land at the specified location under the application of the applicant.</li>
                  <li>The Applicant has occupied the land for the stated number of years.</li>
                  <li>The land is free from claims and conflicts.</li>
                  <li>The land is used for the stated purposes.</li>
                  <li>This affidavit supports the applicant's claim.</li>
                </ul>
              </div>

              {/* Witness Section */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span>IN WITNESS WHEREOF, I set my hand this</span>
                <input type="date" name="affidavit_date" max={today} className={`${inputClass} w-full md:w-40`} required />
                <span>at</span>
                <input type="text" name="affidavit_location" placeholder="LOCATION" className={`${inputClass} w-full md:w-48`} required />,
                <span>Philippines.</span>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">AFFIANT'S SIGNATURE (E-Sign/Print)*</label>
                <input type="text" name="affiant_signature" placeholder="TYPE FULL NAME AS SIGNATURE" className={`${inputClass} w-full md:w-1/2`} required />
              </div>

              <hr className="border-gray-200 my-6" />

              {/* Notary / Subscribed Section */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-bold">SUBSCRIBED AND SWORN TO</span>
                <span>before me this</span>
                <input type="date" name="affidavit_subscribed_date" max={today} className={`${inputClass} w-full md:w-40`} required />
                <span>at</span>
                <input type="text" name="affidavit_subscribed_location" placeholder="LOCATION" className={`${inputClass} w-full md:w-48`} required />,
                <span>Philippines.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="affidavit_id_type" placeholder="*TYPE OF ID PRESENTED" className={inputClass} required />
                <input type="text" name="affidavit_id_number" placeholder="*ID NUMBER" className={inputClass} required />
                <input type="text" name="affidavit_issuing_authority" placeholder="*ISSUING AUTHORITY" className={inputClass} required />
                <input type="text" name="affidavit_officer_name" placeholder="*NAME OF OFFICER ADMINISTERING OATH" className={inputClass} required />
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