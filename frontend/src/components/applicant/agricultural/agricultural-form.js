"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

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

import { submitAgriculturalForm } from "@/lib/api/applications/agricultural/agricultural";
import { Spinner } from "@/components/ui/spinner";
import { toTitleCase } from "@/lib/title-case";
import AddressFields from "@/components/forms/AddressFields";
import { getBarangays } from "@/lib/ph-pampanga/ph-address";

const agriculturalFormSchema = z
  .object({
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(255, "Maximum 255 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(255, "Maximum 255 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    middleName: z
      .string()
      .trim()
      .max(255, "Maximum 255 characters allowed")
      .regex(/^[A-Za-z\s]*$/, "Only letters and spaces are allowed")
      .optional(),
    extension: z
      .string()
      .trim()
      .max(50, "Maximum 50 characters allowed")
      .regex(/^[A-Za-z\s]*$/, "Only letters and spaces are allowed")
      .optional(),
    contactNumber: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "Enter a valid 11-digit mobile number")
      .max(11, "Maximum 11 characters allowed"),
    birthday: z.coerce.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please enter a valid date",
    }),
    sex: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Please select a sex" }),
    }),
    citizenship: z
      .string()
      .trim()
      .min(1, "Citizenship is required")
      .max(100, "Maximum 100 characters allowed")
      .regex(/^[A-Za-z\s-]+$/, "Only letters, spaces, and hyphens are allowed"),
    naturalBorn: z.boolean({
      error: "Please select an option",
    }),
    civilStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "ANNULLED"], {
      errorMap: () => ({ message: "Please select civil status" }),
    }),
    spouse: z
      .string()
      .trim()
      .max(255, "Maximum 255 characters allowed")
      .optional(),
    mailingAddress: z
      .string()
      .trim()
      .min(1, "Complete mailing address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    province: z
      .string()
      .trim()
      .min(1, "Province is required")
      .max(255, "Maximum 255 characters allowed"),
    municipality: z
      .string()
      .trim()
      .min(1, "Municipality is required")
      .max(255, "Maximum 255 characters allowed"),
    barangay: z
      .string()
      .trim()
      .min(1, "Barangay is required")
      .max(255, "Maximum 255 characters allowed"),
    location: z
      .string()
      .trim()
      .min(1, "Specific locations is required")
      .max(500, "Maximum 500 characters allowed"),
    lotNo: z
      .string()
      .trim()
      .min(1, "Lot number is required")
      .max(255, "Maximum 255 characters allowed"),
    surveyNo: z
      .string()
      .trim()
      .max(255, "Maximum 255 characters allowed")
      .optional(),
    landAreaSqm: z.coerce
      .number({ required_error: "Land area is required" })
      .positive("Land area must be greater than 0")
      .max(99999999.99, "Value is too large for the database")
      .refine(
        (val) => Math.round(val * 100) === val * 100,
        "Land area can only have up to 2 decimal places",
      ),
    cultivationDate: z
      .string()
      .trim()
      .refine(
        (val) =>
          /^(\d{4}|(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4})$/.test(val),
        { message: "Enter a date as MM/DD/YYYY or just YYYY" },
      ),
    improvements: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    transferee_info: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    heir_info: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    evidence: z
      .string()
      .trim()
      .max(1000, "Maximum 1000 characters allowed")
      .optional(),
    heir1_name: z
      .string()
      .trim()
      .min(1, "Heir 1 name is required")
      .max(255, "Maximum 255 characters allowed"),
    heir1_address: z
      .string()
      .trim()
      .min(1, "Heir 1 adaress is required")
      .max(1000, "Maximum 1000 characters allowed"),
    heir2_name: z
      .string()
      .trim()
      .min(1, "Heir 2 name is required")
      .max(255, "Maximum 255 characters allowed"),
    heir2_address: z
      .string()
      .trim()
      .min(1, "Heir 2 name is required")
      .max(1000, "Maximum 1000 characters allowed"),
    heir_rep_name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(255, "Maximum 255 characters allowed"),
    heirs_of: z
      .string()
      .trim()
      .min(1, "Ancestor name is required")
      .max(255, "Maximum 255 characters allowed"),
    witness1_name: z
      .string()
      .trim()
      .min(1, "Witness 1 name is required")
      .max(255, "Maximum 255 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    witness1_address: z
      .string()
      .trim()
      .min(1, "Witness 1 address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    witness2_name: z
      .string()
      .trim()
      .min(1, "Witness 2 name is required")
      .max(255, "Maximum 255 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    witness2_address: z
      .string()
      .trim()
      .min(1, "Witness 2 address is required")
      .max(1000, "Maximum 1000 characters allowed"),
    date_filed: z.coerce.date({
      required_error: "Date filed is required",
      invalid_type_error: "Please enter a valid date",
    }),
    privacyConsent: z.literal(true, {
      errorMap: () => ({ message: "Please check this box to proceed" }),
    }),
    assignedInspector: z
      .number({ error: "Please assign an inspector" })
      .int("Invalid inspector")
      .positive("Invalid inspector")
      .max(9999, "Invalid inspector"),
  })
  .refine(
    (data) => {
      if (data.civilStatus === "MARRIED") return !!data.spouse?.trim();
      return true;
    },
    {
      path: ["spouse"],
      message: "Spouse name is required for married applicants",
    },
  )
  .refine(
    (data) => {
      if (data.civilStatus !== "MARRIED") return !data.spouse?.trim();
      return true;
    },
    {
      path: ["spouse"],
      message: "Spouse name should only be set if civil status is Married",
    },
  )
  .refine(
    (data) =>
      getBarangays(data.province, data.municipality).includes(data.barangay),
    {
      path: ["barangay"],
      message: "Selected barangay does not belong to the selected municipality",
    },
  );

const civilStatusChoices = [
  { id: 1, value: "SINGLE" },
  { id: 2, value: "MARRIED" },
  { id: 3, value: "WIDOWED" },
  { id: 4, value: "ANNULLED" },
];

export default function AgriculturalForm({ inspectors }) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-xs font-medium";

  const [showModal, setShowModal] = useState(false);
  const [openBirthday, setOpenBirthday] = useState(false);
  const [openDateFiled, setOpenDateFiled] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(agriculturalFormSchema),
    defaultValues: {
      province: "Pampanga",
      privacyConsent: false,
      civilStatus: "",
    },
  });

  const civilStatus = watch("civilStatus");
  const agreedToPrivacy = watch("privacyConsent");

  useEffect(() => {
    if (civilStatus !== "MARRIED") {
      setValue("spouse", "", { shouldValidate: true, shouldDirty: false });
    }
  }, [civilStatus, setValue]);

  const onSubmit = async (data) => {
    try {
      await submitAgriculturalForm(data);
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
          Application for Agricultural Free Patent
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

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("mailingAddress")}
                  type="text"
                  placeholder="*COMPLETE MAILING ADDRESS"
                  className={inputClass}
                />
                {errors.mailingAddress && (
                  <div className={errorClass}>
                    {errors.mailingAddress.message}
                  </div>
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
                    {...register("contactNumber")}
                    type="text"
                    placeholder="*09XXXXXXXXX"
                    className={inputClass}
                  />
                  {errors.contactNumber && (
                    <div className={errorClass}>
                      {errors.contactNumber.message}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  NATURAL BORN?*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <Controller
                    name="naturalBorn"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={
                          field.value === undefined ? "" : String(field.value)
                        }
                        onValueChange={(val) => field.onChange(val === "true")}
                      >
                        <SelectTrigger
                          size="20"
                          className="w-full px-2 py-2 mb-0 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start"
                        >
                          <SelectValue placeholder="*SELECT">
                            {field.value === true
                              ? "Yes"
                              : field.value === false
                                ? "No"
                                : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.naturalBorn && (
                    <div className={errorClass}>
                      {errors.naturalBorn.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="birthday"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  DATE OF BIRTH*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <Controller
                    name="birthday"
                    control={control}
                    render={({ field }) => (
                      <Popover
                        open={openBirthday}
                        onOpenChange={setOpenBirthday}
                      >
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              id="birthday"
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
                              setOpenBirthday(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.birthday && (
                    <div className={errorClass}>{errors.birthday.message}</div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  SEX*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <Controller
                    name="sex"
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
                          <SelectValue placeholder="*SELECT SEX" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.sex && (
                    <div className={errorClass}>{errors.sex.message}</div>
                  )}
                </div>
              </div>
            </div>

            {civilStatus === "MARRIED" && (
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("spouse")}
                    type="text"
                    placeholder="NAME OF SPOUSE (IF MARRIED)"
                    className={inputClass}
                  />
                  {errors.spouse && (
                    <div className={errorClass}>{errors.spouse.message}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section: Land Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Location of Agricultural Land Applied For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <AddressFields
                control={control}
                setValue={setValue}
                errors={errors}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("location")}
                  type="text"
                  placeholder="*SPECIFIC LOCATION / SITIO / STREET"
                  className={inputClass}
                />
                {errors.location && (
                  <div className={errorClass}>{errors.location.message}</div>
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

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("surveyNo")}
                  type="text"
                  placeholder="SURVEY NO."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section: Declarations */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Declarations
            </h2>
            <div className="text-sm text-gray-700 space-y-4 bg-[#fdfdfd] p-5 border border-gray-200 rounded-lg shadow-inner">
              <p>1. I am not an owner of more than 12 hectares of land.</p>
              <p>
                2. I have not filed any petition for judicial titling on the
                same subject lot.
              </p>

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  3. I entered upon and began cultivation of the same on:
                </label>
                <div className="flex flex-col gap-1 text-left mb-3">
                  <input
                    {...register("cultivationDate")}
                    type="text"
                    placeholder="MM/DD/YYYY or Year"
                    className={`${inputClass} w-full md:w-64`}
                  />
                  {errors.cultivationDate && (
                    <div className={errorClass}>
                      {errors.cultivationDate.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <textarea
                    {...register("improvements")}
                    rows="2"
                    placeholder="Improvements made..."
                    className={`${inputClass} resize-none overflow-hidden`}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  4. (Optional, if applicant is a transferee)
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <textarea
                    {...register("transferee_info")}
                    rows="2"
                    placeholder="State public land origin, date of first cultivation, etc."
                    className={`${inputClass} resize-none overflow-hidden`}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  5. (Optional, if applicant is an heir)
                </label>
                <div className="flex flex-col gap-1 text-left mb-3">
                  <textarea
                    {...register("heir_info")}
                    rows="2"
                    placeholder="State previous cultivator, date of death, improvements, etc."
                    className={`${inputClass} resize-none overflow-hidden`}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <textarea
                    {...register("evidence")}
                    rows="2"
                    placeholder="Evidence of relationship, death, burial, and heirship is attached and consists of:"
                    className={`${inputClass} resize-none overflow-hidden`}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Heir Declaration & Witnesses */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Heir Declaration & Witnesses
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Names and addresses of the heirs of my ancestors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("heir1_name")}
                    type="text"
                    placeholder="HEIR 1 NAME"
                    className={inputClass}
                  />
                  {errors.heir1_name && (
                    <div className={errorClass}>
                      {errors.heir1_name.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("heir1_address")}
                    type="text"
                    placeholder="HEIR 1 ADDRESS"
                    className={inputClass}
                  />
                  {errors.heir1_address && (
                    <div className={errorClass}>
                      {errors.heir1_address.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("heir2_name")}
                    type="text"
                    placeholder="HEIR 2 NAME"
                    className={inputClass}
                  />
                  {errors.heir2_name && (
                    <div className={errorClass}>
                      {errors.heir2_name.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("heir2_address")}
                    type="text"
                    placeholder="HEIR 2 ADDRESS"
                    className={inputClass}
                  />
                  {errors.heir2_address && (
                    <div className={errorClass}>
                      {errors.heir2_address.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-4">
                <span>6. I am</span>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("heir_rep_name")}
                    type="text"
                    placeholder="NAME"
                    className={`${inputClass} w-48`}
                  />
                  {errors.heir_rep_name && (
                    <div className={errorClass}>
                      {errors.heir_rep_name.message}
                    </div>
                  )}
                </div>
                <span>, the only heir/representative of the heirs of</span>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("heirs_of")}
                    type="text"
                    placeholder="ANCESTOR NAME"
                    className={`${inputClass} w-48`}
                  />
                  {errors.heirs_of && (
                    <div className={errorClass}>{errors.heirs_of.message}</div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-6 font-medium">
                Witnesses to this application residing in the neighborhood:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("witness1_name")}
                    type="text"
                    placeholder="*WITNESS 1 NAME"
                    className={inputClass}
                  />
                  {errors.witness1_name && (
                    <div className={errorClass}>
                      {errors.witness1_name.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("witness1_address")}
                    type="text"
                    placeholder="*WITNESS 1 ADDRESS"
                    className={inputClass}
                  />
                  {errors.witness1_address && (
                    <div className={errorClass}>
                      {errors.witness1_address.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("witness2_name")}
                    type="text"
                    placeholder="*WITNESS 2 NAME"
                    className={inputClass}
                  />
                  {errors.witness2_name && (
                    <div className={errorClass}>
                      {errors.witness2_name.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("witness2_address")}
                    type="text"
                    placeholder="*WITNESS 2 ADDRESS"
                    className={inputClass}
                  />
                  {errors.witness2_address && (
                    <div className={errorClass}>
                      {errors.witness2_address.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Sworn Statement */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Sworn Statement
            </h2>
            <div className="bg-white p-4 border border-gray-200 rounded my-4">
              <p className="mb-2 font-medium italic">
                I hereby certify under oath that the foregoing is true and
                correct to the best of my knowledge and belief.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  DATE FILED*
                </label>
                <div className="flex flex-col gap-1 text-left">
                  <Controller
                    name="date_filed"
                    control={control}
                    render={({ field }) => (
                      <Popover
                        open={openDateFiled}
                        onOpenChange={setOpenDateFiled}
                      >
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              id="date_filed"
                              className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start ${
                                field.value ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              <div className="flex flex-row justify-between items-center">
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "*DATE FILED"}
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
                              setOpenDateFiled(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date_filed && (
                    <div className={errorClass}>
                      {errors.date_filed.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-left text-sm font-bold text-gray-800 mb-1 uppercase">
                Select Inspector
              </label>

              <Controller
                name="assignedInspector"
                control={control}
                render={({ field }) => {
                  const selectedInspector = inspectors.find(
                    (i) => i.id === field.value,
                  );

                  const getInspectorName = (i) =>
                    toTitleCase(
                      [i.firstName, i.middleName, i.lastName, i.extensionName]
                        .filter(Boolean)
                        .join(" "),
                    );

                  return (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className={inputClass}>
                        {selectedInspector ? (
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-semibold text-gray-800 truncate">
                              {getInspectorName(selectedInspector)}
                            </span>

                            <span className="text-gray-400 truncate">
                              ({selectedInspector.email})
                            </span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select an inspector" />
                        )}
                      </SelectTrigger>

                      <SelectContent className="max-h-80">
                        <SelectGroup>
                          {inspectors
                            .filter((i) => i.isAvailable)
                            .map((i) => (
                              <SelectItem key={i.id} value={String(i.id)}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-semibold text-green-800 truncate">
                                    {getInspectorName(i)}
                                  </span>

                                  <span className="text-xs text-gray-400 truncate">
                                    ({i.email})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              {errors.assignedInspector && (
                <div className={errorClass}>
                  {errors.assignedInspector.message}
                </div>
              )}
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
              for the purpose of processing this Agricultural Free Patent
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
              className="px-8 py-3 cursor-pointer bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
