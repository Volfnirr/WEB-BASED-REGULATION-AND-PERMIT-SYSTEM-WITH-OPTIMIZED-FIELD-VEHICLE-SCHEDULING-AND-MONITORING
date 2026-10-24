"use client";

import ThankYouModal from "@/components/ui/modal/thankyou";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller, useWatch } from "react-hook-form";

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
import AddressFields from "@/components/forms/AddressFields";
import { getBarangays } from "@/lib/ph-pampanga/ph-address";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";
const optionalText = (max = 1000) =>
  z.preprocess(
    (value) => (typeof value === "string" && !value.trim() ? undefined : value),
    z.string().trim().max(max, "This value is too long").optional(),
  );
const requiredText = (label, max = 255) =>
  z
    .string(label + " is required")
    .trim()
    .min(1, label + " is required")
    .max(max, label + " is too long");
const personName = (label) =>
  requiredText(label).regex(
    /^[\p{L}\p{M} .'-]+$/u,
    "Use letters, spaces, apostrophes, periods, or hyphens",
  );
function todayInManila() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type) => parts.find((entry) => entry.type === type).value;
  return part("year") + "-" + part("month") + "-" + part("day");
}
function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00.000Z");
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
const dateField = (label) =>
  requiredText(label, 10)
    .refine(isRealDate, "Choose a valid full date")
    .refine(
      (value) => !isRealDate(value) || value <= todayInManila(),
      label + " cannot be in the future",
    );
const optionalDate = (label) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    dateField(label).optional(),
  );

const agriculturalFormSchema = z
  .object({
    lastName: personName("Last name"),
    firstName: personName("First name"),
    middleName: optionalText(255),
    contactNumber: requiredText("Contact number", 11).regex(
      /^09\d{9}$/,
      "Enter a valid 11-digit mobile number starting with 09",
    ),
    birthday: dateField("Date of birth"),
    sex: z.enum(["Male", "Female"], "Please select a sex"),
    citizenship: requiredText("Citizenship", 100),
    naturalBorn: z.boolean("Please select Yes or No"),
    civilStatus: z.enum(
      ["SINGLE", "MARRIED", "DIVORCED", "SEPARATED", "WIDOWED"],
      "Please select a civil status",
    ),
    spouse: optionalText(255),
    mailingAddress: requiredText("Mailing address", 1000),
    province: requiredText("Province"),
    municipality: requiredText("Municipality"),
    barangay: requiredText("Barangay"),
    location: requiredText("Specific location", 500),
    lotNo: requiredText("Lot number"),
    surveyNo: requiredText("Survey number"),
    landAreaSqm: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce
        .number("Enter a valid land area")
        .positive("Land area must be greater than 0")
        .max(99999999.99, "Land area is too large")
        .refine(
          (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
          "Use at most 2 decimal places",
        ),
    ),
    cultivationDate: dateField("Cultivation date"),
    improvements: optionalText(),
    firstCultivatorName: optionalText(255),
    firstCultivationDate: optionalDate("First cultivation date"),
    previousCultivatorName: optionalText(255),
    previousCultivatorDeathDate: optionalDate("Date of death"),
    heirImprovements: optionalText(),
    evidence: optionalText(),
    heir1_name: optionalText(255),
    heir1_address: optionalText(),
    heir2_name: optionalText(255),
    heir2_address: optionalText(),
    heir3_name: optionalText(255),
    heir3_address: optionalText(),
    unoccupiedPeriodAndReason: optionalText(),
    witness1_name: personName("Witness 1 name"),
    witness1_address: requiredText("Witness 1 address", 1000),
    witness2_name: personName("Witness 2 name"),
    witness2_address: requiredText("Witness 2 address", 1000),
    privacyConsent: z.literal(true, "Please agree to the Data Privacy Consent"),
  })
  .superRefine((data, context) => {
    const requireField = (key, message) => {
      if (!hasValue(data[key]))
        context.addIssue({ code: "custom", path: [key], message });
    };
    if (data.civilStatus === "MARRIED")
      requireField("spouse", "Spouse name is required when Married");
    if (data.civilStatus !== "MARRIED" && hasValue(data.spouse)) {
      context.addIssue({
        code: "custom",
        path: ["spouse"],
        message: "Spouse name applies only when Married",
      });
    }
    if (
      !getBarangays(data.province, data.municipality).includes(data.barangay)
    ) {
      context.addIssue({
        code: "custom",
        path: ["barangay"],
        message: "Select a barangay belonging to the selected municipality",
      });
    }
    const transferee = ["firstCultivatorName", "firstCultivationDate"];
    if (transferee.some((key) => hasValue(data[key]))) {
      transferee.forEach((key) =>
        requireField(
          key,
          "Complete both transferee fields or leave both blank",
        ),
      );
    }
    const heirCore = [
      "previousCultivatorName",
      "previousCultivatorDeathDate",
      "heirImprovements",
      "evidence",
    ];
    const heirRows = [1, 2, 3].flatMap((row) => [
      "heir" + row + "_name",
      "heir" + row + "_address",
    ]);
    if ([...heirCore, ...heirRows].some((key) => hasValue(data[key]))) {
      heirCore.forEach((key) =>
        requireField(
          key,
          "Complete this field when using the heir section (enter None for no improvements)",
        ),
      );
    }
    for (const row of [1, 2, 3]) {
      const pair = ["heir" + row + "_name", "heir" + row + "_address"];
      if (pair.some((key) => hasValue(data[key]))) {
        pair.forEach((key) =>
          requireField(
            key,
            "Enter both the heir name and address, or leave this row blank",
          ),
        );
      }
    }
  });

const civilStatusChoices = [
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "SEPARATED",
  "WIDOWED",
].map((value, id) => ({ id, value }));

function AgriculturalDateField({ name, control, inputClass }) {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const parsed = field.value
          ? new Date(field.value + "T00:00:00")
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
                  id={name}
                  type="button"
                  onBlur={field.onBlur}
                  data-invalid={fieldState.invalid || undefined}
                  className={
                    inputClass +
                    " flex min-h-10 items-center justify-between gap-2 text-left"
                  }
                >
                  <span
                    className={selected ? "text-gray-800" : "text-gray-400"}
                  >
                    {selected
                      ? selected.toLocaleDateString("en-GB")
                      : "DD/MM/YYYY"}
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
                      ? date.getFullYear() +
                          "-" +
                          String(date.getMonth() + 1).padStart(2, "0") +
                          "-" +
                          String(date.getDate()).padStart(2, "0")
                      : "",
                  );
                  field.onBlur();
                  setOpen(false);
                }}
              />
              {selected && (
                <button
                  type="button"
                  className="w-full border-t p-2 text-sm text-gray-600"
                  onClick={() => {
                    field.onChange("");
                    field.onBlur();
                    setOpen(false);
                  }}
                >
                  Clear date
                </button>
              )}
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
function AgriculturalField({
  name,
  label,
  register,
  control,
  errors,
  inputClass,
  date = false,
  multiline = false,
}) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={name} className="text-xs font-bold text-gray-700">
        {label}
      </label>
      {date ? (
        <AgriculturalDateField
          name={name}
          control={control}
          inputClass={inputClass}
        />
      ) : multiline ? (
        <textarea
          id={name}
          {...register(name)}
          rows={2}
          className={`${inputClass} resize-none overflow-hidden`}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
        />
      ) : (
        <input
          id={name}
          {...register(name)}
          type="text"
          className={inputClass}
        />
      )}
      {errors[name] && (
        <p className="text-red-600 text-xs font-medium">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export default function AgriculturalForm() {
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const errorClass = "text-red-600 text-xs font-medium";

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(agriculturalFormSchema),
    defaultValues: {
      province: "Pampanga",
      privacyConsent: false,
      civilStatus: "",
      birthday: "",
      cultivationDate: "",
      firstCultivationDate: "",
      previousCultivatorDeathDate: "",
    },
  });

  const [
    civilStatus,
    agreedToPrivacy,
    birthday,
    firstName,
    middleName,
    lastName,
    ancestorName,
  ] = useWatch({
    control,
    name: [
      "civilStatus",
      "privacyConsent",
      "birthday",
      "firstName",
      "middleName",
      "lastName",
      "previousCultivatorName",
    ],
  });
  const applicantName = [firstName, middleName, lastName]
    .filter(Boolean)
    .join(" ");
  const heirValues = useWatch({
    control,
    name: [
      "previousCultivatorName",
      "previousCultivatorDeathDate",
      "heirImprovements",
      "evidence",
      "heir1_name",
      "heir1_address",
      "heir2_name",
      "heir2_address",
      "heir3_name",
      "heir3_address",
    ],
  });
  const hasHeirDetails = heirValues.some(hasValue);
  let age = "";
  if (isRealDate(birthday || "")) {
    const birth = new Date(birthday + "T00:00:00");
    const today = new Date(todayInManila() + "T00:00:00");
    age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    )
      age--;
    if (age < 0) age = "";
  }
  const fieldProps = { register, control, errors, inputClass };

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
      Object.entries(err.fieldErrors || {}).forEach(([name, messages]) => {
        if (messages?.length)
          setError(name, { type: "server", message: messages[0] });
      });
      toast.error(
        err.message || "Something went wrong submitting your application.",
        {
          position: "top-center",
        },
      );
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  <AgriculturalDateField
                    name="birthday"
                    control={control}
                    inputClass={inputClass}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="age"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                AGE
              </label>
              <input
                id="age"
                value={age}
                readOnly
                className={inputClass + " bg-gray-50"}
                placeholder="Calculated from birthday"
              />
            </div>
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
                  placeholder="*SURVEY NO."
                  className={inputClass}
                />
                {errors.surveyNo && (
                  <p className={errorClass}>{errors.surveyNo.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Declarations */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Declarations
            </h2>
            <div className="text-sm text-gray-700 space-y-6 bg-[#fdfdfd] p-5 border border-gray-200 rounded-lg shadow-inner">
              <p>1. I am not an owner of more than 12 hectares of land.</p>
              <p>
                2. I have not filed any petition for judicial titling on the
                same subject lot.
              </p>
              <div className="space-y-3">
                <p>
                  3. I entered upon and began cultivation of the same on the
                  date below, and since then, I have continuously cultivated the
                  land; and have made thereon the following improvements:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AgriculturalField
                    {...fieldProps}
                    name="cultivationDate"
                    label="DATE CULTIVATION BEGAN *"
                    date
                  />
                  <AgriculturalField
                    {...fieldProps}
                    name="improvements"
                    label="IMPROVEMENTS MADE"
                    multiline
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Complete each optional section that applies. Leave
                non-applicable sections blank. If completing the heir section,
                describe the improvements and attached evidence; enter None if
                there are no improvements.
              </p>
              <div className="space-y-3">
                <p>
                  4. (Optional, if the applicant is a transferee) The land
                  described and applied for is not claimed or occupied by any
                  other person but is public land which was first occupied and
                  cultivated by the person below on the date indicated.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AgriculturalField
                    {...fieldProps}
                    name="firstCultivatorName"
                    label="NAME OF FIRST CULTIVATOR"
                  />
                  <AgriculturalField
                    {...fieldProps}
                    name="firstCultivationDate"
                    label="DATE FIRST OCCUPIED AND CULTIVATED"
                    date
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p>
                  5. (Optional, if the applicant is an heir) The previous
                  cultivator named below, who was my ancestor, died on the date
                  indicated. Since his/her death, I have cultivated the said
                  land and existing improvements thereon which consist of the
                  following:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AgriculturalField
                    {...fieldProps}
                    name="previousCultivatorName"
                    label="NAME OF PREVIOUS CULTIVATOR / ANCESTOR"
                  />
                  <AgriculturalField
                    {...fieldProps}
                    name="previousCultivatorDeathDate"
                    label="DATE OF DEATH"
                    date
                  />
                </div>
                <AgriculturalField
                  {...fieldProps}
                  name="heirImprovements"
                  label="EXISTING IMPROVEMENTS"
                  multiline
                />
                <p>
                  Evidence of relationship, death, burial, and heirship is
                  hereto attached and consists of:
                </p>
                <AgriculturalField
                  {...fieldProps}
                  name="evidence"
                  label="DESCRIPTION OF ATTACHED EVIDENCE"
                  multiline
                />
                <p className="text-xs text-gray-600">
                  Document requirement: Evidence of relationship, death, burial,
                  and heirship. Describe the documents here; provide the
                  documents to DENR with your application.
                </p>
                <p>
                  The following are the names and addresses of the heirs of my
                  ancestor:
                </p>
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <AgriculturalField
                      {...fieldProps}
                      name={"heir" + row + "_name"}
                      label={"HEIR " + row + " NAME"}
                    />
                    <AgriculturalField
                      {...fieldProps}
                      name={"heir" + row + "_address"}
                      label={"HEIR " + row + " ADDRESS"}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p>
                  6. (If the heir section applies) I am the person named below,
                  the only heir/representative of the heirs of the ancestor
                  below, entitled to succeed him/her according to the laws of
                  the Philippines.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      APPLICANT NAME
                    </label>
                    <input
                      readOnly
                      value={hasHeirDetails ? applicantName : ""}
                      className={inputClass + " bg-gray-50"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ANCESTOR NAME
                    </label>
                    <input
                      readOnly
                      value={hasHeirDetails ? ancestorName || "" : ""}
                      className={inputClass + " bg-gray-50"}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p>
                  7. The land has been continuously occupied and cultivated by
                  me or my said ancestor since the date of entry thereon as
                  above stated, except during the following period, when the
                  land was not occupied for the reason stated:
                </p>
                <AgriculturalField
                  {...fieldProps}
                  name="unoccupiedPeriodAndReason"
                  label="PERIOD AND REASON (IF APPLICABLE)"
                  multiline
                />
              </div>
              <p>
                8. To the best of my knowledge, information and belief, the land
                applied for is an alienable and disposable public agricultural
                land suitable for agricultural purposes.
              </p>
              <p>
                9. I agree to demarcate applicable easements consistent with the
                existing policies and regulations.
              </p>
              <div className="space-y-3">
                <p>
                  10. The following named witnesses will testify that the
                  allegations in this application are true:
                </p>
                {[1, 2].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <AgriculturalField
                      {...fieldProps}
                      name={"witness" + row + "_name"}
                      label={"WITNESS " + row + " NAME *"}
                    />
                    <AgriculturalField
                      {...fieldProps}
                      name={"witness" + row + "_address"}
                      label={"WITNESS " + row + " ADDRESS *"}
                    />
                  </div>
                ))}
              </div>
              <p>
                11. I understand that any applicant who willfully and knowingly
                submit false statements or executes false affidavits in
                connection with this application shall be deemed guilty of
                perjury and that any person who, not being qualified to apply
                for public lands, files an application or induces or permits
                another to file it on his/her behalf shall be punishable in
                accordance with existing laws. His/her application shall be
                rejected or cancelled and all amount paid on account thereof
                shall be forfeited in favor of the Government, and he/she shall
                not be entitled to apply for any public land in the Philippines.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase mb-3">
              Affidavit
            </h2>
            <p className="text-sm leading-6 text-gray-700">
              That I have read, or someone has read to me, and I thoroughly
              understand the foregoing application and that I signed the same
              and this affidavit in the presence of the officer who administered
              the oath; and that each and every statement in the application is
              true and correct.
            </p>
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
