import DashboardSkeleton from "@/components/application-admin/dashboard/dashboard-loading";
import LogoutSync from "@/components/route-protection/logoutSync";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import Title from "@/components/ui/title";
import VehicleDashboardStatus from "@/components/vehicle-admin/dashboard/dashboard-status";
import { dashboardStatus } from "@/lib/api/vehicle/vehicle-server";
import { Suspense } from "react";

async function DashboardPage() {
  const { status } = await dashboardStatus();

  return (
    <>
      <div>
        <VehicleDashboardStatus status={status} />
      </div>
    </>
  );
}
export default function DashboardPageSuspense() {
  <LogoutSync />;
  return (
    <Suspense
      fallback={
        <>
          <Title
            title2="Dashboard"
            description="View an overview of applications and vehicles."
          />
          <DashboardSkeletonSwitcher />
        </>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}
