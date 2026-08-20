"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { submitAgriculturalForm } from "@/lib/api/applications/agricultural-form"; 
import { Spinner } from "@/components/ui/spinner";

const agriculturalFormSchema = z.object({
  lastName: z.string().trim().min(1, "Last name is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().min(1, "Middle name is required"),
  extension: z.string().trim().optional(),
  
  contactNumber: z.string().trim().regex(/^09\d{9}$/, "Enter a valid 11-digit mobile number"),
  email: z.email("Invalid email"),
  birthday: z.string().trim().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Please use MM/DD/YYYY format"),
  
  sex: z.enum(["Male", "Female"], { errorMap: () => ({ message: "Please select a sex" }) }),
  citizenship: z.string().trim().min(1, "Citizenship is required"),
  naturalBorn: z.enum(["Yes", "No"], { errorMap: () => ({ message: "Please select an option" }) }),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Anulled"], { errorMap: () => ({ message: "Please select civil status" }) }),
  
  spouse: z.string().trim().optional(),
  mailingAddress: z.string().trim().min(5, "Complete mailing address is required"),

  province: z.string().trim().min(1, "Province is required"),
  municipality: z.string().trim().min(1, "Municipality is required"),
  barangay: z.string().trim().min(1, "Barangay is required"),
  location: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, "Lot number is required"),
  surveyNo: z.string().trim().optional(),
  area: z.coerce
        .number("Land area is required")
        .positive("Land area must be greater than 0")
        .refine(
          (val) => Math.round(val * 100) === val * 100,
          "Land area can only have up to 2 decimal places",
        ),
  cultivationDate: z.string().trim().optional(),
  improvements: z.string().trim().optional(),
  transferee_info: z.string().trim().optional(),
  heir_info: z.string().trim().optional(),
  evidence: z.string().trim().optional(),

  heir1_name: z.string().trim().optional(),
  heir1_address: z.string().trim().optional(),
  heir2_name: z.string().trim().optional(),
  heir2_address: z.string().trim().optional(),
  heir_rep_name: z.string().trim().optional(),
  heirs_of: z.string().trim().optional(),

  witness1_name: z.string().trim().min(1, "Witness 1 name is required"),
  witness1_address: z.string().trim().min(1, "Witness 1 address is required"),
  witness2_name: z.string().trim().min(1, "Witness 2 name is required"),
  witness2_address: z.string().trim().min(1, "Witness 2 address is required"),

  date_filed: z.string().trim().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Please use MM/DD/YYYY format"),
  applicant_signature: z.string().trim().min(1, "Digital signature is required"),

  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Please check this box to proceed" }),
  }),
});

export default function AgriculturalForm() {
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
    resolver: zodResolver(agriculturalFormSchema),
  });

  const agreedToPrivacy = watch("privacyConsent");

  const onSubmit = async (data) => {
    try {
      await submitAgriculturalForm(data); 
      console.log("Validated Agricultural Data:", data);
      reset();
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "An error occurred during submission", {
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
          Agricultural Free Patent
        </h1>
        
        <div className="text-sm mb-6 space-y-1">
          <p className="text-green-600 font-medium">
            Asterisk(<span className="text-red-500">*</span>) = Required Fields /
            Kailangan lagyan ng impormasyon.
          </p>
        </div>

        <hr className="border-gray-200 mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <fieldset disabled={isSubmitting} className="space-y-8">
            
            {/* APPLICANT'S INFORMATION */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
                Applicant's Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*LAST NAME"
                    {...register("lastName")}
                    className={inputClass}
                  />
                  {errors.lastName && <span className="text-red-600 text-xs font-medium">{errors.lastName.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*FIRST NAME"
                    {...register("firstName")}
                    className={inputClass}
                  />
                  {errors.firstName && <span className="text-red-600 text-xs font-medium">{errors.firstName.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*MIDDLE NAME"
                    {...register("middleName")}
                    className={inputClass}
                  />
                  {errors.middleName && <span className="text-red-600 text-xs font-medium">{errors.middleName.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="NAME EXTENSION"
                    {...register("extension")}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CONTACT NUMBER*
                  </label>
                  <input
                    type="text"
                    placeholder="*09XXXXXXXXX"
                    {...register("contactNumber")}
                    className={inputClass}
                  />
                  {errors.contactNumber && <span className="text-red-600 text-xs font-medium">{errors.contactNumber.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    EMAIL ADDRESS*
                  </label>
                  <input
                    type="email"
                    placeholder="*EMAIL ADDRESS"
                    {...register("email")}
                    className={inputClass}
                  />
                  {errors.email && <span className="text-red-600 text-xs font-medium">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    DATE OF BIRTH*
                  </label>
                  <input
                    type="text"
                    placeholder="*MM/DD/YYYY"
                    {...register("birthday")}
                    className={inputClass}
                  />
                  {errors.birthday && <span className="text-red-600 text-xs font-medium">{errors.birthday.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    SEX*
                  </label>
                  <select
                    defaultValue=""
                    {...register("sex")}
                    className={inputClass}
                  >
                    <option value="" disabled>SELECT SEX</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.sex && <span className="text-red-600 text-xs font-medium">{errors.sex.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CITIZENSHIP*
                  </label>
                  <input
                    type="text"
                    placeholder="*CITIZENSHIP"
                    {...register("citizenship")}
                    className={inputClass}
                  />
                  {errors.citizenship && <span className="text-red-600 text-xs font-medium">{errors.citizenship.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    NATURAL BORN?*
                  </label>
                  <select
                    defaultValue=""
                    {...register("naturalBorn")}
                    className={inputClass}
                  >
                    <option value="" disabled>SELECT</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.naturalBorn && <span className="text-red-600 text-xs font-medium">{errors.naturalBorn.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CIVIL STATUS*
                  </label>
                  <select
                    defaultValue=""
                    {...register("civilStatus")}
                    className={inputClass}
                  >
                    <option value="" disabled>SELECT STATUS</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Anulled">Annulled</option>
                  </select>
                  {errors.civilStatus && <span className="text-red-600 text-xs font-medium">{errors.civilStatus.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="NAME OF SPOUSE (IF MARRIED)"
                    {...register("spouse")}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*FULL MAILING ADDRESS (e.g., House No., Street, Barangay, City, Province)"
                    {...register("mailingAddress")}
                    className={inputClass}
                  />
                  {errors.mailingAddress && <span className="text-red-600 text-xs font-medium">{errors.mailingAddress.message}</span>}
                </div>
              </div>
            </div>

            {/* LOCATION OF AGRICULTURAL LAND APPLIED FOR */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
                Location of Agricultural Land Applied For
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*PROVINCE"
                    defaultValue="Pampanga"
                    {...register("province")}
                    className={inputClass}
                  />
                  {errors.province && <span className="text-red-600 text-xs font-medium">{errors.province.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*MUNICIPALITY / CITY"
                    {...register("municipality")}
                    className={inputClass}
                  />
                  {errors.municipality && <span className="text-red-600 text-xs font-medium">{errors.municipality.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*BARANGAY"
                    {...register("barangay")}
                    className={inputClass}
                  />
                  {errors.barangay && <span className="text-red-600 text-xs font-medium">{errors.barangay.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="SPECIFIC LOCATION / SITIO / STREET"
                    {...register("location")}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*LOT NO."
                    {...register("lotNo")}
                    className={inputClass}
                  />
                  {errors.lotNo && <span className="text-red-600 text-xs font-medium">{errors.lotNo.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="SURVEY NO."
                    {...register("surveyNo")}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="*LAND AREA (SQM)"
                    {...register("area")}
                    className={inputClass}
                  />
                  {errors.area && <span className="text-red-600 text-xs font-medium">{errors.area.message}</span>}
                </div>
              </div>
            </div>

            {/* DECLARATIONS */}
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
                    type="text"
                    placeholder="MM/DD/YYYY or Year"
                    {...register("cultivationDate")}
                    className={`${inputClass} w-full md:w-64 mb-3`}
                  />
                  <textarea
                    rows="2"
                    placeholder="Improvements made..."
                    {...register("improvements")}
                    className={inputClass}
                  ></textarea>
                </div>

                <div className="mt-4">
                  <label className="block mb-1 font-medium">
                    4. (Optional, if applicant is a transferee)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="State public land origin, date of first cultivation, etc."
                    {...register("transferee_info")}
                    className={inputClass}
                  ></textarea>
                </div>

                <div className="mt-4">
                  <label className="block mb-1 font-medium">
                    5. (Optional, if applicant is an heir)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="State previous cultivator, date of death, improvements, etc."
                    {...register("heir_info")}
                    className={`${inputClass} mb-3`}
                  ></textarea>
                  <textarea
                    rows="2"
                    placeholder="Evidence of relationship, death, burial, and heirship is attached and consists of:"
                    {...register("evidence")}
                    className={inputClass}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* HEIR DECLARATION & WITNESSES */}
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
                    placeholder="HEIR 1 NAME"
                    {...register("heir1_name")}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="HEIR 1 ADDRESS"
                    {...register("heir1_address")}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="HEIR 2 NAME"
                    {...register("heir2_name")}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="HEIR 2 ADDRESS"
                    {...register("heir2_address")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-4">
                  <span>6. I am</span>
                  <input
                    type="text"
                    placeholder="NAME"
                    {...register("heir_rep_name")}
                    className={`${inputClass} w-48`}
                  />
                  <span>, the only heir/representative of the heirs of</span>
                  <input
                    type="text"
                    placeholder="ANCESTOR NAME"
                    {...register("heirs_of")}
                    className={`${inputClass} w-48`}
                  />
                </div>

                <p className="text-sm text-gray-700 mt-6 font-medium">
                  Witnesses to this application residing in the neighborhood:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="*WITNESS 1 NAME"
                      {...register("witness1_name")}
                      className={inputClass}
                    />
                    {errors.witness1_name && <span className="text-red-600 text-xs font-medium">{errors.witness1_name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="*WITNESS 1 ADDRESS"
                      {...register("witness1_address")}
                      className={inputClass}
                    />
                    {errors.witness1_address && <span className="text-red-600 text-xs font-medium">{errors.witness1_address.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="*WITNESS 2 NAME"
                      {...register("witness2_name")}
                      className={inputClass}
                    />
                    {errors.witness2_name && <span className="text-red-600 text-xs font-medium">{errors.witness2_name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="*WITNESS 2 ADDRESS"
                      {...register("witness2_address")}
                      className={inputClass}
                    />
                    {errors.witness2_address && <span className="text-red-600 text-xs font-medium">{errors.witness2_address.message}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* SWORN STATEMENT */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
                Sworn Statement
              </h2>
              <p className="text-sm text-gray-700 mb-4 italic border-l-4 border-[#4DAA74] pl-3 py-1">
                I hereby certify under oath that the foregoing is true and correct
                to the best of my knowledge and belief.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    DATE FILED
                  </label>
                  <input
                    type="text"
                    placeholder="*MM/DD/YYYY"
                    {...register("date_filed")}
                    className={inputClass}
                  />
                  {errors.date_filed && <span className="text-red-600 text-xs font-medium">{errors.date_filed.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    APPLICANT'S SIGNATURE (E-Sign/Print)
                  </label>
                  <input
                    type="text"
                    placeholder="*TYPE FULL NAME AS SIGNATURE"
                    {...register("applicant_signature")}
                    className={inputClass}
                  />
                  {errors.applicant_signature && <span className="text-red-600 text-xs font-medium">{errors.applicant_signature.message}</span>}
                </div>
              </div>
            </div>

            {/* DATA PRIVACY CONSENT SECTION */}
            <div className="bg-[#f0f7f3] border border-[#d1e5d8] rounded-lg p-4 text-sm text-gray-700">
              <h2 className="text-xs font-bold text-[#1a5632] uppercase tracking-wider mb-2">
                Data Privacy Consent
              </h2>
              <p className="text-xs leading-relaxed text-gray-600 mb-3">
                In compliance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>, I hereby
                authorize the agency/local government unit to collect, process,
                store, and evaluate my personal data and land information strictly
                for the purpose of processing this Agricultural Free Patent
                Application. I understand that my information will be protected
                and will not be shared with unauthorized third parties without my
                express written consent.
              </p>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="flex flex-col gap-1">
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

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-2">
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