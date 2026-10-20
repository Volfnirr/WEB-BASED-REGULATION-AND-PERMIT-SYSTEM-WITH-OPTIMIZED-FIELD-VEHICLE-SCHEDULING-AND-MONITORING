"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/lib/context/account-info-context";
import {
  getApplicationCopy,
  downloadApplicationCopies,
} from "@/lib/api/applications/application-copies";
import { StatusColor } from "@/lib/status";
import ApplicationExportFormat from "./export-format";
import useExportFormat from "./use-export-format";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingBar({ className = "" }) {
  return (
    <Skeleton
      className={`bg-[#E9EEEB] motion-reduce:animate-none ${className}`}
    />
  );
}

function ApplicationDetailsLoading({ back }) {
  return (
    <div className="mx-auto w-full max-w-6xl text-[#172033]" aria-busy="true">
      {back}
      <p role="status" className="sr-only">
        Loading application details…
      </p>
      <div aria-hidden="true">
        <div className="mb-6 space-y-3">
          <LoadingBar className="h-3 w-36" />
          <LoadingBar className="h-8 w-72 max-w-full" />
          <LoadingBar className="h-4 w-44" />
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            {[6, 4, 4].map((fieldCount, sectionIndex) => (
              <div
                key={sectionIndex}
                className="overflow-hidden rounded-xl border border-[#E1E5E9] bg-white"
              >
                <div className="border-b border-[#E1E5E9] bg-[#F8FAF9] px-5 py-4">
                  <LoadingBar className="h-5 w-40" />
                </div>
                <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2">
                  {Array.from({ length: fieldCount }, (_, fieldIndex) => (
                    <div key={fieldIndex} className="min-w-0 space-y-3">
                      <LoadingBar className="h-3 w-24" />
                      <LoadingBar
                        className={`h-4 ${fieldIndex % 2 ? "w-2/3" : "w-4/5"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            <div className="rounded-xl border border-[#E1E5E9] bg-white p-5">
              <LoadingBar className="mb-4 h-5 w-36" />
              <LoadingBar className="h-7 w-24 rounded-full" />
              <div className="mt-5 space-y-5">
                {[0, 1].map((index) => (
                  <div key={index} className="space-y-3">
                    <LoadingBar className="h-3 w-28" />
                    <LoadingBar className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-xl border border-[#E1E5E9] bg-white p-5">
              <LoadingBar className="h-5 w-20" />
              <LoadingBar className="h-4 w-full" />
              <LoadingBar className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function displayApplicationDate(value, dateOnly = false) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: dateOnly ? "UTC" : "Asia/Manila",
    dateStyle: "medium",
    ...(dateOnly
      ? {}
      : {
          timeStyle: "short",
        }),
  }).format(date);
}
function fieldText(field) {
  if (field.value === null || field.value === undefined || field.value === "")
    return "Not provided";
  if (field.type === "boolean") return field.value ? "Yes" : "No";
  if (field.type === "date") return displayApplicationDate(field.value, true);
  if (field.type === "decimal")
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(field.value);
  return String(field.value);
}
export default function ApplicationDetails({ id }) {
  const { user, isPending } = useUser();
  const [busy, setBusy] = useState(false);
  const [format, setFormat] = useExportFormat();
  const [error, setError] = useState("");
  const query = useQuery({
    queryKey: ["application-copy", user?.id, id],
    queryFn: ({ signal }) => getApplicationCopy(id, signal),
    enabled: Boolean(user?.id),
    retry: false,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const back = (
    <Link
      href="/applicant/my-applications"
      className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#005221]"
    >
      <ArrowLeft size={16} />
      My applications
    </Link>
  );
  if (isPending || (user && query.isPending))
    return <ApplicationDetailsLoading back={back} />;
  if (!user) return <p role="alert">Sign in to view your application.</p>;
  if (query.isError)
    return (
      <div>
        {back}
        <p role="alert" className="text-red-700">
          {query.error.message}
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-4 underline"
        >
          Try again
        </button>
      </div>
    );
  const copy = query.data;
  if (!copy) return null;
  async function download() {
    setBusy(true);
    setError("");
    try {
      await downloadApplicationCopies([copy.id], format);
    } catch (failure) {
      setError(failure.message);
      query.refetch();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto w-full max-w-6xl text-[#172033]">
      {back}
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#52657D]">
            Submitted application
          </p>
          <h1 className="text-2xl font-semibold">{copy.title}</h1>
          <p className="mt-2 text-sm text-[#52657D]">{copy.referenceNo}</p>
        </div>
        {copy.canExport && (
          <div className="flex flex-wrap items-center gap-3">
            <ApplicationExportFormat
              value={format}
              onChange={setFormat}
              disabled={busy}
            />
            <button
              type="button"
              disabled={busy || query.isFetching}
              onClick={download}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#005221] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              <Download size={16} />
              {busy
                ? "Preparing download…"
                : `Download ${format === "pdf" ? "PDF" : "Word"}`}
            </button>
          </div>
        )}
      </header>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {copy.sections.map((section) => (
            <section
              key={section.title}
              className="overflow-hidden rounded-xl border border-[#E1E5E9] bg-white"
            >
              <h2 className="border-b border-[#E1E5E9] bg-[#F8FAF9] px-5 py-4 text-sm font-semibold">
                {section.title}
              </h2>
              <dl className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.key} className="min-w-0">
                    <dt className="mb-1 text-xs font-medium text-[#52657D]">
                      {field.label}
                    </dt>
                    <dd className="whitespace-pre-wrap break-words text-sm leading-6">
                      {fieldText(field)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-5">
          <section className="rounded-xl border border-[#E1E5E9] bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold">Application status</h2>
            <span
              className={`${StatusColor(copy.status)} inline-flex rounded-full px-3 py-1 text-xs font-semibold`}
            >
              {copy.status}
            </span>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-[#52657D]">
                  Submitted · Manila time
                </dt>
                <dd className="mt-1">
                  {displayApplicationDate(copy.submittedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#52657D]">
                  Reviewed · Manila time
                </dt>
                <dd className="mt-1">
                  {displayApplicationDate(copy.reviewedAt)}
                </dd>
              </div>
            </dl>
          </section>
          <section className="rounded-xl border border-[#E1E5E9] bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold">Remarks</h2>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#52657D]">
              {copy.remarks || "No remarks yet."}
            </p>
          </section>
          <p className="flex gap-2 text-xs leading-5 text-[#52657D]">
            <FileText className="h-4 w-4 shrink-0" />
            {copy.canExport
              ? "Download a Word or PDF copy of this application at any status."
              : "Application export is unavailable."}
          </p>
        </aside>
      </div>
    </div>
  );
}
