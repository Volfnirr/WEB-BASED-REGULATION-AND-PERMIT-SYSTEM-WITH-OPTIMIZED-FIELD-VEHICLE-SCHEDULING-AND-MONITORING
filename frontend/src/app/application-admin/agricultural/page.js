"use client";
import ScheduleCardValue from "@/components/application-admin/agricultural/card";
import AgriculturalInfo from "@/components/application-admin/agricultural/agricultural-info";
import AgriculturalTable from "@/components/application-admin/agricultural/agricultural-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";
import {
  getAgriculturalApplications,
  getAgriculturalStatus,
} from "@/lib/api/applications/agricultural/agricultural";
import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
import DashboardSkeletonSwitcher from "@/components/skeleton/skeletons-switcher";
import { useQuery } from "@tanstack/react-query";

export default function AgriculturalApplicationReview() {
  const applications = useQuery({
    queryKey: ["agricultural-applications"],
    queryFn: getAgriculturalApplications,
  });
  const status = useQuery({
    queryKey: ["agricultural-status"],
    queryFn: getAgriculturalStatus,
  });

  if (applications.isPending || status.isPending) {
    return (
      <>
        <Title
          title="Manage "
          title2="Agricultural"
          title3="Applications"
          description="View and manage all Agricultural Applications."
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
      <AssignedServices reqServices={[1]}>
        <Title
          title="Manage "
          title2="Agricultural"
          title3="Applications"
          description="View and manage all Agricultural Applications."
        />

        <AgriculturalInfo status={status.data.status} />
        <AgriculturalTable initialData={applications.data.applications} />
        {/* <ScheduleCardValue /> */}
      </AssignedServices>
    </div>
  );
}
