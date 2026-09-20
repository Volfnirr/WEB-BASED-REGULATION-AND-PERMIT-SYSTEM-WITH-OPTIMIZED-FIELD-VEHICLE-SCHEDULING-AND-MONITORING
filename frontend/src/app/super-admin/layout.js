import CheckRole from "@/components/route-protection/check-role";
import SuperAdminSiderbar from "@/components/super-admin/super-admin-sidebar";
import Topbar from "@/components/ui/top-bar";
import { UserProvider } from "@/lib/context/account-info-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SuperAdminLayout({ children }) {
  return (
    <UserProvider>
      <CheckRole userRoles={["SUPER_ADMIN"]}>
        <TooltipProvider>
          <div className="flex h-screen bg-[#b1b1b1]">
            <SuperAdminSiderbar />
            <main className="flex-1 pt-16 md:pt-4 px-4 overflow-auto bg-[#F2F2F4]">
              <Topbar />
              {children}
            </main>
          </div>
        </TooltipProvider>
      </CheckRole>
    </UserProvider>
  );
}
