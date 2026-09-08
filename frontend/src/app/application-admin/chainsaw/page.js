import ScheduleCardValue from "@/components/application-admin/chainsaw/card";
import ChainsawInfo from "@/components/application-admin/chainsaw/chainsaw-info";
import ChainsawTable from "@/components/application-admin/chainsaw/chainsaw-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";
import {
  chainsawApplications,
  getChainsawAppStatus,
} from "@/lib/api/applications/chainsaw/chainsaw-server";

export default async function ChainsawApplicationReview() {
  const { applications } = await chainsawApplications();
  const { status } = await getChainsawAppStatus();

  return (
    <div>
      <AssignedServices reqServices={[4]}>
        <Title
          title="Manage "
          title2="Chainsaw"
          title3="Applications"
          description="View and manage all Chainsaw Applications."
        />
        <ChainsawInfo status={status} />
        <ChainsawTable initialData={applications} />
        <ScheduleCardValue />
      </AssignedServices>
    </div>
  );
}