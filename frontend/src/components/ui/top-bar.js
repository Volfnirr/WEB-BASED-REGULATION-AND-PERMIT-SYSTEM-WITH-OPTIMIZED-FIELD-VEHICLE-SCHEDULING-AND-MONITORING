"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight } from "lucide-react";
import { UserRoundCog } from "lucide-react";
import ManageProfileUI from "./modal/manage-account";
import { useState } from "react";

function formatSegment(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Topbar() {
  const [manageUserOpen, isManageUserOpen] = useState(false);
  const pathname = usePathname();

  const rawSegments = pathname.split("/").filter(Boolean);

  const segments = rawSegments.map((seg, i) => ({
    label: formatSegment(seg),
    href: "/" + rawSegments.slice(0, i + 1).join("/"),
  }));

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 rounded-lg mb-4">
      <div className="flex flex-1 items-center gap-1 min-w-0 overflow-hidden text-sm text-gray-600">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <span
              key={seg.href}
              className={`flex items-center gap-1 ${isLast ? "min-w-0" : "shrink-0"}`}
            >
              {i > 0 && (
                <ChevronRight size={14} className="text-gray-400 shrink-0" />
              )}
              {isLast ? (
                <span className="truncate text-gray-900 font-medium">
                  {seg.label}
                </span>
              ) : (
                <Link
                  href={seg.href}
                  className="max-w-32 truncate hover:text-gray-900 hover:underline transition-colors"
                >
                  {seg.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
      <div className="flex flex-row justify-end shrink-0">
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0 ml-2"
          onClick={() => isManageUserOpen(true)}
        >
          <UserRoundCog size={20} className="text-green-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0 ml-2">
          <Bell size={20} className="text-gray-600" />
        </button>
      </div>
      <ManageProfileUI
        isOpen={manageUserOpen}
        onClose={() => isManageUserOpen(false)}
      />
    </header>
  );
}
