import ReviewAgricultural from "@/components/review/agricultural/agricultural-review";
import { AgriculturalSampleData } from "@/lib/form-sample-data/agricultural-sample-data";
import { notFound } from "next/navigation";

export default async function AgriculturalFormReview({ params }) {
  const { id } = await params;
  const application = AgriculturalSampleData.find((app) => app.id === id);

  if (!application) {
    notFound();
  }

  return (
    <div>
      <ReviewAgricultural data={application} />
    </div>
  );
}
