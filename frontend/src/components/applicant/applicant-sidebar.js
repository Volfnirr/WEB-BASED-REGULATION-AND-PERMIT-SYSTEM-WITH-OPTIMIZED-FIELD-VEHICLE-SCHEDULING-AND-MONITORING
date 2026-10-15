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
  ClipboardList,
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

const services = [
  {
    icon: Leaf,
    name: "Agricultural Free Patent",
    href: "/applicant/agricultural",
  },
  {
    icon: HousePlus,
    name: "Residential Free Patent",
    href: "/applicant/residential",
  },
  {
    icon: Trees,
    name: "Tree Cutting Permit",
    href: "/applicant/tree-cutting",
  },
  {
    icon: ToolCase,
    name: "Chainsaw Registration",
    href: "/applicant/chainsaw",
  },
];

function getInitials(name) {
  if (!name) return "AP";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ApplicantSidebar() {
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
                    Applicant
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
              Available Services
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {services.map((service) => {
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
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel className="mb-2 px-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A7D7B5] group-data-[collapsible=icon]:hidden">
              Applications
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="/applicant/my-applications" onClick={close} />
                    }
                    tooltip="My Applications"
                    isActive={isActive("/applicant/my-applications")}
                    className={
                      isActive("/applicant/my-applications")
                        ? "h-10 cursor-pointer rounded-lg !bg-white px-3 text-[14px] font-semibold !text-[#005221] shadow-sm [&>svg]:!text-[#005221] hover:!bg-white hover:!text-[#005221]"
                        : "h-10 cursor-pointer rounded-lg px-3 text-[14px] font-medium text-white/75 hover:bg-white/10 hover:text-white"
                    }
                  >
                    <ClipboardList className="size-[18px] shrink-0" />
                    <span>My Applications</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 gap-0.5 text-left leading-tight">
                    <span className="truncate text-[14px] font-semibold text-white">
                      {user ? user.name : "Loading..."}
                    </span>

                    <span className="truncate text-[12px] text-white/60">
                      Applicant
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
