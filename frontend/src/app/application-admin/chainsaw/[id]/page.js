import ReviewChainsawApp from "@/components/review/chainsaw/chainsaw-review";
import AssignedServices from "@/components/route-protection/check-service";
import { ChainsawSampleData } from "@/lib/form-sample-data/chainsaw-sample-data";
import { notFound } from "next/navigation";

export default async function ChainsawFormReview({ params }) {
  const { id } = await params;
  const application = ChainsawSampleData.find((app) => app.id === id);

  if (!application) {
    notFound();
  }

  return (
    <div>
      <AssignedServices reqServices={[4]}>
        <ReviewChainsawApp data={application} />
      </AssignedServices>
    </div>
  );
}
