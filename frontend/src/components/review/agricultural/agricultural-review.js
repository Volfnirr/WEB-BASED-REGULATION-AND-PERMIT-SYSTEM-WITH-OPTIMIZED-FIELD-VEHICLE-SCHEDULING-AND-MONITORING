"use client";
import { useState } from "react";
import InspectorAssignment from "@/components/review/inspector-assignment";
import { localDate } from "@/lib/local-date";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { StatusColor } from "@/lib/status";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  approveApplication,
  rejectApplication,
} from "@/lib/api/applications/app-admin-action";
import Link from "next/link";
import { useRouter } from "next/navigation";

const action = [
  { id: 1, value: "APPROVED" },
  { id: 2, value: "REJECTED" },
];

const submitFormSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"], "Please select an action"),
  remarks: z.string().trim().min(1, "Remarks is required"),
});

function agriculturalDate(value) {
  if (!value) return "Not provided";
  const text = String(value);
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return text;
  const date = new Date(text);
  return Number.isNaN(date.getTime())
    ? text
    : date.toLocaleDateString("en-GB", { timeZone: "UTC" });
}
function submittedAge(birthday, submittedAt) {
  if (!birthday || !submittedAt) return "";
  const birth = new Date(birthday);
  const submitted = new Date(submittedAt);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(submitted);
  const part = (type) =>
    Number(parts.find((value) => value.type === type).value);
  let age = part("year") - birth.getUTCFullYear();
  if (
    part("month") < birth.getUTCMonth() + 1 ||
    (part("month") === birth.getUTCMonth() + 1 &&
      part("day") < birth.getUTCDate())
  )
    age--;
  return age >= 0 ? age : "";
}

export default function ReviewAgricultural({ data, params }) {
  const agricultural = data.agriculturalFormData.agriculturalFormData;
  const [savedInspector, setSavedInspector] = useState(
    agricultural?.assignedInspector ?? null,
  );
  const [inspectorBusy, setInspectorBusy] = useState(false);
  const [inspectorDirty, setInspectorDirty] = useState(false);
  const router = useRouter();
  const applicantName = [
    agricultural?.firstName,
    agricultural?.middleName,
    agricultural?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
  const hasHeirDetails = [
    agricultural?.previousCultivatorName,
    agricultural?.previousCultivatorDeathDate,
    agricultural?.heirImprovements,
    agricultural?.heirRelationDetails,
    agricultural?.heirDetailsRelation,
    agricultural?.heir1Name,
    agricultural?.heir2Name,
    agricultural?.heir3Name,
    agricultural?.heirRepresentativeName,
  ].some(Boolean);
  const hasTransfereeDetails = Boolean(
    agricultural?.firstCultivatorName ||
    agricultural?.firstCultivationDate ||
    agricultural?.transfereeDetails,
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(submitFormSchema),
    defaultValues: {
      action: undefined,
      remarks: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      if (formData.action === "APPROVED") {
        if (inspectorBusy || inspectorDirty || !savedInspector) {
          throw new Error(
            "Assign and save an inspector before approving this application",
          );
        }
        await approveApplication({
          id: params,
          remarks: formData.remarks,
        });
      } else {
        await rejectApplication({
          id: params,
          remarks: formData.remarks,
        });
      }
      router.replace("/application-admin/pending");
      toast.success(
        formData.action === "APPROVED"
          ? "Successfully approved application"
          : "Successfully rejected application",
        { position: "top-center" },
      );
    } catch (err) {
      toast.error(
        `Something went wrong submitting your application:  ${err ? err.message : ""}`,
        {
          position: "top-center",
        },
      );
    }
  };

  const readOnlyInputClass =
    "w-full px-0 py-1 bg-transparent border-0 text-sm leading-6 text-gray-800 pointer-events-none";

  return (
    <div className="flex-1 w-full min-h-screen mb-2 overflow-y-auto bg-[#F4F7F5] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto w-full text-[#172033]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Review Agricultural Free Patent
            </h1>
            <p className="text-sm text-gray-600">
              Reference No.:{" "}
              <span className="font-medium text-gray-900">
                {agricultural?.application?.referenceNo ?? ""}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Date Submitted:{" "}
              <span className="font-medium text-gray-900">
                {localDate(agricultural?.application?.submittedAt)}
              </span>
            </p>
          </div>
          <div
            className={`${StatusColor(
              agricultural?.application?.status,
            )} mt-4 md:mt-0 px-4 py-1.5 font-bold text-sm rounded-lg border shadow-sm`}
          >
            {agricultural?.application?.status ?? "UNKNOWN"}
          </div>
        </div>

        <div className="space-y-5 [&>div]:rounded-xl [&>div]:overflow-hidden [&>div]:border [&>div]:border-[#E1E5E9] [&>div]:bg-white [&>div]:p-5 [&>div>h2]:-mx-5 [&>div>h2]:-mt-5 [&>div>h2]:mb-5 [&>div>h2]:border-b [&>div>h2]:border-[#E1E5E9] [&>div>h2]:bg-[#F8FAF9] [&>div>h2]:px-5 [&>div>h2]:py-4">
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Applicant Information
            </h2>
            <p className="mb-4 text-sm">
              <span className="font-semibold">Age at submission: </span>
              {submittedAge(
                agricultural?.dateOfBirth,
                agricultural?.application?.submittedAt,
              )}
            </p>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={
                    [
                      agricultural?.firstName,
                      agricultural?.middleName,
                      agricultural?.lastName,
                      agricultural?.extensionName,
                    ]
                      .filter(Boolean)
                      .join(" ") ?? ""
                  }
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Mailing Address
                </label>
                <input
                  type="text"
                  value={agricultural?.fullAddress ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={agricultural?.contactNo ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  value={agricultural?.email ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={
                    agricultural?.dateOfBirth
                      ? new Date(agricultural.dateOfBirth).toLocaleDateString()
                      : ""
                  }
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sex
                </label>
                <input
                  type="text"
                  value={agricultural?.sex ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Citizenship
                </label>
                <input
                  type="text"
                  value={agricultural?.citizenship ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Natural Born?
                </label>
                <input
                  type="text"
                  value={
                    agricultural?.naturalBorn === null ||
                    agricultural?.naturalBorn === undefined
                      ? ""
                      : agricultural?.naturalBorn
                        ? "Yes"
                        : "No"
                  }
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Civil Status
                </label>
                <input
                  type="text"
                  value={agricultural?.civilStatus ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name of Spouse
                </label>
                <input
                  type="text"
                  value={agricultural?.spouseName ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Land Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Location of Agricultural Land Applied For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  value={agricultural?.province ?? ""}
                  className={`${readOnlyInputClass} bg-gray-100 pointer-events-none`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Municipality
                </label>
                <input
                  type="text"
                  value={agricultural?.municipality ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Barangay
                </label>
                <input
                  type="text"
                  value={agricultural?.barangay ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specific Location / Sitio
                </label>
                <input
                  type="text"
                  value={agricultural?.specificLocation ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Lot No.
                </label>
                <input
                  type="text"
                  value={agricultural?.lotNo ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Survey No.
                </label>
                <input
                  type="text"
                  value={agricultural?.surveyNo ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Land Area (SQM)
                </label>
                <input
                  type="text"
                  value={agricultural?.landAreaSqm ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Declarations */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Declarations
            </h2>
            <div className="space-y-5 text-sm leading-6 text-gray-700">
              <p>1. I am not an owner of more than 12 hectares of land.</p>
              <p>
                2. I have not filed any petition for judicial titling on the
                same subject lot.
              </p>
              <p>
                3. I entered upon and began cultivation of the same on{" "}
                <strong>
                  {agriculturalDate(agricultural?.cultivationDate)}
                </strong>
                , and since then, I have continuously cultivated the land; and
                have made thereon the following improvements:
              </p>
              <p className="whitespace-pre-wrap">
                {agricultural?.improvementsMade || "Not provided"}
              </p>
              {hasTransfereeDetails && (
                <div className="space-y-2">
                  <p>
                    4. (If the applicant is a transferee) The land described and
                    applied for is not claimed or occupied by any other person
                    but is public land which was first occupied and cultivated
                    by{" "}
                    <strong>
                      {agricultural?.firstCultivatorName ||
                        "Not recorded in the original application"}
                    </strong>{" "}
                    on{" "}
                    <strong>
                      {agriculturalDate(agricultural?.firstCultivationDate)}
                    </strong>
                    .
                  </p>
                  {agricultural?.transfereeDetails && (
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">
                        Original transferee details:{" "}
                      </span>
                      {agricultural.transfereeDetails}
                    </p>
                  )}
                </div>
              )}
              {hasHeirDetails && (
                <div className="space-y-3">
                  {agricultural?.previousCultivatorName ? (
                    <p>
                      5. (If the applicant is an heir) The previous cultivator{" "}
                      <strong>{agricultural.previousCultivatorName}</strong>,
                      who was my ancestor, died on{" "}
                      <strong>
                        {agriculturalDate(
                          agricultural.previousCultivatorDeathDate,
                        )}
                      </strong>
                      . Since his/her death, I have cultivated the said land and
                      existing improvements thereon which consist of the
                      following:
                    </p>
                  ) : (
                    <p>5. Heir information from the original application:</p>
                  )}
                  {agricultural?.heirImprovements && (
                    <p className="whitespace-pre-wrap">
                      {agricultural.heirImprovements}
                    </p>
                  )}
                  {agricultural?.heirRelationDetails && (
                    <p className="whitespace-pre-wrap">
                      {agricultural.heirRelationDetails}
                    </p>
                  )}
                  {agricultural?.heirDetailsRelation && (
                    <p className="whitespace-pre-wrap">
                      Evidence of relationship, death, burial, and heirship is
                      hereto attached and consists of:{" "}
                      {agricultural.heirDetailsRelation}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    Document requirement: Evidence of relationship, death,
                    burial, and heirship.
                  </p>
                  {[1, 2, 3]
                    .filter(
                      (row) =>
                        agricultural?.["heir" + row + "Name"] ||
                        agricultural?.["heir" + row + "Address"],
                    )
                    .map((row) => (
                      <div
                        key={row}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <p>
                          <span className="block text-xs font-semibold text-gray-500">
                            HEIR {row} NAME
                          </span>
                          {agricultural["heir" + row + "Name"] ||
                            "Not provided"}
                        </p>
                        <p>
                          <span className="block text-xs font-semibold text-gray-500">
                            HEIR {row} ADDRESS
                          </span>
                          {agricultural["heir" + row + "Address"] ||
                            "Not provided"}
                        </p>
                      </div>
                    ))}
                  <p>
                    6. I am{" "}
                    <strong>
                      {agricultural?.heirRepresentativeName || applicantName}
                    </strong>
                    , the only heir/representative of the heirs of{" "}
                    <strong>
                      {agricultural?.heirsOfAncestorName ||
                        agricultural?.previousCultivatorName ||
                        "Not provided"}
                    </strong>{" "}
                    entitled to succeed him/her according to the laws of the
                    Philippines.
                  </p>
                </div>
              )}
              {agricultural?.unoccupiedPeriodAndReason && (
                <div className="space-y-2">
                  <p>
                    7. The land has been continuously occupied and cultivated by
                    me or my said ancestor since the date of entry thereon as
                    above stated, except during the following period, when the
                    land was not occupied for the reason stated:
                  </p>
                  <p className="whitespace-pre-wrap">
                    {agricultural.unoccupiedPeriodAndReason}
                  </p>
                </div>
              )}
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
                    <p>
                      <span className="block text-xs font-semibold text-gray-500">
                        WITNESS {row} NAME
                      </span>
                      {agricultural?.["witness" + row + "Name"] ||
                        "Not provided"}
                    </p>
                    <p>
                      <span className="block text-xs font-semibold text-gray-500">
                        WITNESS {row} ADDRESS
                      </span>
                      {agricultural?.["witness" + row + "Address"] ||
                        "Not provided"}
                    </p>
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
            <h2 className="text-sm font-bold text-gray-800 mb-3">Affidavit</h2>
            <p className="text-sm leading-6 text-gray-700">
              That I have read, or someone has read to me, and I thoroughly
              understand the foregoing application and that I signed the same
              and this affidavit in the presence of the officer who administered
              the oath; and that each and every statement in the application is
              true and correct.
            </p>
            <p className="mt-4 text-sm">
              Date filed: {agriculturalDate(agricultural?.dateFiled)}
            </p>
          </div>
          <InspectorAssignment
            applicationId={params}
            status={agricultural?.application?.status}
            assignedInspector={agricultural?.assignedInspector}
            displayName={data.agriculturalFormData.displayName}
            onSaved={setSavedInspector}
            onBusyChange={setInspectorBusy}
            onDirtyChange={setInspectorDirty}
            reviewSubmitting={isSubmitting}
          />

          {agricultural?.application?.status === "PENDING" && (
            /* Bottom Action Buttons (for the Reviewer) */
            <div className="border rounded-xl p-4 text-black">
              <h3 className="font-bold mb-4">ACTION</h3>
              <form
                className="space-y-8"
                onSubmit={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <div className="flex flex-col justify-center gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <Controller
                      name="action"
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
                            <SelectValue placeholder="*SELECT ACTION" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {action.map((a) => (
                                <SelectItem key={a.id} value={a.value}>
                                  {a.value}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.action && (
                      <div className="text-red-600 text-xs font-medium">
                        {errors.action.message}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col gap-1 text-left">
                      <textarea
                        {...register("remarks")}
                        type="text"
                        placeholder="Add remarks..."
                        className="h-9 max-h-80 resize-none overflow-hidden w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors "
                        onInput={(e) => {
                          e.currentTarget.style.height = "auto";
                          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }}
                      />
                      {errors.remarks && (
                        <div className="text-red-600 text-xs font-medium">
                          {errors.remarks.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={isSubmitting || inspectorBusy}
                    className="disabled:opacity-50 bg-green-600 flex justify-center text-center text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    {isSubmitting ? <Spinner data-icon /> : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {agricultural?.application?.status === "APPROVED" ||
          agricultural?.application?.status === "REJECTED" ? (
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-3">Remarks</h2>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className={`whitespace-pre-wrap ${readOnlyInputClass} `}>
                  {agricultural?.application?.remarks}
                </div>
              </div>
              <Link
                className="bg-green-600 flex justify-center text-center text-white py-3 rounded-lg hover:bg-green-700"
                href={`/application-admin/${agricultural?.application?.status === "APPROVED" ? "approved" : "rejected"}`}
              >
                Go back
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
