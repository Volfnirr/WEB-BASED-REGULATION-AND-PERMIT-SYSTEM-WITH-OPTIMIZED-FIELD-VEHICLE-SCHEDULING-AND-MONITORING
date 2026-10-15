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

function formatSegment(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name) {
  if (!name) return "SA";
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function SuperAdminTopbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const rawSegments = (pathname || "")
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "super-admin");
  const segments = [
    { label: "Super Admin", href: "/super-admin" },
    ...rawSegments.map((segment, index) => ({
      label: formatSegment(segment),
      href: `/super-admin/${rawSegments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle navigation sidebar"
          className="-ml-1 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#172033]"
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
                            className="max-w-36 truncate text-[#64748B] transition-colors hover:text-[#172033]"
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
        title={user?.name || "Super Admin"}
      >
        {getInitials(user?.name)}
      </div>
    </header>
  );
}
