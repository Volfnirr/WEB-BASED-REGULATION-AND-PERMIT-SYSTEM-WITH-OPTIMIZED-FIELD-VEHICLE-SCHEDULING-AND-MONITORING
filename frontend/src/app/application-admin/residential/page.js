"use client";
import ScheduleCardValue from "@/components/application-admin/residential/card";
import ResidentialInfo from "@/components/application-admin/residential/residential-info";
import ResidentialTable from "@/components/application-admin/residential/residential-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";
import {
  getResidentialApplications,
  getResidentialStatus,
} from "@/lib/api/applications/residential/residential";
import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import { useQuery } from "@tanstack/react-query";

export default function ResidentialApplicationReview() {
  const applications = useQuery({
    queryKey: ["residential", "applications"],
    queryFn: getResidentialApplications,
  });
  const status = useQuery({
    queryKey: ["residential", "status"],
    queryFn: getResidentialStatus,
  });

  if (applications.isPending || status.isPending) {
    return (
      <>
        <Title
          title="Manage "
          title2="Residential"
          title3="Applications"
          description="View and manage all Residential Applications."
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
      <AssignedServices reqServices={[2]}>
        <Title
          title="Manage "
          title2="Residential"
          title3="Applications"
          description="View and manage all Residential Applications."
        />
        <ResidentialInfo status={status.data.status} />
        <ResidentialTable initialData={applications.data.applications} />
        {/* <ScheduleCardValue /> */}
      </AssignedServices>
    </div>
  );
}
