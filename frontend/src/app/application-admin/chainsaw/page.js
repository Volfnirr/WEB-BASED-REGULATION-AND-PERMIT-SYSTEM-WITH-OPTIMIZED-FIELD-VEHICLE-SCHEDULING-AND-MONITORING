"use client";
import ScheduleCardValue from "@/components/application-admin/chainsaw/card";
import ChainsawInfo from "@/components/application-admin/chainsaw/chainsaw-info";
import ChainsawTable from "@/components/application-admin/chainsaw/chainsaw-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";
import {
  getChainsawApplications,
  getChainsawStatus,
} from "@/lib/api/applications/chainsaw/chainsaw";
import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import { useQuery } from "@tanstack/react-query";

export default function ChainsawApplicationReview() {
  const applications = useQuery({
    queryKey: ["chainsaw", "applications"],
    queryFn: getChainsawApplications,
  });
  const status = useQuery({
    queryKey: ["chainsaw", "status"],
    queryFn: getChainsawStatus,
  });

  if (applications.isPending || status.isPending) {
    return (
      <>
        <Title
          title="Manage "
          title2="Chainsaw"
          title3="Applications"
          description="View and manage all Chainsaw Applications."
        />
        <DashboardSkeletonSwitcher />
        <TableSkeleton />
      </>
    );
  }
  if (applications.isError)
    return <p className="text-sm text-red-600">{applications.error.message}</p>;
  if (status.isError)
    return <p className="text-sm text-red-600">{status.error.message}</p>;

  return (
    <div>
      <AssignedServices reqServices={[4]}>
        <Title
          title="Manage "
          title2="Chainsaw"
          title3="Applications"
          description="View and manage all Chainsaw Applications."
        />
        <ChainsawInfo status={status.data.status} />
        <ChainsawTable initialData={applications.data.applications} />
        {/* <ScheduleCardValue /> */}
      </AssignedServices>
    </div>
  );
}
