import ScheduleCardValue from "@/components/application-admin/agricultural/card";
import AgriculturalInfo from "@/components/application-admin/agricultural/agricultural-info";
import AgriculturalTable from "@/components/application-admin/agricultural/agricultural-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";
import {
  agriculturalApplications,
  getAgriculturalAppStatus,
} from "@/lib/api/applications/agricultural/agricultural-server";

export default async function AgriculturalApplicationReview() {
  const { applications } = await agriculturalApplications();
  const { status } = await getAgriculturalAppStatus();

  return (
    <div>
      <AssignedServices reqServices={[1]}>
        <Title
          title="Manage "
          title2="Agricultural"
          title3="Applications"
          description="View and manage all Agricultural Applications."
        />
        <AgriculturalInfo status={status} />
        <AgriculturalTable initialData={applications} />
        <ScheduleCardValue />
      </AssignedServices>
    </div>
  );
}