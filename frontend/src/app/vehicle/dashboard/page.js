"use client";
import DashboardSkeleton from "@/components/application-admin/dashboard/dashboard-loading";
import LogoutSync from "@/components/route-protection/logoutSync";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import Title from "@/components/ui/title";
import VehicleDashboardStatus from "@/components/vehicle-admin/dashboard/dashboard-status";
import { getVehicleDashboard } from "@/lib/api/vehicle/manage-vehicles";
// import { dashboardStatus } from "@/lib/api/vehicle/vehicle-server";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  // const { status } = await dashboardStatus();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["vehicle-dashboard"],
    queryFn: getVehicleDashboard,
    refetchInterval: 30 * 1000,
  });

  if (isPending) {
    return (
      <>
        <Title
          title2="Dashboard"
          description="View an overview of applications and vehicles."
        />
        <DashboardSkeletonSwitcher />
      </>
    );
  }
  // useEffect(() => {
  //   if (isFetching) {
  //     toast.success("Updating...", {
  //       id: "dashboard-updating",
  //       position: "top-right",
  //     });
  //   }
  // }, [isFetching]);
  if (isError && !data) {
    return <p className="text-sm text-red-600">{error.message}</p>;
  }

  return (
    <div className="relative">
      <VehicleDashboardStatus status={data.status} />
    </div>
  );
}

// export default function DashboardPageSuspense() {
//   <LogoutSync />;
//   return (
//     <Suspense
//       fallback={
//         <>
//           <Title
//             title2="Dashboard"
//             description="View an overview of applications and vehicles."
//           />
//           <DashboardSkeletonSwitcher />
//         </>
//       }
//     >
//       <DashboardPage />
//     </Suspense>
//   );
// }
