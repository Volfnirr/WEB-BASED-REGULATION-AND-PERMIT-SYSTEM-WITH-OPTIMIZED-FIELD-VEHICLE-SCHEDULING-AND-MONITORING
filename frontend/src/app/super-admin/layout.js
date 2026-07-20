import SuperAdminSiderbar from "@/components/super-admin/super-admin-sidebar";
import Topbar from "@/components/ui/top-bar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#b1b1b1]">
      <SuperAdminSiderbar />
      <main className="flex-1 pt-16 md:pt-4 px-4 overflow-auto bg-[#F2F2F4]">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
