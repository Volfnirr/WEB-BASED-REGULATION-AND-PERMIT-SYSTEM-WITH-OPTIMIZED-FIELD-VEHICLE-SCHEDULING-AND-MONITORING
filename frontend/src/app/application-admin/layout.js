import ApplicationAdminSidebar from "@/components/application-admin/application-admin-sidebar";
import CheckRole from "@/components/route-protection/check-role";
import Topbar from "@/components/ui/top-bar";
import { UserProvider } from "@/lib/context/account-info-context";
import { ServicesProvider } from "@/lib/context/service-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
import LogoutSync from "@/components/route-protection/logoutSync";
import AutoRefresh from "@/lib/router-refresh";
import { requireRole } from "@/components/route-protection/check-role-server";

export default async function ApplicationAdminLayout({ children }) {
  await requireRole(["APPLICATION_ADMIN"]);

  return (
    <UserProvider>
      <LogoutSync />
      {/* <AutoRefresh /> */}
      {/* <CheckRole userRoles={["APPLICATION_ADMIN"]}> */}
      <ServicesProvider>
        <TooltipProvider>
          <div className="flex h-screen bg-[#b1b1b1]">
            <ApplicationAdminSidebar />
            <main className="flex-1 pt-16 md:pt-4 px-4 overflow-auto bg-[#F2F2F4]">
              <Topbar />
              {children}
            </main>
          </div>
        </TooltipProvider>
      </ServicesProvider>
      {/* </CheckRole> */}
    </UserProvider>
  );
}
