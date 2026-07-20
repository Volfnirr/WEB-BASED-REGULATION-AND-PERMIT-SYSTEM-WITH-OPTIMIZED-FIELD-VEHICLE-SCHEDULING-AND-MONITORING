import ReviewResidential from "@/components/review/residential/residential-review";
import { ResidentialFormData } from "@/lib/form-sample-data/residential_form_data";
import { notFound } from "next/navigation";

export default async function ResidentialFormReview({ params }) {
  const { id } = await params;
  const application = ResidentialFormData.find((app) => app.id === id);

  if (!application) {
    notFound();
  }

  return (
    <div>
      <ReviewResidential data={application} />
    </div>
  );
}
