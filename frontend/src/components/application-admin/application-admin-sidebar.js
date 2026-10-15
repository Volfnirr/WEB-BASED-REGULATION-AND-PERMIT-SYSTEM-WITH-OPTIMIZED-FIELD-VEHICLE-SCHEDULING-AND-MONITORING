"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import {
  ToolCase,
  HousePlus,
  Leaf,
  Trees,
  LayoutDashboard,
  ClockFading,
  CircleCheck,
  CircleX,
  UserRoundCog,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import { useServices } from "@/lib/context/service-context";
import { Spinner } from "@/components/ui/spinner";
import { toTitleCase } from "@/lib/title-case";
import { logout } from "@/lib/api/logout";
import { useUser } from "@/lib/context/account-info-context";
import ManageProfileUI from "@/components/ui/modal/manage-account";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const ALL_SERVICES = [
  {
    id: 1,
    icon: Leaf,
    name: "Agricultural Free Patent",
    href: "/application-admin/agricultural",
  },
  {
    id: 2,
    icon: HousePlus,
    name: "Residential Free Patent",
    href: "/application-admin/residential",
  },
  {
    id: 3,
    icon: Trees,
    name: "Tree Cutting Permit",
    href: "/application-admin/tree-cutting",
  },
  {
    id: 4,
    icon: ToolCase,
    name: "Chainsaw Registration",
    href: "/application-admin/chainsaw",
  },
];

const APPLICATIONS = [
  {
    id: 1,
    icon: ClockFading,
    name: "Pending",
    href: "/application-admin/pending",
  },
  {
    id: 2,
    icon: CircleCheck,
    name: "Approved",
    href: "/application-admin/approved",
  },
  {
    id: 3,
    icon: CircleX,
    name: "Rejected",
    href: "/application-admin/rejected",
  },
];

function getInitials(name) {
  if (!name) return "AA";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ApplicationAdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { isMobile, setOpenMobile } = useSidebar();
  const close = () => setOpenMobile(false);

  const { assignedServices, loading, error } = useServices();
  const { user } = useUser();

  const [manageUserOpen, setManageUserOpen] = useState(false);

  const currentUser = {
    name: assignedServices.name ? toTitleCase(assignedServices.name) : "",
  };

  const visibleServices = ALL_SERVICES.filter((service) =>
    assignedServices.services?.some((item) => item.serviceId === service.id),
  );

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-emerald-950/20 bg-[#005221] text-white"
      >
        <SidebarHeader className="bg-[#005221] px-3 pb-3 pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<div />}
                className="h-14 cursor-default rounded-lg px-2 hover:bg-transparent hover:text-white active:bg-transparent"
              >
                <Image
                  src="/homedenrlogo.png"
                  alt="DENR logo"
                  width={42}
                  height={42}
                  loading="eager"
                  className="shrink-0"
                />

                <div className="grid flex-1 gap-0.5 text-left leading-tight">
                  <span className="truncate text-[15px] font-bold tracking-wide text-white">
                    PENRO Portal
                  </span>

                  <span className="truncate text-[12px] font-medium text-white/65">
                    Application Administrator
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <div className="mx-4 h-px bg-black/10" />

        <SidebarContent className="bg-[#005221] px-2 pt-3">
          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel className="mb-2 px-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A7D7B5] group-data-[collapsible=icon]:hidden">
              Workspace
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link
                        href="/application-admin/dashboard"
                        onClick={close}
                      />
                    }
                    tooltip="Dashboard"
                    isActive={isActive("/application-admin/dashboard")}
                    className={
                      isActive("/application-admin/dashboard")
                        ? "h-10 cursor-pointer rounded-lg !bg-white px-3 text-[14px] font-semibold !text-[#005221] shadow-sm [&>svg]:!text-[#005221] hover:!bg-white hover:!text-[#005221]"
                        : "h-10 cursor-pointer rounded-lg px-3 text-[14px] font-medium text-white/75 hover:bg-white/10 hover:text-white"
                    }
                  >
                    <LayoutDashboard className="size-[18px] shrink-0" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel className="mb-2 px-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A7D7B5] group-data-[collapsible=icon]:hidden">
              {visibleServices.length > 1
                ? "Assigned Services"
                : "Assigned Service"}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {loading ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      disabled
                      className="h-10 cursor-default rounded-lg px-3 text-[14px] text-white/60 opacity-100"
                    >
                      <Spinner className="size-4 animate-spin text-[#A7D7B5]" />
                      <span>Loading services</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : error ? (
                  <SidebarMenuItem>
                    <p className="px-3 py-2 text-sm text-red-200 group-data-[collapsible=icon]:hidden">
                      Failed to load services
                    </p>
                  </SidebarMenuItem>
                ) : (
                  visibleServices.map((service) => {
                    const Icon = service.icon;
                    const active = isActive(service.href);

                    return (
                      <SidebarMenuItem key={service.href}>
                        <SidebarMenuButton
                          render={<Link href={service.href} onClick={close} />}
                          tooltip={service.name}
                          isActive={active}
                          className={
                            active
                              ? "h-10 cursor-pointer rounded-lg !bg-white px-3 text-[14px] font-semibold !text-[#005221] shadow-sm [&>svg]:!text-[#005221] hover:!bg-white hover:!text-[#005221]"
                              : "h-10 cursor-pointer rounded-lg px-3 text-[14px] font-medium text-white/75 hover:bg-white/10 hover:text-white"
                          }
                        >
                          <Icon className="size-[18px] shrink-0" />
                          <span>{service.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel className="mb-2 px-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A7D7B5] group-data-[collapsible=icon]:hidden">
              Assigned Applications
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {APPLICATIONS.map((app) => {
                  const Icon = app.icon;
                  const active = isActive(app.href);

                  return (
                    <SidebarMenuItem key={app.href}>
                      <SidebarMenuButton
                        render={<Link href={app.href} onClick={close} />}
                        tooltip={app.name}
                        isActive={active}
                        className={
                          active
                            ? "h-10 cursor-pointer rounded-lg !bg-white px-3 text-[14px] font-semibold !text-[#005221] shadow-sm [&>svg]:!text-[#005221] hover:!bg-white hover:!text-[#005221]"
                            : "h-10 cursor-pointer rounded-lg px-3 text-[14px] font-medium text-white/75 hover:bg-white/10 hover:text-white"
                        }
                      >
                        <Icon
                          className={`size-[18px] shrink-0 ${
                            !active && app.name === "Pending"
                              ? "text-[#7ED6A2]"
                              : !active && app.name === "Approved"
                                ? "text-[#86D99B]"
                                : !active && app.name === "Rejected"
                                  ? "text-red-300"
                                  : ""
                          }`}
                        />

                        <span>{app.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-[#005221] px-3 pb-4 pt-2 text-white">
          <div className="mb-3 h-px bg-black/10" />

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="h-14 cursor-pointer rounded-lg px-2 text-white hover:bg-white/10 hover:text-white data-[popup-open]:bg-white/10 data-[popup-open]:text-white"
                    />
                  }
                >
                  <Avatar className="h-9 w-9 shrink-0 rounded-full">
                    <AvatarFallback className="rounded-full bg-white/15 text-sm font-semibold text-white">
                      {getInitials(user?.name || currentUser.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 gap-0.5 text-left leading-tight">
                    <span className="truncate text-[14px] font-semibold text-white">
                      {user?.name || currentUser.name || "Loading..."}
                    </span>

                    <span className="truncate text-[12px] text-white/60">
                      Application Administrator
                    </span>
                  </div>

                  <ChevronsUpDown className="ml-auto size-4 text-white/60" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-60 rounded-xl p-1.5 shadow-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-1 font-normal">
                      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                        <Avatar className="h-9 w-9 rounded-full">
                          <AvatarFallback className="rounded-full bg-green-100 font-semibold text-[#005221]">
                            {getInitials(user?.name || currentUser.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="grid min-w-0 flex-1 text-left leading-tight">
                          <span className="truncate text-sm font-semibold">
                            {user?.name || currentUser.name || "Loading..."}
                          </span>

                          <span className="mt-0.5 truncate text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="h-9 cursor-pointer rounded-md"
                      onClick={() => setManageUserOpen(true)}
                    >
                      <UserRoundCog className="size-4" />
                      Manage Account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => logout(router)}
                    className="h-9 cursor-pointer rounded-md text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="size-4 text-red-600" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <ManageProfileUI
        isOpen={manageUserOpen}
        onClose={() => setManageUserOpen(false)}
      />
    </>
  );
}
