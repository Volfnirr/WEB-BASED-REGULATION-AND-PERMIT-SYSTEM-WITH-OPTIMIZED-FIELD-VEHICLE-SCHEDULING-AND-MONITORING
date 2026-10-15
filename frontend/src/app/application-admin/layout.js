import ApplicationAdminSidebar from "@/components/application-admin/application-admin-sidebar";
import CheckRole from "@/components/route-protection/check-role";
import Topbar from "@/components/ui/top-bar";
import { UserProvider } from "@/lib/context/account-info-context";
import { ServicesProvider } from "@/lib/context/service-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
import LogoutSync from "@/components/route-protection/logoutSync";
import AutoRefresh from "@/lib/router-refresh";
import { requireRole } from "@/components/route-protection/check-role-server";
import QueryProvider from "@/components/providers/query-provider";

export default async function ApplicationAdminLayout({ children }) {
  await requireRole(["APPLICATION_ADMIN"]);

  return (
    <UserProvider>
      <QueryProvider>
        <LogoutSync />
        {/* <AutoRefresh /> */}
        {/* <CheckRole userRoles={["APPLICATION_ADMIN"]}> */}
        <ServicesProvider>
          <TooltipProvider>
            <SidebarProvider
              style={{
                "--sidebar-width": "14.5rem",
                "--sidebar-width-icon": "3.5rem",
              }}
            >
              <ApplicationAdminSidebar />
              <SidebarInset className="min-w-0 bg-[#F5F6F7]">
                <Topbar />
                <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 sm:p-6 lg:p-9">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ServicesProvider>
        {/* </CheckRole> */}
      </QueryProvider>
    </UserProvider>
  );
}
