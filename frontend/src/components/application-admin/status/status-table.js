"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, FileSearchCorner } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localDateTime } from "@/lib/local-date";
import { StatusColor } from "@/lib/status";
import { useUser } from "@/lib/context/account-info-context";
import { downloadApplicationCopies } from "@/lib/api/applications/application-copies";
export default function ViewApplicationsTable({ columns, rows }) {
  const { user } = useUser();
  const [selected, setSelected] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const eligible = rows
    .filter(
      (row) =>
        row.status === "APPROVED" &&
        row.assignedToId === user?.id &&
        user?.role === "APPLICATION_ADMIN",
    )
    .map((row) => row.id);
  const active = selected.filter((id) => eligible.includes(id));
  const showExport = eligible.length > 0;
  async function download(ids) {
    setBusy(true);
    setError("");
    try {
      await downloadApplicationCopies(ids);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="w-full min-w-0 overflow-hidden">
      {showExport && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E1E5E9] bg-[#F8FAF9] px-4 py-3">
          <p className="text-xs text-[#52657D]" role="status">
            {active.length
              ? `${active.length} selected`
              : "Select approved applications assigned to you."}
          </p>
          <div className="flex gap-3">
            {active.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setSelected([])}
                className="text-sm text-[#52657D]"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              disabled={!active.length || busy}
              onClick={() => download(active)}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#005221] px-3 text-sm text-white disabled:opacity-40"
            >
              <Download size={15} />
              {busy ? "Preparing…" : `Export selected (${active.length})`}
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <Table className="min-w-[820px]">
        <TableHeader>
          <TableRow>
            {showExport && (
              <TableHead className="w-12 px-4">
                <input
                  type="checkbox"
                  aria-label="Select all approved applications on this page"
                  checked={active.length === eligible.length}
                  disabled={busy}
                  onChange={(event) =>
                    setSelected(event.target.checked ? eligible : [])
                  }
                  className="h-4 w-4 accent-green-800"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-[#52657D]"
                key={column.data}
              >
                {column.head}
              </TableHead>
            ))}
            <TableHead className="px-4 text-xs font-semibold text-[#52657D]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!rows.length ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1 + Number(showExport)}
                className="py-10 text-center text-sm text-gray-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <FileSearchCorner size={48} />
                  No applications found
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} className="bg-white hover:bg-[#F8FAF9]">
                {showExport && (
                  <TableCell className="px-4">
                    <input
                      type="checkbox"
                      checked={active.includes(row.id)}
                      disabled={!eligible.includes(row.id) || busy}
                      aria-label={`Select ${row.referenceNo} for export`}
                      onChange={() =>
                        setSelected((values) =>
                          values.includes(row.id)
                            ? values.filter((id) => id !== row.id)
                            : [...values, row.id],
                        )
                      }
                      className="h-4 w-4 accent-green-800"
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.data} className="px-4 text-sm">
                    {column.data === "status" ? (
                      <span
                        className={`${StatusColor(row.status)} inline-flex rounded-full px-3 py-1 text-xs`}
                      >
                        {row.status}
                      </span>
                    ) : ["submittedAt", "reviewedAt"].includes(column.data) ? (
                      row[column.data] ? (
                        localDateTime(row[column.data])
                      ) : (
                        "Not available"
                      )
                    ) : (
                      <span className="block max-w-52 truncate">
                        {row[column.data]}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell className="px-4">
                  <Link
                    href={row.page}
                    className="inline-flex min-h-10 items-center text-sm font-semibold text-[#005221]"
                  >
                    View application
                  </Link>
                  {eligible.includes(row.id) && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => download([row.id])}
                      className="flex min-h-9 items-center gap-1 text-xs text-[#52657D] cursor-pointer"
                    >
                      <Download size={13} />
                      Export DOCX
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
