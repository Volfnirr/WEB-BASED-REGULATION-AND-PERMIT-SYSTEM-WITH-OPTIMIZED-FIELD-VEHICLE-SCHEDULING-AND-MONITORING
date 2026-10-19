"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitResidentialForm } from "@/lib/api/applications/residential/residential";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { toTitleCase } from "@/lib/title-case";
import AddressFields from "@/components/forms/AddressFields";
import { getBarangays } from "@/lib/ph-pampanga/ph-address";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const optionalText = (max, message) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(max, message).optional(),
  );

const requiredPastOrTodayDate = (requiredMessage, futureMessage) =>
  z.coerce
    .date(requiredMessage)
    .refine((value) => value <= new Date(), futureMessage);

const optionalPastOrTodayDate = (futureMessage) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce
      .date()
      .refine((date) => date <= new Date(), futureMessage)
      .optional(),
  );

const residentialFormSchema = z
  .object({
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(100, "Last name is too long")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(100, "First name is too long")
      .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    middleName: optionalText(100, "Middle name is too long"),
    fullAddress: z
      .string()
      .trim()
      .min(1, "Mailing address is required")
      .max(255, "Mailing address is too long"),
    contactNo: z
      .string()
      .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number"),
    privacyConsent: z.literal(true, "Please check this box to proceed"),
    citizenship: z
      .string()
      .trim()
      .min(1, "Citizenship is required")
      .max(50, "Citizenship is too long"),
    civilStatus: z.enum(
      ["SINGLE", "MARRIED", "DIVORCED", "SEPARATED", "WIDOWED"],
      "Please select a civil status",
    ),
    dateOfBirth: requiredPastOrTodayDate(
      "Date of birth is required",
      "Date of birth cannot be in the future",
    ),
    sex: z.enum(["MALE", "FEMALE"], "Please select a sex"),
    spouseName: optionalText(100, "Spouse name is too long"),
    province: z
      .string("Please select a province")
      .trim()
      .min(1, "Please select a province")
      .max(100),
    municipality: z
      .string("Please select a municipality/city")
      .trim()
      .min(1, "Please select a municipality/city")
      .max(100),
    barangay: z
      .string("Please select a barangay")
      .trim()
      .min(1, "Please select a barangay")
      .max(100),
    specificLocation: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(255, "Location is too long"),
    lotNo: z.string().trim().min(1, "Lot No. is required").max(50),
    surveyNo: z.string().trim().min(1, "Survey No. is required").max(100),
    landAreaSqm: z.coerce
      .number("Land area is required")
      .positive("Land area must be greater than 0")
      .max(99999999.99, "Land area cannot exceed 99,999,999.99 sqm")
      .refine(
        (value) => Math.round(value * 100) === value * 100,
        "Land area can only have up to 2 decimal places",
      ),
    occupationDate: requiredPastOrTodayDate(
      "Date of occupation is required",
      "Date of occupation cannot be in the future",
    ),
    heirPredecessorName: optionalText(150, "Predecessor name is too long"),
    heirRelationship: optionalText(100, "Relationship is too long"),
    heirDateOfDeath: optionalPastOrTodayDate(
      "Date of death cannot be in the future",
    ),
    transfereePredecessorName: optionalText(
      150,
      "Predecessor name is too long",
    ),
    transferAction: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.enum(["SOLD", "DONATED", "TRANSFERRED", "ASSIGNED"]).optional(),
    ),
    transactionDate: optionalPastOrTodayDate(
      "Transaction date cannot be in the future",
    ),
    employmentMarriageOccupationDate: optionalPastOrTodayDate(
      "Date of occupation cannot be in the future",
    ),
    marriageWithName: optionalText(150, "Name is too long"),
    forceAbsenceOccupationDate: optionalPastOrTodayDate(
      "Date of occupation cannot be in the future",
    ),
    motherLotOccupationDate: optionalPastOrTodayDate(
      "Date of occupation cannot be in the future",
    ),
    assignedInspector: z
      .number({ error: "Please assign an inspector" })
      .int("Invalid inspector")
      .positive("Invalid inspector")
      .max(9999, "Invalid inspector"),
  })
  .superRefine((data, context) => {
    if (data.civilStatus === "MARRIED" && !hasValue(data.spouseName)) {
      context.addIssue({
        code: "custom",
        path: ["spouseName"],
        message: "Spouse name is required for married applicants",
      });
    }
    if (data.civilStatus !== "MARRIED" && hasValue(data.spouseName)) {
      context.addIssue({
        code: "custom",
        path: ["spouseName"],
        message: "Spouse name should only be set if civil status is Married",
      });
    }
    if (
      hasValue(data.barangay) &&
      hasValue(data.municipality) &&
      !getBarangays(data.province, data.municipality).includes(data.barangay)
    ) {
      context.addIssue({
        code: "custom",
        path: ["barangay"],
        message:
          "Selected barangay does not belong to the selected municipality",
      });
    }

    const requireCompleteGroup = (fields, message) => {
      const count = fields.filter(([key]) => hasValue(data[key])).length;
      if (count === 0 || count === fields.length) return;
      fields.forEach(([key, label]) => {
        if (!hasValue(data[key])) {
          context.addIssue({
            code: "custom",
            path: [key],
            message: `${label} is required ${message}`,
          });
        }
      });
    };

    requireCompleteGroup(
      [
        ["heirPredecessorName", "Predecessor name"],
        ["heirRelationship", "Relationship"],
        ["heirDateOfDeath", "Date of death"],
      ],
      "when completing the heir section",
    );
    requireCompleteGroup(
      [
        ["transfereePredecessorName", "Predecessor name"],
        ["transferAction", "Transfer action"],
        ["transactionDate", "Transaction date"],
      ],
      "when completing the transferee section",
    );
    requireCompleteGroup(
      [
        ["employmentMarriageOccupationDate", "Date of occupation"],
        ["marriageWithName", "Name after marriage with"],
      ],
      "when completing the employment and/or marriage section",
    );
  });

const civilStatusChoices = [
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "SEPARATED",
  "WIDOWED",
];

function calculateAge(value) {
  if (!value) return "";
  const birthDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "";
  const current = new Date();
  let age = current.getFullYear() - birthDate.getFullYear();
  const month = current.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && current.getDate() < birthDate.getDate()))
    age--;
  return age >= 0 ? age : "";
}

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className="text-xs font-medium text-red-600">{error.message}</div>
  );
}

function ResidentialDateField({ name, control, inputClass }) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const value = field.value;
        const parsed = value
          ? value instanceof Date
            ? value
            : new Date(`${value}T00:00:00`)
          : undefined;
        const selected =
          parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <button
                  ref={field.ref}
                  type="button"
                  id={name}
                  onBlur={field.onBlur}
                  data-invalid={fieldState.invalid || undefined}
                  className={`${inputClass} flex h-11 items-center justify-between gap-2 text-left ${selected ? "text-gray-800" : "text-gray-400"}`}
                >
                  <span>
                    {selected
                      ? selected.toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "SELECT DATE"}
                  </span>
                  <CalendarDays size={18} className="shrink-0" />
                </button>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selected}
                defaultMonth={selected ?? today}
                captionLayout="dropdown"
                endMonth={today}
                disabled={{ after: today }}
                onSelect={(date) => {
                  field.onChange(
                    date
                      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                      : "",
                  );
                  field.onBlur();
                  setOpen(false);
                }}
              />
              {selected && (
                <div className="border-t border-gray-200 p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      field.onChange("");
                      field.onBlur();
                      setOpen(false);
                    }}
                  >
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}

function Requirement({ children }) {
  return (
    <p className="mt-3 text-xs leading-5 text-gray-600">
      <span className="font-semibold text-gray-700">Document requirement:</span>{" "}
      {children}
    </p>
  );
}

export default function ResidentialForm({ inspectors = [] }) {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(residentialFormSchema),
    defaultValues: {
      province: "Pampanga",
      municipality: "",
      barangay: "",
      privacyConsent: false,
      civilStatus: "",
      sex: "",
      transferAction: "",
    },
  });

  const civilStatus = watch("civilStatus");
  const dateOfBirth = watch("dateOfBirth");
  const agreedToPrivacy = watch("privacyConsent");
  const age = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);

  useEffect(() => {
    if (civilStatus !== "MARRIED") {
      setValue("spouseName", "", { shouldValidate: true, shouldDirty: false });
    }
  }, [civilStatus, setValue]);

  const onSubmit = async (data) => {
    try {
      await submitResidentialForm(data);
      reset();
      setShowModal(true);
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong submitting your application.",
        { position: "top-center" },
      );
    }
  };

  const inspectorName = (inspector) =>
    toTitleCase(
      [
        inspector.firstName,
        inspector.middleName,
        inspector.lastName,
        inspector.extensionName,
      ]
        .filter(Boolean)
        .join(" "),
    );

  return (
    <div className="flex min-h-7/8 w-full flex-1 items-center justify-center overflow-y-auto bg-[#4DAA74] p-4 mb-2 md:p-8 font-sans relative">
      <div className="mx-auto h-fit w-full max-w-full rounded-xl bg-white p-6 shadow-xl md:p-10">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
          Application for Residential Free Patent
        </h1>
        <hr className="mb-8 border-gray-200" />

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase text-gray-800">
              Applicant Information
            </h2>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <input
                  {...register("lastName")}
                  placeholder="*LAST NAME"
                  className={inputClass}
                />
                <ErrorMessage error={errors.lastName} />
              </div>
              <div>
                <input
                  {...register("firstName")}
                  placeholder="*FIRST NAME"
                  className={inputClass}
                />
                <ErrorMessage error={errors.firstName} />
              </div>
              <div>
                <input
                  {...register("middleName")}
                  placeholder="MIDDLE NAME"
                  className={inputClass}
                />
                <ErrorMessage error={errors.middleName} />
              </div>
            </div>

            <div className="mb-4">
              <textarea
                {...register("fullAddress")}
                placeholder="*MAILING ADDRESS"
                rows={1}
                className={`h-9 ${inputClass} resize-none overflow-hidden`}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
              />
              <ErrorMessage error={errors.fullAddress} />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <input
                  {...register("citizenship")}
                  placeholder="*CITIZENSHIP"
                  className={inputClass}
                />
                <ErrorMessage error={errors.citizenship} />
              </div>
              <div>
                <Controller
                  name="civilStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="*SELECT CIVIL STATUS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {civilStatusChoices.map((status) => (
                            <SelectItem key={status} value={status}>
                              {toTitleCase(status)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage error={errors.civilStatus} />
              </div>
              <div>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="*SELECT SEX" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage error={errors.sex} />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  DATE OF BIRTH*
                </label>
                <ResidentialDateField
                  name="dateOfBirth"
                  control={control}
                  inputClass={inputClass}
                />
                <ErrorMessage error={errors.dateOfBirth} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  AGE
                </label>
                <input
                  value={age}
                  readOnly
                  placeholder="CALCULATED FROM BIRTHDAY"
                  className={`${inputClass} bg-gray-100`}
                />
              </div>
            </div>

            {civilStatus === "MARRIED" && (
              <div className="mb-4">
                <input
                  {...register("spouseName")}
                  placeholder="*NAME OF SPOUSE"
                  className={inputClass}
                />
                <ErrorMessage error={errors.spouseName} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  MOBILE NUMBER*
                </label>
                <input
                  {...register("contactNo")}
                  placeholder="*09XXXXXXXXX"
                  className={inputClass}
                />
                <ErrorMessage error={errors.contactNo} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  EMAIL ADDRESS
                </label>
                <input
                  value="Taken from your account"
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase text-gray-800">
              Lot/Parcel Information
            </h2>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <AddressFields
                control={control}
                setValue={setValue}
                errors={errors}
              />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <input
                  {...register("specificLocation")}
                  placeholder="*LOCATION / SPECIFIC LOCATION"
                  className={inputClass}
                />
                <ErrorMessage error={errors.specificLocation} />
              </div>
              <div>
                <input
                  {...register("lotNo")}
                  placeholder="*LOT NO."
                  className={inputClass}
                />
                <ErrorMessage error={errors.lotNo} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <input
                  {...register("surveyNo")}
                  placeholder="*SURVEY NO."
                  className={inputClass}
                />
                <ErrorMessage error={errors.surveyNo} />
              </div>
              <div>
                <input
                  {...register("landAreaSqm")}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="*AREA (SQ. M.)"
                  className={inputClass}
                />
                <ErrorMessage error={errors.landAreaSqm} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase text-gray-800">
              Declarations
            </h2>
            <div className="space-y-5 rounded-lg border border-gray-200 bg-[#fdfdfd] p-5 text-sm leading-6 text-gray-700 shadow-inner">
              <p>
                1. I am a natural-born Filipino Citizen, as evidenced by my PSA
                Birth Certificate or Certificate of Live Birth in the Local
                Registry, Philippine Passport, or any government-issued ID
                indicating Filipino citizenship, which is hereto attached.
              </p>
              <p>
                2. I am not an awardee of a Residential Free Patent within the
                same city or municipality where the land subject of this
                application is located.
              </p>
              <p>
                3. I am not an owner of more than twelve (12) hectares of land.
              </p>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <p className="mb-3 font-medium">
                  4. a. I have actually occupied and resided in the subject lot
                  continuously since:
                </p>
                <div className="max-w-sm">
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    DATE OF OCCUPATION*
                  </label>
                  <ResidentialDateField
                    name="occupationDate"
                    control={control}
                    inputClass={inputClass}
                  />
                  <ErrorMessage error={errors.occupationDate} />
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Complete each section that applies to you and leave
                non-applicable sections empty. If you use a section, complete
                all of its fields.
              </p>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <p className="mb-3 font-medium">
                  If the applicant is an heir (optional)
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block min-h-8 text-xs font-bold text-gray-700">
                      NAME OF PREDECESSOR-IN-INTEREST
                    </label>
                    <input
                      {...register("heirPredecessorName")}
                      placeholder="NAME"
                      className={`${inputClass} h-11`}
                    />
                    <ErrorMessage error={errors.heirPredecessorName} />
                  </div>
                  <div>
                    <label className="mb-1 block min-h-8 text-xs font-bold text-gray-700">
                      RELATIONSHIP
                    </label>
                    <input
                      {...register("heirRelationship")}
                      placeholder="RELATIONSHIP"
                      className={`${inputClass} h-11`}
                    />
                    <ErrorMessage error={errors.heirRelationship} />
                  </div>
                  <div>
                    <label className="mb-1 block min-h-8 text-xs font-bold text-gray-700">
                      DATE OF DEATH
                    </label>
                    <ResidentialDateField
                      name="heirDateOfDeath"
                      control={control}
                      inputClass={inputClass}
                    />
                    <ErrorMessage error={errors.heirDateOfDeath} />
                  </div>
                </div>
                <p className="mt-3">
                  Since the death of the decedent, I have continuously and
                  actually occupied and resided in the subject lot.
                </p>
                <Requirement>Death certificate of the decedent.</Requirement>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <p className="mb-3 font-medium">
                  If the applicant is a transferee (optional)
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block min-h-8 text-xs font-bold text-gray-700">
                      NAME OF PREDECESSOR-IN-INTEREST
                    </label>
                    <input
                      {...register("transfereePredecessorName")}
                      placeholder="NAME"
                      className={`${inputClass} h-11`}
                    />
                    <ErrorMessage error={errors.transfereePredecessorName} />
                  </div>
                  <div>
                    <label className="mb-1 block min-h-8 text-xs font-bold text-gray-700">
                      TRANSFER ACTION
                    </label>
                    <Controller
                      name="transferAction"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={`${inputClass} h-11`}>
                            <SelectValue placeholder="SELECT TRANSFER ACTION" />
                          </SelectTrigger>
                          <SelectContent>
                            {["SOLD", "DONATED", "TRANSFERRED", "ASSIGNED"].map(
                              (value) => (
                                <SelectItem key={value} value={value}>
                                  {toTitleCase(value)}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <ErrorMessage error={errors.transferAction} />
                  </div>
                  <div>
                    <label className="mb-1 block min-h-8 text-xs font-bold text-gray-700">
                      DATE OF TRANSACTION
                    </label>
                    <ResidentialDateField
                      name="transactionDate"
                      control={control}
                      inputClass={inputClass}
                    />
                    <ErrorMessage error={errors.transactionDate} />
                  </div>
                </div>
                <p className="mt-3">
                  Since the date of the transaction, I have continuously and
                  actually occupied and resided in the subject lot.
                </p>
                <Requirement>Corresponding transfer document.</Requirement>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <p className="mb-3 font-medium">
                  If the applicant is absent due to employment and/or marriage
                  (optional)
                </p>
                <p className="mb-3">
                  I have actually occupied and resided in the subject lot
                  continuously since the date provided below, but was absent
                  thereon due to my employment and/or marriage with the person
                  named below.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">
                      DATE OF OCCUPATION
                    </label>
                    <ResidentialDateField
                      name="employmentMarriageOccupationDate"
                      control={control}
                      inputClass={inputClass}
                    />
                    <ErrorMessage
                      error={errors.employmentMarriageOccupationDate}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">
                      MARRIAGE WITH
                    </label>
                    <input
                      {...register("marriageWithName")}
                      placeholder="NAME"
                      className={inputClass}
                    />
                    <ErrorMessage error={errors.marriageWithName} />
                  </div>
                </div>
                <Requirement>
                  Certificate of Employment, Barangay Certification, Sworn
                  Affidavit, Marriage Certificate, or another document proving
                  the fact.
                </Requirement>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <p className="mb-3 font-medium">
                  If the applicant is absent due to force majeure or fraud,
                  violence, or intimidation (optional)
                </p>
                <p className="mb-3">
                  I have actually occupied and resided in the subject lot
                  continuously since the date provided below, but was absent
                  thereon due to force majeure or commission of fraud, violence,
                  or intimidation upon me or any member of my family.
                </p>
                <div className="max-w-sm">
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    DATE OF OCCUPATION
                  </label>
                  <ResidentialDateField
                    name="forceAbsenceOccupationDate"
                    control={control}
                    inputClass={inputClass}
                  />
                  <ErrorMessage error={errors.forceAbsenceOccupationDate} />
                </div>
                <Requirement>
                  Barangay blotter, summons, complaint-affidavit, Barangay
                  Certification, Sworn Affidavit, or another document proving
                  the fact.
                </Requirement>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <p className="mb-3 font-medium">
                  If the applicant previously occupied a mother lot (optional)
                </p>
                <p className="mb-3">
                  I have actually occupied and resided in the mother lot
                  continuously since:
                </p>
                <div className="max-w-sm">
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    DATE OF OCCUPATION
                  </label>
                  <ResidentialDateField
                    name="motherLotOccupationDate"
                    control={control}
                    inputClass={inputClass}
                  />
                  <ErrorMessage error={errors.motherLotOccupationDate} />
                </div>
                <Requirement>
                  PSA Birth Certificate/s proving relationship, extrajudicial
                  settlement, competent transfer document, waiver, Deed of
                  Donation, or Partition Agreement.
                </Requirement>
              </div>

              <p>
                5. To the best of my knowledge, information, and belief, the
                land applied for is zoned as residential or mixed use.
              </p>
              <p>
                6. I have not filed any petition for judicial titling on the
                same subject lot.
              </p>
              <p>
                7. I agree to demarcate applicable easements consistent with
                existing policies and regulations.
              </p>
              <p>
                8. I understand that willfully submitting false statements or
                executing false affidavits may constitute perjury and may be
                punishable under existing laws.
              </p>
              <p>
                9. I declare that I have read, or someone has read to me, and I
                understand this application, and that every statement is true
                and correct.
              </p>
            </div>
          </section>

          <section>
            <label className="mb-1 block text-sm font-bold uppercase text-gray-800">
              Select Inspector
            </label>
            <Controller
              name="assignedInspector"
              control={control}
              render={({ field }) => {
                const selectedInspector = inspectors.find(
                  (item) => item.id === field.value,
                );
                return (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className={inputClass}>
                      {selectedInspector ? (
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-semibold text-gray-800">
                            {inspectorName(selectedInspector)}
                          </span>
                          <span className="truncate text-gray-400">
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
                          .filter((item) => item.isAvailable)
                          .map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              <span className="font-semibold text-green-800">
                                {inspectorName(item)}
                              </span>{" "}
                              <span className="text-xs text-gray-400">
                                ({item.email})
                              </span>
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            <ErrorMessage error={errors.assignedInspector} />
          </section>

          <section className="rounded-lg border border-[#d1e5d8] bg-[#f0f7f3] p-4 text-sm text-gray-700">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1a5632]">
              Data Privacy Consent
            </h2>
            <p className="mb-3 text-xs leading-relaxed text-gray-600">
              In compliance with the Data Privacy Act of 2012 (RA 10173), I
              authorize the agency or local government unit to collect, process,
              store, and evaluate my personal and land information for this
              Residential Free Patent Application.
            </p>
            <label className="flex cursor-pointer select-none items-start gap-3">
              <input
                {...register("privacyConsent")}
                type="checkbox"
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#1a5632] focus:ring-2 focus:ring-[#1a5632]"
              />
              <span className="text-xs font-semibold text-gray-800 md:text-sm">
                I have read and agree to the Data Privacy Consent statement
                above.*
              </span>
            </label>
            <ErrorMessage error={errors.privacyConsent} />
          </section>

          <div className="flex min-h-15 w-full items-center justify-start gap-2 md:justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !agreedToPrivacy}
              className="min-h-9 cursor-pointer bg-green-700 text-md transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? <Spinner data-icon /> : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
      {showModal && <ThankYouModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
