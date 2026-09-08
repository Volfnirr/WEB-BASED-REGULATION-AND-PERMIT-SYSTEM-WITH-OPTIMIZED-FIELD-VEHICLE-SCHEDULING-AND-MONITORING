"use client";

import React from "react";
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

const action = [
  { id: 1, value: "APPROVED" },
  { id: 2, value: "REJECTED" },
];

const submitFormSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"], "Please select an action"),
  remarks: z.string().trim().min(1, "Remarks is required"),
});

export default function ReviewAgricultural({ data, params }) {
  const agricultural = data.agriculturalFormData;


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
      toast.success(
        formData.action === "APPROVED"
          ? "Successfully approved application"
          : "Successfully rejected application",
        { position: "top-center" }
      );
    } catch (err) {
      toast.error(
        `Something went wrong submitting your application:  ${err ? err.message : ""}`,
        {
          position: "top-center",
        }
      );
    }
  };

  const readOnlyInputClass =
    "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800 pointer-events-none";

  return (
    <div
      className="flex-1 w-full min-h-screen mb-2 overflow-y-auto p-4 md:p-8 font-sans rounded-lg"
      style={{ backgroundColor: "#4DAA74" }}
    >
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
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
                {agricultural?.application?.submittedAt
                  ? new Date(agricultural.application.submittedAt).toLocaleDateString()
                  : ""}
              </span>
            </p>
          </div>
          <div
            className={`${StatusColor(
              agricultural?.application?.status
            )} mt-4 md:mt-0 px-4 py-1.5 font-bold text-sm rounded-lg border border-yellow-200 shadow-sm`}
          >
            {agricultural?.application?.status ?? "UNKNOWN"}
          </div>
        </div>

        <div className="space-y-8">
          {/* Section: Applicant Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={[
                    agricultural?.firstName,
                    agricultural?.middleName,
                    agricultural?.lastName,
                    agricultural?.extensionName,
                  ]
                    .filter(Boolean)
                    .join(" ") ?? ""}
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
                  value={agricultural?.dateOfBirth ? new Date(agricultural.dateOfBirth).toLocaleDateString() : ""}
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
                  value={agricultural?.naturalBorn === null || agricultural?.naturalBorn === undefined ? "" : (agricultural?.naturalBorn ? "Yes" : "No")}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cultivation Start Date
                </label>
                <input
                  type="text"
                  value={agricultural?.cultivationDate ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Improvements Made
                </label>
                <input
                  type="text"
                  value={agricultural?.improvementsMade ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Transferee Information (if applicable)
                </label>
                <input
                  type="text"
                  value={agricultural?.transfereeDetails ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Heir Information (if applicable)
                </label>
                <input
                  type="text"
                  value={agricultural?.heirRelationDetails ?? agricultural?.heirDetailsRelation ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Heirs & Witnesses */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Heir Declaration & Witnesses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={agricultural?.heir1Name ?? ""}
                placeholder="Heir 1 Name"
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                value={agricultural?.heir1Address ?? ""}
                placeholder="Heir 1 Address"
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                value={agricultural?.heir2Name ?? ""}
                placeholder="Heir 2 Name"
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                value={agricultural?.heir2Address ?? ""}
                placeholder="Heir 2 Address"
                className={readOnlyInputClass}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Heir/Representative Name
                </label>
                <input
                  type="text"
                  value={agricultural?.heirRepresentativeName ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Heir(s) Of
                </label>
                <input
                  type="text"
                  value={agricultural?.heirsOfAncestorName ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <p className="text-xs font-bold text-gray-700 mb-1 mt-4">
              Witnesses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={agricultural?.witness1Name ?? ""}
                placeholder="Witness 1 Name"
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                value={agricultural?.witness1Address ?? ""}
                placeholder="Witness 1 Address"
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                value={agricultural?.witness2Name ?? ""}
                placeholder="Witness 2 Name"
                className={readOnlyInputClass}
                readOnly
              />
              <input
                type="text"
                value={agricultural?.witness2Address ?? ""}
                placeholder="Witness 2 Address"
                className={readOnlyInputClass}
                readOnly
              />
            </div>
          </div>

          {/* Section: Sworn Statement */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Sworn Statement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date Filed
                </label>
                <input
                  type="text"
                  value={agricultural?.dateFiled ? new Date(agricultural.dateFiled).toLocaleDateString() : ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Applicant's Signature
                </label>
                <input
                  type="text"
                  value={agricultural?.signatureName ?? ""}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

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
                        className="w-full resize-y overflow-auto px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors "
                      />
                      {errors.remarks && (
                        <div className="text-red-600 text-xs font-medium">
                          {errors.remarks.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="bg-green-600 flex justify-center text-center text-white py-3 rounded-lg hover:bg-green-700">
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
                <div>
                  <input
                    type="text"
                    value={agricultural?.application?.remarks ?? ""}
                    className={readOnlyInputClass}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}