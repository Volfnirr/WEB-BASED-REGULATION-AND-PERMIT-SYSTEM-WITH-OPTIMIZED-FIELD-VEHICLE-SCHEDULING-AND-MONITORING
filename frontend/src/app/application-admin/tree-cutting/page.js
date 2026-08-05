import TreeCuttingInfo from "@/components/application-admin/tree-cutting/tree-cutting-info";
import TreeCuttingTable from "@/components/application-admin/tree-cutting/tree-cutting-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";

export default function TreeCuttingApplicationReview() {
  return (
    <div>
      <AssignedServices reqServices={[3]}>
        <Title
          title="Manage "
          title2="Tree Cutting"
          title3="Applications"
          description="View and manage all Tree Cutting Applications."
        />
        <TreeCuttingInfo />
        <TreeCuttingTable />
      </AssignedServices>
    </div>
  );
}
