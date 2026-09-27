import PendingInfo from "@/components/application-admin/status/pending-info";
import PendingTable from "@/components/application-admin/status/pending-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";
import {
  appAdminApplicationsByStatus,
  assingedApplicationStatus,
} from "@/lib/api/applications/app-admin-applications-server";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";

import { notFound } from "next/navigation";
import BarLoading from "@/components/application-admin/services-dashboard/service-bar-loading";
import AssignSkeletonSwitcher from "@/components/skeleton/skeletons-assign-switcher";

const VALID_STATUSES = ["pending", "approved", "rejected"];

async function Status({ params }) {
  const { status } = await params;
  const { assignedStatus } = await assingedApplicationStatus();
  if (!VALID_STATUSES.includes(status)) {
    notFound();
  }

  const { applications } = await appAdminApplicationsByStatus(
    status.toUpperCase(),
  );
  if (!applications) {
    notFound();
  }

  const serviceSlugs = {
    1: "agricultural",
    2: "residential",
    3: "tree-cutting",
    4: "chainsaw",
  };

  const applicationsWithPage = applications.map((application) => {
    const service = serviceSlugs[application.serviceId];
    const page = `/application-admin/${status}/${service}/${application.id}`;
    return {
      ...application,
      page,
    };
  });
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div>
      <AssignedServices reqServices={[1, 2, 3, 4]}>
        <Title
          title="Manage Your"
          title2={statusLabel}
          title3="Applications"
          description={`View and manage all your ${status} applications.`}
        />
        <PendingInfo status={assignedStatus} />
        <PendingTable initialData={applicationsWithPage} status={status} />
      </AssignedServices>
    </div>
  );
}

export default async function StatusSuspense({ params }) {
  const { status } = await params;

  const statusLabel = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "";
  return (
    <Suspense
      fallback={
        <>
          <Title
            title="Manage Your"
            title2={statusLabel}
            title3="Applications"
            description={`View and manage all your ${status} applications.`}
          />
          <AssignSkeletonSwitcher />
          <TableSkeleton />
        </>
      }
    >
      <Status params={params} />
    </Suspense>
  );
}
