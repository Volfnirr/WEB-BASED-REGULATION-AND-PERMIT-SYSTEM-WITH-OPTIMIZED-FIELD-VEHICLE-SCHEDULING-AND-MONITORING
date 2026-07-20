import ReviewChainsawApp from "@/components/review/chainsaw/chainsaw-review";
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
      <ReviewChainsawApp data={application} />
    </div>
  );
}
