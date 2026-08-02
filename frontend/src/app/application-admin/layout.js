import ApplicationAdminSidebar from "@/components/application-admin/sidebar";
import CheckRole from "@/components/route-protection/check-role";
import Topbar from "@/components/ui/top-bar";

export default function ApplicationAdminLayout({ children }) {
  return (
    <CheckRole userRoles={["APPLICATION_ADMIN"]}>
      <div className="flex h-screen bg-[#b1b1b1]">
        <ApplicationAdminSidebar />
        <main className="flex-1 pt-16 md:pt-4 px-4 overflow-auto bg-[#F2F2F4]">
          <Topbar />
          {children}
        </main>
      </div>
    </CheckRole>
  );
}
