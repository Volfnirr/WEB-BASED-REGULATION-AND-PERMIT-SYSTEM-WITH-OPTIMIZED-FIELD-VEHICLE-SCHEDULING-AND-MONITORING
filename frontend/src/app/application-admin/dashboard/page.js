import AppAdminDashboardInfo from "@/components/application-admin/dashboard/dashboard-info";
import { addAdminlistAllApplicationsStatus } from "@/lib/api/applications/app-admin-applications-server";
export default async function AdminDashboard() {
  const { status } = await addAdminlistAllApplicationsStatus();

  return (
    <div>
      <AppAdminDashboardInfo status={status} />
    </div>
  );
}
