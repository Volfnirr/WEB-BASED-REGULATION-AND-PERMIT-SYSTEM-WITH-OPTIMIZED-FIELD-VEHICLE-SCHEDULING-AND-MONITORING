"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { submitChainsawForm } from "@/lib/api/applications/chainsaw-form"; 
import { Spinner } from "@/components/ui/spinner";

const chainsawFormSchema = z.object({
  registrationType: z.enum(["New", "Renewal"], {
    errorMap: () => ({ message: "Please select a registration type" }),
  }),
  lastname: z.string().trim().min(1, "Last name is required"),
  firstname: z.string().trim().min(1, "First name is required"),
  middlename: z.string().trim().min(1, "Middle name is required"),
  extension: z.string().trim().optional(),
  
  province: z.string().trim().min(1, "Province is required"),
  municipality: z.string().trim().min(1, "Municipality is required"),
  barangay: z.string().trim().min(1, "Barangay is required"),
  completeAddress: z.string().trim().min(5, "Complete address is required"),
  
  // FIX 1: Added .string().trim().min(1) before .email()
  email: z.email("Invalid email"),
  

  contactNumber: z 
     .string()
     .trim()
     .regex(/^09\d{9}$/, "Enter a valid 11-digit Philippine mobile number"),

  brand: z.string().trim().min(1, "Brand is required"),
  model: z.string().trim().min(1, "Model is required"),
  dateAcquisition: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Please use MM/DD/YYYY format"),
  serialNumber: z.string().trim().min(1, "Serial number is required"),
  horsePower: z.string().trim().min(1, "Horse power is required"),
  guideBarLength: z.string().trim().min(1, "Guide bar length is required"),

  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Please check this box to proceed" }),
  }),
});

export default function ChainsawForm() {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  const [showModal, setShowModal] = useState(false);

  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(chainsawFormSchema),

  });

  const agreedToPrivacy = watch("privacyConsent");

  const onSubmit = async (data) => {
    try {
     
      await submitChainsawForm(data); 
      console.log("Validated Chainsaw Data:", data);
      reset();
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "An error occurred", {
        position: "top-center",
      });
    }
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

        
        <div className="text-sm mb-6 space-y-1">
          <p className="text-green-600 font-medium">
            Asterisk(<span className="text-red-500">*</span>) = Required Fields/
            Kailangan lagyan ng impormasyon.
          </p>
        </div>

        <hr className="border-gray-200 mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
          <fieldset disabled={isSubmitting} className="space-y-8">
            
           
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-bold text-gray-900">
                Registration Type<span className="text-red-500">*</span>
              </label>
              <select
                {...register("registrationType")}
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select a Registration Type
                </option>
                <option value="New">New</option>
                <option value="Renewal">Renewal</option>
              </select>
              {errors.registrationType && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.registrationType.message}
                </div>
              )}
            </div>

            
            <div>
              <h2 className="text-md font-bold text-green-700 mb-4">
                Applicant Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Last name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("lastname")}
                    className={inputClass}
                  />
                  {errors.lastname && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.lastname.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    First name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("firstname")}
                    className={inputClass}
                  />
                  {errors.firstname && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.firstname.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Middle name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("middlename")}
                    className={inputClass}
                  />
                  {errors.middlename && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.middlename.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Extension
                  </label>
                  <input 
                    type="text" 
                    {...register("extension")} 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div className="flex flex-col gap-1 text-left">
               <label className="block text-xs font-bold text-gray-700">
                 Province<span className="text-red-500">*</span>
               </label>
               <input
                   type="text"
                    {...register("province")}
                    placeholder="Select Province"
                   className={inputClass} 
                 />
                     {errors.province && (
                  <div className="text-red-600 text-xs font-medium">
                  {errors.province.message}
                  </div>
                    )}
               </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Municipality<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("municipality")}
                    placeholder="Select Municipality"
                    className={inputClass}
                  />
                  {errors.municipality && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.municipality.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Barangay<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("barangay")}
                    placeholder="Select Barangay"
                    className={inputClass}
                  />
                  {errors.barangay && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.barangay.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 text-left mb-4">
                <label className="block text-xs font-bold text-gray-700">
                  Complete Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("completeAddress")}
                  rows="3"
                  className={inputClass}
                ></textarea>
                {errors.completeAddress && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.completeAddress.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={inputClass}
                  />
                  {errors.email && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Contact Number:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("contactNumber")}
                    placeholder="e.g. 09123456789"
                    className={inputClass}
                  />
                  {errors.contactNumber && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.contactNumber.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

           
            <div>
              <h2 className="text-md font-bold text-green-700 mb-4">
                Chainsaw Specifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Brand:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("brand")}
                    className={inputClass}
                  />
                  {errors.brand && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.brand.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Model:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("model")}
                    className={inputClass}
                  />
                  {errors.model && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.model.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Date of Acquisition:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("dateAcquisition")}
                    placeholder="MM/DD/YYYY"
                    className={inputClass}
                  />
                  {errors.dateAcquisition && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.dateAcquisition.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Serial Number:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("serialNumber")}
                    className={inputClass}
                  />
                  {errors.serialNumber && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.serialNumber.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Horse Power:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("horsePower")}
                    className={inputClass}
                  />
                  {errors.horsePower && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.horsePower.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Max. Length of Guide Bar:
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("guideBarLength")}
                    className={inputClass}
                  />
                  {errors.guideBarLength && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.guideBarLength.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

           
            <div className="bg-[#f0f7f3] border border-[#d1e5d8] rounded-lg p-4 text-sm text-gray-700">
              <h2 className="text-xs font-bold text-[#1a5632] uppercase tracking-wider mb-2">
                Data Privacy Consent
              </h2>
              <p className="text-xs leading-relaxed text-gray-600 mb-3">
                In compliance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>, I hereby
                authorize the agency/local government unit to collect, process,
                store, and evaluate my personal data and land information strictly
                for the purpose of processing this Chainsaw Registration
                Application. I understand that my information will be protected
                and will not be shared with unauthorized third parties without my
                express written consent.
              </p>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    type="checkbox"
                    {...register("privacyConsent")}
                    className="mt-0.5 h-4 w-4 text-[#1a5632] border-gray-300 rounded focus:ring-2 focus:ring-[#1a5632] cursor-pointer"
                  />
                  
                </div>
                <span className="font-semibold text-gray-800 text-xs md:text-sm">
                  I have read and agree to the Data Privacy Consent statement above.*
                </span>
              </label>
            </div>

            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!agreedToPrivacy || isSubmitting}
                className="flex justify-center items-center px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Spinner data-icon />
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </div>

      {showModal && <ThankYouModal onClose={() => setShowModal(false)} />}
    </div>
  );
}