import ResidentialForm from "@/components/applicant/residential/residential-form";
import { inspectorList } from "@/lib/api/applications/residential/residential-server";

export default async function ResidentialApplication() {
  const { inspectors } = await inspectorList();
  return <ResidentialForm inspectors={inspectors} />;
}
