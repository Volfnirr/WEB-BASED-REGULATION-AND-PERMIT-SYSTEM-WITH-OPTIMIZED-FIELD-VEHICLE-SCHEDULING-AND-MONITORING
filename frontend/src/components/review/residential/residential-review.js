"use client";
import { useState } from "react";
import InspectorAssignment from "@/components/review/inspector-assignment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { localDate } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import { Spinner } from "@/components/ui/spinner";
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

const actions = ["APPROVED", "REJECTED"];
const submitFormSchema = z.object({
  action: z.enum(actions, "Please select an action"),
  remarks: z.string().trim().min(1, "Remarks is required"),
});

function dateOnly(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function ageFromBirthDate(value, atValue) {
  if (!value) return "Not provided";
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return "Not provided";
  const today = atValue ? new Date(atValue) : new Date();
  let age = today.getFullYear() - birthDate.getUTCFullYear();
  const month = today.getMonth() - birthDate.getUTCMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getUTCDate()))
    age--;
  return String(age);
}

function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="mb-1 text-xs font-medium text-[#52657D]">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm leading-6">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : String(value)}
      </dd>
    </div>
  );
}

function Section({ title, children, oneColumn = false }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#E1E5E9] bg-white">
      <h2 className="border-b border-[#E1E5E9] bg-[#F8FAF9] px-5 py-4 text-sm font-semibold">
        {title}
      </h2>
      <dl
        className={`grid gap-x-6 gap-y-5 p-5 ${oneColumn ? "" : "sm:grid-cols-2"}`}
      >
        {children}
      </dl>
    </section>
  );
}

function Statement({ children }) {
  return <div className="text-sm leading-6 text-[#172033]">{children}</div>;
}

export default function ReviewResidential({ data, params }) {
  const router = useRouter();
  const { residentialFormData: residential } = data.residentialFormData;
  const application = residential?.application;
  const [savedInspector, setSavedInspector] = useState(
    residential?.assignedInspector ?? null,
  );
  const [inspectorBusy, setInspectorBusy] = useState(false);
  const [inspectorDirty, setInspectorDirty] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(submitFormSchema) });

  const onSubmit = async (formData) => {
    try {
      if (formData.action === "APPROVED") {
        if (inspectorBusy || inspectorDirty || !savedInspector) {
          throw new Error(
            "Assign and save an inspector before approving this application",
          );
        }
        await approveApplication({ id: params, remarks: formData.remarks });
      } else {
        await rejectApplication({ id: params, remarks: formData.remarks });
      }
      toast.success(
        formData.action === "APPROVED"
          ? "Successfully approved application"
          : "Successfully rejected application",
        { position: "top-center" },
      );
      router.replace("/application-admin/pending");
    } catch (error) {
      toast.error(
        `Something went wrong submitting your review: ${error?.message || ""}`,
        { position: "top-center" },
      );
    }
  };

  const hasHeir = Boolean(
    residential?.heirPredecessorName ||
    residential?.heirRelationship ||
    residential?.heirDateOfDeath,
  );
  const hasTransferee = Boolean(
    residential?.transfereePredecessorName ||
    residential?.transferAction ||
    residential?.transactionDate,
  );
  const hasEmploymentMarriage = Boolean(
    residential?.employmentMarriageOccupationDate ||
    residential?.marriageWithName,
  );

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#F4F7F5] p-4 font-sans md:p-8">
      <div className="mx-auto w-full max-w-6xl text-[#172033]">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#52657D]">
              Application review
            </p>
            <h1 className="text-2xl font-semibold">Residential Free Patent</h1>
            <p className="mt-2 text-sm text-[#52657D]">
              {application?.referenceNo}
            </p>
          </div>
          <span
            className={`${StatusColor(application?.status)} inline-flex rounded-full px-3 py-1 text-xs font-semibold`}
          >
            {application?.status}
          </span>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <Section title="Applicant information">
              <Field label="Last name" value={residential?.lastName} />
              <Field label="First name" value={residential?.firstName} />
              <Field label="Middle name" value={residential?.middleName} />
              <Field label="Mailing address" value={residential?.fullAddress} />
              <Field label="Citizenship" value={residential?.citizenship} />
              <Field label="Civil status" value={residential?.civilStatus} />
              <Field
                label="Date of birth"
                value={dateOnly(residential?.dateOfBirth)}
              />
              <Field
                label="Age at submission"
                value={ageFromBirthDate(
                  residential?.dateOfBirth,
                  application?.submittedAt,
                )}
              />
              <Field label="Sex" value={residential?.sex} />
              {residential?.spouseName && (
                <Field label="Spouse name" value={residential.spouseName} />
              )}
              <Field label="Mobile number" value={residential?.contactNo} />
              <Field label="Email" value={residential?.email} />
            </Section>

            <Section title="Lot/Parcel information">
              <Field label="Lot number" value={residential?.lotNo} />
              <Field label="Survey number" value={residential?.surveyNo} />
              <Field label="Area (sq. m.)" value={residential?.landAreaSqm} />
              <Field label="Location" value={residential?.specificLocation} />
              <Field label="Barangay" value={residential?.barangay} />
              <Field
                label="City/Municipality"
                value={residential?.municipality}
              />
              <Field label="Province" value={residential?.province} />
            </Section>

            <Section title="Declarations" oneColumn>
              <Statement>
                1. The applicant declares that they are a natural-born Filipino
                citizen and will provide the evidence listed in the official
                form.
              </Statement>
              <Statement>
                2. The applicant declares that they are not an awardee of a
                Residential Free Patent within the same city or municipality.
              </Statement>
              <Statement>
                3. The applicant declares that they do not own more than twelve
                (12) hectares of land.
              </Statement>
              <Statement>
                4. a. The applicant has actually occupied and resided in the
                subject lot continuously since{" "}
                <strong>{dateOnly(residential?.occupationDate)}</strong>.
              </Statement>
            </Section>

            {hasHeir && (
              <Section title="If applicant is an heir">
                <Field
                  label="Predecessor-in-interest"
                  value={residential?.heirPredecessorName}
                />
                <Field
                  label="Relationship"
                  value={residential?.heirRelationship}
                />
                <Field
                  label="Date of death"
                  value={dateOnly(residential?.heirDateOfDeath)}
                />
                <Statement>
                  Document requirement: death certificate of the decedent.
                </Statement>
              </Section>
            )}

            {hasTransferee && (
              <Section title="If applicant is a transferee">
                <Field
                  label="Predecessor-in-interest"
                  value={residential?.transfereePredecessorName}
                />
                <Field
                  label="Transfer action"
                  value={residential?.transferAction}
                />
                <Field
                  label="Date of transaction"
                  value={dateOnly(residential?.transactionDate)}
                />
                <Statement>
                  Document requirement: corresponding transfer document.
                </Statement>
              </Section>
            )}

            {hasEmploymentMarriage && (
              <Section title="If absent due to employment and/or marriage">
                <Field
                  label="Date occupation began"
                  value={dateOnly(
                    residential?.employmentMarriageOccupationDate,
                  )}
                />
                <Field
                  label="Marriage with"
                  value={residential?.marriageWithName}
                />
                <Statement>
                  Document requirement: Certificate of Employment, Barangay
                  Certification, Sworn Affidavit, Marriage Certificate, or other
                  supporting evidence.
                </Statement>
              </Section>
            )}

            {residential?.forceAbsenceOccupationDate && (
              <Section
                title="If absent due to force majeure, fraud, violence, or intimidation"
                oneColumn
              >
                <Field
                  label="Date occupation began"
                  value={dateOnly(residential.forceAbsenceOccupationDate)}
                />
                <Statement>
                  Document requirement: barangay blotter, summons,
                  complaint-affidavit, Barangay Certification, Sworn Affidavit,
                  or other supporting evidence.
                </Statement>
              </Section>
            )}

            {residential?.motherLotOccupationDate && (
              <Section
                title="If applicant previously occupied the mother lot"
                oneColumn
              >
                <Field
                  label="Date occupation of the mother lot began"
                  value={dateOnly(residential.motherLotOccupationDate)}
                />
                <Statement>
                  Document requirement: proof of relationship, extrajudicial
                  settlement, transfer document, waiver, Deed of Donation, or
                  Partition Agreement.
                </Statement>
              </Section>
            )}

            <Section title="Remaining declarations" oneColumn>
              <Statement>
                5. The land is zoned as residential or mixed use.
              </Statement>
              <Statement>
                6. No petition for judicial titling has been filed for the same
                lot.
              </Statement>
              <Statement>
                7. The applicant agrees to demarcate applicable easements.
              </Statement>
              <Statement>
                8. The applicant understands the consequences of false
                statements and affidavits.
              </Statement>
              <Statement>
                9. The applicant declares that the application was read,
                understood, and is true and correct.
              </Statement>
            </Section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-5">
            <section className="rounded-xl border border-[#E1E5E9] bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold">Application status</h2>
              <span
                className={`${StatusColor(application?.status)} inline-flex rounded-full px-3 py-1 text-xs font-semibold`}
              >
                {application?.status}
              </span>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-[#52657D]">Submitted</dt>
                  <dd className="mt-1">
                    {localDate(application?.submittedAt)}
                  </dd>
                </div>
              </dl>
            </section>

            <InspectorAssignment
              applicationId={params}
              status={residential?.application?.status}
              assignedInspector={residential?.assignedInspector}
              displayName={data.residentialFormData.displayName}
              onSaved={setSavedInspector}
              onBusyChange={setInspectorBusy}
              onDirtyChange={setInspectorDirty}
              reviewSubmitting={isSubmitting}
            />

            {application?.status === "PENDING" && (
              <section className="rounded-xl border border-[#E1E5E9] bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold">Review action</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <Controller
                      name="action"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full border border-gray-300 bg-white text-sm">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {actions.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.action && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.action.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <textarea
                      {...register("remarks")}
                      rows="5"
                      placeholder="Add remarks..."
                      className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
                    />
                    {errors.remarks && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.remarks.message}
                      </p>
                    )}
                  </div>
                  <button
                    disabled={isSubmitting || inspectorBusy}
                    className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#005221] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {isSubmitting ? <Spinner data-icon /> : "Submit review"}
                  </button>
                </form>
              </section>
            )}

            {application?.status !== "PENDING" && (
              <section className="rounded-xl border border-[#E1E5E9] bg-white p-5">
                <h2 className="mb-3 text-sm font-semibold">Remarks</h2>
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#52657D]">
                  {application?.remarks || "No remarks."}
                </p>
                <Link
                  className="mt-4 flex min-h-11 items-center justify-center rounded-lg bg-[#005221] px-4 py-2 text-sm font-medium text-white"
                  href={`/application-admin/${application?.status === "APPROVED" ? "approved" : "rejected"}`}
                >
                  Go back
                </Link>
              </section>
            )}

            <p className="flex gap-2 text-xs leading-5 text-[#52657D]">
              <FileText className="h-4 w-4 shrink-0" />
              Residential export will be available when the DOCX exporter is
              implemented.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
