import ApplicantSidebar from "@/components/applicant/applicant-sidebar";
import CheckRole from "@/components/route-protection/check-role";
import { requireRole } from "@/components/route-protection/check-role-server";
import LogoutSync from "@/components/route-protection/logoutSync";
import Topbar from "@/components/ui/top-bar";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
import { UserProvider } from "@/lib/context/account-info-context";
import { redirect } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import QueryProvider from "@/components/providers/query-provider";
export default async function ApplicantLayout({ children }) {
  await requireRole(["USER"]);

  return (
    <UserProvider>
      <QueryProvider>
        <LogoutSync />
        {/* <CheckRole userRoles={["USER"]}> */}
        <TooltipProvider>
          <SidebarProvider
            style={{
              "--sidebar-width": "14.5rem",
              "--sidebar-width-icon": "3.5rem",
            }}
          >
            <ApplicantSidebar />
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
  );
}
