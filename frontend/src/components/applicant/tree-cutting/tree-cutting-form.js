"use client";
import ThankYouModal from "@/components/ui/modal/thankyou";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { submitTreeCuttingForm } from "@/lib/api/applications/tree-cutting/tree-cutting";
import { Spinner } from "@/components/ui/spinner";

const treeCuttingFormSchema = z.object({
  lastName: z.string().trim().min(1, "Last name is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  extensionName: z.string().trim().optional(),
  email: z.email("Invalid email"),
  fullAddress: z.string().trim().min(1, "Full address is required"),
  treeCuttingAddress: z
    .string()
    .trim()
    .min(1, "Tree Cutting Address is required"),
  noTreesToBeRemoved: z.coerce.number().min(1, "Must remove at least one tree"),
  signatureName: z.string().trim().min(1, "Signature name is required"),
  privacyConsent: z.literal(true, "Please check this box to proceed"),
  contactNo: z
    .string()
    .regex(/^09\d{9}$/, "Enter a valid Philippine mobile number")
    .min(11, "Phone number must be 11 digits.")
    .max(11, "Phone number must be 11 digits."),
});

export default function TreeCuttingForm() {
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
    resolver: zodResolver(treeCuttingFormSchema),
  });

  const agreedToPrivacy = watch("privacyConsent");
  const onSubmit = async (data) => {
    try {
      await submitTreeCuttingForm(data);
      reset();
      setShowModal(true);
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div
      className="flex-1 w-full min-h-screen overflow-y-auto p-4 md:p-8 font-sans relative"
      style={{ backgroundColor: "#4DAA74" }}
    >
      {/* Changed max-w-4xl to max-w-6xl to perfectly match the background proportions of the previous forms */}
      <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-xl p-6 md:p-10 h-fit">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold text-gray-900">
            DENR Administrative Order No. 2026-06
          </h1>
          <p className="text-sm font-semibold text-gray-700 mt-2">
            Guideline in the Cutting, Gathering, Collection in/or Removal of
            Trees within Residential Lots
          </p>
          <h2 className="text-lg font-bold text-[#1a5632] mt-4 uppercase">
            Annex A
          </h2>
          <p className="text-md font-bold text-gray-800 mt-1">
            Notification for the Cutting and Removal of Trees within Residential
            Lot
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            Please complete all the details in the space provided. Indicate N/A
            if not applicable.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="space-y-8"
        >
          {/* Section I: Contact Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">
              Section I. Contact Information
            </h3>
            <div className="space-y-4">
              <span className="text-sm font-bold text-gray-800 uppercase border-gray-200 pb-2">
                Owner Name
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("lastName")}
                    type="text"
                    placeholder="*LAST NAME"
                    className={inputClass}
                  />
                  {errors.lastName && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.lastName.message}
                    </div>
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
                    <div className="text-red-600 text-xs font-medium">
                      {errors.firstName.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("middleName")}
                    type="text"
                    placeholder="*MIDDLE NAME"
                    className={inputClass}
                  />
                  {errors.middleName && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.middleName.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("extensionName")}
                    type="text"
                    placeholder="*NAME EXTENSION"
                    className={inputClass}
                  />
                  {errors.extensionName && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.extensionName.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("fullAddress")}
                  type="text"
                  placeholder="*MAILING ADDRESS"
                  className={inputClass}
                />
                {errors.fullAddress && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.fullAddress.message}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="*EMAIL"
                    className={inputClass}
                    required
                  />
                  {errors.email && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <input
                    {...register("contactNo")}
                    type="text"
                    placeholder="*CONTACT NO."
                    className={inputClass}
                  />
                  {errors.contactNo && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.contactNo.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section II: Tree Cutting Activity Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">
              Section II. Tree Cutting Activity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("treeCuttingAddress")}
                  type="text"
                  placeholder="*COMPLETE ADDRESS WHERE CUTTING/REMOVAL WILL BE CONDUCTED"
                  className={inputClass}
                />
                {errors.treeCuttingAddress && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.treeCuttingAddress.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <input
                  {...register("noTreesToBeRemoved")}
                  type="number"
                  placeholder="*NO. OF TREES TO BE CUT/REMOVED"
                  className={inputClass}
                />
                {errors.noTreesToBeRemoved && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.noTreesToBeRemoved.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="flex flex-col items-center pt-8 mt-8">
            <div className="flex flex-col gap-1 text-left">
              <input
                {...register("signatureName")}
                type="text"
                placeholder="SIGNATURE OVER PRINTED NAME"
                className={`${inputClass} text-center border-t-0 border-r-0 border-l-0 rounded-none border-b-2 border-gray-800 w-64 md:w-80 shadow-none focus:ring-0`}
              />
              {errors.signatureName && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.signatureName.message}
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
              for the purpose of processing this Tree Cutting Permit
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
                {errors.privacyConsent && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.privacyConsent.message}
                  </div>
                )}
              </div>
              <span className="font-semibold text-gray-800 text-xs md:text-sm">
                I have read and agree to the Data Privacy Consent statement
                above.*
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!agreedToPrivacy}
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
