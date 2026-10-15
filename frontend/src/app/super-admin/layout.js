import SuperAdminTopbar from "@/components/super-admin/super-admin-topbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/lib/context/account-info-context";
import LogoutSync from "@/components/route-protection/logoutSync";
import { requireRole } from "@/components/route-protection/check-role-server";
import SuperAdminSidebar from "@/components/super-admin/super-admin-sidebar";

export default async function SuperAdminLayout({ children }) {
  await requireRole(["SUPER_ADMIN"]);

  return (
    <UserProvider>
      <LogoutSync />
      <TooltipProvider>
        <SidebarProvider
          style={{
            "--sidebar-width": "14.5rem",
            "--sidebar-width-icon": "3.5rem",
          }}
        >
          <SuperAdminSidebar />
          <SidebarInset className="min-w-0 bg-[#F5F6F7]">
            <SuperAdminTopbar />
            <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 sm:p-6 lg:p-9">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </UserProvider>
  );
}
