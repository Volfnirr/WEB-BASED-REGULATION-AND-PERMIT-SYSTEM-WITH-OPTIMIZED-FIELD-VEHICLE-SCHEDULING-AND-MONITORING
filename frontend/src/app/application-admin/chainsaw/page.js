import ChainsawInfo from "@/components/application-admin/chainsaw/chainsaw-info";
import ChainsawTable from "@/components/application-admin/chainsaw/chainsaw-table";
import Title from "@/components/ui/title";

export default function ChainsawApplicationReview() {
  return (
    <div>
      <Title
        title="Manage "
        title2="Chainsaw"
        title3="Applications"
        description="View and manage all Agricultural Applications."
      />
      <ChainsawInfo />
      <ChainsawTable />
    </div>
  );
}
