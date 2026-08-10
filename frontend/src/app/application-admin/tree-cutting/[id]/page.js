import TreeCuttingReview from "@/components/review/tree-cutting/tree-cutting-review";
import AssignedServices from "@/components/route-protection/check-service";
import { notFound } from "next/navigation";
import { getTreeCuttingFormDataById } from "@/lib/api/applications/tree-cutting-server";
export default async function ResidentialFormReview({ params }) {
  const { id } = await params;
  const { treeCuttingFormData } = await getTreeCuttingFormDataById(id);
  console.log("APPLICATION DATA:", treeCuttingFormData);
  if (!treeCuttingFormData) {
    notFound();
  }

  return (
    <div>
      <AssignedServices reqServices={[3]}>
        <TreeCuttingReview data={treeCuttingFormData} />
      </AssignedServices>
    </div>
  );
}
