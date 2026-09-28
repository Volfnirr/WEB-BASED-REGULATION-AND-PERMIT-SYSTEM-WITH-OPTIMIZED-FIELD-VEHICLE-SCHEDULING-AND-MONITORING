import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
import TreeCuttingInfo from "@/components/application-admin/tree-cutting/tree-cutting-info";
import TreeCuttingTable from "@/components/application-admin/tree-cutting/tree-cutting-table";
import AssignedServices from "@/components/route-protection/check-service";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import Title from "@/components/ui/title";
import {
  treeCuttingApplications,
  getTreeCuttingStatus,
} from "@/lib/api/applications/tree-cutting/tree-cutting-server";
import { Suspense } from "react";

async function TreeCuttingApplicationReviewData() {
  const { applications } = await treeCuttingApplications();
  const { status } = await getTreeCuttingStatus();
  return (
    <div>
      <AssignedServices reqServices={[3]}>
        <Title
          title="Manage "
          title2="Tree Cutting"
          title3="Applications"
          description="View and manage all Tree Cutting Applications."
        />
        <TreeCuttingInfo status={status} />
        <TreeCuttingTable initialData={applications} />
      </AssignedServices>
    </div>
  );
}

export default function TreeCuttingApplicationReview() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <TreeCuttingApplicationReviewData />
    </Suspense>
  );
}
