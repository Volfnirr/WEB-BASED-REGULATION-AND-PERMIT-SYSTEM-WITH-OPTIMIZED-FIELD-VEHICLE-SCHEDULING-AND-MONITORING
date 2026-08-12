"use client";
import { localDate } from "@/lib/local-date";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  approveTreeCuttingApplication,
  rejectTreeCuttingApplication,
} from "@/lib/api/applications/tree-cutting";

const action = [
  { id: 1, value: "APPROVED" },
  { id: 2, value: "REJECTED" },
];

const submitFormSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"], "Please select an action"),
  remarks: z.string().trim().min(1, "Remarks is required"),
});

export default function ReviewTreeCutting({ data, params }) {
  const treeCutting = data;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(submitFormSchema),
  });

  const onSubmit = async (formData) => {
    try {
      if (formData.action === "APPROVED") {
        await approveTreeCuttingApplication({
          id: params,
          remarks: formData.remarks,
        });
      } else {
        await rejectTreeCuttingApplication({
          id: params,
          remarks: formData.remarks,
        });
      }
      console.log(data);
      toast.success(
        formData.action === "APPROVED"
          ? "Successfully approved application"
          : "Successfully rejected application",
        { position: "top-center" },
        {
          position: "top-center",
        },
      );
    } catch (err) {
      toast.error("Something went wrong submitting your application", {
        position: "top-center",
      });
    }
  };
  const readOnlyInputClass =
    "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800 pointer-events-none";

  return (
    <div
      className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans rounded-lg"
      style={{ backgroundColor: "#4DAA74" }}
    >
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Review Tree Cutting Permit
            </h1>
            <p className="text-sm text-gray-600">
              Application No.:{" "}
              <span className="font-medium text-gray-900">
                {treeCutting?.id}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Reference No.:{" "}
              <span className="font-medium text-gray-900">
                {treeCutting?.application?.referenceNo}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Date Submitted:{" "}
              <span className="font-medium text-gray-900">
                {localDate(treeCutting?.application?.submittedAt)}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-sm rounded-full border border-yellow-200 shadow-sm">
            {treeCutting?.application?.status}
          </div>
        </div>

        <div className="space-y-8">
          {/* Section I: Contact Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Section I. Contact Information
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name of Residential Lot Owner
                </label>
                <input
                  type="text"
                  defaultValue={
                    treeCutting?.lastName +
                    treeCutting?.firstName +
                    treeCutting?.middleName +
                    treeCutting?.extensionName
                  }
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mailing Address
                </label>
                <input
                  type="text"
                  defaultValue={treeCutting?.fullAddress}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  defaultValue={treeCutting?.email}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contact No.
                </label>
                <input
                  type="text"
                  defaultValue={treeCutting?.contactNo}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section II: Tree Cutting Activity Information */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              Section II. Tree Cutting Activity Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Complete Address Where Cutting/Removal Will Be Conducted
                </label>
                <input
                  type="text"
                  defaultValue={treeCutting?.treeCuttingAddress}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  No. of Trees to Be Cut/Removed
                </label>
                <input
                  type="text"
                  defaultValue={treeCutting?.noTreesToBeRemoved}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section: Signature */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3">Signature</h2>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Signature Over Printed Name
                </label>
                <input
                  type="text"
                  defaultValue={treeCutting?.signatureName}
                  className={readOnlyInputClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons (for the Reviewer) */}
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
                {/* <select id="status" className="border rounded-lg p-3">
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select> */}
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
                  {isSubmitting ? (
                    <>
                      <Spinner data-icon />
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
