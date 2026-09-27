import { Suspense } from "react";
import AppAdminDashboardInfo from "@/components/application-admin/dashboard/dashboard-info";
import { addAdminlistAllApplicationsStatus } from "@/lib/api/applications/app-admin-applications-server";
import DashboardSkeleton from "@/components/application-admin/dashboard/dashboard-loading";
import Title from "@/components/ui/title";
import AssignedServices from "@/components/route-protection/check-service";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";

async function DashboardData() {
  const { status } = await addAdminlistAllApplicationsStatus();

  return (
    <AssignedServices reqServices={[1, 2, 3, 4]}>
      <AppAdminDashboardInfo status={status} />
    </AssignedServices>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <>
          <Title
            title2="Dashboard"
            description="View an overview of applications."
          />
          <DashboardSkeletonSwitcher />
        </>
      }
    >
      <DashboardData />
    </Suspense>
  );
}
