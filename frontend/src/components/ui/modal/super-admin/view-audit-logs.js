"use client";

import { X } from "lucide-react";
import { localDateTime } from "@/lib/local-date";

export default function AuditLogsView({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Audit Logs
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        <div className="w-full grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 mb-5 text-sm">
          <span className="text-gray-500 font-medium">Action</span>
          <span className="text-gray-900 font-semibold">{data.action}</span>

          <span className="text-gray-500 font-medium">Date</span>
          <span className="text-gray-900 font-semibold">
            {localDateTime(data.logDate)}
          </span>

          <span className="text-gray-500 font-medium">Target</span>
          <span className="text-gray-900 font-semibold">{data.target}</span>

          <span className="text-gray-500 font-medium">Actor</span>
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            {data.actorName}
            {data?.actorRole && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold bg-green-100 text-green-800">
                {data.actorRole}
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Details
          </label>
          <span className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 min-h-20 whitespace-pre-wrap wrap-break-word">
            {data?.details || "—"}
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 cursor-pointer bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
