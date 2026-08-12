"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
//shadcn huhuhuuhh
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarDays } from "lucide-react";
import { submitResidentialForm } from "@/lib/api/applications/residential-form";
import { Spinner } from "@/components/ui/spinner";

const residentialFormSchema = z
  .object({
    // APPLICANT INFORMATION
    lastName: z.string().trim().min(1, "Last name is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    middleName: z.string().trim().optional(),
    extensionName: z.string().trim().optional(),
    email: z.email("Invalid email address"),
    fullAddress: z.string().trim().min(1, "Complete address is required"),
    contactNo: z
      .string()
      .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number"),
    privacyConsent: z.literal(true, "Please check this box to proceed"),
    citizenship: z.string().trim().min(1, "Citizenship is required"),
    civilStatus: z.enum(
      ["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"],
      "Please select a civil status",
    ),
    dateOfBirth: z.coerce.date("Date of birth is required"),
    placeOfBirth: z.string().trim().min(1, "Place of birth is required"),
    spouseName: z.string().trim().optional(),

    // LAND INFORMATION
    province: z.string().trim().min(1, "Province is required"),
    municipality: z.string().trim().min(1, "Municipality is required"),
    barangay: z.string().trim().min(1, "Barangay is required"),
    specificLocation: z
      .string()
      .trim()
      .min(1, "Specific Location / Sitio is required"),
    lotNo: z.string().trim().min(1, "Lot No. is required"),
    landAreaSqm: z.coerce
      .number("Land area is required")
      .positive("Land area must be greater than 0")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places",
      ),

    // AFFIDAVIT
    affidavitProvince: z.string().trim().min(1, "Province is required"),
    affidavitCity: z.string().trim().min(1, "City/Municipality is required"),
    affiantName: z.string().trim().min(1, "Affiant's name is required"),
    affiantAddress: z.string().trim().min(1, "Affiant's address is required"),
    applicantFullName: z
      .string()
      .trim()
      .min(1, "Applicant fullname is required"),
    affidavitLandLocation: z
      .string()
      .trim()
      .min(1, "Land location is required"),
    yearsOfOccupation: z.coerce
      .number("Years in possession is required")
      .int("Years must be a whole number")
      .nonnegative("Years in possession cannot be negative"),
    purposeOfUse: z.string().trim().min(1, "Purpose of use is required"),
    affidavitDate: z.coerce.date("Affidavit date is required"),
    affidavitLocation: z
      .string()
      .trim()
      .min(1, "Affidavit location is required"),
    signatureAffiantName: z
      .string()
      .trim()
      .min(1, "Full name signature is required"),
  })
  .refine(
    (data) => {
      if (data.civilStatus === "MARRIED") {
        return !!data.spouseName?.trim();
      }
      return true;
    },
    {
      path: ["spouseName"],
      message: "Spouse name is required for married applicants",
    },
  );

const civilStatusChoices = [
  { id: 1, value: "SINGLE" },
  { id: 2, value: "MARRIED" },
  { id: 3, value: "WIDOWED" },
  { id: 4, value: "ANNULLED" },
];

export default function ResidentialForm() {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-xs font-medium";

  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openWitness, setOpenWitness] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(residentialFormSchema),
    defaultValues: {
      province: "Pampanga",
      affidavitProvince: "Pampanga",
      privacyConsent: false,
      civilStatus: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await submitResidentialForm(data);
      console.log(data);
      reset();
      setShowModal(true);
    } catch (err) {
      toast.error("Something went wrong submitting your application.", {
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
          Application for Residential Free Patent
        </h1>
        <hr className="border-gray-200 mb-8" />

        <form
          className="space-y-8"
          onSubmit={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="*LAST NAME"
                  className={inputClass}
                />
                {errors.lastName && (
                  <div className={errorClass}>{errors.lastName.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="*FIRST NAME"
                  className={inputClass}
                />
                {errors.firstName && (
                  <div className={errorClass}>{errors.firstName.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("middleName")}
                  type="text"
                  placeholder="MIDDLE NAME"
                  className={inputClass}
                />
                {errors.middleName && (
                  <div className={errorClass}>{errors.middleName.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("extensionName")}
                  type="text"
                  placeholder="NAME EXTENSION"
                  className={inputClass}
                />
                {errors.extensionName && (
                  <div className={errorClass}>
                    {errors.extensionName.message}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("fullAddress")}
                  type="text"
                  placeholder="*COMPLETE ADDRESS"
                  className={inputClass}
                />
                {errors.fullAddress && (
                  <div className={errorClass}>{errors.fullAddress.message}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("citizenship")}
                  type="text"
                  placeholder="*CITIZENSHIP"
                  className={inputClass}
                />
                {errors.citizenship && (
                  <div className={errorClass}>{errors.citizenship.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <Controller
                  name="civilStatus"
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
                        <SelectValue placeholder="*SELECT CIVIL STATUS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {civilStatusChoices.map((c) => (
                            <SelectItem key={c.id} value={c.value}>
                              {c.value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.civilStatus && (
                  <div className={errorClass}>{errors.civilStatus.message}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  CONTACT NUMBER*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("contactNo")}
                    type="text"
                    placeholder="*09XXXXXXXXX"
                    className={inputClass}
                  />
                  {errors.contactNo && (
                    <div className={errorClass}>{errors.contactNo.message}</div>
                  )}
                </div>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  DATE OF BIRTH*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              id="dateOfBirth"
                              className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start ${
                                field.value ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              <div className="flex flex-row justify-between items-center">
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "*DATE OF BIRTH"}
                                <CalendarDays size={20} />
                              </div>
                            </button>
                          }
                        />
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            defaultMonth={field.value}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              field.onChange(date);
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.dateOfBirth && (
                    <div className={errorClass}>
                      {errors.dateOfBirth.message}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  PLACE OF BIRTH*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("placeOfBirth")}
                    type="text"
                    placeholder="*PLACE OF BIRTH"
                    className={inputClass}
                  />
                  {errors.placeOfBirth && (
                    <div className={errorClass}>
                      {errors.placeOfBirth.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("spouseName")}
                  type="text"
                  placeholder="NAME OF SPOUSE (IF MARRIED)"
                  className={inputClass}
                />
                {errors.spouseName && (
                  <div className={errorClass}>{errors.spouseName.message}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Land Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Land Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                {...register("province")}
                type="text"
                readOnly
                className={`${inputClass} bg-gray-100 pointer-events-none`}
              />
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("municipality")}
                  type="text"
                  placeholder="*MUNICIPALITY"
                  className={inputClass}
                />
                {errors.municipality && (
                  <div className={errorClass}>
                    {errors.municipality.message}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("specificLocation")}
                  type="text"
                  placeholder="SPECIFIC LOCATION / SITIO"
                  className={inputClass}
                />
                {errors.specificLocation && (
                  <div className={errorClass}>
                    {errors.specificLocation.message}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("lotNo")}
                  type="text"
                  placeholder="*LOT NO."
                  className={inputClass}
                />
                {errors.lotNo && (
                  <div className={errorClass}>{errors.lotNo.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("landAreaSqm")}
                  type="text"
                  placeholder="*LAND AREA (SQM)"
                  className={inputClass}
                />
                {errors.landAreaSqm && (
                  <div className={errorClass}>{errors.landAreaSqm.message}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Affidavit */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Affidavit Support
            </h2>

            <div className="text-sm text-gray-700 space-y-4 bg-[#fdfdfd] p-5 border border-gray-200 rounded-lg shadow-inner">
              {/* Jurisdiction Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-bold uppercase text-gray-900 w-full md:w-auto">
                  Republic of the Philippines
                </span>
                <span className="hidden md:inline">|</span>
                <span>Province of</span>
                <input
                  {...register("affidavitProvince")}
                  type="text"
                  readOnly
                  className={`${inputClass} w-full md:w-48 bg-gray-100 pointer-events-none`}
                />
                <span>City/Municipality of</span>
                <div className="flex flex-col gap-1 text-left w-full md:w-48">
                  <input
                    {...register("affidavitCity")}
                    type="text"
                    placeholder="CITY/MUNICIPALITY"
                    className={inputClass}
                  />
                  {errors.affidavitCity && (
                    <div className={errorClass}>
                      {errors.affidavitCity.message}
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Affiant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("affiantName")}
                    type="text"
                    placeholder="*AFFIANT'S NAME"
                    className={inputClass}
                  />
                  {errors.affiantName && (
                    <div className={errorClass}>
                      {errors.affiantName.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("affiantAddress")}
                    type="text"
                    placeholder="*AFFIANT'S ADDRESS"
                    className={inputClass}
                  />
                  {errors.affiantAddress && (
                    <div className={errorClass}>
                      {errors.affiantAddress.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("affidavitLandLocation")}
                    type="text"
                    placeholder="*LAND LOCATION"
                    className={inputClass}
                  />
                  {errors.affidavitLandLocation && (
                    <div className={errorClass}>
                      {errors.affidavitLandLocation.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("applicantFullName")}
                    type="text"
                    placeholder="*APPLICANT'S NAME (SAME AS ABOVE)"
                    className={inputClass}
                  />
                  {errors.applicantFullName && (
                    <div className={errorClass}>
                      {errors.applicantFullName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    YEARS IN POSSESSION*
                  </label>
                  <div className="flex flex-col gap-1 text-left">
                    <input
                      {...register("yearsOfOccupation")}
                      type="number"
                      min="0"
                      placeholder="*NO. OF YEARS"
                      className={inputClass}
                    />
                    {errors.yearsOfOccupation && (
                      <div className={errorClass}>
                        {errors.yearsOfOccupation.message}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PURPOSE OF USE*
                  </label>
                  <div className="flex flex-col gap-1 text-left">
                    <input
                      {...register("purposeOfUse")}
                      type="text"
                      placeholder="*PURPOSE OF USE"
                      className={inputClass}
                    />
                    {errors.purposeOfUse && (
                      <div className={errorClass}>
                        {errors.purposeOfUse.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sworn Deposition Text */}
              <div className="bg-white p-4 border border-gray-200 rounded my-4">
                <p className="mb-2 font-medium italic">
                  I, the Affiant, residing at the address provided, hereby
                  depose:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                  <li>
                    I am familiar with the land at the specified location under
                    the application of the applicant.
                  </li>
                  <li>
                    The Applicant has occupied the land for the stated number of
                    years.
                  </li>
                  <li>The land is free from claims and conflicts.</li>
                  <li>The land is used for the stated purposes.</li>
                  <li>This affidavit supports the applicant's claim.</li>
                </ul>
              </div>

              {/* Witness Section */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span>IN WITNESS WHEREOF, I set my hand this</span>
                <div className="flex flex-col gap-1 text-left md:w-40">
                  <Controller
                    name="affidavitDate"
                    control={control}
                    render={({ field }) => (
                      <Popover open={openWitness} onOpenChange={setOpenWitness}>
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              id="affidavitDate"
                              className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start ${
                                field.value ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              <div className="flex flex-row justify-between items-center">
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "MM-DD-YYYY"}
                                <CalendarDays size={20} />
                              </div>
                            </button>
                          }
                        />
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            defaultMonth={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setOpenWitness(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.affidavitDate && (
                    <div className={errorClass}>
                      {errors.affidavitDate.message}
                    </div>
                  )}
                </div>
                <span>at</span>
                <div className="flex flex-col gap-1 text-left w-full md:w-48">
                  <input
                    {...register("affidavitLocation")}
                    type="text"
                    placeholder="LOCATION"
                    className={inputClass}
                  />
                  {errors.affidavitLocation && (
                    <div className={errorClass}>
                      {errors.affidavitLocation.message}
                    </div>
                  )}
                </div>
                ,<span>Philippines.</span>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  AFFIANT'S SIGNATURE (E-Sign/Print)*
                </label>
                <div className="flex flex-col gap-1 text-left w-full md:w-1/2">
                  <input
                    {...register("signatureAffiantName")}
                    type="text"
                    placeholder="TYPE FULL NAME AS SIGNATURE"
                    className={inputClass}
                  />
                  {errors.signatureAffiantName && (
                    <div className={errorClass}>
                      {errors.signatureAffiantName.message}
                    </div>
                  )}
                </div>
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
              for the purpose of processing this Residential Free Patent
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
              disabled={isSubmitting}
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
