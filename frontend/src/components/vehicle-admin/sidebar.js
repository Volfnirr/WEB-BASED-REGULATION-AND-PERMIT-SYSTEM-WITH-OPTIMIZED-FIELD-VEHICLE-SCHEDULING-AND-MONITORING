"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  CalendarCog,
  Car,
  UserRoundCog,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Workspace",
    links: [
      {
        icon: LayoutDashboard,
        name: "Dashboard",
        href: "/vehicle/dashboard",
      },
    ],
  },
  {
    label: "Trip Ticket",
    links: [
      {
        icon: FileText,
        name: "Trip Ticket",
        href: "/vehicle/trip-applications",
      },
    ],
  },
  {
    label: "Drivers",
    links: [
      {
        icon: UserRoundCog,
        name: "Manage Drivers",
        href: "/vehicle/manage-drivers",
      },
      {
        icon: CalendarCog,
        name: "Driver Schedules",
        href: "/vehicle/driver-schedules",
      },
    ],
  },
  {
    label: "Vehicles",
    links: [
      {
        icon: CalendarCog,
        name: "Vehicle Schedules",
        href: "/vehicle/vehicles-schedules",
      },
      {
        icon: Car,
        name: "Vehicles",
        href: "/vehicle/manage-vehicles",
      },
    ],
  },
];

function getInitials(name) {
  if (!name) return "VA";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function VehicleAdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { isMobile, setOpenMobile } = useSidebar();
  const close = () => setOpenMobile(false);

  const { user } = useUser();

  const [manageUserOpen, setManageUserOpen] = useState(false);

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
                  className="shrink-0"
                />

                <div className="grid flex-1 gap-0.5 text-left leading-tight">
                  <span className="truncate text-[15px] font-bold tracking-wide text-white">
                    PENRO Portal
                  </span>

                  <span className="truncate text-[12px] font-medium text-white/65">
                    Vehicle Administrator
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <div className="mx-4 h-px bg-black/10" />

        <SidebarContent className="bg-[#005221] px-2 pt-3">
          {groups.map((group) => (
            <SidebarGroup key={group.label} className="px-1 py-2">
              <SidebarGroupLabel className="mb-2 px-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A7D7B5] group-data-[collapsible=icon]:hidden">
                {group.label}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.links.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} onClick={close} />}
                          tooltip={item.name}
                          isActive={active}
                          className={
                            active
                              ? "h-10 cursor-pointer rounded-lg !bg-white px-3 text-[14px] font-semibold !text-[#005221] shadow-sm [&>svg]:!text-[#005221] hover:!bg-white hover:!text-[#005221]"
                              : "h-10 cursor-pointer rounded-lg px-3 text-[14px] font-medium text-white/75 hover:bg-white/10 hover:text-white"
                          }
                        >
                          <Icon className="size-[18px] shrink-0" />

                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
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
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 gap-0.5 text-left leading-tight">
                    <span className="truncate text-[14px] font-semibold text-white">
                      {user ? user.name : "Loading..."}
                    </span>

                    <span className="truncate text-[12px] text-white/60">
                      Vehicle Administrator
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
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="grid min-w-0 flex-1 text-left leading-tight">
                          <span className="truncate text-sm font-semibold">
                            {user ? user.name : "Loading..."}
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
