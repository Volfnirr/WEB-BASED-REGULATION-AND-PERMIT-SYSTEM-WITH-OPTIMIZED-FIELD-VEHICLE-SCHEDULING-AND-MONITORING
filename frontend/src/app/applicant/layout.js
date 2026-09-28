import ApplicantSidebar from "@/components/applicant/applicant-sidebar";
import CheckRole from "@/components/route-protection/check-role";
import { requireRole } from "@/components/route-protection/check-role-server";
import LogoutSync from "@/components/route-protection/logoutSync";
import Topbar from "@/components/ui/top-bar";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
import { UserProvider } from "@/lib/context/account-info-context";
import { redirect } from "next/navigation";
export default async function ApplicantLayout({ children }) {
  await requireRole(["USER"]);

  return (
    <UserProvider>
      <LogoutSync />
      {/* <CheckRole userRoles={["USER"]}> */}
      <div className="flex h-screen bg-[#b1b1b1]">
        <ApplicantSidebar />
        <main className="flex-1 pt-16 md:pt-4 px-4 overflow-auto bg-[#F2F2F4]">
          <Topbar />
          {children}
        </main>
      </div>
      {/* </CheckRole> */}
    </UserProvider>
  );
}
