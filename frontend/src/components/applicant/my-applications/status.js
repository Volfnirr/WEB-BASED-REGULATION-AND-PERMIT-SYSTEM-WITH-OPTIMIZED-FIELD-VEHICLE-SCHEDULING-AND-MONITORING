"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, Plus, Search, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusColor } from "@/lib/status";
import { downloadApplicationCopies } from "@/lib/api/applications/application-copies";
import { displayApplicationDate } from "./application-details";
import ApplicationExportFormat from "./export-format";
import useExportFormat from "./use-export-format";
const services = [
  ["agricultural", "Agricultural Free Patent"],
  ["residential", "Residential Free Patent"],
  ["chainsaw", "Chainsaw Registration"],
  ["tree-cutting", "Tree Cutting Permit"],
];
const control =
  "min-h-11 w-full rounded-lg border border-[#D9E1E8] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700";
const optionStyle =
  "cursor-pointer px-3 py-2 text-[#172033] hover:bg-green-50 hover:text-[#005221] focus:bg-green-50 focus:text-[#005221] data-highlighted:bg-green-50 data-highlighted:text-[#005221]";
function ApplicationFilter({ label, value, options, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className="h-11 min-h-11 w-full min-w-0 border-[#D9E1E8] bg-white px-3 text-sm hover:border-green-700 focus-visible:border-green-700 focus-visible:ring-green-700/20"
      >
        <SelectValue>
          {options.find((option) => option.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        className="border border-[#D9E1E8] bg-white p-1 text-[#172033]"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={optionStyle}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default function ApplicationStatusPage({ initialData = [] }) {
  const [format, setFormat] = useExportFormat();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [service, setService] = useState(""),
    [sort, setSort] = useState("newest"),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const filtered = initialData
    .filter(
      (row) =>
        (!status || row.status === status) &&
        (!service || row.service?.name === service) &&
        [row.referenceNo, row.service?.name, row.status, row.remarks].some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(search.toLowerCase()),
        ),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? new Date(a.submittedAt) - new Date(b.submittedAt)
        : new Date(b.submittedAt) - new Date(a.submittedAt),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 8)),
    current = Math.min(page, pages),
    rows = filtered.slice((current - 1) * 8, current * 8),
    eligible = rows.map((row) => row.id),
    active = selected.filter((id) => eligible.includes(id));
  function change(setter, value) {
    setter(value);
    setPage(1);
    setSelected([]);
    setError("");
  }
  function toggle(id) {
    setSelected((ids) =>
      ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id],
    );
  }
  async function exportRows(ids) {
    setBusy(true);
    setError("");
    try {
      await downloadApplicationCopies(ids, format);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  const view = (row) => (
    <Link
      href={`/applicant/my-applications/${row.id}`}
      className="inline-flex min-h-10 items-center gap-1 whitespace-nowrap text-sm font-semibold text-[#005221]"
    >
      View application
      <ArrowUpRight size={15} />
    </Link>
  );
  const checkbox = (row) => (
    <input
      type="checkbox"
      checked={active.includes(row.id)}
      disabled={busy}
      onChange={() => toggle(row.id)}
      aria-label={`Select ${row.referenceNo} for export`}
      title="Select for export"
      className="h-4 w-4 accent-green-800 disabled:opacity-30"
    />
  );
  return (
    <div className="w-full min-w-0 space-y-5 text-[#172033]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#52657D]">
          Track your requests, review submitted details, and download Word or
          PDF copies at any status.
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                className="min-h-11 gap-2 bg-[#4CAF7D] px-4 text-white hover:bg-[#3D986A] focus-visible:ring-green-700/20"
              />
            }
          >
            <Plus size={16} />
            New application
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 max-w-[calc(100vw-2rem)] border border-[#D9E1E8] bg-white"
          >
            {services.map(([slug, title]) => (
              <DropdownMenuItem
                key={slug}
                render={<Link href={`/applicant/${slug}`} />}
                className={optionStyle}
              >
                {title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["All", "PENDING", "APPROVED", "REJECTED"].map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => change(setStatus, value === "All" ? "" : value)}
            aria-pressed={status === (value === "All" ? "" : value)}
            className={`rounded-xl border bg-white p-4 text-left transition ${status === (value === "All" ? "" : value) ? "border-[#005221] ring-1 ring-[#005221]" : "border-[#E1E5E9]"}`}
          >
            <span className="block text-xs font-medium capitalize text-[#52657D]">
              {value.toLowerCase()}
            </span>
            <span className="mt-2 block text-2xl font-semibold">
              {value === "All"
                ? initialData.length
                : initialData.filter((row) => row.status === value).length}
            </span>
          </button>
        ))}
      </div>
      <section
        aria-label="Applications"
        className="overflow-hidden rounded-xl border border-[#E1E5E9] bg-white"
      >
        <div className="grid gap-3 border-b border-[#E1E5E9] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_150px_230px_160px]">
          <label className="relative">
            <span className="sr-only">Search applications</span>
            <Search
              size={16}
              className="absolute left-3 top-3.5 text-[#64748B]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => change(setSearch, event.target.value)}
              placeholder="Search reference, type, or remarks"
              className={`${control} pl-9`}
            />
          </label>
          <ApplicationFilter
            label="Filter status"
            value={status || "all"}
            onChange={(value) =>
              change(setStatus, value === "all" ? "" : value)
            }
            options={[
              { value: "all", label: "All statuses" },
              ...["PENDING", "APPROVED", "REJECTED"].map((value) => ({
                value,
                label: value,
              })),
            ]}
          />
          <ApplicationFilter
            label="Filter application type"
            value={service || "all"}
            onChange={(value) =>
              change(setService, value === "all" ? "" : value)
            }
            options={[
              { value: "all", label: "All application types" },
              ...[
                ...new Set(
                  initialData.map((row) => row.service?.name).filter(Boolean),
                ),
              ].map((value) => ({ value, label: value })),
            ]}
          />
          <ApplicationFilter
            label="Sort applications"
            value={sort}
            onChange={(value) => change(setSort, value)}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
            ]}
          />
        </div>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 bg-[#F8FAF9] px-4 py-3">
          <p className="text-xs text-[#52657D]" role="status">
            {active.length
              ? `${active.length} selected`
              : "Select applications to export."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ApplicationExportFormat
              value={format}
              onChange={setFormat}
              disabled={busy}
            />
            {active.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                disabled={busy}
                className="text-sm text-[#52657D]"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              disabled={!active.length || busy}
              onClick={() => exportRows(active)}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#005221] px-3 text-sm font-medium text-white disabled:opacity-40"
            >
              <Download size={15} />
              {busy
                ? "Preparing…"
                : `Export selected${active.length ? ` (${active.length})` : ""}`}
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" className="px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {!rows.length ? (
          <div className="px-6 py-12 text-center">
            <FileText className="mx-auto mb-3 text-green-700" size={32} />
            <h2 className="font-semibold">
              {initialData.length
                ? "No matching applications"
                : "Your applications will appear here"}
            </h2>
            <p className="mt-2 text-sm text-[#52657D]">
              {initialData.length
                ? "Try another search or clear your filters."
                : "Choose an application type to get started."}
            </p>
            {initialData.length ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setService("");
                  setSelected([]);
                  setPage(1);
                }}
                className="mt-4 text-sm font-semibold text-[#005221]"
              >
                Clear filters
              </button>
            ) : (
              <div className="mx-auto mt-5 grid max-w-lg gap-2 sm:grid-cols-2">
                {services.map(([slug, title]) => (
                  <Link
                    key={slug}
                    href={`/applicant/${slug}`}
                    className="rounded-lg border p-3 text-sm text-[#005221]"
                  >
                    {title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-[#E1E5E9] text-xs text-[#52657D]">
                  <tr>
                    <th className="w-12 p-4">
                      <input
                        type="checkbox"
                        aria-label="Select all applications on this page"
                        checked={
                          eligible.length > 0 &&
                          active.length === eligible.length
                        }
                        disabled={!eligible.length || busy}
                        onChange={(event) =>
                          setSelected(event.target.checked ? eligible : [])
                        }
                        className="h-4 w-4 accent-green-800"
                      />
                    </th>
                    {[
                      "Application",
                      "Submitted",
                      "Status",
                      "Remarks",
                      "Actions",
                    ].map((title) => (
                      <th
                        scope="col"
                        key={title}
                        className="px-4 py-3 font-semibold"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[#EDF0F3] last:border-0 hover:bg-[#FAFCFB]"
                    >
                      <td className="p-4">{checkbox(row)}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">{row.service?.name}</p>
                        <p className="mt-1 text-xs text-[#52657D]">
                          {row.referenceNo}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-[#52657D]">
                        {displayApplicationDate(row.submittedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`${StatusColor(row.status)} inline-flex rounded-full px-2.5 py-1 text-xs font-semibold`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="max-w-52 px-4 py-4">
                        <p className="line-clamp-2 break-words text-xs leading-5 text-[#52657D]">
                          {row.remarks || "No remarks yet"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {view(row)}
                        {
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => exportRows([row.id])}
                            className="flex min-h-9 items-center gap-1 text-xs text-[#52657D] cursor-pointer"
                          >
                            <Download size={13} />
                            {`Export ${format === "pdf" ? "PDF" : "Word"}`}
                          </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-[#E1E5E9] md:hidden">
              {rows.map((row) => (
                <article key={row.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="pt-1">{checkbox(row)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {row.service?.name}
                      </p>
                      <p className="mt-1 break-words text-xs text-[#52657D]">
                        {row.referenceNo}
                      </p>
                    </div>
                    <span
                      className={`${StatusColor(row.status)} rounded-full px-2 py-1 text-[10px] font-semibold`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-[#52657D]">
                    Submitted {displayApplicationDate(row.submittedAt)}
                  </p>
                  <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[#52657D]">
                    {row.remarks || "No remarks yet"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    {view(row)}
                    {
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => exportRows([row.id])}
                        className="inline-flex min-h-10 items-center gap-1 text-xs text-[#52657D]"
                      >
                        <Download size={14} />
                        Export DOCX
                      </button>
                    }
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E5E9] px-4 py-3 text-xs text-[#52657D]">
          <p>
            {filtered.length} application{filtered.length === 1 ? "" : "s"} ·
            Page {current} of {pages}
          </p>
          <div className="flex gap-2">
            {[
              ["Previous", current - 1, current === 1],
              ["Next", current + 1, current === pages],
            ].map(([title, target, disabled]) => (
              <button
                type="button"
                key={title}
                disabled={disabled || busy}
                onClick={() => {
                  setPage(target);
                  setSelected([]);
                  setError("");
                }}
                className="min-h-10 rounded-lg border px-3 disabled:opacity-40"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
