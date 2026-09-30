"use client";
import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
import TreeCuttingInfo from "@/components/application-admin/tree-cutting/tree-cutting-info";
import TreeCuttingTable from "@/components/application-admin/tree-cutting/tree-cutting-table";
import AssignedServices from "@/components/route-protection/check-service";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import Title from "@/components/ui/title";
import {
  getTreeCuttingApplications,
  getTreeCuttingStatus,
} from "@/lib/api/applications/tree-cutting/tree-cutting";
import { useQuery } from "@tanstack/react-query";

export default function TreeCuttingApplicationReview() {
  const applications = useQuery({
    queryKey: ["tree-cutting-applications"],
    queryFn: getTreeCuttingApplications,
  });
  const status = useQuery({
    queryKey: ["tree-cutting-status"],
    queryFn: getTreeCuttingStatus,
  });

  if (applications.isPending || status.isPending) {
    return (
      <>
        <Title
          title="Manage "
          title2="Tree Cutting"
          title3="Applications"
          description="View and manage all Tree Cutting Applications."
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
      <AssignedServices reqServices={[3]}>
        <Title
          title="Manage "
          title2="Tree Cutting"
          title3="Applications"
          description="View and manage all Tree Cutting Applications."
        />
        <TreeCuttingInfo status={status.data.status} />
        <TreeCuttingTable initialData={applications.data.applications} />
      </AssignedServices>
    </div>
  );
}
