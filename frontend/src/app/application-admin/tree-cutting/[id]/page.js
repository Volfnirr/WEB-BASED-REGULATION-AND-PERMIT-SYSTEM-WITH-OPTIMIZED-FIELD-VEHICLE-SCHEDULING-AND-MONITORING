import TreeCuttingReview from "@/components/review/tree-cutting/tree-cutting-review";
import AssignedServices from "@/components/route-protection/check-service";
import { TreeCuttingSampleData } from "@/lib/form-sample-data/tree-cutting-sampe-data";
import { notFound } from "next/navigation";

export default async function ResidentialFormReview({ params }) {
  const { id } = await params;
  const application = TreeCuttingSampleData.find((app) => app.id === id);

  if (!application) {
    notFound();
  }

  return (
    <div>
      <AssignedServices reqServices={[3]}>
        <TreeCuttingReview data={application} />
      </AssignedServices>
    </div>
  );
}
