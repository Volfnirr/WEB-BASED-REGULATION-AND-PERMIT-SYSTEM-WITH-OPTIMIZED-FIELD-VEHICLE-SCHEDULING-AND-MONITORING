import ChainsawInfo from "@/components/application-admin/chainsaw/chainsaw-info";
import ChainsawTable from "@/components/application-admin/chainsaw/chainsaw-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";

export default function ChainsawApplicationReview() {
  return (
    <div>
      <AssignedServices reqServices={[4]}>
        <Title
          title="Manage "
          title2="Chainsaw"
          title3="Applications"
          description="View and manage all Agricultural Applications."
        />
        <ChainsawInfo />
        <ChainsawTable />
      </AssignedServices>
    </div>
  );
}
