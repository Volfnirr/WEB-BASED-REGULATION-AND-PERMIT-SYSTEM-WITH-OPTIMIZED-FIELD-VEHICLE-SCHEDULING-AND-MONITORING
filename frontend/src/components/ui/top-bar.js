"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUser } from "@/lib/context/account-info-context";

const ROLE_LABELS = {
  applicant: "Applicant",
  "application-admin": "Application Admin",
  vehicle: "Vehicle Admin",
};

function formatSegment(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name, fallback) {
  if (!name) {
    return fallback
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const rawSegments = (pathname || "").split("/").filter(Boolean);
  const rootSegment = rawSegments[0] || "applicant";
  const roleName = ROLE_LABELS[rootSegment] || formatSegment(rootSegment);
  const segments = [
    { label: roleName, href: `/${rootSegment}` },
    ...rawSegments.slice(1).map((segment, index) => ({
      label: formatSegment(segment),
      href: `/${rawSegments.slice(0, index + 2).join("/")}`,
    })),
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle navigation sidebar"
          className="-ml-1 cursor-pointer text-[#475569] hover:bg-[#F1F5F9] hover:text-[#172033]"
        />
        <Separator orientation="vertical" className="h-5 bg-[#E5E7EB]" />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap gap-2 text-sm">
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;

              return (
                <Fragment key={segment.href}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="text-[#94A3B8] [&>svg]:size-3" />
                  )}
                  <BreadcrumbItem
                    className={isLast ? "min-w-0" : "hidden shrink-0 sm:block"}
                  >
                    {isLast ? (
                      <BreadcrumbPage
                        aria-current="page"
                        className="truncate font-medium text-[#172033]"
                      >
                        {segment.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={
                          <Link
                            href={segment.href}
                            className="max-w-36 cursor-pointer truncate text-[#64748B] transition-colors hover:text-[#172033]"
                          />
                        }
                      >
                        {segment.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div
        aria-label={user?.name ? `Signed in as ${user.name}` : "Signed in"}
        className="ml-4 grid size-9 shrink-0 place-items-center rounded-full bg-[#E8F1EB] text-xs font-semibold text-[#005221]"
        title={user?.name || roleName}
      >
        {getInitials(user?.name, roleName)}
      </div>
    </header>
  );
}
