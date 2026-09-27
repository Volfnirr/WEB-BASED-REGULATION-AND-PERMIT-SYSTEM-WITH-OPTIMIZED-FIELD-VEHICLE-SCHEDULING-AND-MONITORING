import DashboardInfo from "@/components/super-admin/dashboard/dashboard-info";
import DashboardSkeleton from "@/components/super-admin/dashboard/dashboard-skele";
import Title from "@/components/ui/title";
import { userDashboard } from "@/lib/api/super-admin/super-admin-server";
import { Suspense } from "react";

async function Dashboard() {
  const { userDashboard: dashboard } = await userDashboard();

  return (
    <div>
      <DashboardInfo dashboard={dashboard} />
    </div>
  );
}
export default function ResidentialApplicationReview() {
  return (
    <Suspense
      fallback={
        <>
          <Title title2="Dashboard" description="View an overview of users." />
          <DashboardSkeleton />
        </>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
