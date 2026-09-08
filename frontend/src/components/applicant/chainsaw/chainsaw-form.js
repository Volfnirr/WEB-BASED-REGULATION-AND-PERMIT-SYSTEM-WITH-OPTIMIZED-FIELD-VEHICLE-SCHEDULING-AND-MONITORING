"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { submitChainsawForm } from "@/lib/api/applications/chainsaw/chainsaw"; 
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const errorClass = "text-red-600 text-xs font-medium";

  const [showModal, setShowModal] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
          Application for Chainsaw Registration
        </h1>
        <hr className="border-gray-200 mb-8" />

        <form
          className="space-y-8"
          onSubmit={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {/* Section: Registration Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                REGISTRATION TYPE*
              </label>
              <div className="flex flex-col gap-1 text-left">
                <Controller
                  name="registrationType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        size="20"
                        className="w-full px-2 py-2 mb-0 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start"
                      >
                        <SelectValue placeholder="*SELECT TYPE" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Renewal">Renewal</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.registrationType && (
                  <div className={errorClass}>{errors.registrationType.message}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("lastname")}
                  type="text"
                  placeholder="*LAST NAME"
                  className={inputClass}
                />
                {errors.lastname && (
                  <div className={errorClass}>{errors.lastname.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("firstname")}
                  type="text"
                  placeholder="*FIRST NAME"
                  className={inputClass}
                />
                {errors.firstname && (
                  <div className={errorClass}>{errors.firstname.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("middlename")}
                  type="text"
                  placeholder="*MIDDLE NAME"
                  className={inputClass}
                />
                {errors.middlename && (
                  <div className={errorClass}>{errors.middlename.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("extension")}
                  type="text"
                  placeholder="NAME EXTENSION"
                  className={inputClass}
                />
                {errors.extension && (
                  <div className={errorClass}>{errors.extension.message}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("province")}
                  type="text"
                  placeholder="*PROVINCE"
                  className={inputClass}
                />
                {errors.province && (
                  <div className={errorClass}>{errors.province.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("municipality")}
                  type="text"
                  placeholder="*MUNICIPALITY"
                  className={inputClass}
                />
                {errors.municipality && (
                  <div className={errorClass}>{errors.municipality.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("barangay")}
                  type="text"
                  placeholder="*BARANGAY"
                  className={inputClass}
                />
                {errors.barangay && (
                  <div className={errorClass}>{errors.barangay.message}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <textarea
                  {...register("completeAddress")}
                  rows="3"
                  placeholder="*COMPLETE ADDRESS (House No., Street, Subdivision)"
                  className={inputClass}
                ></textarea>
                {errors.completeAddress && (
                  <div className={errorClass}>{errors.completeAddress.message}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  EMAIL ADDRESS*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="*EMAIL ADDRESS"
                    className={inputClass}
                  />
                  {errors.email && (
                    <div className={errorClass}>{errors.email.message}</div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  CONTACT NUMBER*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("contactNumber")}
                    type="text"
                    placeholder="*09XXXXXXXXX"
                    className={inputClass}
                  />
                  {errors.contactNumber && (
                    <div className={errorClass}>{errors.contactNumber.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Chainsaw Specifications */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Chainsaw Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("brand")}
                  type="text"
                  placeholder="*BRAND"
                  className={inputClass}
                />
                {errors.brand && (
                  <div className={errorClass}>{errors.brand.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("model")}
                  type="text"
                  placeholder="*MODEL"
                  className={inputClass}
                />
                {errors.model && (
                  <div className={errorClass}>{errors.model.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("dateAcquisition")}
                  type="text"
                  placeholder="*DATE OF ACQUISITION (MM/DD/YYYY)"
                  className={inputClass}
                />
                {errors.dateAcquisition && (
                  <div className={errorClass}>{errors.dateAcquisition.message}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("serialNumber")}
                  type="text"
                  placeholder="*SERIAL NUMBER"
                  className={inputClass}
                />
                {errors.serialNumber && (
                  <div className={errorClass}>{errors.serialNumber.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("horsePower")}
                  type="text"
                  placeholder="*HORSE POWER"
                  className={inputClass}
                />
                {errors.horsePower && (
                  <div className={errorClass}>{errors.horsePower.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("guideBarLength")}
                  type="text"
                  placeholder="*MAX. LENGTH OF GUIDE BAR"
                  className={inputClass}
                />
                {errors.guideBarLength && (
                  <div className={errorClass}>{errors.guideBarLength.message}</div>
                )}
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
            <div className="flex flex-col gap-1 text-left">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  {...register("privacyConsent")}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 text-[#1a5632] border-gray-300 rounded focus:ring-2 focus:ring-[#1a5632] cursor-pointer"
                />
                <span className="font-semibold text-gray-800 text-xs md:text-sm">
                  I have read and agree to the Data Privacy Consent statement
                  above.*
                </span>
              </label>
              {errors.privacyConsent && (
                <div className={errorClass}>
                  {errors.privacyConsent.message}
                </div>
              )}
            </div>
          </div>

          {/* Form Submission Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !agreedToPrivacy}
              className="px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
        </form>
      </div>

      {showModal && <ThankYouModal onClose={() => setShowModal(false)} />}
    </div>
  );
}