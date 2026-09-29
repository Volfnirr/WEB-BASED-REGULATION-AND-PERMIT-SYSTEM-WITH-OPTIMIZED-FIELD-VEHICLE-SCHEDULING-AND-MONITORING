"use client";
import { Suspense } from "react";
import AppAdminDashboardInfo from "@/components/application-admin/dashboard/dashboard-info";
// import { addAdminlistAllApplicationsStatus } from "@/lib/api/applications/app-admin-applications-server";
import DashboardSkeleton from "@/components/application-admin/dashboard/dashboard-loading";
import Title from "@/components/ui/title";
import AssignedServices from "@/components/route-protection/check-service";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import { getAdminlistAllApplicationsStatus } from "@/lib/api/applications/app-admin-action";
import { useQuery } from "@tanstack/react-query";

export default function DashboardData() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["applications-dashboard"],
    queryFn: getAdminlistAllApplicationsStatus,
    refetchInterval: 20 * 1000,
  });

  if (isPending) {
    return (
      <>
        <Title
          title2="Dashboard"
          description="View an overview of applications."
        />
        <DashboardSkeletonSwitcher />
      </>
    );
  }

  if (isError && !data) {
    return <p className="text-sm text-red-600">{error.message}</p>;
  }

  return (
    <AssignedServices reqServices={[1, 2, 3, 4]}>
      <AppAdminDashboardInfo status={data.status} />
    </AssignedServices>
  );
}

// export default function AdminDashboard() {
//   return (
//     <Suspense
//       fallback={
//         <>
//           <Title
//             title2="Dashboard"
//             description="View an overview of applications."
//           />
//           <DashboardSkeletonSwitcher />
//         </>
//       }
//     >
//       <DashboardData />
//     </Suspense>
//   );
// }
