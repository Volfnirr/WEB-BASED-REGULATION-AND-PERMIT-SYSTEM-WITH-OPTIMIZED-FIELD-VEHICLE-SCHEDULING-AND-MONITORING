import CheckRole from "@/components/route-protection/check-role";
import Topbar from "@/components/ui/top-bar";
import VehicleAdminSiderbar from "@/components/vehicle-admin/sidebar";
import { UserProvider } from "@/lib/context/account-info-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
import { redirect } from "next/navigation";
import LogoutSync from "@/components/route-protection/logoutSync";
import { requireRole } from "@/components/route-protection/check-role-server";
import QueryProvider from "@/components/providers/query-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import VehicleAdminSidebar from "@/components/vehicle-admin/sidebar";

export default async function VehicleAdminLayout({ children }) {
  await requireRole(["VEHICLE_ADMIN"]);

  return (
    <>
      <UserProvider>
        <QueryProvider>
          <LogoutSync />
          {/* <CheckRole userRoles={["VEHICLE_ADMIN"]}> */}
          <TooltipProvider>
            <SidebarProvider
              style={{
                "--sidebar-width": "14.5rem",
                "--sidebar-width-icon": "3.5rem",
              }}
            >
              <VehicleAdminSidebar />
              <SidebarInset className="min-w-0 bg-[#F5F6F7]">
                <Topbar />
                <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 sm:p-6 lg:p-9">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
          {/* </CheckRole> */}
        </QueryProvider>
      </UserProvider>
    </>
  );
}
